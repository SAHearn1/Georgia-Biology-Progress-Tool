import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
      title: "Server Configuration Error",
      description:
        "There is a problem with the server configuration. Please contact the administrator.",
    },
    AccessDenied: {
      title: "Access Denied",
      description:
        "You do not have permission to sign in. Please contact your administrator.",
    },
    Verification: {
      title: "Verification Failed",
      description:
        "The verification token has expired or has already been used. Please try signing in again.",
    },
    OAuthSignin: {
      title: "OAuth Sign-In Error",
      description:
        "Error occurred during OAuth sign-in process. Please try again.",
    },
    OAuthCallback: {
      title: "OAuth Callback Error",
      description:
        "Error occurred during OAuth callback. This might be due to a URI mismatch. Please contact the administrator.",
    },
    OAuthCreateAccount: {
      title: "Account Creation Error",
      description:
        "Could not create OAuth account. Please try again or contact support.",
    },
    EmailCreateAccount: {
      title: "Account Creation Error",
      description:
        "Could not create email account. Please try again or contact support.",
    },
    Callback: {
      title: "Callback Error",
      description:
        "Error occurred during authentication callback. Please try again.",
    },
    OAuthAccountNotLinked: {
      title: "Account Not Linked",
      description:
        "This email is already associated with another account. Please sign in with your original provider.",
    },
    EmailSignin: {
      title: "Email Sign-In Error",
      description: "Failed to send the email. Please try again later.",
    },
    CredentialsSignin: {
      title: "Sign-In Failed",
      description: "Invalid credentials. Please check your email and password.",
    },
    SessionRequired: {
      title: "Session Required",
      description: "You must be signed in to access this page.",
    },
    Default: {
      title: "Authentication Error",
      description: "An unexpected error occurred. Please try again.",
    },
  };

  const errorInfo = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-600 w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {errorInfo.title}
        </h1>
        <p className="text-gray-600 mb-8">{errorInfo.description}</p>

        {/* Error Code (for debugging) */}
        {error && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 font-mono">
              Error Code: {error}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full bg-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="block w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-all"
          >
            Return to Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Need Help?
          </p>
          <p className="text-xs text-blue-600">
            If this error persists, please contact your system administrator with
            the error code shown above.
          </p>
        </div>

        {/* Common Solutions */}
        {(error === "OAuthCallback" || error === "Configuration") && (
          <div className="mt-6 text-left">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Administrator: Common Solutions
            </p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>Verify NEXTAUTH_URL matches deployment URL</li>
              <li>Check Google OAuth redirect URIs in Cloud Console</li>
              <li>Ensure AUTH_SECRET is set in environment variables</li>
              <li>Confirm GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
