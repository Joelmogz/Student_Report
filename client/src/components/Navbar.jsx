import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuth from "@/context/AuthContext";

export default function Navbar(user) {
    const {logout} = useAuth();
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <Link to="/">Home</Link>
            {user?.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
            {user?.role === 'student' && <Link to="/student">Student Dashboard</Link>}
            {!user && <Link to="/login">Login</Link>}
            {!user && <Link to="/register">Register</Link>}
            {user && <Button onClick={logout}>Logout</Button>}
        </nav>
    );
};


