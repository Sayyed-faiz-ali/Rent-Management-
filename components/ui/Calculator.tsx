import React, { useState } from 'react';
import Card from './Card';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplay(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clearDisplay = () => {
        setDisplay('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (operator && !waitingForSecondOperand) {
            const result = calculate(firstOperand!, inputValue, operator);
            setDisplay(String(result));
            setFirstOperand(result);
        } else {
            setFirstOperand(inputValue);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (first: number, second: number, op: string): number => {
        switch (op) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': return second === 0 ? Infinity : first / second;
            default: return second;
        }
    };

    const handleEquals = () => {
        const inputValue = parseFloat(display);
        if (operator && firstOperand !== null) {
            if (waitingForSecondOperand) return; // Prevent equals being hit multiple times
            const result = calculate(firstOperand, inputValue, operator);
            setDisplay(String(result));
            setFirstOperand(result);
            setOperator(null);
            setWaitingForSecondOperand(true);
        }
    };
    
    const ButtonComponent = ({ onClick, label, className = '' } : { onClick: () => void, label: string, className?: string }) => (
        <button onClick={onClick} className={`text-xl font-semibold rounded-lg p-3 transition-colors duration-200 ${className}`}>
            {label}
        </button>
    );

    return (
        <Card className="w-full max-w-xs mx-auto flex flex-col">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">Calculator</h3>
            <div className="bg-slate-800 text-white text-4xl font-mono text-right p-4 rounded-lg mb-4 break-all h-20 flex items-end justify-end">
                {display}
            </div>
            <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <ButtonComponent onClick={clearDisplay} label="C" className="col-span-2 bg-red-200 hover:bg-red-300 text-red-800" />
                <ButtonComponent onClick={() => performOperation('/')} label="÷" className="bg-primary-200 hover:bg-primary-300 text-primary-800" />
                <ButtonComponent onClick={() => performOperation('*')} label="×" className="bg-primary-200 hover:bg-primary-300 text-primary-800" />

                {/* Row 2 */}
                <ButtonComponent onClick={() => inputDigit('7')} label="7" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => inputDigit('8')} label="8" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => inputDigit('9')} label="9" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => performOperation('-')} label="-" className="bg-primary-200 hover:bg-primary-300 text-primary-800" />

                {/* Row 3 */}
                <ButtonComponent onClick={() => inputDigit('4')} label="4" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => inputDigit('5')} label="5" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => inputDigit('6')} label="6" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => performOperation('+')} label="+" className="bg-primary-200 hover:bg-primary-300 text-primary-800" />

                {/* Row 4 & 5 */}
                <ButtonComponent onClick={() => inputDigit('1')} label="1" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => inputDigit('2')} label="2" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={() => inputDigit('3')} label="3" className="bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={handleEquals} label="=" className="row-span-2 bg-primary-500 hover:bg-primary-600 text-white" />

                <ButtonComponent onClick={() => inputDigit('0')} label="0" className="col-span-2 bg-slate-200 hover:bg-slate-300" />
                <ButtonComponent onClick={inputDecimal} label="." className="bg-slate-200 hover:bg-slate-300" />
            </div>
        </Card>
    );
};

export default Calculator;
