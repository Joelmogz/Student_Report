import React, { useState, useEffect } from 'react';

export default function StudentList({ students, onView, onEdit, onDelete, onSelectionChange }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const pageSize = 5;

  useEffect(() => {
    if (onSelectionChange) onSelectionChange(selected);
  }, [selected, onSelectionChange]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedStudents = React.useMemo(() => {
    if (!sortConfig.key) return students;
    const sorted = [...students].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [students, sortConfig]);

  const totalPages = Math.ceil(sortedStudents.length / pageSize);
  const paginatedStudents = sortedStudents.slice((page - 1) * pageSize, page * pageSize);

  const allSelected = paginatedStudents.length > 0 && paginatedStudents.every(s => selected.includes(s._id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(selected.filter(id => !paginatedStudents.some(s => s._id === id)));
    } else {
      setSelected([
        ...selected,
        ...paginatedStudents.filter(s => !selected.includes(s._id)).map(s => s._id)
      ]);
    }
  };

  const toggleSelect = (id) => {
    setSelected(selected =>
      selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id]
    );
  };

  if (!students || students.length === 0) {
    return <p className="font-bold text-error text-3xl">No students found</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <caption className="text-base-content font-italic mb-2">A list of your students</caption>
        <thead>
          <tr className="bg-base-200">
            <th>
              <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('fullName')}>
              Full Name {sortConfig.key === 'fullName' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('email')}>
              Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('status')}>
              Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th className="cursor-pointer" onClick={() => handleSort('role')}>
              Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStudents.map(student => (
            <tr key={student._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(student._id)}
                  onChange={() => toggleSelect(student._id)}
                />
              </td>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.status}</td>
              <td>{student.role}</td>
              <td className="flex gap-2">
                {onView && (
                  <button className="btn btn-info btn-xs" onClick={() => onView(student)}>View</button>
                )}
                {onEdit && (
                  <button className="btn btn-warning btn-xs" onClick={() => onEdit(student)}>Edit</button>
                )}
                {onDelete && (
                  <button className="btn btn-error btn-xs" onClick={() => onDelete(student)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {selected.length > 0 && (
        <div className="flex gap-2 justify-center mt-4">
          <span className="font-semibold">Selected: {selected.length}</span>
        </div>
      )}
    </div>
  );
}