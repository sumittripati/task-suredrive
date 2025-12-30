'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import TaskCard from '@/components/TaskCard';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
}

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        fetchTasks(session.access_token);
      }
    };
    checkUser();
  }, [router]);

   const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const fetchTasks = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const refreshTasks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      fetchTasks(session.access_token);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-3 py-1 text-sm font-bold text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
          {!showForm && !editingTask && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
            >
              + New Task
            </button>
          )}
        </div>

        {(showForm || editingTask) && (
          <div className="mb-6">
            <TaskForm
              onTaskSaved={refreshTasks}
              initialData={editingTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        <div className="grid gap-4">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found. Create one!</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowForm(false);
                }}
                onDelete={refreshTasks}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
