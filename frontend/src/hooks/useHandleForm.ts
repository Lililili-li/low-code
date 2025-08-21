import { ref } from 'vue'

import { useHandleObject } from './useHandleObject.ts'

export function useHandleForm(initValues) {
  const formRef = ref(null)

  const { data, reset, update } = useHandleObject(initValues)


  async function validate() {
    return await formRef.value.validate()
  }

  function updateVales(values) {
    update(values)
  }

  function setValues(values) {
    data.value = values
  }

  function resetFields(values) {
    formRef.value.resetFields()
    reset()
    if (values) setValues(values)
  }

  return {
    formRef,
    model: data,
    validate,
    updateVales,
    setValues,
    resetFields
  }
}
