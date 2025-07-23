import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


export default function PendingStudents({students, onApprove, onReject}) {
    if(!students || students.length === 0) {
        return <p className="font-bold text-error text-3xl">No Pending found</p>
    }
    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <caption className="text-base-content font-italic mb-2">A list of pending students</caption>
                <thead>
                    <tr className="bg-base-200">
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Registered</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.fullName}</td>
                            <td>{student.email}</td>
                            <td>{new Date(student.createdAt).toLocaleString()}</td>
                            <td className="flex gap-2">
                                {onApprove && (
                                    <button className="btn btn-success btn-xs" onClick={() => onApprove(student._id)}>Approve</button>
                                )}
                                {onReject && (
                                    <button className="btn btn-error btn-xs" onClick={() => {
                                        const reason = prompt('Enter rejection reason:');
                                        if(reason) onReject(student._id, reason);
                                    }}>Reject</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}