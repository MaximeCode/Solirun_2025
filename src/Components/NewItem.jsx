export default function NewItem({ setShow }) {
  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setShow()}
        className="p-6 size-auto btn border border-success rounded-lg shadow-sm">
        <svg
          className="w-12 h-12 text-success"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  )
}
