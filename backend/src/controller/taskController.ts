const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Helper to get authenticated Supabase client
const getSupabase = (req: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    return createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
    });
};

const getTasks = async (req: any, res: any) => {
    console.log('getTasks called');
    const supabase = getSupabase(req);
    if (!supabase) {
        console.log('Unauthorized: Missing auth header');
        res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
        return;
    }

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase error:', error);
        res.status(500).json({ error: error.message });
        return;
    }

    console.log('Tasks fetched:', data?.length);
    res.status(200).json(data);
};

const createTask = async (req: any, res: any) => {
    const supabase = getSupabase(req);
    if (!supabase) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { title, description, status } = req.body;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
    }

    const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, description, status: status || 'Pending', user_id: user.id }])
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(201).json(data[0]);
};

const updateTask = async (req: any, res: any) => {
    const supabase = getSupabase(req);
    if (!supabase) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { id } = req.params;
    const { title, description, status } = req.body;

    const { data, error } = await supabase
        .from('tasks')
        .update({ title, description, status })
        .eq('id', id)
        .select();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    if (data.length === 0) {
        res.status(404).json({ error: 'Task not found or permission denied' });
        return;
    }

    res.status(200).json(data[0]);
};

const deleteTask = async (req: any, res: any) => {
    const supabase = getSupabase(req);
    if (!supabase) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { id } = req.params;

    const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    res.status(200).json({ message: 'Task deleted successfully' });
};

const getTaskById = async (req: any, res: any) => {
    const supabase = getSupabase(req);
    if (!supabase) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { id } = req.params;

    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        res.status(500).json({ error: error.message });
        return;
    }

    if (!data) {
        res.status(404).json({ error: 'Task not found' });
        return;
    }

    res.status(200).json(data);
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById
};
