
import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Logo from '../ui/Logo';

// Icons
const DashboardIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const MessageIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const DollarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
);
const FamilyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4"/><path d="M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M6 21V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11"/><path d="M12 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M12 3a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"/></svg>
);


const ownerLinks = [
  { to: '/owner/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/owner/tenants', label: 'Tenants', icon: UsersIcon },
  { to: '/owner/messaging', label: 'Messaging', icon: MessageIcon },
];

const tenantLinks = [
  { to: '/tenant/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { to: '/tenant/payments', label: 'Payments', icon: DollarIcon },
  { to: '/tenant/family', label: 'Family', icon: FamilyIcon },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const { user } = useAppContext();
    const location = useLocation();
    const trigger = useRef<HTMLButtonElement>(null);
    const sidebar = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    const links = user?.role === 'owner' ? ownerLinks : tenantLinks;

    return (
        <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-auto w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
        >
            <div className="flex justify-between mb-10 pr-3 sm:px-2">
                <div className="flex-grow">
                  <Logo className="text-white"/>
                </div>
                <button
                    ref={trigger}
                    className="lg:hidden text-slate-500 hover:text-slate-400"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                >
                    <span className="sr-only">Close sidebar</span>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
                    </svg>
                </button>
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">Menu</h3>
                    <ul className="mt-3">
                        {links.map((link) => (
                        <li key={link.to} className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${location.pathname.includes(link.to) && 'bg-slate-900'}`}>
                            <NavLink to={link.to} className={`block text-slate-200 hover:text-white truncate transition duration-150 ${location.pathname.includes(link.to) && 'hover:text-slate-200'}`}>
                            <div className="flex items-center">
                                <link.icon className="shrink-0 h-6 w-6" />
                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">{link.label}</span>
                            </div>
                            </NavLink>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
