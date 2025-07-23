import React, { useEffect, useState } from 'react';
import { getAllStudents, getPendingStudents, approveStudent, rejectStudent } from '../services/api';
import StudentList from '../components/StudentList';
import PendingStudents from '../components/PendingStudent';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    getAllStudents().then(res => setStudents(res.data));
    getPendingStudents().then(res => setPending(res.data));
  }, []);

  const handleApprove = async (studentId) => {
    await approveStudent(studentId);
    setPending(pending.filter(s => s._id !== studentId));
  };

  const handleReject = async (studentId, reason) => {
    await rejectStudent(studentId, reason);
    setPending(pending.filter(s => s._id !== studentId));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Pending Students</h3>
      <PendingStudents students={pending} onApprove={handleApprove} onReject={handleReject} />
      <h3>All Students</h3>
      <StudentList students={students} />
    </div>
  );
}

export default AdminDashboard;