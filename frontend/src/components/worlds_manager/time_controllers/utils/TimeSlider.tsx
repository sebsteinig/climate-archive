// Importing necessary React hooks and utility functions
import { useStore } from "@/utils/store/store";
import { 
  forwardRef, useEffect, useImperativeHandle, useMemo, useRef , useState
} from "react";

// Importing various types that represent specific data structures or states
import {
  TimeFrame,
  TimeFrameRef,
  TimeFrameState,
  WorldID,
  TimeMode,
  WorldData,
} from "@/utils/store/worlds/time/time.type";
import { goto, jumpTo } from "@/utils/store/worlds/time/loop";
import { ControllerRef } from "./TimeController";
import Slider from '@mui/material/Slider';
import { useFrame } from '@react-three/fiber';

// Define the properties (Props) expected for the component
type Props = {
  className?: string;
  world_id: WorldID;
  data: WorldData;
  current_frame: TimeFrameRef;
  controller_ref: ControllerRef | undefined;
  labels: boolean;
  onSliderChange?: (value: number) => void;
};

// Define the TimeSlider component
export const TimeSlider: React.FC<Props> = ({ world_id, className, current_frame, controller_ref, data, labels, onSliderChange }) => {

  const state_worlds = useStore((state) => state.worlds)
  const [sliderValue, setSliderValue] = useState(0);

  // get number of timesteps
  const max = useMemo(() => {
    if (data.time.mode === TimeMode.mean) {
      console.log(data.collection);
      return data.collection.exps.length;
    } else {
      const frame = current_frame.current.get(world_id);
      const timestep = frame?.timesteps;
      return timestep ?? 0;
    }
  }, [current_frame.current.get(world_id)]);

  const marks = [
    { value: 0, label: '0%'},
    { value: 20, label: '20%'},
    { value: 40, label: '40%'},
    { value: 60, label: '60%'},
    { value: 80, label: '80%'},
    { value: 100, label: '100%'},
  ];
  const marksProps = labels ? { marks } : {};

  // The slider value shoullf alway be in sync with the frame weight
  // of the current_frame. This frame weight might be updated by different
  // components (e.g. the time slider, the geologic timescale or the
  // play/pause button). All of these components update the frame weight
  // in the current_frame which is the main control, so we periodically
  // check this weight and update the slider value accordingly.
  //
  // That's not very React-y, but it works!
  const sliderValueRef = useRef(sliderValue);  // Create a ref to store the latest value of sliderValue
  // Update the ref whenever sliderValue changes
  useEffect(() => {
    sliderValueRef.current = sliderValue;
  }, [sliderValue]);
  
  useEffect(() => {
    // 
    const updateSlider = () => {
        let frame = current_frame.current.get(world_id);
        if (!frame ) return;
        let newValue = frame.weight;
        if (sliderValueRef.current !== newValue) {
          setSliderValue(newValue);
        }
    };
    // Set up the interval
    const intervalId = setInterval(updateSlider, 10);
    // Clear the interval when the component is unmounted.
    return () => clearInterval(intervalId);
  }, []);  // The empty dependency array means this useEffect runs once when the component mounts.

  return (
    <div style={{ padding: '0 3px' }} className={className}>
      <Slider 
        value={sliderValue}
        // `mousedown` event is fired, i.e. slider is clicked
        onChange={(event, newValue) => {
          // stop animation
          // controller_ref?.pause()
          let newWeight = newValue as number
          // check whether current time controller is monthly climatology
          // if so, update all monthly time controllers (sync)
          let activeController = state_worlds.slots.get(world_id).time.controller
          if ( activeController == 0 ) { 
            for (let w of state_worlds.slots) {
              let frame = current_frame.current.get(w[0]);
              console.log(frame)
              let passiveController = w[1].time.controller
              if (!frame ) return;
              if ( passiveController == activeController )
              jumpTo( frame, newWeight, false );
            }
          // if not, update only the current time controller
          } else {
              let frame = current_frame.current.get(world_id);
              if (!frame ) return;
              jumpTo( frame, newWeight, false );
          }
        }}
        // `mouseup` event is fired, i.e. slider is released
        onChangeCommitted={(event, newValue) => {
          let newWeight = newValue as number
          // is_changing.current = false;
          const frame = current_frame.current.get(world_id);
          if (!frame) return;
          const target = Math.round(newWeight);
          if (!target) return;
          // // check whether current time controller is monthly climatology
          // // if so, update all monthly time controllers (sync)
          let activeController = state_worlds.slots.get(world_id).time.controller
          if ( activeController == 0 ) { 
            for (let w of state_worlds.slots) {
              let frame = current_frame.current.get(w[0]);
              let passiveController = w[1].time.controller
              if (!frame ) return;
              if ( passiveController == activeController )
              goto(frame, target, 0.2, false);
            }
          // if not, update only the current time controller
          } else {
              let frame = current_frame.current.get(world_id);
              if (!frame ) return;
              goto(frame, target, 0.2, false);
          }
        }}
        min={0}
        max={max}
        step={0.01}
        {...marksProps}
        sx={{
          "& .MuiSlider-thumb": {
            width: 25, 
            height: 25, 
            backgroundColor: 'rgb(16, 185, 129)',
            boxShadow: '0px 0px 0 0px rgb(16, 185, 129)',
            transition: 'none',
            "&:hover": {
              backgroundColor: 'rgb(16, 185, 129)', 
              boxShadow: '0px 0px 10px 1px rgb(16, 185, 129)',
              transition: 'none',            
            },
            "&:active": {
              boxShadow: '0px 0px 20px 2px rgb(16, 185, 129)',
              transition: 'none',            
            },
          },
          "& .MuiSlider-track": {
            height: 8, // Adjust as needed for track thickness
            backgroundColor: 'rgb(16, 185, 129)', // Green
            transition: 'none',
          },
          "& .MuiSlider-rail": {
            height: 8, // Adjust as needed for rail thickness
            backgroundColor: 'rgb(5, 150, 105)',
            transition: 'none',
          },
          "& .MuiSlider-markLabel": {
            color: "lightgray" // light gray color for the label text
          }
        }}
        valueLabelDisplay="auto"
      />
    </div>
  );
};
