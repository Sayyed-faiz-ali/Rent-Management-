import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Tenant, Payment } from '../../types';
import Card from '../../components/ui/Card';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PaymentHistory: React.FC = () => {
    const { tenants } = useAppContext();
    const tenant = tenants.length > 0 ? tenants[0] : null;

    const [filterYear, setFilterYear] = useState<string>('all');
    const [filterMonth, setFilterMonth] = useState<string>('all');

    if (!tenant) {
        return <p>Loading payment data...</p>;
    }
    
    const sortedPayments = [...tenant.payments].sort((a, b) => new Date(b.year, b.month - 1).getTime() - new Date(a.year, a.month - 1).getTime());

    const availableYears = [...new Set(tenant.payments.map(p => p.year))].sort((a,b) => b - a);

    const filteredPayments = sortedPayments.filter(payment => {
        const yearMatch = filterYear === 'all' || payment.year === parseInt(filterYear);
        const monthMatch = filterMonth === 'all' || payment.month === parseInt(filterMonth);
        return yearMatch && monthMatch;
    });

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Payment History</h2>
                <div className="flex items-center gap-4">
                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                        <option value="all">All Years</option>
                        {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="w-full sm:w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                        <option value="all">All Months</option>
                        {months.map((month, index) => <option key={index} value={index + 1}>{month}</option>)}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total Due</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount Paid</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredPayments.map((payment) => {
                             let status;
                             if (payment.balance <= 0) {
                                 status = <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>;
                             } else if (payment.amountPaid > 0) {
                                 status = <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Partial</span>;
                             } else {
                                 status = <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Due</span>;
                             }

                            return (
                                <tr key={payment._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{months[payment.month - 1]} {payment.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₹{payment.totalDue.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">₹{payment.amountPaid.toLocaleString()}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${payment.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ₹{payment.balance.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                 {filteredPayments.length === 0 && <p className="text-center py-8 text-slate-500">No payment history found for the selected period.</p>}
            </div>
        </Card>
    );
};

export default PaymentHistory;