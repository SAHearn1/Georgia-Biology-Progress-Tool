"use client";

import { useState } from "react";

export default function StudentJoinForm() {
  const [accessCode, setAccessCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // TODO: Implement API call to validate access code and join class
      // For now, just simulate the submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // This would typically redirect to the student dashboard or show success
      console.log("Joining class with access code:", accessCode);
    } catch (err) {
      console.error("Error joining class:", err);
      setError("Failed to join class. Please check your access code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="accessCode" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Access Code
        </label>
        <input
          type="text"
          id="accessCode"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          placeholder="XXXXXXXX"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-lg font-mono tracking-wider"
          required
          disabled={isSubmitting}
          maxLength={8}
        />
        <p className="mt-2 text-xs text-gray-400 text-center">
          Enter the 8-character code from your teacher
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || accessCode.length < 8}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Joining..." : "Join Class"}
      </button>
    </form>
  );
}
