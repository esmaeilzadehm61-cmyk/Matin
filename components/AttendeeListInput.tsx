
import React from 'react';

interface AttendeeListInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AttendeeListInput: React.FC<AttendeeListInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="attendee-list" className="block text-sm font-medium text-slate-300">
        2. Enter Attendee Names
      </label>
      <div className="mt-2">
        <textarea
          id="attendee-list"
          name="attendee-list"
          rows={8}
          className="block w-full rounded-md border-0 bg-slate-800 py-2 px-3 text-slate-200 shadow-sm ring-1 ring-inset ring-slate-700 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
          placeholder="Enter one name per line..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">Provide the full names of everyone expected to be present.</p>
    </div>
  );
};
