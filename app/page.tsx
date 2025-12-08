import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Georgia Biology Progress Tool</h1>
      <div className="space-y-4">
        <Link 
          href="/student-join" 
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          Join as Student
        </Link>
        <Link 
          href="/login" 
          className="block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
        >
          Teacher Login
        </Link>
      </div>
    </main>
  );
}
