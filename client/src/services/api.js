import axios from 'axios';

// Set your backend base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Admin: Pending students
export const getPendingStudents = () => API.get('/auth/pending');
export const approveStudent = (studentId) => API.patch(`/auth/approve/${studentId}`);
export const rejectStudent = (studentId, reason) => API.patch(`/auth/reject/${studentId}`, { reason });

// Student
export const getProfile = () => API.get('/students/me');
export const getMyMarks = () => API.get('/students/me/marks');

// Admin: Students
export const getAllStudents = () => API.get('/students');
export const getStudentById = (studentId) => API.get(`/students/${studentId}`);
export const updateStudent = (studentId, data) => API.patch(`/students/${studentId}`, data);
export const removeStudent = (studentId) => API.delete(`/students/${studentId}`);
export const giveRemarks = (marksId, remarks) => API.patch(`/students/marks/${marksId}/remarks`, { remarks });

// Marks
export const createMarks = (data) => API.post('/marks', data);
export const updateMarks = (marksId, data) => API.patch(`/marks/${marksId}`, data);
export const deleteMarks = (marksId) => API.delete(`/marks/${marksId}`);
export const getMarksByStudent = (studentId) => API.get(`/marks/student/${studentId}`);

// Re-evaluation Requests
export const createReevalRequest = (data) => API.post('/reevaluation-requests', data);
export const getAllReevalRequests = () => API.get('/reevaluation-requests');
export const getMyReevalRequests = () => API.get('/reevaluation-requests/my');
export const updateReevalRequestStatus = (id, status, adminRemark) => API.patch(`/reevaluation-requests/${id}/status`, { status, adminRemark });

export default API;