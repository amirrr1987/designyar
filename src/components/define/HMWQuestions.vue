<script setup lang="ts">
import { computed, ref } from 'vue'
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
  Typography,
  message,
} from 'ant-design-vue'
import { DeleteOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AiSectionAssist from '@/components/shared/AiSectionAssist.vue'
import { useDefineStore } from '@/stores/define'
import { useProjectStore } from '@/stores/project'
import { fa } from '@/content/fa'

const defineStore = useDefineStore()
const projectStore = useProjectStore()
const { hmw } = storeToRefs(defineStore)
const draft = ref('')
const copy = fa.defineTools.hmw
const glossary = fa.getGlossary('hmw')
const job = fa.getJob('define.hmw')
const isJunior = computed(() => projectStore.isJuniorMode)
const { Paragraph, Text } = Typography

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
  <Space direction="vertical" size="middle" style="width: 100%">
    <Paragraph v-if="glossary" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ glossary.labelFa }}</Text>
      <template v-if="!isJunior && glossary.glossEn"> ({{ glossary.glossEn }})</template>
      : {{ glossary.definition }}
    </Paragraph>
    <Paragraph v-if="job && isJunior" type="secondary" style="margin-bottom: 0">
      <Text strong>{{ fa.whyHeading }}</Text>
      {{ ' ' }}{{ job.why }}
    </Paragraph>

    <AiSectionAssist action="generate-hmw" :label="copy.aiLabel" section="سوالات چگونه می‌توانیم" />

    <Space.Compact block>
      <Input
        v-model:value="draft"
        :placeholder="copy.placeholder"
        @press-enter="onAdd"
      />
      <Button type="primary" @click="onAdd">
        <template #icon><PlusOutlined /></template>
        {{ copy.add }}
      </Button>
    </Space.Compact>

    <Empty v-if="hmw.length === 0" :description="copy.empty" />

    <List v-else item-layout="horizontal" :data-source="hmw">
      <template #renderItem="{ item }">
        <ListItem>
          <template #actions>
            <Button type="link" @click="defineStore.incrementHMWVote(item.id)">
              <template #icon><LikeOutlined /></template>
              {{ copy.vote }}
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
              <Tag color="blue">{{ item.votes }} {{ copy.vote }}</Tag>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </Space>
</template>
