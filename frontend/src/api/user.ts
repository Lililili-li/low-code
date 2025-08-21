import request from "@/api/http/request"
export default {
  login: (data: any) => {
    return request.post("/api/user/login", data)
  },
  register: (data: any) => {
    return request.post("/api/user/register", data)
  },
  getUserInfo: () => {
    return request.get("/api/user")
  }
}
