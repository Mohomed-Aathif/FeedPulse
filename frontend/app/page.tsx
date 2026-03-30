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

const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
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

  type ValidationError = {
    msg: string;
  };

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
    setMessage(error.message || 'Something went wrong');
  } else {
    setMessage('An unknown error occurred');
  }
} finally {
  setLoading(false);
}

};

return (
<div style={{ padding: '40px', maxWidth: '600px', margin: 'auto' }}> <h1>Submit Feedback</h1>

  <form onSubmit={handleSubmit}>
    <input
      name="title"
      placeholder="Title"
      value={form.title}
      onChange={handleChange}
      required
      style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
    />

    <textarea
      name="description"
      placeholder="Description (min 20 chars)"
      value={form.description}
      onChange={handleChange}
      required
      minLength={20}
      style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
    />

    <select
      name="category"
      value={form.category}
      onChange={handleChange}
      style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
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
      style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
    />

    <input
      name="submitterEmail"
      type="email"
      placeholder="Your Email (optional)"
      value={form.submitterEmail}
      onChange={handleChange}
      style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
    />

    <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
      {loading ? 'Submitting...' : 'Submit'}
    </button>
  </form>

  {message && <p style={{ marginTop: '10px' }}>{message}</p>}
</div>


);
}
