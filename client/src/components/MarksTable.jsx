import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


export default function MarksTable({marks, onEdit, onDelete, onRemark}) {
    if(!marks || marks.length === 0) {
        return <p className="font-bold text-error text-3xl">No Marks found</p>
    }
    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <caption className="text-base-content font-italic mb-2">My Marks</caption>
                <thead>
                    <tr className="bg-base-200">
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Remarks</th>
                        {(onEdit || onDelete || onRemark) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {marks.map(mark => (
                        <tr key={mark._id}>
                            <td>{mark.subject}</td>
                            <td>{mark.marks}</td>
                            <td>{mark.grade}</td>
                            <td>{mark.remarks}</td>
                            {(onEdit || onDelete || onRemark) && (
                                <td className="flex gap-2">
                                    {onEdit && (
                                        <button className="btn btn-warning btn-xs" onClick={() => onEdit(mark)}>Edit</button>
                                    )}
                                    {onDelete && (
                                        <button className="btn btn-error btn-xs" onClick={() => onDelete(mark)}>Delete</button>
                                    )}
                                    {onRemark && (
                                        <button className="btn btn-info btn-xs" onClick={() => onRemark(mark)}>Remark</button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}