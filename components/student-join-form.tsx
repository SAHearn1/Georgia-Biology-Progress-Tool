'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod validation schema - Privacy-first: no email required
const studentJoinSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  accessCode: z.string().min(4, 'Access code must be at least 4 characters').max(20, 'Access code is too long'),
});

type StudentJoinFormData = z.infer<typeof studentJoinSchema>;

export default function StudentJoinForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentJoinFormData>({
    resolver: zodResolver(studentJoinSchema),
  });

  const onSubmit = async (data: StudentJoinFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      
      const response = await fetch('/api/student/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          accessCode: data.accessCode
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to join class');
      }

      // Redirect to the test page with the sessionId
      if (result.sessionId) {
        router.push(`/test/${result.sessionId}`);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            {...register('lastName')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        {/* Access Code */}
        <div>
          <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
            Access Code
          </label>
          <input
            id="accessCode"
            type="text"
            {...register('accessCode')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.accessCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your class access code"
          />
          {errors.accessCode && (
            <p className="mt-1 text-sm text-red-600">{errors.accessCode.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Get the access code from your teacher
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? 'Starting Assessment...' : 'Start Assessment'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 We respect your privacy. No email address required.
        </p>
      </div>
    </div>
  );
}
