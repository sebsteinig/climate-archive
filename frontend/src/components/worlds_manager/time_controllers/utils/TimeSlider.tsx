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
    { value: 0, label: 'J'},
    { value: 1, label: 'F'},
    { value: 2, label: 'M'},
    { value: 3, label: 'A'},
    { value: 4, label: 'M'},
    { value: 5, label: 'J'},
    { value: 6, label: 'J'},
    { value: 7, label: 'A'},
    { value: 8, label: 'S'},
    { value: 9, label: 'O'},
    { value: 10, label: 'N'},
    { value: 11, label: 'D'},
  ];

  const marks_no_labels = [
    { value: 0},
    { value: 1},
    { value: 2},
    { value: 3},
    { value: 4},
    { value: 5},
    { value: 6},
    { value: 7},
    { value: 8},
    { value: 9},
    { value: 10},
    { value: 11},
  ];

  console.log(labels)

  const marksProps = labels && state_worlds.slots.size <= 18 ? { marks } : {marks_no_labels};

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

  const getSliderStyles = () => {
    const baseStyles = {
      transition: 'none',
      "& .MuiSlider-thumb": {
        width: 25, 
        height: 25, 
        backgroundColor: 'rgb(16, 185, 129)',
        boxShadow: '0px 0px 0 0px rgb(16, 185, 129)',
        "&:hover": {
          backgroundColor: 'rgb(16, 185, 129)', 
          boxShadow: '0px 0px 10px 1px rgb(16, 185, 129)',
        },
        "&:active": {
          boxShadow: '0px 0px 20px 2px rgb(16, 185, 129)',
        },
      },
      "& .MuiSlider-track": {
        height: 8, // Adjust as needed for track thickness
        backgroundColor: 'rgb(16, 185, 129)', // Green
      },
      "& .MuiSlider-rail": {
        height: 8, // Adjust as needed for rail thickness
        backgroundColor: 'rgb(5, 150, 105)',
      },
      "& .MuiSlider-markLabel": {
        color: "lightgray", // light gray color for the label text
        fontSize: 10.5
      }
    }
  
    if (state_worlds.slots.size <= 4) {
      return baseStyles;
    }
  
    return {
      ...baseStyles,
      padding: '0 0 10px 0',
      // margins: 0,
      margin: '2px 0 8px 0',
      transition: 'none',            

      "& .MuiSlider-thumb": {
        width: 15, 
        height: 15, 
        backgroundColor: 'rgb(16, 185, 129)',
        boxShadow: '0px 0px 0 0px rgb(16, 185, 129)',
        "&:hover": {
          backgroundColor: 'rgb(16, 185, 129)', 
          boxShadow: '0px 0px 10px 1px rgb(16, 185, 129)',
        },
        "&:active": {
          boxShadow: '0px 0px 20px 2px rgb(16, 185, 129)',
        },
      },
      "& .MuiSlider-track": {
        height: 5, // Adjust as needed for track thickness
        backgroundColor: 'rgb(16, 185, 129)', // Green
      },
      "& .MuiSlider-rail": {
        height: 5, // Adjust as needed for rail thickness
        backgroundColor: 'rgb(5, 150, 105)',
      },
      "& .MuiSlider-markLabel": {
        color: "lightgray", // light gray color for the label text
        fontSize: 8.0,
        padding: 0,
        top: '15px' // Adjust this value as needed

      }
    };
  };

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
        sx={ getSliderStyles() }
        valueLabelDisplay="auto"
      />
    </div>
  );
};
