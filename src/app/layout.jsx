import Header from "@/Components/Header"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 mx-auto">
        <Header />
        {children}
        {/* Script to include Flowbite components */}
        <script src="../../node_modules/flowbite/dist/flowbite.min.js"></script>
      </body>
    </html>
  )
}
