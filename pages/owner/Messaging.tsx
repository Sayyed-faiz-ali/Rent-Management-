import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Messaging: React.FC = () => {
    const { tenants, sendMessage } = useAppContext();
    const [recipient, setRecipient] = useState('all');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message) return;
        sendMessage(recipient, message);
        setStatus(`Message sent successfully to ${recipient === 'all' ? 'all tenants' : tenants.find(t => t._id === recipient)?.name}!`);
        setMessage('');
        setRecipient('all');
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Message / Reminder</h2>
            {status && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4 text-sm">{status}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-slate-700 mb-1">Recipient</label>
                    <select
                        id="recipient"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">All Tenants</option>
                        {tenants.map(tenant => (
                            <option key={tenant._id} value={tenant._id}>
                                {tenant.name} ({tenant.houseNumber})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea
                        id="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Type your rent reminder or message here..."
                    />
                </div>
                <div className="text-right">
                    <Button type="submit">Send Message</Button>
                </div>
            </form>
        </Card>
    );
};

export default Messaging;