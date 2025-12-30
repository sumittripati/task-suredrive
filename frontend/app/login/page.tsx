// 'use client';

// import { useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState<string | null>(null);
//     const router = useRouter();

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);

//         const { error } = await supabase.auth.signInWithPassword({
//             email,
//             password,
//         });

//         if (error) {
//             setError(error.message);
//         } else {
//             router.push('/');
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100">
//             <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
//                 <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Login</h2>
//                 {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}
//                 <form onSubmit={handleLogin}>
//                     <div className="mb-4">
//                         <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
//                             Email
//                         </label>
//                         <input
//                             className="w-full rounded border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
//                             id="email"
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
//                             Password
//                         </label>
//                         <input
//                             className="w-full rounded border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
//                             id="password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <button
//                         className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
//                         type="submit"
//                     >
//                         Sign In
//                     </button>
//                 </form>
//                 <p className="mt-4 text-center text-sm text-gray-600">
//                     Don't have an account?{' '}
//                     <Link href="/signup" className="text-blue-500 hover:text-blue-700">
//                         Sign Up
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }




'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            setError(error.message);
        } else {
            toast.success('Logged in successfully');
            router.push('/'); 
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Login</h2>
                {error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            name="email"
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <input
                            name="password"
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-500 hover:text-blue-700">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
