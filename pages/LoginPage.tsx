import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
    const { role } = useParams<{ role: 'owner' | 'tenant' }>();
    const navigate = useNavigate();
    const { login } = useAppContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    if (!role) {
        navigate('/');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = login(email, password, role);
        setLoading(false);
        if (success) {
            navigate(`/${role}/dashboard`);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };
    
    const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
            <Logo className="mb-8" />
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">{roleTitle} Login</h2>
                <p className="text-center text-slate-500 mb-6">Access your dashboard</p>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Email Address"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                    <Input 
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                    <Button type="submit" className="w-full !py-2.5" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                 <p className="text-sm text-center text-slate-500 mt-6">
                    Don't have an account?{' '}
                    <Link to={`/signup/${role}`} className="font-medium text-primary-600 hover:text-primary-500">
                        Sign up
                    </Link>
                </p>
               
            </Card>
        </div>
    );
};

export default LoginPage;