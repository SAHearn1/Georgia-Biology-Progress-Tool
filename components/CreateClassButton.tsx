"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export function CreateClassButton() {
  return (
    <Link
      href="/dashboard/classes/new"
      className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm"
    >
      <Plus className="w-5 h-5" />
      Create New Class
    </Link>
  );
}
