import StudentJoinForm from "@/components/StudentJoinForm";

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Biology Class
            </h1>
            <p className="text-gray-600">
              Enter your name and access code to join your teacher's class
            </p>
          </div>
          <StudentJoinForm />
        </div>
      </div>
    </div>
  );
}
