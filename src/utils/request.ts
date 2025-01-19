import axios, { Axios, type AxiosResponse } from 'axios'

interface IRequest {
  get(url: string, params?: any): Promise<any>
  post(url: string, data?: any): Promise<any>
  download(url: string, params?: any): Promise<any>
}

class Request {
  private axiosInstance: Axios
  constructor() {
    this.axiosInstance = axios.create({
      // baseURL: import.meta.env.VITE_API_BASE_UR || 'http://localhost:3000',
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
      }
    })

    this.init()
  }
  private init() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data.code === 200) {
          return response.data
        } else if (response.data.code === 500) {
          return Promise.reject('服务器错误')
        }
        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  public get(url: string, params?: any) {
    return this.axiosInstance.get(url, { params })
  }
  public post(url: string, data?: any) {
    return this.axiosInstance.post(url, data)
  }
  public download(url: string, params?: any, filename: string = 'download', config?: any) {
    return new Promise((resolve, reject) => {

    })
  }
}

const request: IRequest = new Request()

export default request
