<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, Empty, Input, Popconfirm, Space, Tree, message } from 'ant-design-vue'
import type { TreeProps } from 'ant-design-vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useIdeateStore } from '@/stores/ideate'
import type { SitemapNode } from '@/types/ideate'

const ideateStore = useIdeateStore()
const { sitemap } = storeToRefs(ideateStore)

const rootTitle = ref('')
const childTitle = ref('')
const selectedKey = ref<string | null>(null)
const editingKey = ref<string | null>(null)
const editingTitle = ref('')

const treeData = computed((): TreeProps['treeData'] => mapToTreeData(sitemap.value))

function mapToTreeData(nodes: SitemapNode[]): TreeProps['treeData'] {
  return nodes.map((node) => ({
    key: node.key,
    title: node.title,
    children: node.children?.length ? mapToTreeData(node.children) : undefined,
  }))
}

function onSelect(keys: (string | number)[]): void {
  const first = keys[0]
  selectedKey.value = typeof first === 'string' ? first : null
}

function onAddRoot(): void {
  const title = rootTitle.value.trim()
  if (!title) {
    message.warning('عنوان صفحه را وارد کنید')
    return
  }
  ideateStore.addSitemapChild(null, title)
  rootTitle.value = ''
  message.success('صفحه ریشه افزوده شد')
}

function onAddChild(): void {
  if (!selectedKey.value) {
    message.warning('ابتدا یک گره را انتخاب کنید')
    return
  }
  const title = childTitle.value.trim()
  if (!title) {
    message.warning('عنوان زیرصفحه را وارد کنید')
    return
  }
  ideateStore.addSitemapChild(selectedKey.value, title)
  childTitle.value = ''
  message.success('زیرصفحه افزوده شد')
}

function startEdit(key: string, title: string): void {
  editingKey.value = key
  editingTitle.value = title
}

function commitEdit(): void {
  if (!editingKey.value) return
  const title = editingTitle.value.trim()
  if (!title) {
    message.warning('عنوان نمی‌تواند خالی باشد')
    return
  }
  ideateStore.updateSitemapTitle(editingKey.value, title)
  editingKey.value = null
  editingTitle.value = ''
}

function onDeleteSelected(): void {
  if (!selectedKey.value) return
  ideateStore.removeSitemapNode(selectedKey.value)
  selectedKey.value = null
  message.success('گره حذف شد')
}
</script>

<template>
  <Space direction="vertical" size="middle">
    <Card size="small" title="افزودن صفحه ریشه">
      <Space wrap>
        <Input v-model:value="rootTitle" placeholder="مثلاً محصولات" @press-enter="onAddRoot" />
        <Button type="primary" @click="onAddRoot">
          <template #icon><PlusOutlined /></template>
          ریشه
        </Button>
      </Space>
    </Card>

    <Card size="small" title="افزودن زیرصفحه به گره انتخاب‌شده">
      <Space wrap>
        <Input
          v-model:value="childTitle"
          placeholder="مثلاً جزئیات محصول"
          :disabled="!selectedKey"
          @press-enter="onAddChild"
        />
        <Button type="primary" :disabled="!selectedKey" @click="onAddChild">
          <template #icon><PlusOutlined /></template>
          زیرصفحه
        </Button>
        <Popconfirm
          title="گره انتخاب‌شده حذف شود؟"
          ok-text="حذف"
          cancel-text="انصراف"
          :disabled="!selectedKey"
          @confirm="onDeleteSelected"
        >
          <Button danger :disabled="!selectedKey">
            <template #icon><DeleteOutlined /></template>
            حذف گره
          </Button>
        </Popconfirm>
      </Space>
    </Card>

    <Empty v-if="sitemap.length === 0" description="نقشه سایت خالی است" />

    <Tree
      v-else
      default-expand-all
      :tree-data="treeData"
      :selected-keys="selectedKey ? [selectedKey] : []"
      @select="onSelect"
    >
      <template #title="{ key, title }">
        <Space v-if="editingKey === key">
          <Input
            v-model:value="editingTitle"
            size="small"
            @press-enter="commitEdit"
            @blur="commitEdit"
          />
        </Space>
        <Space v-else>
          <span @dblclick="startEdit(String(key), String(title))">{{ title }}</span>
        </Space>
      </template>
    </Tree>
  </Space>
</template>
