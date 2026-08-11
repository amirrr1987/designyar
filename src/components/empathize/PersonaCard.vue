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

interface PersonaCardProps {
  persona: Persona
}

const props = defineProps<PersonaCardProps>()
const emit = defineEmits<{ remove: [id: string] }>()

function onConfirmRemove(): void {
  emit('remove', props.persona.id)
}
</script>

<template>
  <Card size="small">
    <template #title>
      <Space>
        <Avatar :style="{ backgroundColor: persona.avatarColor ?? '#1677ff' }">
          {{ persona.name.slice(0, 1) }}
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
      <DescriptionsItem label="نقش">{{ persona.role }}</DescriptionsItem>
      <DescriptionsItem label="سن">
        <Tag v-if="persona.age !== null">{{ persona.age }}</Tag>
        <span v-else>—</span>
      </DescriptionsItem>
      <DescriptionsItem label="اهداف">{{ persona.goals }}</DescriptionsItem>
      <DescriptionsItem label="دردها">{{ persona.pains }}</DescriptionsItem>
      <DescriptionsItem label="بیو">{{ persona.bio || '—' }}</DescriptionsItem>
    </Descriptions>
  </Card>
</template>
