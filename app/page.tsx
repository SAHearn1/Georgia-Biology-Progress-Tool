import Link from "next/link";
import { Target, Users, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <span className="font-bold text-gray-900">GA Biology</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/api/auth/signin"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Teacher Sign In
            </Link>
            <Link
              href="/student/join"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Student Join
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Georgia Biology Progress Tool
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Real-time instructional intelligence for Biology EOC preparation.
            Track student mastery, identify at-risk learners, and optimize teaching strategies.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/api/auth/signin"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/student/join"
              className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg"
            >
              Join as Student
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Priority Alerts
            </h3>
            <p className="text-gray-600">
              Instantly identify at-risk students and get actionable intervention recommendations.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              IRT-Based Assessment
            </h3>
            <p className="text-gray-600">
              Scientific ability estimation using Item Response Theory for accurate mastery tracking.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Class Management
            </h3>
            <p className="text-gray-600">
              Manage multiple classes, track progress, and share access codes with students effortlessly.
            </p>
          </div>
        </div>

        {/* For Teachers Section */}
        <div className="mt-20 bg-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Biology Class?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Sign in with Google to access your teacher dashboard and start tracking student progress today.
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg"
          >
            Teacher Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500">
          <p>Georgia Biology Progress Tool - Empowering educators with data-driven insights</p>
        </div>
      </footer>
    </div>
  );
}
