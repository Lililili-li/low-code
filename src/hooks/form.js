import { ref } from 'vue'

import { useObjectData } from './object-data'

export function useForm(initValues) {
  const formRef = ref(null)

  const { data, reset, update } = useObjectData(initValues)


  async function validate() {
    return await formRef.value.validate()
  }

  function updateValeus(values) {
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
    updateValeus,
    setValues,
    resetFields
  }
}
