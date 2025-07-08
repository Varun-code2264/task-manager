'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/tasks') // use your local FastAPI URL
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="border p-4 rounded shadow flex flex-col gap-2">
            <div>
              <h2 className="font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p className={`text-sm font-semibold ${
                  task.status === 'pending' ? 'text-red-600' :
                  task.status === 'in-progress' ? 'text-yellow-600' :
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
            <div className = "flex gap-2">
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
            const res = await fetch(`http://127.0.0.1:8000/tasks/${task.id}`, {
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
  );
}
