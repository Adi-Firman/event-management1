'use client'; // Penting untuk komponen interaktif

import { useRouter } from 'next/navigation'; // Perhatikan import dari 'next/navigation'

export default function LoginButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/login')}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      Login
    </button>
  );
}