import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';

const SignupPage: React.FC = () => {
    const { role } = useParams<{ role: 'owner' | 'tenant' }>();
    const navigate = useNavigate();
    const { signup } = useAppContext();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!role) {
        navigate('/');
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        
        let success = false;
        if (role === 'tenant') {
            if (!name || !email || !password || !houseNumber) {
                setError("Please fill in all fields for tenant signup.");
                setLoading(false);
                return;
            }
            // In a real multi-owner app, you'd have a way to assign an owner.
            // Here, we'll hardcode the first owner's ID for simplicity.
            success = signup({ name, email, password, houseNumber, ownerId: 'owner_1' }, 'tenant');
        } else { // role === 'owner'
             if (!name || !email || !password) {
                setError("Please fill in all fields for owner signup.");
                setLoading(false);
                return;
            }
            success = signup({ name, email, password }, 'owner');
        }
        
        setLoading(false);

        if (success) {
            navigate(`/${role}/dashboard`);
        } else {
            setError("An error occurred during signup. The email might already be in use.");
        }
    };

    const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
            <Logo className="mb-8" />
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Create {roleTitle} Account</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Full Name"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input 
                        label="Email Address"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                     {role === 'tenant' && (
                        <Input 
                            label="House Number"
                            id="houseNumber"
                            type="text"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            placeholder="e.g., A-101"
                            required
                        />
                    )}
                    <Input 
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                     <Input 
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full !py-2.5" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <p className="text-sm text-center text-slate-500 mt-6">
                    Already have an account?{' '}
                    <Link to={`/login/${role}`} className="font-medium text-primary-600 hover:text-primary-500">
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default SignupPage;