<script setup lang="ts">
import {
  BrowsersOutline,
  BuildOutline,
  CodeDownloadSharp,
  TrashOutline,
} from "@vicons/ionicons5";
import { ref } from "vue";
import projectBgMock from "@/assets/images/project/project-bg-mock.png";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";
const router = useRouter();
const formData = ref({
  projectName: "",
});

const mockProjectData = ref([
  {
    previewImage: projectBgMock,
    name: "项目",
    status: 1,
    id: 1,
    description: "这是一个项目描述",
    creator: "admin3",
  },
  {
    previewImage: projectBgMock,
    name: "项目2",
    status: 0,
    id: 2,
    description: "这是一个项目描述",
    creator: "张三",
  },
  {
    previewImage: projectBgMock,
    name: "项目3",
    status: 0,
    id: 3,
    description: "这是一个项目描述",
    creator: "张三",
  },
]);

const handleEdit = (item: any) => {
  router.push({
    name: "Setting",
    params: {
      id: item.id,
    },
  });
};

const onSearch = (name: string) => {
  console.log(name, "name");
};
</script>

<template>
  <div class="list-container w-full">
    <a-layout-header style="height: 50px; border-bottom: 1px solid #333">
      <Header @onSearch="onSearch" placeholder="请输入项目名称" />
    </a-layout-header>
    <a-layout-content style="padding: 12px">
      <a-grid :cols="3" :colGap="12" :rowGap="12">
        <a-grid-item v-for="item in mockProjectData" :key="item.id">
          <a-card body-style="padding: 10px">
            <template #cover>
              <div class="project-image-wrapper">
                <img :src="item.previewImage" alt="" class="project-image" />
                <div class="status-tag" :class="item.status === 1 ? 'success' : 'error'">
                  <span class="status-text">{{ item.status === 1 ? "已发布" : "开发中" }}</span>
                </div>
              </div>
              <a-image :src="item.previewImage" style="display: none" />
            </template>
            <div class="flex flex-col gap-3">
              <div class="info">
                <div class="info--name font-bold">{{ item.name }}</div>
                <div class="info--more flex flex-1 items-center justify-end">
                  <div class="status flex items-center flex-shrink-0">
                    创建人： {{ item.creator }}
                  </div>
                </div>
              </div>
              <div class="description">
                {{ item.description }}
              </div>
              <div class="operate flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <a-tooltip position="bottom" content="修改">
                    <a-button type="dashed" size="small">
                      <template #icon>
                        <a-icon size="16">
                          <icon-edit />
                        </a-icon>
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip position="bottom" content="导出">
                    <a-button type="dashed" size="small">
                      <template #icon>
                        <a-icon size="16">
                          <CodeDownloadSharp />
                        </a-icon>
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip position="bottom" content="复制">
                    <a-button type="dashed" size="small">
                      <template #icon>
                        <a-icon size="16">
                          <icon-copy />
                        </a-icon>
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip position="bottom" content="删除">
                    <a-button type="dashed" size="small">
                      <template #icon>
                        <a-icon size="16">
                          <TrashOutline />
                        </a-icon>
                      </template>
                    </a-button>
                  </a-tooltip>
                </div>
                <div class="flex items-center gap-2">
                  <a-tooltip position="bottom" content="开发">
                    <a-button type="dashed" size="small" @click="handleEdit(item)">
                      <template #icon>
                        <a-icon size="16">
                          <BuildOutline />
                        </a-icon>
                      </template>
                    </a-button>
                  </a-tooltip>
                  <a-tooltip position="bottom" content="预览">
                    <a-button type="dashed" size="small">
                      <template #icon>
                        <a-icon size="16">
                          <BrowsersOutline />
                        </a-icon>
                      </template>
                    </a-button>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </a-card>
        </a-grid-item>
      </a-grid>
    </a-layout-content>
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
    transition: all 0.3s;
    &:hover {
      scale: 1.1;
    }
  }
  .info {
    display: flex;
    align-items: center;
    &--name {
      width: 68%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 16px;
    }

  }
  .description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .project-image-wrapper {
    position: relative;
    overflow: hidden;
  }

  .status-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
    z-index: 1;

    &.success {
      background: linear-gradient(135deg, #4b9e5f 0%, #3d8b4e 100%);
      box-shadow: 0 2px 8px rgba(75, 158, 95, 0.2);
    }

    &.error {
      background: linear-gradient(135deg, #2c4df4 0%, #4326e7 100%);
      box-shadow: 0 2px 8px rgba(228, 164, 65, 0.2);
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .status-text {
    display: block;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
  }
}
</style>
