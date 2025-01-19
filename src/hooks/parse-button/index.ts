import type { IParsedButton } from './type.ts'
import { toRefs } from 'vue'

export default function parseButton(data: IParsedButton) {
  const { props, text } = data;

  return toRefs({
    props,
    text
  })
}
