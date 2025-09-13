
import React from 'react';

interface ProgressBarProps {
    current: number;
    max: number;
    color: string;
    label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, color, label }) => {
    const percentage = max > 0 ? (current / max) * 100 : 0;

    return (
        <div className="w-full">
            {label && <div className="text-xs font-bold mb-1 uppercase tracking-wider text-gray-400">{label}</div>}
            <div className="w-full bg-gray-700 rounded-full h-4 shadow-inner overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
             <div className="text-right text-xs font-semibold text-gray-300 mt-1">
                {current} / {max}
            </div>
        </div>
    );
};

export default ProgressBar;
   