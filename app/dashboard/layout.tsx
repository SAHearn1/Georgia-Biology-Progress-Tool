import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import SignOutButton from "@/components/SignOutButton"

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold">
                RootWork
              </Link>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/classes"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-100"
                >
                  Classes
                </Link>
                <Link
                  href="/dashboard/students"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium hover:text-blue-100"
                >
                  Students
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{session.user?.name}</span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
