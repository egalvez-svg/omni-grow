export interface PayloadInterface {
  id: number
  usuario: string
  email: string
  roles: string[]
  modulos: { slug: string }[]
}
