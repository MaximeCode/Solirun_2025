"use client"

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Header from "@/Components/Header"
import PropTypes from "prop-types"

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
  if (!loading && !user) {
    router.push('/Login');
    return null;
  }

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
}
