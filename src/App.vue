<script setup lang="ts">
import { RouterView } from "vue-router";
import { darkTheme } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";

const themeOverrides = {
  // common: {
  //   primaryColor: 'rgba(245,57,48, 1)',
  //   primaryColorHover: 'rgba(245,57,48, 1)',
  // },
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="darkTheme" :locale="zhCN" :date-locale="dateZhCN">
    <n-scrollbar style="height: 100vh">
      <RouterView />
    </n-scrollbar>
  </n-config-provider>
</template>

<style scoped></style>
