import { Time, TimeFrame } from "@/utils/store/time/time.type"
import { VariableName } from "@/utils/store/variables/variable.types"
import { Experiment } from "@/utils/types"
import { MutableRefObject } from "react"
import { CanvasHolder, tickBuilder } from "../tick"
import { World } from "@/components/3D_components/World"
import { View } from "@react-three/drei"

export type SceneProps = {
  track: MutableRefObject<HTMLElement>
  time: Time
  exps: Experiment[]
  frame: TimeFrame
  active_variables: VariableName[]
  context: CanvasHolder,
  onChange: (frame:TimeFrame) => void
}

export function Scene({
  track,
  time,
  exps,
  frame,
  active_variables,
  context,
  onChange,
}: SceneProps) {
  var config = {
    model: "Dune",
    heightData: "/assets/textures/tfgzk_height.smoothed.png",
  }

  return (
    <View track={track}>
      <World
        config={config}
        tick={tickBuilder(time, exps, frame, active_variables, context,onChange)}
      />
    </View>
  )
}
