
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AttendeeListInput } from './components/AttendeeListInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { Alert } from './components/Alert';
import { checkAttendance } from './services/geminiService';
import type { AttendanceResult, ImageFile } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [attendeeList, setAttendeeList] = useState<string>('');
  const [results, setResults] = useState<AttendanceResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckAttendance = useCallback(async () => {
    if (!imageFile || !attendeeList.trim()) {
      setError('Please upload a photo and provide a list of attendees.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const attendanceResult = await checkAttendance(imageFile, attendeeList);
      setResults(attendanceResult);
    } catch (err) {
      console.error(err);
      setError('Failed to check attendance. The AI model may be unable to process the request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, attendeeList]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-slate-700">
            <div className="flex flex-col gap-6">
              <ImageUploader onImageUpload={setImageFile} />
              <AttendeeListInput value={attendeeList} onChange={setAttendeeList} />
            </div>
            <div className="flex flex-col items-center justify-center space-y-6">
              <button
                onClick={handleCheckAttendance}
                disabled={isLoading || !imageFile || !attendeeList.trim()}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 transition-all duration-300 ease-in-out shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-1"
              >
                {isLoading ? 'Analyzing...' : 'Check Attendance'}
              </button>
              <div className="w-full min-h-[200px] flex items-center justify-center p-4">
                {isLoading && <Spinner />}
                {error && <Alert message={error} />}
                {results && <ResultsDisplay results={results} />}
              </div>
            </div>
          </div>
          <p className="text-center text-slate-500 mt-8 text-sm">
            Powered by Gemini AI. For best results, use clear group photos and provide one full name per line.
          </p>
        </main>
      </div>
    </div>
  );
};

export default App;
