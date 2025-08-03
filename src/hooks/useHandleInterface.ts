// 处理接口请求
import { createSchedule } from "@/utils/schedule"
import axios, { type AxiosRequestConfig } from "axios"

export default function useHandleInterface() {
  const handleInterface = (params: any) => {
    console.log(params)
  }
  const handlePreFetch = (params: any) => {
    console.log(params)
  }
  const handleSuccess = (res: any) => {
    console.log(res)
  }
  const handleError = (error: any) => {
    console.log(error)
  }
  function getUsername(): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(String(Date.now()))
      }, 1000)
    })
  }
  const handleLoopFetch = async (params: AxiosRequestConfig, timeout: number) => {
    // return new Promise((resolve, reject) => {
    //   const schedule = createSchedule(async () => {
    //     const res = await handleFetch(params, timeout)
    //     resolve(res)
    //   }, {
    //     interval: timeout,
    //     immediate: true
    //   })
    //   schedule.start()
    // })
  }
  const handleFetch = async (params: AxiosRequestConfig, timeout: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const res = await axios({ ...params, ...{ timeout: timeout } })
      resolve(res.data)
    })
  }
  return {
    handleInterface,
    handlePreFetch,
    handleSuccess,
    handleError,
    handleFetch,
    handleLoopFetch
  }
}
