<script setup lang="ts">
import { useComponentConfigStore } from "@/stores/useComponentConfigStore.js"
import { computed, ref } from "vue"
import { TextGrammarSettings24Regular } from "@vicons/fluent"
import SelectVariableModal from "@/components/SelectVariableModal/index.vue"

const componentConfigStore = useComponentConfigStore()

const compConfig = computed(() => componentConfigStore?.activeComponent!)

const selectVariableModalRef = ref(null)
const openModal = () => {
  (selectVariableModalRef.value as any)?.openModal()
}
</script>

<template>
  <a-scrollbar style="height: calc(100vh - 130px); overflow-y: auto">
    <div class="style-page pr-3 pl-3">
      <a-space class="w-full">
        <a-typography style="width: 60px">是否渲染</a-typography>
        <div class="flex gap-2 items-center">
          <a-switch
            v-model="compConfig.props.visible.value"
            v-if="(compConfig.props.visible.type as string) === 'Normal'"
            size="small"
          />
          <span >已绑定：-</span>
          <a-tooltip
            :content="compConfig.props.visible.type === 'JSExpression' ? '变量绑定' : '常量渲染'"
            class="flex-1"
            @click="openModal"
          >
            <div class="cursor-pointer">
              <a-icon size="20">
                <TextGrammarSettings24Regular />
              </a-icon>
            </div>
          </a-tooltip>
        </div>
      </a-space>
      <a-space
        class="w-full"
        align="center"
        justify="space-between"
        v-if="compConfig.props.visible.type === 'JSExpression'"
        style="margin-top: -10px"
      >
        <a-typography style="width: 30px"></a-typography>
        <div class="flex-1 flex gap-1 items-center">
        </div>
      </a-space>
    </div>
  </a-scrollbar>
  <SelectVariableModal ref="selectVariableModalRef" />
</template>
<style lang="less" scoped></style>
