<script setup lang="ts">
import {
  Search,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { ref } from 'vue'

const formData = ref({
  templateName: '',
})

</script>

<template>
  <div class="list-container">
    <n-layout-header bordered style="height: 60px">
      <div class="header h-full flex items-center justify-between">
        <div class="search flex">
          <n-input
            v-model:value="formData.templateName"
            placeholder="请输入模版名称"
            style="margin-right: 20px; width: 250px"
          />
          <n-button type="primary">
            <template #icon>
              <n-icon>
                <Search />
              </n-icon>
            </template>
            搜索
          </n-button>
        </div>
      </div>
    </n-layout-header>
  </div>
</template>

<style scoped lang="less">
.list-container {

  .header {
    .search {
      padding: 0 20px;
    }
  }

}
</style>
