<script setup lang="ts"></script>

<template>
  <div class="avatar">
    <a-dropdown>
      <a-avatar
        :style="{
          color: 'yellow',
          backgroundColor: 'red',
          cursor: 'pointer',
        }"
        :size="32"
        shape="square"
      >
        M
      </a-avatar>
      <template #content>
        <a-doption>
          <a-icon>
            <icon-user />
          </a-icon>
          用户资料
        </a-doption>
        <a-doption>
          <a-icon>
            <icon-edit />
          </a-icon>
          编辑资料
        </a-doption>
        <a-doption>
          <a-icon>
            <icon-export />
          </a-icon>
          退出登录
        </a-doption>
      </template>
    </a-dropdown>
  </div>
</template>
