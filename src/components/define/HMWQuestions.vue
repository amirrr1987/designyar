<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Empty,
  Input,
  List,
  ListItem,
  ListItemMeta,
  Popconfirm,
  Space,
  Tag,
  message,
} from 'ant-design-vue'
import { DeleteOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useDefineStore } from '@/stores/define'

const defineStore = useDefineStore()
const { hmw } = storeToRefs(defineStore)
const draft = ref('')

function onAdd(): void {
  const question = draft.value.trim()
  if (!question) {
    message.warning('سوال را وارد کنید')
    return
  }
  const normalized = question.startsWith('چگونه می‌توانیم')
    ? question
    : `چگونه می‌توانیم ${question}؟`
  defineStore.addHMW(normalized)
  draft.value = ''
  message.success('سوال افزوده شد')
}
</script>

<template>
  <Space direction="vertical" size="middle">
    <Space wrap>
      <AiAssistButton action="generate-hmw" label="تولید سوالات HMW با AI" section="سوالات HMW" />
    </Space>
    <Space.Compact block>
      <Input
        v-model:value="draft"
        placeholder="مثلاً خرید را برای والدین پرمشغله ساده‌تر کنیم"
        @press-enter="onAdd"
      />
      <Button type="primary" @click="onAdd">
        <template #icon><PlusOutlined /></template>
        افزودن HMW
      </Button>
    </Space.Compact>

    <Empty v-if="hmw.length === 0" description="هنوز سوال How Might We ثبت نشده است" />

    <List v-else item-layout="horizontal" :data-source="hmw">
      <template #renderItem="{ item }">
        <ListItem>
          <template #actions>
            <Button type="link" @click="defineStore.incrementHMWVote(item.id)">
              <template #icon><LikeOutlined /></template>
              رأی
            </Button>
            <Popconfirm
              title="این سوال حذف شود؟"
              ok-text="حذف"
              cancel-text="انصراف"
              @confirm="defineStore.removeHMW(item.id)"
            >
              <Button type="link" danger>
                <template #icon><DeleteOutlined /></template>
              </Button>
            </Popconfirm>
          </template>
          <ListItemMeta :title="item.question">
            <template #description>
              <Tag color="blue">{{ item.votes }} رأی</Tag>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </Space>
</template>
