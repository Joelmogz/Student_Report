import React, { useState } from "react";
import { login } from '../services/api';
import useAuth from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage = () => {
    const { login: loginContext } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            loginContext(res.data.user, res.data.token);
            setMessage('Login Successfully');
            toast.success('Login Successfully');
            if (res.data.user.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-base-100">
            <form onSubmit={handleSubmit} className="card w-full max-w-md bg-base-200 shadow-xl p-8">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold mb-4">Login</h2>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full mb-3" />
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="input input-bordered w-full mb-3" />
                    <button type="submit" className="btn btn-primary w-full">Login</button>
                    {message && <p className="mt-2 text-center text-error">{message}</p>}
                    <div className="card-actions justify-end mt-4">
                        <span className="text-sm text-gray-500">Enter Your Login Details</span>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;