import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


export default function PendingStudents({students,onApprove , onReject }) {

    if(!students ||students.length === 0) {
        return <p className="font-bold text-red-500 text-3xl">No Pending found</p>

    }

    return (
        <Table>
            <TableCaption className="text-gray-200 font-italic">A list of pending students</TableCaption>
            <TableHeader>
                <TableRow className="flex justify-between bg-gray-200 items-center">
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead> Registered</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map(student => (
                    <TableRow key={student._id}>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <td>{new Date(student.createdAt).toLocaleString()}</td>
                        <TableCell>
                            {onApprove && (
                                <Button onClick = {() => onApprove(student)}>Approve</Button>
                            )}
                            {onReject && (
                                <Button onClick = {() => {
                                const reason = prompt('Enter rejection reason:');
                                if(reason) onReject(student._id, reason);
                                }}>Reject</Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};