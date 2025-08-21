<script setup lang="ts">
import { ref } from "vue";
import noImage from "@/assets/images/upload/noImage.png";
import { generateUUID } from "@/utils";
enum PreviewImageType {
  DEFAULT = 1,
  UPLOAD = 2,
}
const createModalVisible = ref(false);
const form = ref({
  name: "",
  description: "",
  creator: "张三",
  applicationId: generateUUID(),
  previewImage: "",
  previewImageType: PreviewImageType.DEFAULT,
  status: 0,
});
const rules = ref({
  name: [{ required: true, message: "请输入项目名称" }],
  description: [{ required: true, message: "请输入项目描述" }],
});
const handleCreateProject = () => {
  console.log(form.value);
};
const openCreateProjectModal = () => {
  createModalVisible.value = true;
};
defineExpose({
  openCreateProjectModal,
});
</script>

<template>
  <a-modal
    v-model:visible="createModalVisible"
    title="新建项目"
    @ok="handleCreateProject"
    :width="800"
  >
    <a-form :model="form" :rules="rules" label-align="left" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="项目名称" field="name" label-col-flex="100px">
            <a-input v-model="form.name" placeholder="请输入项目名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="项目描述" field="description" label-col-flex="100px">
            <a-input v-model="form.description" placeholder="简短描述项目(30字以内)" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="接口地址" label-col-flex="100px">
            <a-input v-model="form.applicationId" placeholder="请输入接口地址" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="应用ID" label-col-flex="100px">
            <a-input v-model="form.applicationId" placeholder="请输入项目描述" disabled />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="应用状态" label-col-flex="100px">
            <a-select v-model="form.status" disabled>
              <a-option :value="0">开发中</a-option>
              <a-option :value="1">已发布</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="创建者" label-col-flex="100px">
            <a-input v-model="form.creator" placeholder="请输入项目名称" disabled />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="项目缩略图" label-col-flex="100px">
            <div class="flex flex-col gap-5">
              <a-radio-group v-model="form.previewImageType" style="width: auto;">
                <a-radio :value="PreviewImageType.DEFAULT">使用默认图片</a-radio>
                <a-radio :value="PreviewImageType.UPLOAD">上传图片</a-radio>
              </a-radio-group>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style scoped lang="less"></style>
