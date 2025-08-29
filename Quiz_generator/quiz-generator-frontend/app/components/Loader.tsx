// components/Loader.tsx
"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="mt-2 text-gray-600">Generating quiz, please wait...</p>
    </div>
  );
}
