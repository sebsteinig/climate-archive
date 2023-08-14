import { TimeFrame } from "@/utils/store/time/time.type"


export interface IControllerRef {
  onChange: (frame: TimeFrame) => void
  onWeightUpdate: (frame: TimeFrame) => void
}