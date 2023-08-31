import { TimeFrame, WorldData } from "@/utils/store/worlds/time/time.type"

export interface IControllerRef {
  onChange: (frame: TimeFrame) => void
  onWeightUpdate: (frame: TimeFrame) => void
}
