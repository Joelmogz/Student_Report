import React, { useState } from "react";
import { register } from "@/services/api";
import { Card, CardContent, CardHeader,CardFooter,CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import e from "cors";


const RegisterPage = () => {
    const  [ form, setForm] = useState({fullName: '', email: '', password: ''});
    const [message, setMessage] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    
    const handleSubmit = async e => {
        e.preventDefault();
        try {
          await register(form);
          setMessage('Registration successful! Awaiting approval.');
        } catch (err) {
          setMessage(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Card onSubmit= {handleSubmit} bg-gray-200>
            <CardHeader>
                <CardTitle className="font-bold text-3xl w-full">Register</CardTitle>
            </CardHeader>
            <CardContent>
            <Input name="fullName" type="name" value={form.fullName} onChange={handleChange} placeholder ="Enter your Full Name" className="Shadow border rounded" />
                <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder ="Email" className="Shadow border rounded" />
                <Input name="Password" type="password" value={form.password} onChange={handleChange} placeholder ="Email" className="shadow border rounde" />
                <Button type="submit">Register</Button>
                <p>{message}</p>
            </CardContent>
            <CardFooter className="text-sm bg-grey-100">Enter Your Regestration Details</CardFooter>
        </Card>
    )
    
};

export default RegisterPage;