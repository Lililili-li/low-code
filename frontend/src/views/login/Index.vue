<script setup lang="ts">
import { useHandleForm } from "@/hooks/useHandleForm.ts";
import { useRouter } from "vue-router";
import userService from "@/api/user";
import message from "@/utils/message";
import { useUserStore } from "@/stores/useUserStore";
import { ref } from "vue";

const userStore = useUserStore()
const router = useRouter();
const activeTab = ref("1");
const formRules = {
  account: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
};

const { model: loginModel, formRef: loginFormRef } = useHandleForm({
  account: "",
  password: "",
  isRemember: false,
});
const loginLoading = ref(false);
const onLoginClick = () => {
  (loginFormRef.value as any)?.validate().then(async (res) => {
    loginLoading.value = true;
    try {
      await userStore.login(loginModel.value)
    } finally {
      loginLoading.value = false;
    }
  });
};
const { model: registerModel, formRef: registerFormRef } = useHandleForm({
  userName: "",
  account: "",
  password: "",
  repeatPassword: "",
});
const registerFormRules = {
  account: [
    {
      required: true,
      message: "请输入昵称",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
  repeatPassword: [
    {
      required: true,
      message: "请确认输入密码",
      trigger: "blur",
    },
    {
      validator: (value, callback) => {
        if (value !== registerModel.value.password) {
          callback("两次输入密码不一致");
        }
        callback();
      },
      trigger: "blur",
    },
  ],
};
const registerLoading = ref(false);
const onRegisterClick = () => {
  (registerFormRef.value as any).validate().then(async (res) => {
    registerLoading.value = true;
    try {
      const res = await userService.register(registerModel.value);
      if (res.code === 200) {
        message.success("注册成功")
        activeTab.value = "1"
      } else {
        message.error(res.msg)
      }
    } catch (error) {
      message.error((error as any).response.data.message)
    } finally {
      registerLoading.value = false;
    }
  });
};
</script>
<template>
  <div class="login-container flex justify-center items-center">
    <div class="login-content">
      <a-card style="border-radius: 10px">
        <a-tabs type="capsule" scrollPosition="left" v-model="activeTab">
          <a-tab-pane key="1" title="立即登陆">
            <a-typography-title :heading="4" style="margin-bottom: 20px">
              Hello 欢迎登陆Low-Code
            </a-typography-title>
            <a-form
              ref="loginFormRef"
              :label-width="80"
              :model="loginModel"
              label-placement="left"
              label-align="left"
              :rules="formRules"
            >
              <a-form-item field="account" hide-label>
                <a-input v-model="loginModel.account" placeholder="请输入账号">
                  <template #prefix>
                    <icon-idcard />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item hide-label field="password">
                <a-input-password
                  placeholder="请输入密码"
                  :defaultVisibility="true"
                  allow-clear
                  v-model="loginModel.password"
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item hide-label>
                <div style="display: flex; justify-content: space-between; width: 100%">
                  <a-checkbox v-model="loginModel.isRemember">记住密码</a-checkbox>
                  <a-link>忘记密码</a-link>
                </div>
              </a-form-item>
            </a-form>
            <div style="display: flex; justify-content: center">
              <a-button type="primary" @click="onLoginClick" style="width: 100%" :loading="loginLoading">
                登陆
              </a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" title="注册账号">
            <a-typography-title :heading="4" style="margin-bottom: 20px">
              Hello 欢迎注册Low-Code
            </a-typography-title>
            <a-form
              ref="registerFormRef"
              :label-width="80"
              :model="registerModel"
              label-placement="left"
              label-align="left"
              :rules="registerFormRules"
            >
              <a-form-item field="account" hide-label>
                <a-input v-model="registerModel.account" placeholder="请输入账号">
                  <template #prefix>
                    <icon-idcard />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item hide-label field="password">
                <a-input-password
                  placeholder="请输入密码"
                  :defaultVisibility="true"
                  allow-clear
                  v-model="registerModel.password"
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item hide-label field="repeatPassword">
                <a-input-password
                  placeholder="请确认输入密码"
                  :defaultVisibility="true"
                  allow-clear
                  v-model="registerModel.repeatPassword"
                >
                  <template #prefix>
                    <icon-lock />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item hide-label>
                <a-input v-model="registerModel.userName" placeholder="请输入昵称">
                  <template #prefix>
                    <icon-user />
                  </template>
                </a-input>
              </a-form-item>
            </a-form>
            <div style="display: flex; justify-content: center">
              <a-button type="primary" @click="onRegisterClick" style="width: 100%">
                注册
              </a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  height: 100vh;
  background-image: url(@/assets/images/login-bg.svg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: #1c1c1c;
  .login-content {
    width: 400px;
    height: 400px;
    margin: 0 auto;
  }
}
</style>
