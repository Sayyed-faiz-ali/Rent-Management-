import React from 'react';
import { useAppContext } from '../../context/AppContext';
import type { Tenant } from '../../types';
import Card from '../../components/ui/Card';

const FamilyDetails: React.FC = () => {
    const { tenants } = useAppContext();
    const tenant = tenants.length > 0 ? tenants[0] : null;

    if (!tenant) {
        return <p>Loading family data...</p>;
    }

    return (
        <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Family Members</h2>
            {tenant.familyMembers.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                    {tenant.familyMembers.map((member) => (
                        <li key={member._id} className="py-4">
                            <p className="text-lg font-medium text-slate-900">{member.name}</p>
                            <p className="text-sm text-slate-500">
                                Relation: <span className="font-medium text-slate-600">{member.relation}</span>
                            </p>
                             <p className="text-sm text-slate-500">
                                Age: <span className="font-medium text-slate-600">{member.age} years</span>
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500">No family members have been added.</p>
            )}
        </Card>
    );
};

export default FamilyDetails;