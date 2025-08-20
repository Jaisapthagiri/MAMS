export const useAuthInfo = () => {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    baseId: localStorage.getItem('baseId') || '',
  }
}
