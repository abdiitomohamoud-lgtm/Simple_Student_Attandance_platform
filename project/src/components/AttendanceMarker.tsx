import { useEffect, useState } from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Student, AttendanceStatus } from '../types/database';

export function AttendanceMarker() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [selectedDate]);

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('roll_number');

      if (studentsError) throw studentsError;

      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', selectedDate);

      if (attendanceError) throw attendanceError;

      setStudents(studentsData || []);

      const attendanceMap: Record<string, AttendanceStatus> = {};
      attendanceData?.forEach((record) => {
        attendanceMap[record.student_id] = record.status;
      });
      setAttendance(attendanceMap);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));

    try {
      const { error } = await supabase.from('attendance').upsert(
        {
          student_id: studentId,
          date: selectedDate,
          status,
        },
        {
          onConflict: 'student_id,date',
        }
      );

      if (error) throw error;

      setSaveStatus('Saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      console.error('Error saving attendance:', err);
      setSaveStatus('Error saving');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const getStatusButton = (
    studentId: string,
    status: AttendanceStatus,
    icon: React.ReactNode,
    label: string,
    colorClass: string
  ) => {
    const isSelected = attendance[studentId] === status;
    return (
      <button
        onClick={() => markAttendance(studentId, status)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          isSelected
            ? colorClass
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
        </div>
        {saveStatus && (
          <span className="text-sm text-green-600 font-medium">{saveStatus}</span>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {students.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No students found. Please add students first.
        </p>
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="font-medium text-gray-800">{student.name}</div>
                <div className="text-sm text-gray-500">
                  {student.roll_number} • {student.grade}
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusButton(
                  student.id,
                  'present',
                  <Check className="w-4 h-4" />,
                  'Present',
                  'bg-green-100 text-green-700 hover:bg-green-200'
                )}
                {getStatusButton(
                  student.id,
                  'absent',
                  <X className="w-4 h-4" />,
                  'Absent',
                  'bg-red-100 text-red-700 hover:bg-red-200'
                )}
                {getStatusButton(
                  student.id,
                  'late',
                  <Clock className="w-4 h-4" />,
                  'Late',
                  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
