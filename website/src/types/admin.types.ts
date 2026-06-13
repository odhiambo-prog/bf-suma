export interface AdminProfile {
  id: string
  email: string
  role: 'admin' | 'editor'
}
