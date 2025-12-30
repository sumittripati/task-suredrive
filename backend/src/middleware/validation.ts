const validateTask = (req: any, res: any, next: any) => {
    const { title, description, status } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
        return;
    }

    if (description && typeof description !== 'string') {
        res.status(400).json({ error: 'Description must be a string.' });
        return;
    }

    if (status && !['Pending', 'Completed'].includes(status)) {
        res.status(400).json({ error: 'Status must be either "Pending" or "Completed".' });
        return;
    }

    next();
};

module.exports = { validateTask };
