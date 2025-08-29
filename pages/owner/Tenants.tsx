

import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import type { Tenant } from '../../types';

const EyeIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);

const getPaymentStatus = (tenant: Tenant) => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const payment = tenant.payments.find(p => p.month === currentMonth && p.year === currentYear);

    if (!payment) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">No Record</span>;
    if (payment.amountPaid >= payment.totalDue) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>;
    if (payment.amountPaid > 0) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Partial</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Due</span>;
};


const OwnerTenants: React.FC = () => {
    const { tenants } = useAppContext();
    const navigate = useNavigate();

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Manage Tenants</h2>
                <Button onClick={() => alert("Add Tenant functionality not implemented.")}>Add New Tenant</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">House No.</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Status (Current Month)</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">View</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {tenants.map((tenant) => (
                            <tr key={tenant._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{tenant.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tenant.houseNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{tenant.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{getPaymentStatus(tenant)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button variant="secondary" className="!p-2" onClick={() => navigate(`/owner/tenants/${tenant._id}`)}>
                                        <EyeIcon className="h-5 w-5"/>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default OwnerTenants;