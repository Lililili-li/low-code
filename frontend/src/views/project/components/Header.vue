<script setup lang="ts">
import { Search12Filled } from '@vicons/fluent'
import { ref } from "vue";
import UserSetting from "@/components/UserConfig/index.vue";
const emits = defineEmits(["onSearch"]);
const props = defineProps({
  placeholder: {
    type: String,
    default: "请输入",
  },
});
const name = ref("");
const onSearch = () => {
  emits("onSearch", name.value);
};
</script>

<template>
  <div class="header h-full flex items-center justify-between pl-6 pr-6">
    <div class="search flex">
      <a-input
        v-model:value="name"
        :placeholder="placeholder"
        style="margin-right: 20px; width: 250px"
      />
      <a-button @click="onSearch">
        <template #icon>
          <a-icon>
            <Search12Filled />
          </a-icon>
        </template>
        搜索
      </a-button>
    </div>
    <UserSetting />
  </div>
</template>

<style scoped lang="less"></style>
