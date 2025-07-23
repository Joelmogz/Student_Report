import React, { useEffect, useState } from 'react';
import { getProfile, getMyMarks, deleteMarks } from '../services/api';
import MarksTable from '../components/MarksTable';
import { toast } from 'sonner';

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    getProfile().then(res => setProfile(res.data));
    getMyMarks().then(res => setMarks(res.data));
  }, []);

  // Example edit/delete/remark handlers for MarksTable
  const handleEditMark = (mark) => {
    toast.info(`Edit mark for subject: ${mark.subject}`);
  };
  const handleDeleteMark = async (mark) => {
    try {
      await deleteMarks(mark._id);
      setMarks(marks.filter(m => m._id !== mark._id));
      toast.success(`Deleted mark for subject: ${mark.subject}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete mark');
    }
  };
  const handleRemarkMark = (mark) => {
    toast.info(`Remark for subject: ${mark.subject}`);
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[80vh] bg-base-100">
      <div className="card w-full max-w-3xl bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-2xl font-bold mb-4">Student Dashboard</h2>
        {profile && (
          <div className="mb-6">
            <p><span className="font-semibold">Name:</span> {profile.fullName}</p>
            <p><span className="font-semibold">Email:</span> {profile.email}</p>
            <p><span className="font-semibold">Status:</span> {profile.status}</p>
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">My Marks</h3>
        <MarksTable marks={marks} onEdit={handleEditMark} onDelete={handleDeleteMark} onRemark={handleRemarkMark} />
      </div>
    </div>
  );
}

export default StudentDashboard;
