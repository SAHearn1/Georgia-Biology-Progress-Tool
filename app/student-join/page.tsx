import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentJoinForm from "@/components/student-join-form";

export default function StudentJoinPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Your Class</h1>
            <p className="text-gray-500 text-sm">
              Enter the access code provided by your teacher to begin.
            </p>
          </div>

          {/* The Client Component Form */}
          <StudentJoinForm />
        </div>

        {/* Footer Support */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Community Exceptional Children's Services<br/>
          Secure Assessment Portal
        </p>
      </div>
    </div>
  );
}
