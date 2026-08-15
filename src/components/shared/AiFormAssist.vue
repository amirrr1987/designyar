<script setup lang="ts">
import { computed } from 'vue'
import { Button, Card, Modal, Space, Typography } from 'ant-design-vue'
import type { ButtonProps, CardProps, ModalProps } from 'ant-design-vue'
import { ThunderboltOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'

interface Props {
  assistLabel: string
  loading: boolean
  errorMessage: string
  previewText: string
  hasPreview: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  assist: []
  accept: []
  reject: []
}>()

const cardProps: CardProps = {
  size: 'small',
  bordered: true,
}

const assistBtn: ButtonProps = { type: 'primary' }
const acceptBtn: ButtonProps = { type: 'primary' }

const modalOpen = computed(() => props.hasPreview && !props.loading)

const modalProps: ModalProps = {
  title: 'پیش‌نمایش پیشنهاد هوش مصنوعی',
  width: 640,
  centered: true,
  destroyOnClose: true,
  maskClosable: false,
  keyboard: true,
}

function onAccept(): void {
  emit('accept')
}

function onReject(): void {
  emit('reject')
}
</script>

<template>
  <Card
    v-bind="cardProps"
    class="overflow-hidden shadow-sm ring-1 ring-teal-100/80"
    :head-style="{ background: 'rgba(240, 253, 250, 0.9)', borderBottom: '1px solid #ccfbf1' }"
  >
    <template #title>
      <Space size="small">
        <ThunderboltOutlined class="text-teal-700" aria-hidden="true" />
        <span>پیشنهاد هوش مصنوعی</span>
      </Space>
    </template>

    <Space direction="vertical" class="w-full" size="middle">
      <Typography.Text class="text-stone-500">
        خالی‌ها را پر می‌کند و متن‌های موجود را هم بهتر می‌کند. نتیجه در پنجره باز می‌شود؛ تا وقتی
        نپذیری فرم عوض نمی‌شود.
      </Typography.Text>

      <Button
        v-bind="assistBtn"
        :loading="props.loading"
        :aria-busy="props.loading"
        :aria-label="props.assistLabel"
        @click="emit('assist')"
      >
        <template #icon>
          <ThunderboltOutlined aria-hidden="true" />
        </template>
        {{ props.assistLabel }}
      </Button>

      <Typography.Text v-if="props.loading" class="text-sm text-teal-700" aria-live="polite">
        در حال دریافت پیشنهاد…
      </Typography.Text>
    </Space>
  </Card>

  <Modal
    v-bind="modalProps"
    :open="modalOpen"
    :aria-label="modalProps.title"
    @cancel="onReject"
  >
    <Typography.Paragraph
      class="mb-0! max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-stone-700"
      aria-live="polite"
    >
      {{ props.previewText || 'پیشنهادی برای نمایش نیست.' }}
    </Typography.Paragraph>

    <template #footer>
      <Space wrap>
        <Button v-bind="acceptBtn" aria-label="پذیرش پیشنهاد و اعمال روی فرم" @click="onAccept">
          <template #icon>
            <CheckOutlined aria-hidden="true" />
          </template>
          پذیرش
        </Button>
        <Button aria-label="رد پیشنهاد" @click="onReject">
          <template #icon>
            <CloseOutlined aria-hidden="true" />
          </template>
          رد
        </Button>
      </Space>
    </template>
  </Modal>
</template>
