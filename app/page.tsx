import Link from "next/link";
import { Microscope, BarChart3, Brain, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Microscope className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900 text-lg">Biology Progress Tool</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/api/auth/signout"
                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Teacher Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              Georgia Biology <br />
              <span className="text-indigo-600">Progress Tool</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Adaptive testing powered by Item Response Theory.
              Real-time instructional intelligence for Georgia educators.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            {/* Card 1: Adaptive Testing */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Adaptive Testing</h3>
              <p className="text-sm text-gray-600">
                CAT-powered assessments that adjust to each student's ability level in real-time.
              </p>
            </div>

            {/* Card 2: IRT Analytics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">IRT Analytics</h3>
              <p className="text-sm text-gray-600">
                Psychometric precision using Item Response Theory for accurate mastery measurement.
              </p>
            </div>

            {/* Card 3: GSE Standards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Microscope className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">GSE Aligned</h3>
              <p className="text-sm text-gray-600">
                Fully aligned with Georgia Standards of Excellence for Biology.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Teacher Sign In
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/student"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all border-2 border-gray-200"
                >
                  Student Login
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Georgia Biology Progress Tool.
            Powered by Next.js, Prisma, and Vercel.
          </p>
        </div>
      </footer>
    </div>
  );
}
