import { Experiment } from "@/utils/types"
import { VariableName } from "../../variables/variable.types"
import { Time, TimeFrame, TimeMode } from "../time.type"

async function nextOnceMean(
  time: Time,
  frame: TimeFrame,
  delta: number,
  active_variable: VariableName[],
): Promise<TimeFrame> {}

async function nextOnceTs(
  time: Time,
  frame: TimeFrame,
  delta: number,
  active_variable: VariableName[],
): Promise<TimeFrame> {}

export function nextOnce(
  time: Time,
  exps: Experiment[],
  frame: TimeFrame,
  delta: number,
  active_variable: VariableName[],
): Promise<TimeFrame> {
  switch (time.mode) {
    case TimeMode.mean:
      return nextOnceMean(time, frame, delta, active_variable)
    case TimeMode.ts:
      return nextOnceTs(time, frame, delta, active_variable)
  }
}
