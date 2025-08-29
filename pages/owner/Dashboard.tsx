import React from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Calculator from '../../components/ui/Calculator';
import Calendar from '../../components/ui/Calendar';

// Icons
const UsersIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const DollarIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>);
const AlertIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const MessageIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
    <Card className="flex items-center p-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </Card>
);

const OwnerDashboard: React.FC = () => {
    const { tenants } = useAppContext();
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const totalTenants = tenants.length;
    
    const rentCollectedThisMonth = tenants.reduce((acc, tenant) => {
        const payment = tenant.payments.find(p => p.month === currentMonth && p.year === currentYear);
        return acc + (payment ? payment.amountPaid : 0);
    }, 0);

    const pendingDues = tenants.reduce((acc, tenant) => {
        const payment = tenant.payments.find(p => p.month === currentMonth && p.year === currentYear);
        const balance = payment ? payment.totalDue - payment.amountPaid : 0;
        return acc + (balance > 0 ? balance : 0);
    }, 0);

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<UsersIcon className="h-6 w-6 text-white"/>} title="Total Tenants" value={totalTenants} color="bg-blue-500" />
                <StatCard icon={<DollarIcon className="h-6 w-6 text-white"/>} title="Rent Collected (This Month)" value={`₹${rentCollectedThisMonth.toLocaleString()}`} color="bg-green-500" />
                <StatCard icon={<AlertIcon className="h-6 w-6 text-white"/>} title="Pending Dues (This Month)" value={`₹${pendingDues.toLocaleString()}`} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 flex justify-center">
                    <Calendar />
                </div>
                 <div className="lg:col-span-1 flex justify-center">
                    <Calculator />
                </div>
                <div className="lg:col-span-1">
                     <Card>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-4">
                            <Link to="/owner/tenants">
                                <Button className="w-full flex items-center justify-center"><UsersIcon className="h-5 w-5 mr-2"/>Manage Tenants</Button>
                            </Link>
                            <Link to="/owner/messaging">
                                <Button variant="secondary" className="w-full flex items-center justify-center"><MessageIcon className="h-5 w-5 mr-2"/>Send Message</Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;