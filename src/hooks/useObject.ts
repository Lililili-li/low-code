import { cloneDeep } from "lodash-es"
import { ref } from "vue"

export default function useObject<T extends Record<string, any>>(initValues: T): {
  model: import('vue').Ref<T>;
  reset: () => void;
} {
  const originData = cloneDeep(initValues)
  const model = ref(initValues)
  const reset = () => {
    model.value = originData
  }
  return {
    model: model as import('vue').Ref<T>,
    reset
  }
}
