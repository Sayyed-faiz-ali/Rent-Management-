import React from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Tenant } from '../../types';
import Card from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Icons
const MessageIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const DollarIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>);
const AlertIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const FileIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>);


const TenantDashboard: React.FC = () => {
    const { tenants } = useAppContext();
    const tenant = tenants.length > 0 ? tenants[0] : null;

    if (!tenant) {
        return <p>Loading tenant data...</p>;
    }
    
    const currentMonth = new Date().getMonth(); // 0-11
    const currentYear = new Date().getFullYear();
    const currentPayment = tenant.payments.find(p => p.month === currentMonth + 1 && p.year === currentYear);
    
    const totalDue = currentPayment?.totalDue || 0;
    const amountPaid = currentPayment?.amountPaid || 0;
    const balance = currentPayment?.balance ?? 0;
    
    const recentMessages = [...tenant.messages].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);

    const renderStatusCard = () => {
        if (!currentPayment) {
            return (
                <Card className="border-l-4 border-slate-400 bg-slate-100">
                    <div className="flex items-center gap-3">
                        <FileIcon className="w-8 h-8 text-slate-500 shrink-0"/>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">
                                No Payment Record
                            </h2>
                            <p className="text-slate-600">There is no payment record for {months[currentMonth]} {currentYear}.</p>
                        </div>
                    </div>
                </Card>
            );
        }

        if (balance > 0) {
            return (
                <Card className="bg-red-50 border-l-4 border-red-600">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <AlertIcon className="w-7 h-7 text-red-600" />
                                <h2 className="text-2xl font-bold text-red-800">
                                    Payment Due
                                </h2>
                            </div>
                            <p className="text-slate-600 sm:ml-9">
                                For {months[currentMonth]} {currentYear}, you have an outstanding balance.
                            </p>
                        </div>
                        <div className="text-center sm:text-right w-full sm:w-auto mt-2 sm:mt-0">
                            <p className="text-sm font-medium text-slate-500">Balance Due</p>
                            <p className="text-4xl font-extrabold text-red-600">
                                ₹{balance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-red-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-slate-600 grid grid-cols-2 gap-x-4 gap-y-1">
                            <span className="font-medium text-slate-700">Total Bill:</span>
                            <span>₹{totalDue.toLocaleString()}</span>
                            <span className="font-medium text-slate-700">Amount Paid:</span>
                            <span>₹{amountPaid.toLocaleString()}</span>
                        </div>
                        <Link to="/tenant/payments" className="w-full sm:w-auto">
                             <Button variant="danger" className="w-full">View Details</Button>
                        </Link>
                    </div>
                </Card>
            )
        }

        return (
            <Card className="bg-green-50 border-l-4 border-green-500">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <CheckCircleIcon className="w-10 h-10 text-green-500 shrink-0" />
                        <div>
                            <h2 className="text-2xl font-bold text-green-800">
                                Paid in Full
                            </h2>
                            <p className="text-slate-600">
                                Thank you for your payment for {months[currentMonth]} {currentYear}.
                            </p>
                        </div>
                    </div>
                    <Link to="/tenant/payments" className="w-full sm:w-auto">
                         <Button variant="secondary" className="w-full">View Payment History</Button>
                    </Link>
                </div>
            </Card>
        );
    }


    return (
        <div className="space-y-6">
            {renderStatusCard()}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><MessageIcon className="w-5 h-5"/> Recent Messages from Owner</h3>
                    <div className="space-y-3">
                        {recentMessages.length > 0 ? recentMessages.map(msg => (
                            <div key={msg._id} className="bg-slate-100 p-3 rounded-md">
                                <p className="text-sm text-slate-700">{msg.content}</p>
                                <p className="text-xs text-slate-500 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                            </div>
                        )) : (
                             <p className="text-sm text-slate-500">No new messages.</p>
                        )}
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><DollarIcon className="w-5 h-5"/> Rent & Utility Details ({months[currentMonth]})</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="flex justify-between"><span>Base Rent:</span> <span className="font-medium">₹{currentPayment?.rent.toLocaleString() || 'N/A'}</span></li>
                        <li className="flex justify-between"><span>Electricity Bill:</span> <span className="font-medium">₹{currentPayment?.electricityBill.toLocaleString() || 'N/A'}</span></li>
                        <li className="flex justify-between"><span>Water Charge:</span> <span className="font-medium">₹{currentPayment?.waterCharge.toLocaleString() || 'N/A'}</span></li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default TenantDashboard;