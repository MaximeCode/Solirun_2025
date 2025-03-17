// app/Login/page.jsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Login.module.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:3030/api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'login',
          username, 
          password 
        }),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || 'Échec de la connexion')
        setLoading(false)
        return
      }
      
      // Stocker le token dans localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('username', data.username)
      
      // Redirection vers Admin
      router.push('/Admin')
    } catch (error) {
      setError('Erreur de connexion au serveur')
      console.error('Erreur de connexion:', error)
      setLoading(false)
    }
  }
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Connexion</h1>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Nom d'utilisateur</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Mot de passe</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}