'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Item {
  id: string;
  content: string;
  options: Record<string, string>;
  standard: string;
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Fetch the first question when component mounts
  useEffect(() => {
    fetchNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNextQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For the first question, we need to fetch from the session
      // In a real implementation, you might have a separate endpoint to get the first question
      // For now, we'll make a small POST with no previous answer
      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          itemId: 'initial', // Special marker for first question
          selectedAnswer: '',
          timeSpent: 0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      const data = await response.json();
      
      if (data.completed) {
        setCompleted(true);
      } else if (data.nextItem) {
        setCurrentItem(data.nextItem);
        setSelectedAnswer('');
        setStartTime(Date.now());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentItem) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds

      const response = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          itemId: currentItem.id,
          selectedAnswer,
          timeSpent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      
      if (data.completed) {
        setCompleted(true);
      } else if (data.nextItem) {
        setCurrentItem(data.nextItem);
        setSelectedAnswer('');
        setStartTime(Date.now());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing the assessment. Your teacher will review your results.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-bold text-gray-900">Georgia Biology Assessment</h1>
          {currentItem && (
            <p className="text-sm text-gray-600 mt-1">Standard: {currentItem.standard}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {currentItem && (
            <>
              {/* Question */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {currentItem.content}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {Object.entries(currentItem.options).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedAnswer === key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={key}
                      checked={selectedAnswer === key}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="mt-1 h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-900">
                      <strong>{key}.</strong> {value}
                    </span>
                  </label>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || submitting}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    !selectedAnswer || submitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
