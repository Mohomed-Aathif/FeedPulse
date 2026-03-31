'use client';

import { useState } from 'react';

export default function Home() {
const [form, setForm] = useState({
title: '',
description: '',
category: 'Bug',
submitterName: '',
submitterEmail: '',
});

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

const handleChange = (
e: React.ChangeEvent<
HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>
) => {
const { name, value } = e.target;
setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
setLoading(true);
setMessage('');

try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  type ValidationError = { msg: string };

  if (!res.ok) {
    if (data.error && Array.isArray(data.error)) {
      const errorMessages = (data.error as ValidationError[])
        .map((e) => e.msg)
        .join(', ');
      throw new Error(errorMessages);
    }

    throw new Error(data.message || 'Validation failed');
  }

  setMessage('Feedback submitted successfully!');
  setForm({
    title: '',
    description: '',
    category: 'Bug',
    submitterName: '',
    submitterEmail: '',
  });

} catch (error: unknown) {
  if (error instanceof Error) {
    setMessage(error.message);
  } else {
    setMessage('Something went wrong');
  }
} finally {
  setLoading(false);
}

};

return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4"> <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-md"> <h1 className="text-2xl font-bold text-gray-900 mb-6">
Submit Feedback </h1>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none placeholder:text-gray-500 text-gray-900"
      />

      <textarea
        name="description"
        placeholder="Description (min 20 chars)"
        value={form.description}
        onChange={handleChange}
        required
        minLength={20}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none placeholder:text-gray-500 text-gray-900"
      />
      
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
      >
        <option value="Bug">Bug</option>
        <option value="Feature Request">Feature Request</option>
        <option value="Improvement">Improvement</option>
        <option value="Other">Other</option>
      </select>

      <input
        name="submitterName"
        placeholder="Your Name (optional)"
        value={form.submitterName}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 text-gray-900"
      />

      <input
        name="submitterEmail"
        type="email"
        placeholder="Your Email (optional)"
        value={form.submitterEmail}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-lg placeholder:text-gray-500 text-gray-900"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>

    {message && (
      <p className="mt-4 text-sm text-gray-700">{message}</p>
    )}
  </div>
</div>
);
}
