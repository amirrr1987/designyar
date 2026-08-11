export interface Persona {
  id: string
  name: string
  role: string
  age: number | null
  goals: string
  pains: string
  bio: string
  avatarColor?: string
  createdAt: string
}

export function isPersona(value: unknown): value is Persona {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  const ageOk = v.age === null || typeof v.age === 'number'
  const avatarOk = v.avatarColor === undefined || typeof v.avatarColor === 'string'
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.role === 'string' &&
    ageOk &&
    typeof v.goals === 'string' &&
    typeof v.pains === 'string' &&
    typeof v.bio === 'string' &&
    avatarOk &&
    typeof v.createdAt === 'string'
  )
}

export function isPersonaArray(value: unknown): value is Persona[] {
  return Array.isArray(value) && value.every(isPersona)
}
