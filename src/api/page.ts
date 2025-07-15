import request from "@/api/http/request"
export default {
  getPageParam: (params?) => {
    return request.get('/api/pageParam')
  }
}
