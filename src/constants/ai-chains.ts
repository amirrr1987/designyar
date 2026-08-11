import type { AiActionId } from '@/utils/ai-prompts'

export interface AiChainDef {
  id: string
  label: string
  description: string
  steps: readonly AiActionId[]
}

export const AI_CHAINS: readonly AiChainDef[] = [
  {
    id: 'define-complete',
    label: 'زنجیره Define کامل',
    description: 'بیان مسئله → POV → سوالات HMW (با اعمال خودکار بین مراحل)',
    steps: ['refine-problem', 'refine-pov', 'generate-hmw'],
  },
  {
    id: 'empathize-starter',
    label: 'شروع Empathize',
    description: 'یادداشت تحقیق → پرسونا → نقشه همدلی',
    steps: ['seed-research-notes', 'persona-suggest', 'synthesize-empathy'],
  },
] as const

export type AiChainId = (typeof AI_CHAINS)[number]['id']

export function isAiChainId(value: string): value is AiChainId {
  return AI_CHAINS.some((c) => c.id === value)
}

export function getAiChain(id: AiChainId): AiChainDef {
  const chain = AI_CHAINS.find((c) => c.id === id)
  if (!chain) throw new Error(`Unknown AI chain: ${id}`)
  return chain
}
