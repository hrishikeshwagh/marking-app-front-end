import React, { useState, useEffect } from 'react';

interface marks {
    component_id: number;
    marks_obtained: number;
}

interface assignment {
    id: number;
    student_id: number;
    title: string;
    status: string;
    total_marks_obtained: number;
    grade: string;
    marks: [marks];
}

interface Assignment {
    studentId: number;
    assignments: [assignment];
}

interface StudentAssignmentListProps {
    studentId: number;
    studentName: string;
    onClose: () => void;
}

const StudentAssignmentList: React.FC<StudentAssignmentListProps> = ({ studentId, studentName, onClose }) => {
    const [task, setTask] = useState<Assignment>();
    const [assignmentLength, setAssignmentLength] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`http://192.168.31.125:8000/api/assignments/student/${studentId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch assignments');
                }
                return response.json();
            })
            .then(data => {
                setTask(data);
                setAssignmentLength(data.assignments.length);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [studentId]);

    return (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Assignments for {studentName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : assignmentLength > 0 ? (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>comp_1</th>
                                        <th>comp_2</th>
                                        <th>comp_3</th>
                                        <th>comp_4</th>
                                        <th>Total Marks</th>
                                        <th>Grade</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {task?.assignments.map(assignment => (
                                        <tr key={assignment.id}>
                                            <td>{assignment.title}</td>
                                            <td>{assignment.marks.find(m => m.component_id === 1)?.marks_obtained || '-'}</td>
                                            <td>{assignment.marks.find(m => m.component_id === 2)?.marks_obtained || '-'}</td>
                                            <td>{assignment.marks.find(m => m.component_id === 3)?.marks_obtained || '-'}</td>
                                            <td>{assignment.marks.find(m => m.component_id === 4)?.marks_obtained || '-'}</td>
                                            <td>{assignment.total_marks_obtained}</td>
                                            <td>{assignment.grade}</td>
                                            <td>{assignment.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No assignments found for this student.</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default StudentAssignmentList;
