import { ref } from "vue";

import { cloneDeep } from "lodash-es";

export function useObjectData(initValues) {
  const data = ref(cloneDeep(initValues));

  function reset() {
    data.value = cloneDeep(initValues);
  }

  function update(values) {
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
