import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { StudentForm } from './components/StudentForm';
import { StudentList } from './components/StudentList';
import { AttendanceMarker } from './components/AttendanceMarker';
import { AttendanceHistory } from './components/AttendanceHistory';

type Tab = 'students' | 'attendance' | 'history';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('students');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStudentAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const tabs = [
    { id: 'students' as Tab, label: 'Students' },
    { id: 'attendance' as Tab, label: 'Mark Attendance' },
    { id: 'history' as Tab, label: 'History' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Attendance System
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Track and manage student attendance efficiently
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          {activeTab === 'students' && (
            <>
              <StudentForm onStudentAdded={handleStudentAdded} />
              <StudentList refreshTrigger={refreshTrigger} />
            </>
          )}

          {activeTab === 'attendance' && <AttendanceMarker />}

          {activeTab === 'history' && <AttendanceHistory />}
        </div>
      </main>

      <footer className="mt-12 pb-6 text-center text-gray-500 text-sm">
        Built with React, TypeScript, and Supabase
      </footer>
    </div>
  );
}

export default App;
