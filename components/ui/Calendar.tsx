import React, { useState } from 'react';
import Card from './Card';

const ChevronLeftIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRightIcon: React.FC<{className?: string}> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>);

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    const changeMonth = (amount: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(1); // Set to the first of the month to avoid issues with month lengths
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const renderHeader = () => {
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ChevronLeftIcon className="h-5 w-5 text-slate-500" />
                </button>
                <h3 className="text-lg font-semibold text-slate-800">
                    {monthName} {year}
                </h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <ChevronRightIcon className="h-5 w-5 text-slate-500" />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        return (
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-500 mb-2">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cells = [];
        // Blank cells for start of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`blank-${i}`} className="p-2"></div>);
        }

        // Date cells
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const cellClasses = `flex items-center justify-center h-8 w-8 rounded-full cursor-pointer transition-colors ${
                isToday ? 'bg-primary-300 text-primary-800 font-bold' : 'hover:bg-primary-100'
            }`;
            cells.push(
                <div key={day} className="flex justify-center items-center">
                    <div className={cellClasses}>{day}</div>
                </div>
            );
        }
        return (
             <div className="grid grid-cols-7 gap-y-1 text-sm">
                {cells}
            </div>
        );
    };

    return (
        <Card className="w-full max-w-xs mx-auto">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </Card>
    );
};

export default Calendar;