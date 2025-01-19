import request from "@/utils/request"
export default {
  login: () => {
    return request.post('/api/login')
  }
}