import React, { useEffect, useState } from 'react';
import { getAllStudents, getPendingStudents, approveStudent, rejectStudent, removeStudent, getStudentById, createMarks, getMarksByStudent, updateMarks } from '../services/api';
import StudentList from '../components/StudentList';
import PendingStudents from '../components/PendingStudent';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { BellIcon } from '@heroicons/react/24/outline';

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showGiveMarksModal, setShowGiveMarksModal] = useState(false);
  const [marksForm, setMarksForm] = useState({ subject: '', marks: '', grade: 'A', remarks: '' });
  const [marksStudent, setMarksStudent] = useState(null);
  const [studentMarks, setStudentMarks] = useState([]);
  const [showEditMarksModal, setShowEditMarksModal] = useState(false);
  const [editMarksForm, setEditMarksForm] = useState({ subject: '', marks: '', grade: 'A', remarks: '' });
  const [editMarkId, setEditMarkId] = useState(null);

  // Mock re-evaluation requests
  const [showNotifications, setShowNotifications] = useState(false);
  const mockReevalRequests = [
    { id: 1, student: 'John Doe', subject: 'Math', date: '2024-07-24' },
    { id: 2, student: 'Jane Smith', subject: 'Science', date: '2024-07-23' },
  ];

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
    } catch {
      toast.error('Failed to fetch student details');
    }
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    for (const id of selectedIds) {
      try {
        await approveStudent(id);
        setPending(pending => pending.filter(s => s._id !== id));
        toast.success(`Approved student ${id}`);
      } catch {
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
      } catch {
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
      } catch {
        toast.error(`Failed to delete student ${id}`);
      }
    }
  };

  // Auto-calculate grade
  const calculateGrade = (marks) => {
    if (marks >= 90) return 'A';
    if (marks >= 80) return 'B';
    if (marks >= 70) return 'C';
    if (marks >= 60) return 'D';
    return 'F';
  };

  // Give Marks handlers
  const handleGiveMarks = (student) => {
    setMarksStudent(student);
    setMarksForm({ subject: '', marks: '', grade: 'A', remarks: '' });
    setShowGiveMarksModal(true);
  };
  const handleMarksFormChange = (e) => {
    const { name, value } = e.target;
    setMarksForm(f => {
      if (name === 'marks') {
        const grade = calculateGrade(Number(value));
        return { ...f, marks: value, grade };
      }
      return { ...f, [name]: value };
    });
  };
  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    try {
      await createMarks({
        studentId: marksStudent._id,
        subject: marksForm.subject,
        marks: Number(marksForm.marks),
        grade: marksForm.grade,
        remarks: marksForm.remarks,
      });
      toast.success('Marks given successfully');
      setShowGiveMarksModal(false);
      setMarksStudent(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to give marks');
    }
  };

  // Student details modal: fetch marks
  useEffect(() => {
    if (showModal && selectedStudent) {
      getMarksByStudent(selectedStudent._id).then(res => setStudentMarks(res.data));
    } else {
      setStudentMarks([]);
    }
  }, [showModal, selectedStudent]);

  // Edit Marks handlers
  const handleEditMarks = (mark) => {
    setEditMarkId(mark._id);
    setEditMarksForm({
      subject: mark.subject,
      marks: mark.marks,
      grade: mark.grade,
      remarks: mark.remarks || '',
    });
    setShowEditMarksModal(true);
  };
  const handleEditMarksFormChange = (e) => {
    const { name, value } = e.target;
    setEditMarksForm(f => {
      if (name === 'marks') {
        const grade = calculateGrade(Number(value));
        return { ...f, marks: value, grade };
      }
      return { ...f, [name]: value };
    });
  };
  const handleSubmitEditMarks = async (e) => {
    e.preventDefault();
    try {
      await updateMarks(editMarkId, {
        subject: editMarksForm.subject,
        marks: Number(editMarksForm.marks),
        grade: editMarksForm.grade,
        remarks: editMarksForm.remarks,
      });
      toast.success('Marks updated successfully');
      setShowEditMarksModal(false);
      setEditMarkId(null);
      // Refresh marks
      if (selectedStudent) {
        const res = await getMarksByStudent(selectedStudent._id);
        setStudentMarks(res.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update marks');
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
      {/* Notification Bell */}
      <div className="w-full flex justify-end mb-2 relative">
        <button className="btn btn-ghost btn-circle" aria-label="Show notifications" onClick={() => setShowNotifications(v => !v)}>
          <BellIcon className="h-6 w-6" />
          {(pending.length > 0 || mockReevalRequests.length > 0) && (
            <span className="badge badge-error absolute top-0 right-0">{pending.length + mockReevalRequests.length}</span>
          )}
        </button>
        {showNotifications && (
          <div className="absolute right-0 mt-10 w-80 bg-base-200 shadow-lg rounded-lg z-50 p-4">
            <h4 className="font-bold mb-2">Notifications</h4>
            {pending.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Pending Students:</span> {pending.length}
              </div>
            )}
            {mockReevalRequests.length > 0 && (
              <div>
                <span className="font-semibold">Re-evaluation Requests:</span>
                <ul className="list-disc ml-5">
                  {mockReevalRequests.map(req => (
                    <li key={req.id}>{req.student} requested re-evaluation for {req.subject} ({req.date})</li>
                  ))}
                </ul>
              </div>
            )}
            {pending.length === 0 && mockReevalRequests.length === 0 && (
              <div>No new notifications</div>
            )}
          </div>
        )}
      </div>
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
        <StudentList
          students={filteredStudents}
          onView={handleViewStudent}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onSelectionChange={setSelectedIds}
          onGiveMarks={handleGiveMarks}
        />
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
            {/* Marks List */}
            <h3 className="text-lg font-semibold mt-6 mb-2">Marks</h3>
            {studentMarks.length > 0 ? (
              <table className="table table-zebra w-full mb-4">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMarks.map(mark => (
                    <tr key={mark._id}>
                      <td>{mark.subject}</td>
                      <td>{mark.marks}</td>
                      <td>{mark.grade}</td>
                      <td>{mark.remarks}</td>
                      <td>
                        <button className="btn btn-xs btn-warning" onClick={() => handleEditMarks(mark)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center">No marks found</div>
            )}
          </div>
        </div>
      )}
      {showGiveMarksModal && marksStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form className="bg-white p-6 rounded shadow-xl w-full max-w-sm" onSubmit={handleSubmitMarks}>
            <h4 className="font-bold mb-2">Give Marks to {marksStudent.fullName}</h4>
            <div className="mb-2">
              <label className="block mb-1">Subject</label>
              <input name="subject" className="input input-bordered w-full" value={marksForm.subject} onChange={handleMarksFormChange} required />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Marks</label>
              <input name="marks" type="number" className="input input-bordered w-full" value={marksForm.marks} onChange={handleMarksFormChange} required min="0" />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Grade</label>
              <select name="grade" className="select select-bordered w-full" value={marksForm.grade} onChange={handleMarksFormChange} required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Remarks</label>
              <input name="remarks" className="input input-bordered w-full" value={marksForm.remarks} onChange={handleMarksFormChange} />
            </div>
            <button className="btn btn-primary w-full" type="submit">Submit</button>
            <button className="btn btn-ghost w-full mt-2" type="button" onClick={() => setShowGiveMarksModal(false)}>Cancel</button>
          </form>
        </div>
      )}
      {showEditMarksModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form className="bg-white p-6 rounded shadow-xl w-full max-w-sm" onSubmit={handleSubmitEditMarks}>
            <h4 className="font-bold mb-2">Edit Marks</h4>
            <div className="mb-2">
              <label className="block mb-1">Subject</label>
              <input name="subject" className="input input-bordered w-full" value={editMarksForm.subject} onChange={handleEditMarksFormChange} required />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Marks</label>
              <input name="marks" type="number" className="input input-bordered w-full" value={editMarksForm.marks} onChange={handleEditMarksFormChange} required min="0" />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Grade</label>
              <select name="grade" className="select select-bordered w-full" value={editMarksForm.grade} onChange={handleEditMarksFormChange} required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Remarks</label>
              <input name="remarks" className="input input-bordered w-full" value={editMarksForm.remarks} onChange={handleEditMarksFormChange} />
            </div>
            <button className="btn btn-primary w-full" type="submit">Update</button>
            <button className="btn btn-ghost w-full mt-2" type="button" onClick={() => setShowEditMarksModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;