import { ref, type Ref, type UnwrapRef } from "vue";

import { cloneDeep } from "lodash-es";

type ReturnType<T> = {
  data: Ref<T>;
  reset: () => void;
  update: (values: Partial<T>) => void;
}
export function useHandleObject<T>(initValues: T):ReturnType<T> {
  const data = ref(cloneDeep(initValues));

  function reset() {
    data.value = cloneDeep(initValues);
  }

  function update(values: Partial<T>) {
    for (const [key, value] of Object.entries(values)) {
      data.value[key] = value;
    }
  }

  return {
    data,
    reset,
    update,
  };
}
