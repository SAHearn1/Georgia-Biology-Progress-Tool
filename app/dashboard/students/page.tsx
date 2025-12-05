import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteStudentButton from "@/components/DeleteStudentButton"

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { lastName: "asc" },
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <Link
          href="/dashboard/students/new"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Add New Student
        </Link>
      </div>

      {students.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-green-600 truncate">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="ml-2 flex-shrink-0 font-normal text-gray-500">
                          ID: {student.studentId}
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          {student.grade && <span>Grade {student.grade}</span>}
                          {student.email && <span>{student.email}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <div className="flex space-x-2 items-center">
                        <span className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full">
                          {student._count.enrollments} classes
                        </span>
                        <Link
                          href={`/dashboard/students/${student.id}/edit`}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                        <DeleteStudentButton studentId={student.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center bg-white shadow rounded-lg py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new student.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/students/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Add New Student
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
