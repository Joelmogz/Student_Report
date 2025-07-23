import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


export default function StudentList({students, onView, onEdit, onDelete}) {

    if(!students ||students.length === 0) {
        return <p className="font-bold text-red-500 text-3xl">No students found</p>

    }

    return (
        <Table>
            <TableCaption className="text-gray-200 font-italic">A list of your students</TableCaption>
            <TableHeader>
                <TableRow className="flex justify-between bg-gray-200 items-center">
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map(student => (
                    <TableRow key={student._id}>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.status}</TableCell>
                        <TableCell>{student.role}</TableCell>
                        <TableCell>
                            {onView && (
                                <Button onClick = {() => onView(student)}>View</Button>
                            )}
                            {onEdit && (
                                <Button onClick = {() => onEdit(student)}>Edit</Button>
                            )}
                            {onDelete && (
                                <Button onClick = {() => onDelete(student)}>Delete</Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};