import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteClassButton from "@/components/DeleteClassButton"

export default async function ClassesPage() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const classes = await prisma.class.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
        <Link
          href="/dashboard/classes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Class
        </Link>
      </div>

      {classes.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {classes.map((classItem) => (
              <li key={classItem.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-blue-600 truncate">
                          {classItem.name}
                        </p>
                        {classItem.period && (
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            • Period {classItem.period}
                          </p>
                        )}
                      </div>
                      {classItem.description && (
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            {classItem.description}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <div className="flex space-x-2 items-center">
                        <span className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full">
                          {classItem._count.enrollments} students
                        </span>
                        <Link
                          href={`/dashboard/classes/${classItem.id}`}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/classes/${classItem.id}/edit`}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                        <DeleteClassButton classId={classItem.id} />
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No classes</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new class.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/classes/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add New Class
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
