"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, X } from "lucide-react";

export default function CreateClassButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    accessCode: "",
    description: ""
  });

  // Helper to generate a random 6-char code
  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed I, 1, 0, O to avoid confusion
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, accessCode: code }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/class/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      // Success
      setIsOpen(false);
      setFormData({ name: "", accessCode: "", description: "" }); // Reset
      router.refresh(); // Reloads the server dashboard to show the new class!

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> New Class
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Create New Class</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={onSubmit} className="p-6 space-y-4">

              {/* Class Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Class Name</label>
                <input
                  required
                  placeholder="e.g. Biology Period 2 (Honors)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Access Code */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Access Code</label>
                  <button
                    type="button"
                    onClick={generateCode}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Generate Random
                  </button>
                </div>
                <input
                  required
                  maxLength={10}
                  placeholder="e.g. BIO-202"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono uppercase tracking-wide"
                  value={formData.accessCode}
                  onChange={e => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                />
                <p className="text-xs text-gray-500">Students will use this code to join.</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
