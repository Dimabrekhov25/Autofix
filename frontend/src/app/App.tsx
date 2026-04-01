import { AuthProvider } from '../features/auth/AuthProvider'
import { AppRouter } from './router'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
