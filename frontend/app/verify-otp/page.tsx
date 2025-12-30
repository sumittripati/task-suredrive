'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedEmail = localStorage.getItem('verificationEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            router.push('/signup');
        }
    }, [router]);
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Verification failed');
                toast.error(data.error || 'Verification failed');
            }

            toast.success('Email verified successfully! Please go to login.');
            localStorage.removeItem('verificationEmail');
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded bg-white p-8 shadow">
                <h2 className="mb-6 text-center text-2xl font-bold">Verify Email</h2>
                <p className="mb-4 text-center text-sm text-gray-600">
                    Enter the OTP sent to <strong>{email}</strong>
                </p>
                {error && <div className="mb-4 text-center text-red-500">{error}</div>}
                <form onSubmit={handleVerify}>
                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-bold">OTP</label>
                        <input
                            type="text"
                            className="w-full rounded border p-2 text-center text-2xl tracking-widest"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            required
                            maxLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-blue-500 py-2 font-bold text-white hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
}
