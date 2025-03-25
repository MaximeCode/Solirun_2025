// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Vérifier si l'utilisateur accède à une page Admin
  if (pathname.startsWith('/Admin')) {
    // Récupérer le token
    const token = request.cookies.get('token')?.value;

    // Si pas de token, rediriger vers la page de login
    if (!token) {
      return NextResponse.redirect(new URL('/Login', request.url));
    }

    try {
      // Vérifier le token auprès de l'API
      const response = await fetch("http://localhost:3030/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verifyToken",
          token: token
        }),
      });

      const data = await response.json();

      if (!data.success) {
        // Token invalide, rediriger vers la page de login
        return NextResponse.redirect(new URL('/Login', request.url));
      }

      // Token valide, continuer
      return NextResponse.next();
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      // En cas d'erreur, rediriger vers la page de login
      return NextResponse.redirect(new URL('/Login', request.url));
    }
  }

  // Pour les autres pages, continuer normalement
  return NextResponse.next();
}

export const config = {
  matcher: ['/Admin/:path*'],
};