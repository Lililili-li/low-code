<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Window32Filled, TabDesktopNewPage20Regular } from '@vicons/fluent'
import { usePageConfigStore } from "@/stores/usePageConfigStore"
import { useRoute, useRouter } from "vue-router"
import { Local } from "@/utils/storage"
import jsonPack from "jsonpack"
import UserSetting from "@/components/UserConfig/index.vue"
import { usePanelConfigStore } from "@/stores/usePanelConfigStore"
import { useProjectStore } from "@/stores/useProjectStore"


const route = useRoute()
const router = useRouter()
const pageConfigStore = usePageConfigStore()
const panelConfigStore = usePanelConfigStore()
const projectStore = useProjectStore()

const onSavePageSetting = () => {
  const page = pageConfigStore.pageSetting
  page['style'] = panelConfigStore.canvasSetting as any
  console.log(page)
  const pack = jsonPack.pack(page)
  const globalConfig = jsonPack.pack(projectStore.schema)
  Local.set("pageConfig", pack)
  Local.set("globalConfig", globalConfig)
}
const currentPage = ref<number>()
const onChangePage = (value: number) => {
  router.replace({ name: "Setting", params: { id: value } })
}
onMounted(() => {
  currentPage.value = Number(route.params.id)
})
</script>

<template>
  <div class="layout-header pl-2 pr-2 flex items-center">
    <a-row align="center" class="w-full">
      <a-col :span="8">
        <div class="back">
          <a-button quaternary size="small" @click="router.go(-1)">
            <template #icon>
              <icon-home />
            </template>
            返回
          </a-button>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="page-name flex justify-center gap-4">
          <a-select
            style="width: 240px"
            :options="[
              {
                label: '页面1',
                value: 1,
              },
              {
                label: '页面2',
                value: 2,
              },
            ]"
            v-model="currentPage"
            @change="onChangePage"
          />
          <a-button quaternary>
            <template #icon>
              <a-icon>
                <TabDesktopNewPage20Regular />
              </a-icon>
            </template>
            添加页面
          </a-button>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="info flex justify-end items-center" style="gap: 20px">
          <a-button @click="onSavePageSetting">
            <template #icon>
              <icon-send size="18" />
            </template>
            加载异步数据
          </a-button>
          <router-link :to="{ path: '/preview/1' }" target="_blank">
            <a-button>
              <template #icon>
                <a-icon size="18">
                  <Window32Filled />
                </a-icon>
              </template>
              预览
            </a-button>
          </router-link>
          <a-button @click="onSavePageSetting">
            <template #icon>
              <icon-cloud-download size="18" />
            </template>
            保存
          </a-button>
          <UserSetting />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">
.layout-header {
  height: 49px;
  border-bottom: 1px solid rgb(51, 51, 51);
  background-color: var(--color-menu-light-bg);
  .back {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>
