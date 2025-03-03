import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl text-center text-blue-500">It's the home page</h1>
      <Link
        href="/Rankings"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Voir les classements en temps réel
      </Link>
      <Link
        href="/Admin/AddRuns"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Voir Add Runs
      </Link>
    </div>
  )
}
