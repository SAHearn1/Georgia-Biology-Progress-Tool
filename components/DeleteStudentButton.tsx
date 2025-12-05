"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteStudentButton({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student? This will also remove all enrollments.")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete student")
      }

      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete student")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  )
}
