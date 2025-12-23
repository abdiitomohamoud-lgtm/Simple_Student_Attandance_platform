import { useEffect, useState } from 'react';
import { FileText, Check, X, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Student, AttendanceRecord } from '../types/database';

interface AttendanceWithStudent extends AttendanceRecord {
  student?: Student;
}

export function AttendanceHistory() {
  const [records, setRecords] = useState<AttendanceWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterStudent, setFilterStudent] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filterDate, filterStudent]);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('students')
      .select('*')
      .order('name');

    if (data) setStudents(data);
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          student:students(*)
        `)
        .order('date', { ascending: false });

      if (filterDate) {
        query = query.eq('date', filterDate);
      }

      if (filterStudent) {
        query = query.eq('student_id', filterStudent);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecords(data as AttendanceWithStudent[] || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      present: (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3" />
          Present
        </span>
      ),
      absent: (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3" />
          Absent
        </span>
      ),
      late: (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3" />
          Late
        </span>
      ),
    };
    return badges[status as keyof typeof badges] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterStudent('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Attendance History</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Date
          </label>
          <input
            id="filterDate"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="filterStudent" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Student
          </label>
          <select
            id="filterStudent"
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="">All Students</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.roll_number})
              </option>
            ))}
          </select>
        </div>

        {(filterDate || filterStudent) && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading...</div>
      ) : records.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No attendance records found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Roll No.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{formatDate(record.date)}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {record.student?.name || 'Unknown'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {record.student?.roll_number || '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {record.student?.grade || '-'}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
