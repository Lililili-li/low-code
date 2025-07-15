<template>
  <Modal v-model:visible="visible" title="变量绑定">
    <div class="variable-modal">
      <div class="content flex gap-3">
        <div class="list">
          <div class="title">变量列表</div>
          <div class="list-content flex" style="height: 350px">
            <div class="list-content-left pr-2 pl-2 pt-1 pb-1">

            </div>
            <div class="list-content-right pr-2 pl-2 pt-1 pb-1">右侧树结构</div>
          </div>
        </div>
        <div class="expression">
          <div class="title">表达式</div>
          <div class="expression-content" style="height: 350px">
            <div class="write-able pr-2 pl-2 pt-1 pb-1">书写表达式</div>
            <div class="description pr-2 pl-2 pt-1 pb-1">
              你可以通过点击左侧区域绑定变量，当然你也可以在上方输入复杂的表达式。
              <br />
              输入框内默认支持变量，写法和 JS 写法完全一致。
              <br />
              例：state.name = '张三'
              <br />
              例：global.flag = true
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue"
import Modal from "../Modal/index.vue"

const visible = ref(false)

const openModal = () => {
  visible.value = true
}
defineExpose({ openModal })
</script>

<style lang="less" scoped>
.variable-modal {
  .content {
    > div {
      .title {
        font-weight: bold;
        color: #fff;
        margin-bottom: 5px;
      }
    }
    .list {
      width: 45%;
      .list-content {
        border: 1px solid #666;
        border-radius: 5px;
      }
      .list-content-left {
        width: 40%;
        border-right: 1px solid #666;
      }
      .list-content-right {
        width: 60%;
      }
    }
    .expression {
      width: 55%;
      .expression-content {
        border: 1px solid #666;
        border-radius: 5px;
        .write-able {
          height: 220px;
        }
      }
    }
  }
}
</style>
