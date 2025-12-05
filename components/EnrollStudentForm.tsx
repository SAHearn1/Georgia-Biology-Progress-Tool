"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  firstName: string
  lastName: string
  studentId: string
}

interface EnrollStudentFormProps {
  classId: string
  availableStudents: Student[]
}

export default function EnrollStudentForm({
  classId,
  availableStudents
}: EnrollStudentFormProps) {
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedStudentId) {
      setError("Please select a student")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: selectedStudentId,
          classId
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to enroll student")
      }

      setSelectedStudentId("")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1">
        <label
          htmlFor="studentId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Student
        </label>
        <select
          id="studentId"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          disabled={loading}
        >
          <option value="">-- Select a student --</option>
          {availableStudents.map((student) => (
            <option key={student.id} value={student.id}>
              {student.lastName}, {student.firstName} ({student.studentId})
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading || !selectedStudentId}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enrolling..." : "Enroll"}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </form>
  )
}
