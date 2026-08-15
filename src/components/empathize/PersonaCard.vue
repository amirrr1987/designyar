<script setup lang="ts">
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  DescriptionsItem,
  Popconfirm,
  Space,
  Tag,
} from 'ant-design-vue'
import { DeleteOutlined } from '@ant-design/icons-vue'
import type { Persona } from '@/types/persona'
import { fa } from '@/content/fa'

interface PersonaCardProps {
  persona: Persona
}

const props = defineProps<PersonaCardProps>()
const emit = defineEmits<{ remove: [id: string] }>()
const labels = fa.empathizeTools.persona

function onConfirmRemove(): void {
  emit('remove', props.persona.id)
}

function initial(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  return trimmed.slice(0, 1)
}
</script>

<template>
  <Card size="small">
    <template #title>
      <Space>
        <Avatar :style="{ backgroundColor: persona.avatarColor ?? '#1677ff' }">
          {{ initial(persona.name) }}
        </Avatar>
        <span>{{ persona.name }}</span>
      </Space>
    </template>
    <template #extra>
      <Popconfirm
        title="این پرسونا حذف شود؟"
        ok-text="حذف"
        cancel-text="انصراف"
        @confirm="onConfirmRemove"
      >
        <Button type="text" danger>
          <template #icon><DeleteOutlined /></template>
        </Button>
      </Popconfirm>
    </template>

    <Descriptions :column="1" size="small">
      <DescriptionsItem :label="labels.role">{{ persona.role }}</DescriptionsItem>
      <DescriptionsItem :label="labels.age">
        <Tag v-if="persona.age !== null">{{ persona.age }}</Tag>
        <span v-else>—</span>
      </DescriptionsItem>
      <DescriptionsItem :label="labels.goals">{{ persona.goals }}</DescriptionsItem>
      <DescriptionsItem :label="labels.pains">{{ persona.pains }}</DescriptionsItem>
      <DescriptionsItem v-if="persona.bio.trim()" :label="labels.bio">
        {{ persona.bio }}
      </DescriptionsItem>
    </Descriptions>
  </Card>
</template>
