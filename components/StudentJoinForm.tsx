"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Key, ArrowRight, Loader2 } from "lucide-react";

export default function StudentJoinForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    accessCode: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // SIMULATION: In the real app, this will POST to /api/student/join
    // For now, we simulate a network delay and success
    try {
      if (formData.accessCode.length < 3) {
        throw new Error("Invalid access code.");
      }

      console.log("Submitting:", formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
      
      // On success, redirect to the waiting room or test
      // In real app: router.push(`/test/${sessionId}`);
      alert(`Success! Joining class as ${formData.fullName}`);
      
    } catch (err) {
      setError("We couldn't find a class with that code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* Name Input */}
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            id="fullName"
            required
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="e.g. Jordan Smith"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>
      </div>

      {/* Code Input */}
      <div className="space-y-1.5">
        <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
          Access Code
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Key className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            id="accessCode"
            required
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase tracking-widest transition-colors font-mono"
            placeholder="BIO-101"
            value={formData.accessCode}
            onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Connecting...
          </>
        ) : (
          <>
            Join Class
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
