export const Role = {
  ADMIN: 'ADMIN',
  COACH: 'COACH',
  CLIENT: 'CLIENT'
} as const

export type RoleName = (typeof Role)[keyof typeof Role]
