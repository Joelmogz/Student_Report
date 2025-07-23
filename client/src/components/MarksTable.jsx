import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


export default function MarksTable({marks, onEdit, onDelete, onRemark}) {

    if(!marks || marks.length === 0) {
        return <p className="font-bold text-red-500 text-3xl">No Marks found</p>

    }

    return (
        <Table>
            <TableCaption className="text-gray-200 font-italic">My Marks</TableCaption>
            <TableHeader className="flex justify-between bg-gray-200 items-center">
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Remarks</TableHead>
                    {onEdit || onDelete || onRemark ?<TableHead>Actions</TableHead> : null }
                </TableRow>
            </TableHeader>
            <TableBody>
                {marks.map(student => (
                    <TableRow key={mark._id}>
                        <TableCell>{mark.subject}</TableCell>
                        <TableCell>{marks.marks}</TableCell>
                        <TableCell>{mark.grade}</TableCell>
                        <TableCell>{mark.remarks}</TableCell>
                        <TableCell>
                            {onEdit && (
                                <Button onClick = {() => onEdit(mark)}>Edit</Button>
                            )}
                            {onDelete && (
                                <Button onClick = {() => onDelete(mark)}>Delete</Button>
                            )}
                            {onRemark && (
                                <Button onClick = {() => onView(mark)}>Remark</Button>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};