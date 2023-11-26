import { Label, Row } from "../../filter.utils"
import InputField from "@/components/inputs/InputField"
import { useStore } from "@/utils/store/store"

export function InputAuthor() {
  const author = useStore((state) => state.search.filter.publication.author)
  const setAuthor = useStore((state) => state.search.setAuthor)
  return (
    <Row>
      <Label>Author</Label>
      <InputField
        placeholder="like valdes et al"
        value={author ?? ""}
        onChange={(value: string) => {
          setAuthor(value)
        }}
      />
    </Row>
  )
}
