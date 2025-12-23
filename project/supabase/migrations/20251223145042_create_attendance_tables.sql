/*
  # Student Attendance Management System

  ## New Tables
  
  ### students
  - `id` (uuid, primary key) - Unique identifier for each student
  - `name` (text) - Student's full name
  - `roll_number` (text, unique) - Student's roll/registration number
  - `grade` (text) - Class or grade level
  - `email` (text, optional) - Student's email address
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### attendance
  - `id` (uuid, primary key) - Unique identifier for each attendance record
  - `student_id` (uuid, foreign key) - References students table
  - `date` (date) - Date of attendance
  - `status` (text) - Attendance status: 'present', 'absent', 'late'
  - `notes` (text, optional) - Additional notes or remarks
  - `created_at` (timestamptz) - Record creation timestamp
  
  ## Security
  
  ### Row Level Security
  - RLS enabled on both tables
  - Public read access for demonstration purposes
  - Public write access for demonstration purposes
  
  ### Notes
  - Unique constraint on student_id + date to prevent duplicate attendance records for same day
  - Indexes added for common query patterns (student_id, date)
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  roll_number text UNIQUE NOT NULL,
  grade text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
CREATE POLICY "Allow public read access to students"
  ON students FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to students"
  ON students FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to students"
  ON students FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to students"
  ON students FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to attendance"
  ON attendance FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to attendance"
  ON attendance FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to attendance"
  ON attendance FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to attendance"
  ON attendance FOR DELETE
  TO public
  USING (true);