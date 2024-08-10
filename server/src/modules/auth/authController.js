import { createUser, findUserByEmail, createProject, findOrCreateProject } from './authModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await createUser(email, password);
        const project = await createProject(user.id);
        // const token = jwt.sign({ userId: user.id, projectId: project.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ message: 'User created successfully', userId: user.id, projectId: project.id, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const project = await findOrCreateProject(user.id);
        const token = jwt.sign({ userId: user.id, projectId: project.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, userId: user.id, projectId: project.id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
