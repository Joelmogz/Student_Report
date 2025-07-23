import React, { useState } from "react";
import { login } from '../services/api'; // or '@/services/api' if alias is set up
import  useAuth  from '../context/AuthContext'; // or '@/context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
            if (res.data.user.role === 'admin') navigate('/admin');
            else navigate('/student');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Card bg-gray-200>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="font-bold text-3xl w-full">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="shadow border rounded" />
                    <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="shadow border rounded" />
                    <Button type="submit">Login</Button>
                    <p>{message}</p>
                </CardContent>
                <CardFooter className="text-sm bg-grey-100">Enter Your Login Details</CardFooter>
            </form>
        </Card>
    );
};

export default LoginPage;