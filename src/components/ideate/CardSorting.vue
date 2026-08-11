<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  List,
  ListItem,
  Popconfirm,
  Row,
  Select,
  SelectOption,
  Space,
  Tag,
  message,
} from 'ant-design-vue'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import AiAssistButton from '@/components/shared/AiAssistButton.vue'
import { useIdeateStore } from '@/stores/ideate'

const ideateStore = useIdeateStore()
const { cardSort } = storeToRefs(ideateStore)

const draftLabel = ref('')

const cardById = computed(() => {
  const map = new Map<string, string>()
  for (const card of cardSort.value.cards) {
    map.set(card.id, card.label)
  }
  return map
})

const unassignedCards = computed(() =>
  cardSort.value.unassignedIds
    .map((id) => {
      const label = cardById.value.get(id)
      return label === undefined ? undefined : { id, label }
    })
    .filter((c): c is { id: string; label: string } => c !== undefined),
)

const categoryOptions = computed(() =>
  cardSort.value.categories.map((c) => ({ value: c.id, label: c.title })),
)

function onAddCard(): void {
  const label = draftLabel.value.trim()
  if (!label) {
    message.warning('عنوان کارت را وارد کنید')
    return
  }
  ideateStore.addSortCard(label)
  draftLabel.value = ''
  message.success('کارت افزوده شد')
}

function cardsInCategory(categoryId: string): { id: string; label: string }[] {
  const cat = cardSort.value.categories.find((c) => c.id === categoryId)
  if (!cat) return []
  return cat.cardIds
    .map((id) => {
      const label = cardById.value.get(id)
      return label === undefined ? undefined : { id, label }
    })
    .filter((c): c is { id: string; label: string } => c !== undefined)
}

function onAssign(cardId: string, value: unknown): void {
  if (value === null || value === undefined || value === '') {
    ideateStore.assignSortCard(cardId, null)
    return
  }
  if (typeof value === 'string') {
    ideateStore.assignSortCard(cardId, value)
  }
}

function currentCategoryId(cardId: string): string | undefined {
  if (cardSort.value.unassignedIds.includes(cardId)) return undefined
  const found = cardSort.value.categories.find((c) => c.cardIds.includes(cardId))
  return found?.id
}
</script>

<template>
  <Space direction="vertical" size="large">
    <AiAssistButton action="suggest-card-sort" label="پیشنهاد کارت‌ها با AI" />

    <Card size="small" title="افزودن کارت محتوا">
      <Space wrap>
        <Input v-model:value="draftLabel" placeholder="مثلاً فیلتر قیمت" @press-enter="onAddCard" />
        <Button type="primary" @click="onAddCard">
          <template #icon><PlusOutlined /></template>
          کارت
        </Button>
      </Space>
    </Card>

    <Empty v-if="cardSort.cards.length === 0" description="کارت‌هایی برای مرتب‌سازی اضافه کنید" />

    <template v-else>
      <Card size="small" title="اختصاص دسته">
        <List item-layout="horizontal" :data-source="cardSort.cards">
          <template #renderItem="{ item }">
            <ListItem>
              <template #actions>
                <Select
                  :value="currentCategoryId(item.id)"
                  allow-clear
                  placeholder="بدون دسته"
                  @change="(v: unknown) => onAssign(item.id, v)"
                >
                  <SelectOption v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </SelectOption>
                </Select>
                <Popconfirm
                  title="این کارت حذف شود؟"
                  ok-text="حذف"
                  cancel-text="انصراف"
                  @confirm="ideateStore.removeSortCard(item.id)"
                >
                  <Button type="text" danger>
                    <template #icon><DeleteOutlined /></template>
                  </Button>
                </Popconfirm>
              </template>
              {{ item.label }}
            </ListItem>
          </template>
        </List>
      </Card>

      <Row :gutter="[16, 16]">
        <Col :xs="24" :md="12" :lg="6">
          <Card size="small" title="اختصاص‌نداده">
            <Space wrap>
              <Tag v-for="card in unassignedCards" :key="card.id" color="default">
                {{ card.label }}
              </Tag>
            </Space>
            <Empty v-if="unassignedCards.length === 0" description="خالی" />
          </Card>
        </Col>
        <Col v-for="cat in cardSort.categories" :key="cat.id" :xs="24" :md="12" :lg="6">
          <Card size="small" :title="cat.title">
            <Space wrap>
              <Tag v-for="card in cardsInCategory(cat.id)" :key="card.id" color="processing">
                {{ card.label }}
              </Tag>
            </Space>
            <Empty v-if="cardsInCategory(cat.id).length === 0" description="خالی" />
          </Card>
        </Col>
      </Row>
    </template>
  </Space>
</template>
