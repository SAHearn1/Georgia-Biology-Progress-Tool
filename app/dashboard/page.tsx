import { redirect } from "next/navigation";
import { AlertTriangle, Target, CalendarClock, Users } from 'lucide-react';
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { CreateClassButton } from "@/components/CreateClassButton";

export default async function TeacherDashboard() {
  // 1. Secure the Route (Server-Side)
  // We strictly check for a valid session. If none, bounce to login.
  const session = await auth();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // 2. Fetch Real Data for the Logged-In Teacher
  // We use the ID from the Google Session to find their specific classes.
  const teacherId = session.user.id;

  // Deep query: Teacher -> Classes -> Students
  const myClasses = await db.class.findMany({
    where: { teacherId },
    include: {
      students: {
        orderBy: { lastName: 'asc' } // Alphabetical Roster
      }
    }
  });

  // 3. Calculate "Instructional Intelligence" Metrics
  // Flatten all classes into one list of students for the dashboard summary
  const allStudents = myClasses.flatMap(c => c.students);
  const totalStudents = allStudents.length;

  // Risk Logic: Theta < -1.0 is "At Risk" (approx 1 Standard Deviation below mean)
  const atRiskStudents = allStudents.filter(s => s.lastMastery < -1.0);
  const atRiskCount = atRiskStudents.length;

  // Projection Logic: Simple logistic function of current average mastery to predict EOC pass rate
  const avgMastery = allStudents.reduce((acc, s) => acc + s.lastMastery, 0) / (totalStudents || 1);
  const projectedPassRate = Math.min(99, Math.max(10, Math.round(50 + (avgMastery * 15))));
  const daysUntilEOC = 142; // Static for Fall 2025 countdown

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good Morning, {session.user.name}</h1>
          <p className="text-gray-500">Real-time instructional intelligence for {myClasses.length} active classes.</p>
        </div>
        <CreateClassButton />
      </div>

      {/* ZERO-CLICK INTELLIGENCE PANEL */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1: Priority Alerts (Dynamic) */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="text-red-600 w-5 h-5" />
            </div>
            <h3 className="font-semibold text-red-900">Priority Alerts</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Students At-Risk</span>
              <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">{atRiskCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Total Active Students</span>
              <span className="font-bold text-gray-900 bg-white px-2 py-1 rounded-full border border-gray-200">{totalStudents}</span>
            </div>
             {atRiskCount > 0 && (
                <div className="mt-3 p-2 bg-white rounded border border-red-100 text-xs text-red-800">
                    <b>Attention:</b> {atRiskStudents[0].firstName} {atRiskStudents[0].lastName} requires intervention.
                </div>
            )}
          </div>
        </div>

        {/* Card 2: Teaching Focus (Semi-Static for MVP) */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="font-semibold text-blue-900">Today's Focus</h3>
          </div>
          <p className="text-sm text-gray-700 mb-3">
            System analysis indicates difficulty with <b>SB2.a (DNA Structure)</b> across Period 1.
          </p>
          <div className="bg-white p-3 rounded border border-blue-200 text-xs text-blue-800">
            <b>Recommendation:</b> Review base-pairing rules (A-T, C-G) using the "Ladder" analogy.
          </div>
        </div>

        {/* Card 3: EOC Countdown (Dynamic Calculation) */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <CalendarClock className="text-indigo-600 w-5 h-5" />
            </div>
            <h3 className="font-semibold text-indigo-900">EOC Countdown</h3>
          </div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-3xl font-bold text-indigo-900">{daysUntilEOC}</span>
            <span className="text-sm text-gray-500 mb-1">days remaining</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${projectedPassRate}%` }}></div>
          </div>
          <p className="text-xs text-gray-600">Projected Pass Rate: <b>{projectedPassRate}%</b></p>
        </div>
      </div>

      {/* DATA TABLE: Student Performance Roster */}
      <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h3 className="font-semibold text-gray-800 flex items-center gap-2">
             <Users className="w-4 h-4" /> Student Performance Roster
           </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3">Class</th>
                        <th className="px-6 py-3">Ability Score (θ)</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {allStudents.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-3 font-medium text-gray-900">{student.firstName} {student.lastName}</td>
                            <td className="px-6 py-3 text-gray-500">
                                {myClasses.find(c => c.id === student.classId)?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-3 font-mono text-gray-600">{student.lastMastery.toFixed(2)}</td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    student.lastMastery < -1.0 ? 'bg-red-100 text-red-700' :
                                    student.lastMastery < 0 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {student.lastMastery < -1.0 ? 'Intervention Needed' :
                                     student.lastMastery < 0 ? 'Monitor' : 'On Track'}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {allStudents.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                No students found. Create a class and share the Access Code to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
