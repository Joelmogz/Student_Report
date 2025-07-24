import React, { useEffect, useState, useCallback } from 'react';
import { getProfile, getMyMarks, deleteMarks, createReevalRequest, getMyReevalRequests } from '../services/api';
import MarksTable from '../components/MarksTable';
import { toast } from 'sonner';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { useTheme } from 'next-themes';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [marks, setMarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showReevalModal, setShowReevalModal] = useState(false);
  const [selectedMark, setSelectedMark] = useState(null);
  const [reevalReason, setReevalReason] = useState('');
  const [reevalRequests, setReevalRequests] = useState([]);
  const { theme, setTheme } = useTheme();

  // Track last seen marks and remarks in localStorage
  useEffect(() => {
    if (marks.length === 0) return;
    const lastSeen = JSON.parse(localStorage.getItem('lastSeenMarks') || '{}');
    const newNotifications = [];
    marks.forEach(mark => {
      const lastSeenMark = lastSeen[mark._id];
      // New mark
      if (!lastSeenMark) {
        newNotifications.push({
          type: 'new_mark',
          subject: mark.subject,
          message: `New mark added for ${mark.subject}: ${mark.marks}`
        });
      } else {
        // New or updated remark
        if (mark.remarks && mark.remarks !== lastSeenMark.remarks) {
          newNotifications.push({
            type: 'new_remark',
            subject: mark.subject,
            message: `New remark for ${mark.subject}: ${mark.remarks}`
          });
        }
      }
    });
    setNotifications(newNotifications);
    // Update last seen
    const updatedLastSeen = {};
    marks.forEach(mark => {
      updatedLastSeen[mark._id] = { remarks: mark.remarks };
    });
    localStorage.setItem('lastSeenMarks', JSON.stringify(updatedLastSeen));
  }, [marks]);

  useEffect(() => {
    getProfile().then(res => setProfile(res.data));
    getMyMarks().then(res => setMarks(res.data));
  }, []);

  // Fetch student's re-evaluation requests
  useEffect(() => {
    getMyReevalRequests().then(res => setReevalRequests(res.data)).catch(() => setReevalRequests([]));
  }, []);

  // Calculate analytics
  const marksValues = marks.map(m => m.marks).filter(m => typeof m === 'number');
  const averageMark = marksValues.length ? (marksValues.reduce((a, b) => a + b, 0) / marksValues.length).toFixed(2) : '--';
  const bestMark = marksValues.length ? Math.max(...marksValues) : '--';
  const worstMark = marksValues.length ? Math.min(...marksValues) : '--';

  // Chart data for marks by subject
  const chartData = {
    labels: marks.map(m => m.subject),
    datasets: [
      {
        label: 'Marks',
        data: marks.map(m => m.marks),
        backgroundColor: 'rgba(59, 130, 246, 0.5)', // Tailwind blue-500
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Marks by Subject' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

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

  // Handler for re-evaluation request
  const handleRequestReeval = (mark) => {
    setSelectedMark(mark);
    setReevalReason('');
    setShowReevalModal(true);
  };
  const handleSubmitReeval = async () => {
    if (!selectedMark) return;
    try {
      await createReevalRequest({
        marks: selectedMark._id,
        subject: selectedMark.subject,
        reason: reevalReason,
      });
      toast.success('Re-evaluation request submitted!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit re-evaluation request');
    }
    setShowReevalModal(false);
    setSelectedMark(null);
    setReevalReason('');
  };
  // Accessibility: Close modal on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && showReevalModal) {
      setShowReevalModal(false);
      setSelectedMark(null);
    }
  }, [showReevalModal]);
  useEffect(() => {
    if (showReevalModal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showReevalModal, handleKeyDown]);

  // Export marks as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('My Marks', 14, 16);
    doc.autoTable({
      head: [['Subject', 'Marks', 'Grade', 'Remarks']],
      body: marks.map(m => [m.subject, m.marks, m.grade, m.remarks || '']),
      startY: 22,
    });
    doc.save('marks.pdf');
  };

  // Export marks as CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(
      marks.map(m => ({
        Subject: m.subject,
        Marks: m.marks,
        Grade: m.grade,
        Remarks: m.remarks || '',
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'marks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[80vh] bg-base-100">
      <div className="card w-full max-w-3xl bg-base-200 shadow-xl p-6">
        <h2 className="card-title text-2xl font-bold mb-4">Student Dashboard</h2>
        {/* Profile Management Section */}
        {profile && (
          <div className="mb-6">
            <p><span className="font-semibold">Name:</span> {profile.fullName}</p>
            <p><span className="font-semibold">Email:</span> {profile.email}</p>
            <p><span className="font-semibold">Status:</span> {profile.status}</p>
            {/* TODO: Add 'Edit Profile' button to open profile management modal */}
            <button className="btn btn-sm btn-primary mt-2">Edit Profile</button>
          </div>
        )}

        {/* Marks Analytics Section */}
        <div className="mb-6">
          {/* Summary cards (average, best/worst, etc.) */}
          <div className="flex gap-4 mb-2">
            <div className="card bg-base-300 p-4">Avg: {averageMark}</div>
            <div className="card bg-base-300 p-4">Best: {bestMark}</div>
            <div className="card bg-base-300 p-4">Worst: {worstMark}</div>
          </div>
          {/* Bar Chart for marks by subject */}
          <div className="bg-base-300 p-4 rounded">
            {marks.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="text-center">No data for chart</div>
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          {/* Notifications for new marks, remarks, admin messages */}
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((notif, idx) => (
                <li key={idx} className="alert alert-info">
                  {notif.message}
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-info">No new notifications</div>
          )}
        </div>

        {/* Download/Export Section */}
        <div className="mb-4 flex gap-2">
          {/* PDF/CSV export functionality */}
          <button className="btn btn-sm btn-secondary" aria-label="Export marks as PDF" onClick={handleExportPDF}>Export PDF</button>
          <button className="btn btn-sm btn-secondary" aria-label="Export marks as CSV" onClick={handleExportCSV}>Export CSV</button>
        </div>

        <h3 className="text-lg font-semibold mb-2">My Marks</h3>
        <MarksTable
          marks={marks}
          onEdit={handleEditMark}
          onDelete={handleDeleteMark}
          onRemark={handleRemarkMark}
          renderExtraActions={mark => (
            <button className="btn btn-xs btn-accent" onClick={() => handleRequestReeval(mark)}>
              Request Re-evaluation
            </button>
          )}
        />

        {/* Remarks & Feedback Section */}
        <div className="mt-6">
          {/* Show remarks and add re-evaluation request button/form */}
          <div className="bg-base-300 p-4 rounded mb-4">
            <p>To request a re-evaluation for a mark, use the button in the table above.</p>
          </div>
          {/* Re-evaluation Requests History */}
          <div className="bg-base-300 p-4 rounded">
            <h4 className="font-bold mb-2">My Re-evaluation Requests</h4>
            {reevalRequests.length > 0 ? (
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Admin Remark</th>
                    <th>Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {reevalRequests.map(req => (
                    <tr key={req._id}>
                      <td>{req.subject}</td>
                      <td>{req.reason}</td>
                      <td>{req.status}</td>
                      <td>{req.adminRemark || '-'}</td>
                      <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center">No re-evaluation requests found</div>
            )}
          </div>
        </div>

      {/* Re-evaluation Modal */}
      {showReevalModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div
            className="bg-white p-6 rounded shadow-xl w-full max-w-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Request Re-evaluation Modal"
            tabIndex={-1}
          >
            <h4 className="font-bold mb-2">Request Re-evaluation</h4>
            <p className="mb-4">Subject: {selectedMark?.subject}</p>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder="Reason for re-evaluation (optional)"
              value={reevalReason}
              onChange={e => setReevalReason(e.target.value)}
              rows={3}
            />
            <button className="btn btn-primary w-full" onClick={handleSubmitReeval}>Submit Request</button>
            <button className="btn btn-ghost w-full mt-2" onClick={() => setShowReevalModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      </div>

      {/* Dark Mode & Preferences Section */}
      <div className="fixed bottom-4 right-4">
        {/* Dark mode toggle and preferences */}
        <button
          className="btn btn-sm"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
