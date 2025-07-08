'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetch('https://task-manager-zjxa.onrender.com/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  const filteredTasks = tasks.filter(task =>
    filterStatus === "all" || task.status === filterStatus
  );

  return (
    <>
      <Head>
        <title>Task Manager</title>
        <meta name="description" content="A full-stack task manager built with Next.js, FastAPI & Supabase" />
      </Head>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label className="mr-2 font-semibold">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="all" className="text-black">All</option>
            <option value="pending" className="text-black">Pending</option>
            <option value="in progress" className="text-black">In Progress</option>
            <option value="done" className="text-black">Done</option>
          </select>
        </div>

        <ul className="space-y-2">
          {filteredTasks.map(task => (
            <li key={task.id} className="border p-4 rounded shadow flex flex-col gap-2">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p>{task.description}</p>
                <p className={`text-sm font-semibold ${
                  task.status === 'pending' ? 'text-red-600' :
                  task.status === 'in progress' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>Status: {task.status}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(task.created_at).toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => window.location.href = `/edit/${task.id}`}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={async () => {
                    const confirmed = confirm('Are you sure you want to delete this task?');
                    if (!confirmed) return;
                    const res = await fetch(`https://task-manager-zjxa.onrender.com/tasks/${task.id}`, {
                      method: 'DELETE',
                    });
                    if (res.ok) {
                      setTasks(tasks.filter(t => t.id !== task.id));
                    } else {
                      alert('Failed to delete task');
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
