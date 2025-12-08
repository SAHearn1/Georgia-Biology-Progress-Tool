import Link from 'next/link';
import { GraduationCap, Users, LogIn, LayoutDashboard } from 'lucide-react';
import { auth } from "@/lib/auth"; // Import Auth to check status
import BrandLogo from '@/components/brand-logo';

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo / Home Link */}
          <BrandLogo variant="dark" showSubtitle={false} />

          {/* Dynamic Navigation Tools */}
          <div className="flex gap-4 items-center">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[#1a472a] hover:text-[#143d23] flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Return to Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Teacher Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">

          {/* TEACHER CARD */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a472a] to-[#d4af37]"></div>

            <div className="w-16 h-16 bg-[#1a472a]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="text-[#1a472a] w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">I am a Teacher</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Access the "Zero-Click" dashboard, manage classes, and view real-time instructional intelligence.
            </p>

            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="w-full bg-[#1a472a] text-white py-3 px-4 rounded-xl font-bold hover:bg-[#143d23] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Open Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="w-full bg-white border-2 border-[#1a472a]/20 text-[#1a472a] py-3 px-4 rounded-xl font-bold hover:border-[#1a472a] hover:bg-[#1a472a]/5 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Teacher Login
              </Link>
            )}
          </div>

          {/* STUDENT CARD */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>

            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="text-green-600 w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">I am a Student</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Join a class session, take a progress monitoring assessment, and track your mastery.
            </p>

            <Link
              href="/student/join"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              Enter Class Code
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-gray-400">
        <p>© 2025 Community Exceptional Children's Services</p>
      </footer>
    </div>
  );
}
