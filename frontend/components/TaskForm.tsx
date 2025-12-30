// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabaseClient';

// interface TaskFormProps {
//     onTaskSaved: () => void;
//     initialData?: {
//         id: string;
//         title: string;
//         description: string;
//         status: 'Pending' | 'Completed';
//     } | null;
//     onCancel: () => void;
// }

// export default function TaskForm({ onTaskSaved, initialData, onCancel }: TaskFormProps) {
//     const [title, setTitle] = useState(initialData?.title || '');
//     const [description, setDescription] = useState(initialData?.description || '');
//     const [status, setStatus] = useState<'Pending' | 'Completed'>(initialData?.status || 'Pending');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         try {
//             const { data: { session } } = await supabase.auth.getSession();
//             if (!session) {
//                 setError('You must be logged in.');
//                 setLoading(false);
//                 return;
//             }

//             const url = initialData
//                 ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tasks/${initialData.id}`
//                 : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tasks`;

//             const method = initialData ? 'PUT' : 'POST';

//             const response = await fetch(url, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${session.access_token}`,
//                 },
//                 body: JSON.stringify({ title, description, status }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to save task');
//             }

//             onTaskSaved();
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="rounded bg-white p-4 shadow">
//             <h3 className="mb-4 text-lg font-bold">{initialData ? 'Edit Task' : 'Create New Task'}</h3>
//             {error && <div className="mb-4 text-red-500">{error}</div>}
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <label className="mb-1 block text-sm font-bold">Title</label>
//                     <input
//                         type="text"
//                         className="w-full rounded border p-2"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="mb-1 block text-sm font-bold">Description</label>
//                     <textarea
//                         className="w-full rounded border p-2"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="mb-1 block text-sm font-bold">Status</label>
//                     <select
//                         className="w-full rounded border p-2"
//                         value={status}
//                         onChange={(e) => setStatus(e.target.value as 'Pending' | 'Completed')}
//                     >
//                         <option value="Pending">Pending</option>
//                         <option value="Completed">Completed</option>
//                     </select>
//                 </div>
//                 <div className="flex justify-end gap-2">
//                     <button
//                         type="button"
//                         onClick={onCancel}
//                         className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
//                     >
//                         {loading ? 'Saving...' : 'Save'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }




'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

interface TaskFormProps {
    onTaskSaved: () => void;
    initialData?: {
        id: string;
        title: string;
        description: string;
        status: 'Pending' | 'Completed';
    } | null;
    onCancel: () => void;
}

export default function TaskForm({ onTaskSaved, initialData, onCancel }: TaskFormProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        status: initialData?.status || 'Pending' as 'Pending' | 'Completed'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('You must be logged in.');
                setLoading(false);
                return;
            }

            const url = initialData
                ? `${API_URL}/api/tasks/${initialData.id}`
                : `${API_URL}/api/tasks`;

            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to save task');
                throw new Error(errorData.error || 'Failed to save task');
            }

            onTaskSaved();
            toast.success('Task saved successfully');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded bg-white p-4 shadow">
            <h3 className="mb-2 text-lg font-bold">{initialData ? 'Edit Task' : 'Create New Task'}</h3>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-bold">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full rounded border p-2"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-bold">Description</label>
                    <textarea
                        name="description"
                        className="w-full rounded border p-2"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-bold">Status</label>
                    <select
                        name="status"
                        className="w-full rounded border p-2"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
}
