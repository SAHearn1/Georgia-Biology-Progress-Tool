import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import DeleteEnrollmentButton from "@/components/DeleteEnrollmentButton"
import EnrollStudentForm from "@/components/EnrollStudentForm"

export default async function ClassDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  if (!session?.user) {
    return null
  }

  const classItem = await prisma.class.findFirst({
    where: {
      id,
      teacherId: session.user.id
    },
    include: {
      enrollments: {
        include: {
          student: true
        },
        orderBy: {
          student: {
            lastName: "asc"
          }
        }
      }
    }
  })

  if (!classItem) {
    notFound()
  }

  // Get students not enrolled in this class
  const enrolledStudentIds = classItem.enrollments.map(e => e.studentId)
  const availableStudents = await prisma.student.findMany({
    where: {
      id: {
        notIn: enrolledStudentIds
      }
    },
    orderBy: {
      lastName: "asc"
    }
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link
          href="/dashboard/classes"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Classes
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {classItem.name}
            </h1>
            {classItem.period && (
              <p className="text-gray-600">Period {classItem.period}</p>
            )}
            {classItem.description && (
              <p className="text-gray-600 mt-2">{classItem.description}</p>
            )}
          </div>
          <Link
            href={`/dashboard/classes/${classItem.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Edit Class
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Created: {new Date(classItem.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Enrolled Students ({classItem.enrollments.length})
          </h2>
        </div>

        {availableStudents.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Enroll a Student
            </h3>
            <EnrollStudentForm
              classId={classItem.id}
              availableStudents={availableStudents}
            />
          </div>
        )}

        {classItem.enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classItem.enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.student.firstName}{" "}
                        {enrollment.student.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {enrollment.student.studentId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {enrollment.student.grade || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DeleteEnrollmentButton enrollmentId={enrollment.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No students enrolled
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {availableStudents.length > 0
                ? "Use the form above to enroll students in this class."
                : "Add students first before enrolling them."}
            </p>
            {availableStudents.length === 0 && (
              <div className="mt-6">
                <Link
                  href="/dashboard/students/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Add New Student
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
