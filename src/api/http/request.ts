import message from '@/utils/message'
import axios, { Axios, type AxiosResponse } from 'axios'

interface IRequest {
  get(url: string, params?: any): Promise<any>
  post(url: string, data?: any): Promise<any>
  put(url: string, data?: any): Promise<any>
  delete(url: string, params?: any): Promise<any>
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
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
    this.axiosInstance.interceptors.response.use(
      (response: any) => {
        if (response.status === 200) {
          return response.data
        } else {
          return response
        }
      },
      (error) => {

        if (error.status === 500) {
          return Promise.reject('服务器错误')
        } else if (error.status === 404) {
          message.error('请求资源不存在')
          return Promise.reject('请求资源不存在')
        }
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
  public put(url: string, data?: any) {
    return this.axiosInstance.put(url, data)
  }
  public delete(url: string, params?: any) {
    return this.axiosInstance.delete(url, { params })
  }
  public download(url: string, params?: any, filename: string = 'download', config?: any) {
    return new Promise((resolve, reject) => {
      this.axiosInstance.get(url, { params, responseType: 'blob', ...config }).then((res) => {
        const contentDisposition = res.headers['content-disposition']
        const filename = contentDisposition.split('filename=')[1]
        const blob = new Blob([res.data], { type: res.headers['content-type'] })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
        URL.revokeObjectURL(link.href)
        resolve(true)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

const request: IRequest = new Request()

export default request
