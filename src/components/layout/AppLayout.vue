<script setup lang="ts">
import { Layout } from 'ant-design-vue'

const { Content } = Layout
</script>

<template>
  <Layout
    class="font-sans h-svh overflow-hidden bg-linear-to-b from-teal-50/80 via-slate-50 to-stone-100"
  >
    <Content class="flex h-full justify-center overflow-y-auto p-4 md:p-8">
      <div class="flex w-full max-w-3xl flex-col py-2 md:py-6">
        <RouterView />
      </div>
    </Content>
  </Layout>
</template>
