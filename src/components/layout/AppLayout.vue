<script setup lang="ts">
import { Layout } from 'ant-design-vue'

const { Content } = Layout
</script>

<template>
  <Layout class="font-sans h-svh overflow-hidden">
    <Content class="flex h-full items-center justify-center p-6 md:p-10">
      <div class="flex h-full w-full max-w-2xl flex-col justify-center">
        <RouterView />
      </div>
    </Content>
  </Layout>
</template>
