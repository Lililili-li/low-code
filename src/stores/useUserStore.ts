import { ref } from 'vue'
import { defineStore } from 'pinia'
import userService from '@/api/user'
import message from '@/utils/message'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({})

  const getUserInfo = async () => {
    try {
      const res = await userService.getUserInfo()
      userInfo.value = res.data
      localStorage.setItem("userInfo", JSON.stringify(res.data));
    } catch (error) {
      throw new Error('获取用户信息失败')
    }
  }
  const login = async (data: any) => {
    router.push({
      name: "Project",
    });
    return

    const res = await userService.login(data)

    if (res.code === 200) {
      localStorage.setItem("token", res.data);
      await getUserInfo()
      message.success("登陆成功");
      router.push({
        name: "Project",
      });
    } else {
      message.error(res.msg)
    }
  }
  return {
    userInfo,
    getUserInfo,
    login
  }
})
