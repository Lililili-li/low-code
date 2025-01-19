<script setup lang="ts">
import {
  BrowsersOutline,
  BuildOutline,
  CodeDownloadSharp,
  EllipsisHorizontalSharp,
  Search,
  TrashOutline,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { ref } from 'vue'
import projectBgMock from '@/assets/images/project/project-bg-mock.png'

const formData = ref({
  projectName: '',
})

const mockProjectData = ref([
  {
    previewImage: projectBgMock,
    name: '模拟数据-不可用',
    status: 1,
    id: 1
  },
  {
    previewImage: projectBgMock,
    name: '模拟数据-不可用2',
    status: 0,
    id: 2
  },
  {
    previewImage: projectBgMock,
    name: '模拟数据-不可用3',
    status: 0,
    id: 3
  },

])
</script>

<template>
  <div class="list-container">
    <n-layout-header bordered style="height: 60px">
      <div class="header h-full flex items-center justify-between">
        <div class="search flex">
          <n-input
            v-model:value="formData.projectName"
            placeholder="请输入项目名称"
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
    <n-layout-content style="padding: 12px">
      <n-infinite-scroll style="height: calc(100vh - 100px)" :distance="10" @load="handleLoad">
        <n-grid :x-gap="12" :y-gap="12" :cols="3">
          <n-grid-item v-for="item in mockProjectData" :key="item.id">
            <n-card>
              <template #cover>
                <img :src="item.previewImage" alt="" class="project-image" />
              </template>
              <div class="info">
                <div class="info--name font-bold">{{ item.name }}</div>
                <div class="info--more flex flex-1 items-center justify-between">
                  <div class="status flex items-center">
                    <span
                      class="circle mr-2"
                      :class="item.status === 1 ? 'success' : 'error'"
                    ></span>
                    <span>{{ item.status === 1 ? '已发布' : '未发布' }}</span>
                  </div>
                  <div class="operate ml-5">
                    <n-tooltip trigger="hover" placement="bottom">
                      <template #trigger>
                        <n-button tertiary>
                          <template #icon>
                            <n-icon>
                              <BuildOutline />
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                      编辑项目
                    </n-tooltip>
                    <n-popover trigger="hover" placement="bottom" style="padding: 5px">
                      <template #trigger>
                        <n-button tertiary class="ml-2">
                          <template #icon>
                            <n-icon>
                              <EllipsisHorizontalSharp />
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                      <n-space vertical>
                        <n-button tertiary>
                          <template #icon>
                            <n-icon>
                              <BrowsersOutline />
                            </n-icon>
                          </template>
                          预览窗口
                        </n-button>
                        <n-button tertiary>
                          <template #icon>
                            <n-icon>
                              <CodeDownloadSharp />
                            </n-icon>
                          </template>
                          导出代码
                        </n-button>
                        <n-button tertiary>
                          <template #icon>
                            <n-icon>
                              <TrashOutline />
                            </n-icon>
                          </template>
                          删除项目
                        </n-button>
                      </n-space>
                    </n-popover>
                  </div>
                </div>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-infinite-scroll>
    </n-layout-content>
  </div>
</template>

<style scoped lang="less">
.list-container {

  .header {
    .search {
      padding: 0 20px;
    }
  }

  .project-image {
    cursor: pointer;
    transition: all .3s;
    &:hover {
      scale: 1.1;
    }
  }
  .info {
    display: flex;
    align-items: center;
    padding: 20px 5px;

    &--name {
      width: 60%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 16px;
    }

    &--more {
      .status {
        .circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .success {
          background: #4b9e5f;
        }

        .error {
          background: #e4a441;
        }
      }
    }
  }

  :deep(.n-card__content) {
    padding: 0 10px;
  }
}
</style>
