// components/withAuth.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
      // Vérifiez l'authentification (localStorage, cookies, etc.)
      const checkAuth = async () => {
        const auth = /* votre logique d'authentification */
        
        if (!auth) {
          router.replace('/Login')
        } else {
          setIsAuthenticated(true)
        }
        setLoading(false)
      }
      
      checkAuth()
    }, [router])
    
    if (loading) return <div>Chargement...</div>
    if (!isAuthenticated) return null
    
    return <Component {...props} />
  }
}