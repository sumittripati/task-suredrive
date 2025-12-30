const { createClient } = require('@supabase/supabase-js');
const { sendOTP } = require('../utils/email');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const generateOTP = () => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

const register = async (req: any, res: any) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    try {
        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Check if user exists
        const { data: users, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = users?.users.find((u: any) => u.email === email);

        if (existingUser) {
        
            if (existingUser.email_confirmed_at) {
                res.status(400).json({ error: 'User already exists' });
                return;
            }

            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                existingUser.id,
                { user_metadata: { name, otp, otpExpiry } }
            );

            if (updateError) throw updateError;

            await sendOTP(email, otp);
            res.status(200).json({ message: 'OTP sent to email. Please verify.' });
            return;
        }
        const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, 
            user_metadata: { name, otp, otpExpiry, is_verified: false }
        });

        if (createError) throw createError;

        await sendOTP(email, otp);

        res.status(201).json({ message: 'User created. OTP sent to email.', userId: user.user.id });

    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

const verifyOTP = async (req: any, res: any) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400).json({ error: 'Email and OTP are required' });
        return;
    }

    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) throw error;

        const user = users.find((u: any) => u.email === email);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const { otp: storedOTP, otpExpiry } = user.user_metadata;

        if (!storedOTP || String(storedOTP) !== String(otp)) {
            res.status(400).json({ error: 'Invalid OTP' });
            return;
        }

        if (Date.now() > otpExpiry) {
            res.status(400).json({ error: 'OTP expired' });
            return;
        }

        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { user_metadata: { ...user.user_metadata, otp: null, otpExpiry: null, is_verified: true } }
        );

        if (updateError) throw updateError;

        res.status(200).json({ message: 'Email verified successfully. You can now login.' });

    } catch (error: any) {
        console.error('OTP Verification error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, verifyOTP };
