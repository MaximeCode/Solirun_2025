import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl text-center">It's the home page</h1>
      <Link
        href="/Rankings"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
        Voir les classements en temps réel
      </Link>
      <Link
        href="/Admin/AddClasses"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
        Voir Add Classes
      </Link>
    </div>
  )
}
