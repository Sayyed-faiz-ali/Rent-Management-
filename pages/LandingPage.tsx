
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import Card from '../components/ui/Card';

const OwnerIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v10l-4-4h-6a2 2 0 0 1-2-2v-2"/></svg>
);

const TenantIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
            <div className="text-center mb-12">
                <Logo className="justify-center mb-4" />
                <h1 className="text-4xl font-bold text-slate-800">Welcome to Rent Management System</h1>
                <p className="text-slate-600 mt-2">The one-stop solution for managing rental properties.</p>
            </div>
            
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-slate-700 mb-6">Choose Your Portal</h2>
                <div className="space-y-4">
                    <Button className="w-full !py-4 !text-lg flex items-center justify-center gap-2" onClick={() => navigate('/login/owner')}>
                        <OwnerIcon className="w-6 h-6"/>
                        Owner Portal
                    </Button>
                    <Button className="w-full !py-4 !text-lg flex items-center justify-center gap-2" variant="secondary" onClick={() => navigate('/login/tenant')}>
                        <TenantIcon className="w-6 h-6"/>
                        Tenant Portal
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default LandingPage;
