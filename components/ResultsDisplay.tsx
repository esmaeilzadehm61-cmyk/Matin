
import React from 'react';
import type { AttendanceResult } from '../types';

interface ResultsDisplayProps {
  results: AttendanceResult;
}

const ResultColumn: React.FC<{ title: string; names: string[]; icon: JSX.Element; color: string }> = ({ title, names, icon, color }) => (
    <div className={`flex-1 min-w-[150px] p-4 rounded-lg bg-slate-800 border border-slate-700`}>
        <h3 className={`flex items-center text-lg font-semibold mb-3 ${color}`}>
            {icon}
            <span className="ml-2">{title} ({names.length})</span>
        </h3>
        {names.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-300">
                {names.map((name, index) => (
                    <li key={index} className="truncate">{name}</li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-slate-500">None</p>
        )}
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="w-full text-left animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-center">Attendance Results</h2>
        <div className="flex flex-col sm:flex-row gap-4">
            <ResultColumn 
                title="Present"
                names={results.present}
                color="text-emerald-400"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
            <ResultColumn 
                title="Absent"
                names={results.absent}
                color="text-rose-400"
                icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                }
            />
        </div>
    </div>
  );
};
