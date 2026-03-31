'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
setError('');
setLoading(true);

try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  localStorage.setItem('token', data.token);
  router.push('/dashboard');

} catch (err: unknown) {
  if (err instanceof Error) setError(err.message);
} finally {
  setLoading(false);
}

};

return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"> <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"> <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Login</h2>

    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 text-gray-900"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 text-gray-900"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>

    {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
  </div>
</div>

);
}
