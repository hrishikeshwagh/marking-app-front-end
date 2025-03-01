import React, { useState } from 'react';

interface TeacherLoginProps {
    onLogin: () => void;
}

const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'teacher@example.com' && password === 'password') {
            onLogin();
        } else {
            alert('Invalid credentials! Use teacher@example.com / password');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Teacher Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default TeacherLogin;
