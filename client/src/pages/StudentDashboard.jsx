import React, { useEffect, useState } from 'react';
import { getProfile, getMyMarks } from '../services/api';
import MarksTable from '../components/MarksTable';

function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    getProfile().then(res => setProfile(res.data));
    getMyMarks().then(res => setMarks(res.data));
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>
      {profile && (
        <div>
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Status:</strong> {profile.status}</p>
        </div>
      )}
      <h3>My Marks</h3>
      <MarksTable marks={marks} />
    </div>
  );
}

export default StudentDashboard;
