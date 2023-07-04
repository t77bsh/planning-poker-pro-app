import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold">Oops!</h1>

      <h2 className="text-3xl font-semibold mt-4 mb-2">
        404 Error: Page Not Found
      </h2>
      <p className="text-lg mb-6">
        The requested page does not exist. Click below to return back to home.
      </p>
      <Link
        href="/"
        className="cgi-gradient text-white font-bold py-2 px-4 rounded shadow-2xl"
      >
        Back to home
      </Link>
    </div>
  );
}
