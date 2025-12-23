import { useEffect, useState } from 'react';
import { Users, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Student } from '../types/database';

interface StudentListProps {
  refreshTrigger: number;
}

export function StudentList({ refreshTrigger }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student? This will also delete all their attendance records.')) {
      return;
    }

    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      fetchStudents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Students ({students.length})
        </h2>
      </div>

      {students.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No students found. Add your first student above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Roll No.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{student.roll_number}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{student.name}</td>
                  <td className="py-3 px-4 text-gray-600">{student.grade}</td>
                  <td className="py-3 px-4 text-gray-600">{student.email || '-'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
