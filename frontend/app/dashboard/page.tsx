'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Feedback = {
_id: string;
title: string;
description: string;
category: string;
status: string;
ai_sentiment?: string;
ai_priority?: number;
ai_summary?: string;
ai_tags?: string[];
};

export default function DashboardPage() {
const router = useRouter();

const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
const [loading, setLoading] = useState(true);

// filters
const [category, setCategory] = useState('');
const [sentiment, setSentiment] = useState('');
const [search, setSearch] = useState('');

// pagination
const [page, setPage] = useState(1);
const [pages, setPages] = useState(1);

const fetchData = async () => {
const token = localStorage.getItem('token');

if (!token) {
  router.push('/login');
  return;
}

try {
  const query = `?category=${encodeURIComponent(category)}&sentiment=${encodeURIComponent(sentiment)}&page=${page}&limit=5`;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/feedback${query}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    if (data.message === 'Invalid or expired token') {
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }
    throw new Error(data.message);
  }

  setFeedbacks(data.data);
  setPages(data.pagination.pages);

} catch (error) {
  console.error(error);
  router.push('/login');
} finally {
  setLoading(false);
}

};

useEffect(() => {
fetchData();
}, [category, sentiment, page]);

// SEARCH (frontend filter)
const filtered = feedbacks.filter((f) =>
f.title.toLowerCase().includes(search.toLowerCase()) ||
(f.ai_summary || '').toLowerCase().includes(search.toLowerCase())
);

// STATS
const total = feedbacks.length;
const avgPriority =
feedbacks.reduce((acc, f) => acc + (f.ai_priority || 0), 0) /
(feedbacks.length || 1);

// ACTIONS
const updateStatus = async (id: string, status: string) => {
const token = localStorage.getItem('token');

await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ status }),
});

fetchData();

};

const deleteFeedback = async (id: string) => {
const token = localStorage.getItem('token');

await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

fetchData();


};

if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;

return (
<div style={{ padding: '20px' }}> <h2>Admin Dashboard</h2>

  {/* STATS */}
  <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
    <div>Total: {total}</div>
    <div>Avg Priority: {avgPriority.toFixed(1)}</div>
  </div>

  {/* SEARCH */}
  <input
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
  />

  {/* FILTERS */}
  <div style={{ marginBottom: '20px' }}>
    <select onChange={(e) => setCategory(e.target.value)}>
      <option value="">All Categories</option>
      <option value="Bug">Bug</option>
      <option value="Feature Request">Feature Request</option>
      <option value="Improvement">Improvement</option>
      <option value="Other">Other</option>
    </select>

    <select
      onChange={(e) => setSentiment(e.target.value)}
      style={{ marginLeft: '10px' }}
    >
      <option value="">All Sentiments</option>
      <option value="Positive">Positive</option>
      <option value="Neutral">Neutral</option>
      <option value="Negative">Negative</option>
    </select>
  </div>

  {/* LIST */}
  {filtered.length === 0 ? (
    <p>No feedback found</p>
  ) : (
    filtered.map((item) => (
      <div
        key={item._id}
        style={{
          border: '1px solid #ccc',
          padding: '15px',
          marginBottom: '10px',
          borderRadius: '8px',
        }}
      >
        <h3>{item.title}</h3>
        <p>{item.description}</p>

        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Status:</strong> {item.status}</p>

        {/* SENTIMENT BADGE */}
        <span
          style={{
            padding: '5px 10px',
            borderRadius: '5px',
            color: 'white',
            backgroundColor:
              item.ai_sentiment === 'Positive'
                ? 'green'
                : item.ai_sentiment === 'Negative'
                ? 'red'
                : 'gray',
          }}
        >
          {item.ai_sentiment}
        </span>

        <p><strong>Priority:</strong> {item.ai_priority}</p>
        <p><strong>Summary:</strong> {item.ai_summary}</p>

        {/* ACTIONS */}
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => updateStatus(item._id, 'In Review')}>
            In Review
          </button>

          <button
            onClick={() => updateStatus(item._id, 'Resolved')}
            style={{ marginLeft: '10px' }}
          >
            Resolve
          </button>

          <button
            onClick={() => deleteFeedback(item._id)}
            style={{ marginLeft: '10px', color: 'red' }}
          >
            Delete
          </button>
        </div>
      </div>
    ))
  )}

  {/* PAGINATION */}
  <div style={{ marginTop: '20px' }}>
    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
      Prev
    </button>

    <span style={{ margin: '0 10px' }}>
      Page {page} / {pages}
    </span>

    <button disabled={page === pages} onClick={() => setPage(page + 1)}>
      Next
    </button>

    <button onClick={() => {
      localStorage.removeItem('token');
      router.push('/login');
    }}>
      Logout
    </button>
  </div>
</div>



);
}
