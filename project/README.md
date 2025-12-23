# Student Attendance System

A modern web application for tracking and managing student attendance efficiently. Built with React, TypeScript, and Supabase for real-time data synchronization.

## Features

- **Student Management**: Add, view, and manage student information including roll numbers, grades, and email addresses
- **Attendance Tracking**: Mark student attendance as present, absent, or late with optional notes
- **Attendance History**: View comprehensive attendance records and patterns over time
- **Real-time Sync**: All data is synchronized in real-time across the application
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **User-friendly Interface**: Clean and intuitive UI with easy navigation between different sections

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with PostCSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Lucide React for icons
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abdiitomohamoud-lgtm/Simple_Student_Attandance_platform.git
cd Simple_Student_Attandance_platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the project root and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings.

4. The database migrations are automatically handled. Ensure your Supabase project has the required tables by checking the migrations folder.

### Running the Application

**Development Server:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
```

**Preview Production Build:**
```bash
npm run preview
```

**Type Check:**
```bash
npm run typecheck
```

**Lint Code:**
```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── AttendanceHistory.tsx    # View attendance records
│   ├── AttendanceMarker.tsx     # Mark student attendance
│   ├── StudentForm.tsx          # Add new students
│   └── StudentList.tsx          # List all students
├── lib/
│   └── supabase.ts              # Supabase client configuration
├── types/
│   └── database.ts              # TypeScript database types
├── App.tsx                      # Main application component
├── index.css                    # Global styles
└── main.tsx                     # Application entry point

supabase/
└── migrations/
    └── 20251223145042_create_attendance_tables.sql  # Database schema
```

## Database Schema

### Students Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Student's full name |
| roll_number | text | Unique roll/registration number |
| grade | text | Class or grade level |
| email | text | Student's email (optional) |
| created_at | timestamptz | Record creation timestamp |

### Attendance Table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| student_id | uuid | Foreign key to students table |
| date | date | Attendance date |
| status | text | 'present', 'absent', or 'late' |
| notes | text | Additional notes (optional) |
| created_at | timestamptz | Record creation timestamp |

## Usage Guide

### Adding a Student
1. Navigate to the "Students" tab
2. Fill in the student information form with name, roll number, grade, and optional email
3. Click "Add Student" to save the record

### Marking Attendance
1. Go to the "Mark Attendance" tab
2. Select a student and today's date
3. Choose the attendance status (Present, Absent, or Late)
4. Optionally add notes about the attendance
5. Click "Mark Attendance" to record the entry

### Viewing Attendance History
1. Click on the "History" tab
2. View all attendance records with filters and sorting options
3. Analyze attendance patterns and generate reports if needed

## Security

The application uses Row Level Security (RLS) in Supabase to protect data. Currently configured for demonstration purposes with public read and write access. For production use, implement proper authentication and role-based access control.

## Development Notes

- The application uses React hooks for state management
- Real-time updates are handled through Supabase subscriptions
- TypeScript ensures type safety throughout the codebase
- Tailwind CSS provides utility-first styling

## Future Enhancements

- User authentication and authorization
- Role-based access (teachers, administrators)
- Attendance reports and analytics
- Email notifications for absent students
- Batch import of student data
- Customizable attendance statuses

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please visit the GitHub repository:
https://github.com/abdiitomohamoud-lgtm/Simple_Student_Attandance_platform

---

Built with React, TypeScript, and Supabase
