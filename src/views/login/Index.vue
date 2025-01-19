<script setup>
import { onMounted, ref } from "vue";
import userApi from "@/api/user";
import { Videocam } from "@vicons/ionicons5";
import { Icon } from "@vicons/utils";
import { useForm } from "@/hooks/form";

const formRules = {
  userName: {
    required: true,
    message: "请输入用户名",
    trigger: "blur",
  },
  password: {
    required: true,
    message: "请输入密码",
    trigger: "blur",
  },
};
const { model, formRef } = useForm({
  userName: "",
  password: "",
});

const onLoginClick = () => {
  console.log(model.value);
};
</script>
<template>
  <div class="login-container flex justify-center items-center">
    <div class="login-content">
      <n-card style="border-radius: 10px">
        <n-form
          ref="formRef"
          :label-width="80"
          :model="model"
          label-placement="left"
          label-align="left"
          :rules="formRules"
        >
          <n-form-item label="用户名" path="userName">
            <n-input v-model:value="model.userName" placeholder="请输入用户名" />
          </n-form-item>
          <n-form-item label="密码" path="password">
            <n-input
              type="password"
              show-password-on="click"
              placeholder="请输入密码"
              :maxlength="8"
              v-model:value="model.password"
            />
          </n-form-item>
        </n-form>
        <div style="display: flex; justify-content: center">
          <n-button type="primary" @click="onLoginClick" style="width: 100%">
            立即登陆
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-container {
  height: 100vh;
  background-image: url(@/assets/images/login-bg.svg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: #333;
  .login-content {
    width: 400px;
    height: 400px;
    margin: 0 auto;
  }
}
</style>
