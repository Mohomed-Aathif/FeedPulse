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

const [category, setCategory] = useState('');
const [sentiment, setSentiment] = useState('');
const [status, setStatus] = useState('');
const [search, setSearch] = useState('');

const [page, setPage] = useState(1);
const [pages, setPages] = useState(1);
const [sort, setSort] = useState('date');

const fetchData = async () => {
const token = localStorage.getItem('token');

if (!token) {
  router.push('/login');
  return;
}

try {
  const query = `?category=${encodeURIComponent(category)}&sentiment=${encodeURIComponent(sentiment)}&status=${encodeURIComponent(status)}&sort=${sort}&page=${page}&limit=10`;

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
}, [category, sentiment, status, sort, page]);

const filtered = feedbacks.filter((f) =>
f.title.toLowerCase().includes(search.toLowerCase()) ||
(f.ai_summary || '').toLowerCase().includes(search.toLowerCase())
);

const total = feedbacks.length;
const openItems = feedbacks.filter(f => f.status === 'New').length;
const avgPriority =
feedbacks.reduce((acc, f) => acc + (f.ai_priority || 0), 0) /
(feedbacks.length || 1);

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

const reAnalyze = async (id: string) => {
  const token = localStorage.getItem('token');

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}/reanalyze`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchData();

  } catch (error) {
    console.error('Re-analyze failed', error);
  }
};

const tagCount: Record<string, number> = {};

feedbacks.forEach(f => {
  (f.ai_tags || []).forEach(tag => {
    tagCount[tag] = (tagCount[tag] || 0) + 1;
  });
});

const mostCommonTag = Object.entries(tagCount)
  .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

if (loading) {
return <div className="p-6">Loading...</div>;
}

return ( <div className="min-h-screen bg-gray-50 p-6"> <div className="max-w-5xl mx-auto">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Admin Dashboard
      </h2>

      <button
        onClick={() => {
          localStorage.removeItem('token');
          router.push('/login');
        }}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>

    {/* STATS */}
    <div className="flex gap-6 mb-6 flex-wrap">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Total Feedback</p>
        <p className="text-xl font-bold text-gray-900">{total}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Open Items</p>
        <p className="text-xl font-bold text-gray-900">{openItems}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Avg Priority</p>
        <p className="text-xl font-bold text-gray-900">
          {avgPriority.toFixed(1)}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-sm text-gray-500">Top Tag</p>
        <p className="text-xl font-bold text-gray-900">{mostCommonTag}</p>
      </div>
    </div>

    {/* SEARCH */}
    <input
      placeholder="Search feedback..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500"
    />

    {/* FILTERS */}
    <div className="flex gap-4 mb-6 flex-wrap">

      <select
        onChange={(e) => setCategory(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
      >
        <option value="">All Categories</option>
        <option value="Bug">Bug</option>
        <option value="Feature Request">Feature Request</option>
        <option value="Improvement">Improvement</option>
        <option value="Other">Other</option>
      </select>

      <select
        onChange={(e) => setSentiment(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
      >
        <option value="">All Sentiments</option>
        <option value="Positive">Positive</option>
        <option value="Neutral">Neutral</option>
        <option value="Negative">Negative</option>
      </select>

      <select
        onChange={(e) => setStatus(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
      >
        <option value="">All Status</option>
        <option value="New">New</option>
        <option value="In Review">In Review</option>
        <option value="Resolved">Resolved</option>
      </select>

      <select
        onChange={(e) => setSort(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
      >
        <option value="date">Newest</option>
        <option value="priority">Priority</option>
        <option value="sentiment">Sentiment</option>
      </select>

    </div>

    {/* LIST */}
    {filtered.length === 0 ? (
      <p className="text-gray-600">No feedback found</p>
    ) : (
      filtered.map((item) => (
        <div
          key={item._id}
          className="bg-white p-5 rounded-lg shadow mb-5 hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {item.title}
          </h3>

          <p className="text-gray-600 mb-2">
            {item.description}
          </p>

          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Status:</strong> {item.status}</p>
          </div>

          <span className={`inline-block mt-2 px-3 py-1 rounded text-white text-sm ${
            item.ai_sentiment === 'Positive'
              ? 'bg-green-500'
              : item.ai_sentiment === 'Negative'
              ? 'bg-red-500'
              : 'bg-gray-500'
          }`}>
            {item.ai_sentiment}
          </span>

          <p className="mt-2 text-sm">
            <strong>Priority:</strong> {item.ai_priority}
          </p>

          <p className="text-sm">
            <strong>Summary:</strong> {item.ai_summary}
          </p>

          <div className="mt-4 flex gap-2 flex-wrap">
            <button
              onClick={() => updateStatus(item._id, 'In Review')}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              In Review
            </button>

            <button
              onClick={() => updateStatus(item._id, 'Resolved')}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Resolve
            </button>

            <button
              onClick={() => deleteFeedback(item._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>

            <button
              onClick={() => reAnalyze(item._id)}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              Re-analyze
            </button>
          </div>
        </div>
      ))
    )}

    {/* PAGINATION */}
    <div className="flex justify-between items-center mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span>
        Page {page} / {pages || 1}
      </span>

      <button
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>

  </div>
</div>

);
}
