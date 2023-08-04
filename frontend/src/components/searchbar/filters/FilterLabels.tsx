import InputField from "@/components/inputs/InputField"
import DeletableLabel from "@/components/labels/DeletableLabel"
import Label from "@/components/labels/Label"
import { useEffect, useState } from "react"
import ArrowUp from "$/assets/icons/arrow-up-emerald-400.svg"
import ArrowDown from "$/assets/icons/arrow-down-emerald-400.svg"

type Label = {
  label: string
  display: boolean
}

function LabelButton({ label, remove }: { label: Label; remove: Function }) {
  if (label.display) {
    return (
      <DeletableLabel onClick={() => {}} onRemove={() => remove()}>
        {" "}
        {label.label}
      </DeletableLabel>
    )
  }
  return null
}
function FoundLabelButton({ label, add }: { label: Label; add: Function }) {
  if (label.display) {
    return <Label onClick={() => add()}>{label.label}</Label>
  }
  return null
}
export default function FilterLabels({
  setRequestFilters,
}: {
  setRequestFilters: Function
}) {
  const [display, setDisplay] = useState(false)
  const [labels, setLabels] = useState<{
    searched: string
    found: Label[]
    selected: Label[]
  }>({ searched: "", found: [], selected: [] })
  useEffect(() => {
    let ignore = false

    if (labels.searched !== "") {
      setLabels((prev) => {
        return {
          ...prev,
          found: [
            ...prev.found.filter(({ display }) => display),
            { label: labels.searched, display: true },
          ],
          selected: prev.selected.filter(({ display }) => display),
        }
      })
    }

    return () => {
      ignore = true
    }
  }, [labels.searched])
  if (!display) {
    return (
      <>
        <span onClick={() => setDisplay(true)} className="inline-flex">
          <h3>Filter with labels</h3>
          <ArrowDown className={`w-4 h-4 self-center  text-emerald-400 ml-4`} />
        </span>
      </>
    )
  }

  return (
    <>
      <span
        onClick={() => {
          setLabels((prev) => {
            return {
              searched: "",
              found: prev.found.filter(({ display }) => display),
              selected: prev.selected.filter(({ display }) => display),
            }
          })
          setDisplay(false)
        }}
        className="inline-flex"
      >
        <h3>Filter with labels</h3>
        <ArrowUp className={`w-4 h-4  text-emerald-400 self-center ml-4`} />
      </span>
      <span>
        {labels.selected?.map((label, idx) => {
          return (
            <LabelButton
              label={label}
              key={idx}
              remove={() => {
                setLabels((prev) => {
                  prev.selected[idx].display = false
                  return { ...prev, selected: prev.selected }
                })
              }}
            />
          )
        })}
      </span>

      <div>
        <InputField
          name="searched_label"
          id="searched_label"
          placeholder="Search a label ..."
          value={labels.searched}
          onChange={(e: any) =>
            setLabels((prev) => {
              return { ...prev, searched: e.target.value }
            })
          }
        ></InputField>
        {labels.found?.map((label, idx) => {
          return (
            <FoundLabelButton
              label={label}
              add={() => {
                if (
                  !labels.selected
                    .map(({ label }) => label)
                    .includes(label.label)
                ) {
                  setLabels((prev) => {
                    prev.found[idx].display = false
                    return {
                      ...prev,
                      searched: "",
                      selected: [...prev.selected, { ...label, display: true }],
                    }
                  })
                } else {
                  setLabels((prev) => {
                    prev.found[idx].display = false
                    return {
                      ...prev,
                      searched: "",
                    }
                  })
                }
              }}
              key={idx}
            />
          )
        })}
      </div>
    </>
  )
}
