'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'Pending' | 'Completed';
}

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: () => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const [deleting, setDeleting] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        setDeleting(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                },
            });

            if (response.ok) {
                onDelete();
                toast.success('Task deleted successfully');
            } else {
                alert('Failed to delete task');
                toast.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="mb-4 rounded bg-white p-4 shadow">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-bold">{task.title}</h3>
                    <p className="text-gray-600">{task.description}</p>
                    <span
                        className={`mt-2 inline-block rounded px-2 py-1 text-xs font-bold ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                    >
                        {task.status}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-red-500 hover:text-red-700 disabled:text-red-300"
                    >
                        {deleting ? '...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}
