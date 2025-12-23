export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          name: string;
          roll_number: string;
          grade: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          roll_number: string;
          grade: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          roll_number?: string;
          grade?: string;
          email?: string | null;
          created_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late';
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Student = Database['public']['Tables']['students']['Row'];
export type AttendanceRecord = Database['public']['Tables']['attendance']['Row'];
export type AttendanceStatus = 'present' | 'absent' | 'late';
