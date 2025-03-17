// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3030/api.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'verifyToken',
            token: token
          }),
        });

        const data = await response.json();

        if (data.success) {
          setUser({
            id: data.userId,
            username: data.username
          });
        } else {
          // Token invalide, supprimer et rediriger
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          router.push('/Login');
        }
      } catch (error) {
        console.error('Erreur de vérification:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
    router.push('/Login');
  };

  return { user, loading, logout };
}