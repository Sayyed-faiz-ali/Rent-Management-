import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import type { Payment, FamilyMember } from '../../types';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TrashIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
const CheckCircleIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const EditIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);


const OwnerTenantDetails: React.FC = () => {
    const { _id } = useParams();
    const { getTenantById, addFamilyMember, removeFamilyMember, updateFamilyMember, addPayment, updateTenant, updatePayment, removePayment } = useAppContext();
    const tenant = _id ? getTenantById(_id) : undefined;

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedHouseNumber, setEditedHouseNumber] = useState('');
    
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberAge, setNewMemberAge] = useState('');
    const [newMemberRelation, setNewMemberRelation] = useState('');
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [editedMemberData, setEditedMemberData] = useState({ name: '', age: '', relation: '' });

    const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
    const [newPaymentMonth, setNewPaymentMonth] = useState<number>(new Date().getMonth() + 1);
    const [newPaymentYear, setNewPaymentYear] = useState<number>(new Date().getFullYear());
    const [newPaymentRent, setNewPaymentRent] = useState('');
    const [newPaymentElectricity, setNewPaymentElectricity] = useState('');
    const [newPaymentWater, setNewPaymentWater] = useState('');
    const [newPaymentPaid, setNewPaymentPaid] = useState('');

    const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
    const [editedPaymentData, setEditedPaymentData] = useState({ rent: '', electricityBill: '', waterCharge: '', amountPaid: '' });
    
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (tenant) {
            setEditedName(tenant.name);
            setEditedEmail(tenant.email);
            setEditedHouseNumber(tenant.houseNumber);
        }
    }, [tenant]);

    const showSuccessMessage = (message: string) => {
        setStatusMessage(message);
        setTimeout(() => setStatusMessage(''), 3000);
    };

    if (!tenant) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Tenant not found</h2>
                <Link to="/owner/tenants" className="text-primary-600 hover:underline mt-4 inline-block">
                    Back to Tenants List
                </Link>
            </div>
        );
    }
    
    const sortedPayments = [...tenant.payments].sort((a, b) => new Date(b.year, b.month - 1).getTime() - new Date(a.year, a.month - 1).getTime());

    const handleSaveChanges = () => {
        if (!_id || !editedName || !editedEmail || !editedHouseNumber) {
            alert('Please fill all tenant details.');
            return;
        }
        updateTenant(_id, {
            name: editedName,
            email: editedEmail,
            houseNumber: editedHouseNumber,
        } as any);
        setIsEditing(false);
        showSuccessMessage('Tenant details updated successfully.');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if(tenant) {
            setEditedName(tenant.name);
            setEditedEmail(tenant.email);
            setEditedHouseNumber(tenant.houseNumber);
        }
    };

    const handleAddMemberSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberName || !newMemberAge || !newMemberRelation || !_id) return;

        addFamilyMember(_id, {
            name: newMemberName,
            age: parseInt(newMemberAge, 10),
            relation: newMemberRelation,
        });

        setNewMemberName('');
        setNewMemberAge('');
        setNewMemberRelation('');
        setShowAddMemberForm(false);
        showSuccessMessage('Family member added successfully.');
    };

    const handleRemoveMember = (memberId: string) => {
        if (_id && memberId && window.confirm('Are you sure you want to remove this family member?')) {
            removeFamilyMember(_id, memberId);
            showSuccessMessage('Family member removed successfully.');
        }
    };
    
    const handleStartEditMember = (member: FamilyMember) => {
        setEditingMemberId(member._id!);
        setEditedMemberData({
            name: member.name,
            age: String(member.age),
            relation: member.relation
        });
    };

    const handleUpdateMember = () => {
        if (!_id || !editingMemberId) return;
        
        const age = parseInt(editedMemberData.age, 10);
        if (isNaN(age) || !editedMemberData.name || !editedMemberData.relation) {
            alert("Please fill all fields with valid data.");
            return;
        }
        
        updateFamilyMember(_id, editingMemberId, { name: editedMemberData.name, age, relation: editedMemberData.relation });
        setEditingMemberId(null);
        showSuccessMessage('Family member updated successfully.');
    };

    const handleAddPaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!_id || !newPaymentRent || !newPaymentElectricity || !newPaymentWater || newPaymentPaid === '') {
            alert("Please fill all payment fields.");
            return;
        }

        const rent = parseFloat(newPaymentRent);
        const electricityBill = parseFloat(newPaymentElectricity);
        const waterCharge = parseFloat(newPaymentWater);
        const amountPaid = parseFloat(newPaymentPaid);
        const totalDue = rent + electricityBill + waterCharge;
        const balance = totalDue - amountPaid;

        addPayment(_id, {
            month: newPaymentMonth,
            year: newPaymentYear,
            rent,
            electricityBill,
            waterCharge,
            totalDue,
            amountPaid,
            balance,
            paymentDate: new Date().toISOString(),
        });

        setShowAddPaymentForm(false);
        setNewPaymentRent('');
        setNewPaymentElectricity('');
        setNewPaymentWater('');
        setNewPaymentPaid('');
        showSuccessMessage('Payment record added successfully.');
    };

    const handleRemovePayment = (paymentId: string) => {
        if (_id && paymentId && window.confirm('Are you sure you want to delete this payment record?')) {
            removePayment(_id, paymentId);
            showSuccessMessage('Payment record deleted successfully.');
        }
    };

    const handleStartEditPayment = (payment: Payment) => {
        setEditingPaymentId(payment._id!);
        setEditedPaymentData({
            rent: String(payment.rent),
            electricityBill: String(payment.electricityBill),
            waterCharge: String(payment.waterCharge),
            amountPaid: String(payment.amountPaid),
        });
    };

    const handleCancelEditPayment = () => {
        setEditingPaymentId(null);
    };

    const handleUpdatePayment = () => {
        if (!_id || !editingPaymentId) return;

        const rent = parseFloat(editedPaymentData.rent);
        const electricityBill = parseFloat(editedPaymentData.electricityBill);
        const waterCharge = parseFloat(editedPaymentData.waterCharge);
        const amountPaid = parseFloat(editedPaymentData.amountPaid);
        
        if (isNaN(rent) || isNaN(electricityBill) || isNaN(waterCharge) || isNaN(amountPaid)) {
            alert('Please enter valid numbers.');
            return;
        }

        updatePayment(_id, editingPaymentId, { rent, electricityBill, waterCharge, amountPaid });
        setEditingPaymentId(null);
        showSuccessMessage('Payment record updated successfully.');
    };

    return (
        <div className="space-y-6">
            {statusMessage && (
                <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center gap-2" role="alert">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">{statusMessage}</span>
                </div>
            )}
            <Link to="/owner/tenants" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                &larr; Back to all tenants
            </Link>
            <Card>
                {!isEditing ? (
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800">{tenant.name}</h2>
                            <p className="text-slate-500">{tenant.email} | House No: {tenant.houseNumber}</p>
                        </div>
                        <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Tenant</Button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Edit Tenant Details</h2>
                        <div className="space-y-4">
                            <Input label="Full Name" id="tenantName" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                            <Input label="Email" id="tenantEmail" type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                             <Input label="House Number" id="tenantHouse" value={editedHouseNumber} onChange={(e) => setEditedHouseNumber(e.target.value)} />
                        </div>
                         <div className="flex justify-end items-center gap-4 mt-6">
                            <Button variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </div>
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-slate-800">Family Members</h3>
                        <Button className="!px-3 !py-1 text-sm" onClick={() => setShowAddMemberForm(!showAddMemberForm)} variant={showAddMemberForm ? 'secondary' : 'primary'}>
                            {showAddMemberForm ? 'Cancel' : 'Add Member'}
                        </Button>
                    </div>
                    
                    {showAddMemberForm && (
                        <form onSubmit={handleAddMemberSubmit} className="bg-slate-50 p-4 rounded-md mb-4 space-y-3 transition-all duration-300">
                            <h4 className="font-semibold text-slate-700">Add New Family Member</h4>
                             <Input label="Full Name" id="memberName" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} required />
                             <Input label="Age" id="memberAge" type="number" value={newMemberAge} onChange={(e) => setNewMemberAge(e.target.value)} required />
                             <Input label="Relation" id="memberRelation" value={newMemberRelation} onChange={(e) => setNewMemberRelation(e.target.value)} placeholder="e.g., Spouse, Son, Daughter" required />
                            <div className="text-right">
                                <Button type="submit" className="!py-1.5 !px-3 text-sm">Save Member</Button>
                            </div>
                        </form>
                    )}

                    <ul className="divide-y divide-slate-200">
                        {tenant.familyMembers.map(member => (
                            <li key={member._id} className="py-3">
                                {editingMemberId === member._id ? (
                                    <div className="space-y-2">
                                        <Input label="Name" value={editedMemberData.name} onChange={e => setEditedMemberData({...editedMemberData, name: e.target.value})} />
                                        <Input label="Age" type="number" value={editedMemberData.age} onChange={e => setEditedMemberData({...editedMemberData, age: e.target.value})} />
                                        <Input label="Relation" value={editedMemberData.relation} onChange={e => setEditedMemberData({...editedMemberData, relation: e.target.value})} />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <Button variant="secondary" className="!text-xs !py-1 !px-2" onClick={() => setEditingMemberId(null)}>Cancel</Button>
                                            <Button className="!text-xs !py-1 !px-2" onClick={handleUpdateMember}>Save</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-slate-800">{member.name}</p>
                                            <p className="text-sm text-slate-500">{member.relation}, {member.age} years</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" className="!p-2" onClick={() => handleStartEditMember(member)}>
                                                <EditIcon className="h-4 w-4" />
                                            </Button>
                                            <Button variant="danger" className="!p-2" onClick={() => handleRemoveMember(member._id!)}>
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                     {tenant.familyMembers.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No family members added.</p>}
                </Card>
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-slate-800">Payment History</h3>
                        <Button className="!px-3 !py-1 text-sm" onClick={() => setShowAddPaymentForm(!showAddPaymentForm)} variant={showAddPaymentForm ? 'secondary' : 'primary'}>
                             {showAddPaymentForm ? 'Cancel' : 'Add Payment'}
                        </Button>
                    </div>

                    {showAddPaymentForm && (
                        <form onSubmit={handleAddPaymentSubmit} className="bg-slate-50 p-4 rounded-md mb-4 space-y-3 transition-all duration-300">
                             <h4 className="font-semibold text-slate-700">Add New Payment Record</h4>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="paymentMonth" className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                                    <select id="paymentMonth" value={newPaymentMonth} onChange={(e) => setNewPaymentMonth(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                        {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="paymentYear" className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                                     <select id="paymentYear" value={newPaymentYear} onChange={(e) => setNewPaymentYear(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                        {[...Array(5)].map((_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                                    </select>
                                </div>
                             </div>
                             <Input label="Rent Amount" type="number" value={newPaymentRent} onChange={(e) => setNewPaymentRent(e.target.value)} required />
                             <Input label="Electricity Bill" type="number" value={newPaymentElectricity} onChange={(e) => setNewPaymentElectricity(e.target.value)} required />
                             <Input label="Water Charge" type="number" value={newPaymentWater} onChange={(e) => setNewPaymentWater(e.target.value)} required />
                             <Input label="Amount Paid" type="number" value={newPaymentPaid} onChange={(e) => setNewPaymentPaid(e.target.value)} required />
                             <div className="text-right">
                                <Button type="submit" className="!py-1.5 !px-3 text-sm">Save Payment</Button>
                            </div>
                        </form>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                             <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Month</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Total Due</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Paid</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Balance</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {sortedPayments.map(payment => (
                                     <React.Fragment key={payment._id}>
                                        <tr>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{months[payment.month - 1]} {payment.year}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">₹{payment.totalDue.toLocaleString()}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">₹{payment.amountPaid.toLocaleString()}</td>
                                            <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${payment.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                ₹{payment.balance.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex gap-2">
                                                <Button variant="secondary" className="!p-2" onClick={() => editingPaymentId === payment._id ? handleCancelEditPayment() : handleStartEditPayment(payment)}>
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="danger" className="!p-2" onClick={() => handleRemovePayment(payment._id!)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                        {editingPaymentId === payment._id && (
                                            <tr>
                                                <td colSpan={5} className="p-4 bg-slate-50">
                                                     <div className="space-y-2">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <Input label="Rent" type="number" value={editedPaymentData.rent} onChange={e => setEditedPaymentData({...editedPaymentData, rent: e.target.value})} />
                                                            <Input label="Amount Paid" type="number" value={editedPaymentData.amountPaid} onChange={e => setEditedPaymentData({...editedPaymentData, amountPaid: e.target.value})} />
                                                            <Input label="Electricity" type="number" value={editedPaymentData.electricityBill} onChange={e => setEditedPaymentData({...editedPaymentData, electricityBill: e.target.value})} />
                                                            <Input label="Water" type="number" value={editedPaymentData.waterCharge} onChange={e => setEditedPaymentData({...editedPaymentData, waterCharge: e.target.value})} />
                                                        </div>
                                                        <div className="flex justify-end gap-2 mt-2">
                                                            <Button variant="secondary" className="!text-xs !py-1 !px-2" onClick={handleCancelEditPayment}>Cancel</Button>
                                                            <Button className="!text-xs !py-1 !px-2" onClick={handleUpdatePayment}>Update Payment</Button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     {sortedPayments.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No payment history found.</p>}
                </Card>
            </div>
        </div>
    );
};

export default OwnerTenantDetails;