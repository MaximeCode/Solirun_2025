"use client"

import "./globals.css"
import { socket } from "../utils/socket"
import { useEffect, useState } from "react"
import Header from "@/Components/Header"
// Link for Header
import Link from "next/link"

export default function RootLayout({ children }) {
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  return (
    <html lang="en">
      <body className="h-full">
        {/* Header */}
        {typeof window !== "undefined" &&
          window.location.pathname !== "/Ranking" && <Header />}
        {/* Content */}
        <div className="px-16 py-16">{children}</div>
      </body>
    </html>
  )
}
