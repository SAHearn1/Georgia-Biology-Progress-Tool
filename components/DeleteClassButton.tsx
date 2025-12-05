"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteClassButton({ classId }: { classId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this class? This will also remove all enrollments.")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        throw new Error("Failed to delete class")
      }

      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete class")
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
