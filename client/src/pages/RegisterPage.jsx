import React, { useState } from "react";
import { register } from "@/services/api";
import { toast } from 'sonner';

const RegisterPage = () => {
    const [form, setForm] = useState({ fullName: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await register(form);
            setMessage('Registration successful! Awaiting approval.');
            toast.success('Registration successful! Awaiting approval.');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed');
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-base-100">
            <form onSubmit={handleSubmit} className="card w-full max-w-md bg-base-200 shadow-xl p-8">
                <div className="card-body">
                    <h2 className="card-title text-3xl font-bold mb-4">Register</h2>
                    <input name="fullName" type="text" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="input input-bordered w-full mb-3" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="input input-bordered w-full mb-3" />
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="input input-bordered w-full mb-3" />
                    <button type="submit" className="btn btn-primary w-full">Register</button>
                    {message && <p className="mt-2 text-center text-error">{message}</p>}
                    <div className="card-actions justify-end mt-4">
                        <span className="text-sm text-gray-500">Enter Your Registration Details</span>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;