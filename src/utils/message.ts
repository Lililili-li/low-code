import { computed, defineComponent, ref } from 'vue'
import { Message } from '@arco-design/web-vue'

export default {
  success: (msg: string) => {
    Message.success(msg)
  },
  error: (msg: string) => {
    Message.error(msg)
  },
  warning: (msg: string) => {
    Message.warning(msg)
  },
}
