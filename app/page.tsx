import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">
          RootWork
        </h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Georgia Biology Progress Tool
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A comprehensive tool designed to help teachers prepare students for Biology EOC testing 
          and predict individual student performance. Track progress, manage classes, and support student success.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Manage Classes
            </h3>
            <p className="text-gray-600">
              Create and organize your biology classes with ease. Track multiple periods and sections.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Track Students
            </h3>
            <p className="text-gray-600">
              Monitor individual student progress and maintain comprehensive student records.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure Access
            </h3>
            <p className="text-gray-600">
              Your data is protected with secure authentication and encrypted storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
