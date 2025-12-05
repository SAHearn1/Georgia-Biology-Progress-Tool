"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteEnrollmentButton({
  enrollmentId
}: {
  enrollmentId: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to remove this student from the class?"
      )
    ) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete enrollment")
      }

      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to remove student from class")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  )
}
