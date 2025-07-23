import { Link } from "react-router-dom";
import useAuth from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    return (
        <div className="navbar bg-base-200 shadow mb-4">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Student Report</Link>
            </div>
            <div className="flex-none gap-2">
                {user?.role === 'admin' && <Link to="/admin" className="btn btn-ghost">Admin Dashboard</Link>}
                {user?.role === 'student' && <Link to="/student" className="btn btn-ghost">Student Dashboard</Link>}
                {!user && <Link to="/login" className="btn btn-outline">Login</Link>}
                {!user && <Link to="/register" className="btn btn-primary">Register</Link>}
                {user && <button className="btn btn-error" onClick={logout}>Logout</button>}
            </div>
        </div>
    );
}


