// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function Signup() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [name, setName] = useState('');
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const API_URL = process.env.NEXT_PUBLIC_API_URL;
//     const handleSignup = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await fetch(`${API_URL}/api/auth/register`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password, name }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error || 'Registration failed');
//             }

//             // Store email for OTP page
//             localStorage.setItem('verificationEmail', email);
//             router.push('/verify-otp');
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100">
//             <div className="w-full max-w-md rounded bg-white p-8 shadow">
//                 <h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>
//                 {error && <div className="mb-4 text-center text-red-500">{error}</div>}
//                 <form onSubmit={handleSignup}>
//                     <div className="mb-4">
//                         <label className="mb-1 block text-sm font-bold">Name</label>
//                         <input
//                             type="text"
//                             className="w-full rounded border p-2"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="mb-1 block text-sm font-bold">Email</label>
//                         <input
//                             type="email"
//                             className="w-full rounded border p-2"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="mb-1 block text-sm font-bold">Password</label>
//                         <input
//                             type="password"
//                             className="w-full rounded border p-2"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full rounded bg-blue-500 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-blue-300"
//                     >
//                         {loading ? 'Creating Account...' : 'Sign Up'}
//                     </button>
//                 </form>
//                 <p className="mt-4 text-center text-sm">
//                     Already have an account? <a href="/login" className="text-blue-500">Log In</a>
//                 </p>
//             </div>
//         </div>
//     );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store email for OTP page
            localStorage.setItem('verificationEmail', formData.email);
            toast.success('Registration successful! Please verify your email.');
            router.push('/verify-otp');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded bg-white p-8 shadow">
                <h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>
                {error && <div className="mb-4 text-center text-red-500">{error}</div>}
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-bold">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full rounded border p-2"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-bold">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full rounded border p-2"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-bold">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full rounded border p-2"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-blue-500 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account? <a href="/login" className="text-blue-500">Log In</a>
                </p>
            </div>
        </div>
    );
}
