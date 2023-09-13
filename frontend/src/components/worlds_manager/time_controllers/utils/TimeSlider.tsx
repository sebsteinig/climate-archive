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

// Define a type for the forwarded ref
export type InputRef = {
  onChange: (frame: number) => void;
  onWeightUpdate: (frame: number) => void;
};

// Define the TimeSlider component
export const TimeSlider = forwardRef<InputRef, Props>(function TimeSlider(
  { world_id, className, current_frame, data, labels, onSliderChange }: Props,
  ref,
) {
  const is_changing = useRef(false);
  const departure = useRef<number>(null!);
  const destination = useRef<number>(null!);

  const worlds = useStore((state) => state.worlds.slots);

  // Expose some methods to parent components via ref
  useImperativeHandle(ref, () => {
    return {
      onChange: (frame: number) => {
        if (!is_changing.current) {
          // destination.current = frame;
          setSliderValue(frame as number )
        }        
      },
      onWeightUpdate: (frame: number) => {
        if (!is_changing.current) {
          // destination.current = frame;
          setSliderValue(frame as number )
        }
      },
    };
  });

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

  const [sliderValue, setSliderValue] = useState(0);

  // Reflect external changes in the slider's value
  useEffect(() => {
    const frame = current_frame.current.get(world_id);
    if (frame) {
      setSliderValue(frame.weight as number);
    }
  }, [current_frame, world_id]);

  const marks = [
    {
      value: 0,
      label: '0%',
    },
    {
      value: 20,
      label: '20%',
    },
    {
      value: 40,
      label: '40%',
    },
    {
      value: 60,
      label: '60%',
    },
    {
      value: 80,
      label: '80%',
    },
    {
      value: 100,
      label: '100%',
    },
  ];

  const marksProps = labels ? { marks } : {};

  return (
    <div style={{ padding: '0 3px' }} className={className}>
      <Slider
        value={sliderValue}
        onChange={(event, newValue) => {
          is_changing.current = true;
          destination.current = newValue as number;
          setSliderValue(newValue as number);
          for (let w of worlds) {
            const frame = current_frame.current.get(w[0]);
            if (!frame) return;
            jumpTo(frame, destination.current, () => {
              is_changing.current = false;
            });
          }
          if (onSliderChange) {
            onSliderChange(destination.current);
          }
        }}
        onChangeCommitted={(event, newValue) => {
          is_changing.current = false;
          const frame = current_frame.current.get(world_id);
          if (!frame) return;
          const to = Math.round(destination.current);
          if (!to) return;
          goto(frame, to);
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
            color: "lightgray" // light gray color for the label text
          }
        }}
        valueLabelDisplay="auto"
      />
    </div>
  );
});
