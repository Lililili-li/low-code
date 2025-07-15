import { useToggle } from '@vueuse/core'
import { ref } from 'vue'

interface ApiResponse {
  data: any;
  error?: string; // 可选的错误信息
}
type ApiType = (params?: any) => Promise<any>
type UseFetchDataType = {
  api?: ApiType
  immediate?: boolean
  defaultValue?: any
}
export default function useFetchData({
  api = () => Promise.resolve({data: {}}),
  immediate = true,
  defaultValue = [],
}: UseFetchDataType) {
  // const [loading, toggle] = useToggle(false)
  const loading = ref(false)
  const response = ref(defaultValue)
  function fetch() {
    loading.value = true
    return api().then(res => {
      response.value = res.data
      loading.value = false
    }).catch(err => {
      loading.value = false
    }).finally(() => {
      loading.value = false
    })
  }
  if (immediate) {
    fetch()
  }
  return {
    fetch,
    loading,
    response,
  }
}
