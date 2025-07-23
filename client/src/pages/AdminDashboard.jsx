import React, { useEffect, useState } from 'react';
import { getAllStudents, getPendingStudents, approveStudent, rejectStudent, removeStudent, getStudentById } from '../services/api';
import StudentList from '../components/StudentList';
import PendingStudents from '../components/PendingStudent';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    getAllStudents().then(res => setStudents(res.data));
    getPendingStudents().then(res => setPending(res.data));
  }, []);

  const handleApprove = async (studentId) => {
    try {
      await approveStudent(studentId);
      setPending(pending.filter(s => s._id !== studentId));
      toast.success('Student approved successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve student');
    }
  };

  const handleReject = async (studentId, reason) => {
    try {
      await rejectStudent(studentId, reason);
      setPending(pending.filter(s => s._id !== studentId));
      toast.success('Student rejected successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject student');
    }
  };

  const handleEditStudent = (student) => {
    toast.info(`Edit student: ${student.fullName}`);
  };
  const handleDeleteStudent = async (student) => {
    try {
      await removeStudent(student._id);
      setStudents(students.filter(s => s._id !== student._id));
      toast.success(`Deleted student: ${student.fullName}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete student');
    }
  };

  const handleViewStudent = async (student) => {
    try {
      const res = await getStudentById(student._id);
      setSelectedStudent(res.data);
      setShowModal(true);
    } catch (err) {
      toast.error('Failed to fetch student details',err);
    }
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      try {
        await approveStudent(id);
        setPending(pending => pending.filter(s => s._id !== id));
        toast.success(`Approved student ${id}`);
      } catch (err) {
        toast.error(`Failed to approve student ${id}`);
      }
    }
  };
  const handleBulkReject = async () => {
    const reason = prompt('Enter rejection reason for all selected:');
    for (const id of selectedIds) {
      try {
        await rejectStudent(id, reason);
        setPending(pending => pending.filter(s => s._id !== id));
        toast.success(`Rejected student ${id}`);
      } catch (err) {
        toast.error(`Failed to reject student ${id}`);
      }
    }
  };
  const handleBulkDelete = async () => {
    for (const id of selectedIds) {
      try {
        await removeStudent(id);
        setStudents(students => students.filter(s => s._id !== id));
        toast.success(`Deleted student ${id}`);
      } catch (err) {
        toast.error(`Failed to delete student ${id}`);
      }
    }
  };

  // Filter students by search and status
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Full Name', 'Email', 'Status', 'Role', 'Registered'];
    const rows = filteredStudents.map(s => [
      s.fullName,
      s.email,
      s.status,
      s.role,
      new Date(s.createdAt).toLocaleString()
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'students.csv');
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[80vh] bg-base-100">
      <div className="card w-full max-w-4xl bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-2xl font-bold mb-4">Admin Dashboard</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            className="input input-bordered w-full md:w-1/2"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered w-full md:w-1/4"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="btn btn-outline md:w-1/4" onClick={handleExportCSV}>Export to CSV</button>
        </div>
        <h3 className="text-lg font-semibold mb-2">Pending Students</h3>
        <PendingStudents students={pending} onApprove={handleApprove} onReject={handleReject} />
        <h3 className="text-lg font-semibold mt-8 mb-2">All Students</h3>
        <StudentList students={filteredStudents} onView={handleViewStudent} onEdit={handleEditStudent} onDelete={handleDeleteStudent} onSelectionChange={setSelectedIds} />
        {selectedIds.length > 0 && (
          <div className="flex gap-2 justify-center mt-4">
            <button className="btn btn-success btn-sm" onClick={handleBulkApprove}>Bulk Approve</button>
            <button className="btn btn-error btn-sm" onClick={handleBulkReject}>Bulk Reject</button>
            <button className="btn btn-warning btn-sm" onClick={handleBulkDelete}>Bulk Delete</button>
          </div>
        )}
      </div>
      {showModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-base-100 p-8 rounded-lg shadow-lg w-full max-w-md relative">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setShowModal(false)}>✕</button>
            <h2 className="text-xl font-bold mb-4">Student Details</h2>
            <p><span className="font-semibold">Name:</span> {selectedStudent.fullName}</p>
            <p><span className="font-semibold">Email:</span> {selectedStudent.email}</p>
            <p><span className="font-semibold">Status:</span> {selectedStudent.status}</p>
            <p><span className="font-semibold">Role:</span> {selectedStudent.role}</p>
            <p><span className="font-semibold">Registered:</span> {new Date(selectedStudent.createdAt).toLocaleString()}</p>
            {/* Add more details/actions as needed */}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;