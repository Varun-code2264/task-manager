'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex gap-4">
      <Link href="/" className="hover:underline">Home</Link>
      <Link href="/add" className="hover:underline">Add Task</Link>
    </nav>
  );
}
