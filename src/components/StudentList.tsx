import React, { useEffect, useState } from 'react';
import StudentAssignmentList from './StudentAssignmentsList';
import AddMarks from './AddMarks';
import Modal from './Modal'; // Create this reusable modal component

interface assignment {
    id: number;
    status: string;
    student_it: number;
    title: string;
}

interface Student {
    id: number;
    name: string;
    grade: string;
    assignments: [assignment];
}

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [modalType, setModalType] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://192.168.31.125:8000/api/students')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }
                return response.json();
            })
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h3 className="text-center">Loading...</h3>;
    }

    if (error) {
        return <h3 className="text-center text-danger">{error}</h3>;
    }

    // const isCompleted = student.assignments[0].status === "completed";

    return (
        <div className="container mt-4">
            <h2>Student List</h2>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Grade</th>
                        <th>Assignments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map(student => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.grade}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setModalType("view");
                                        }}
                                    >
                                        View Assignments
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm"
                                        disabled={student?.assignments[0]?.status === "completed"}
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setModalType("add");
                                        }}
                                    >
                                        Add Marks
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">
                                No students found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* View Assignments Modal */}
            {selectedStudent && modalType === "view" && (
                <Modal
                    title={`Assignments for ${selectedStudent.name}`}
                    onClose={() => setSelectedStudent(null)}
                >
                    <StudentAssignmentList
                        studentId={selectedStudent.id}
                        studentName={selectedStudent.name}
                        onClose={() => setSelectedStudent(null)}
                    />
                </Modal>
            )}

            {/* Add Marks Modal */}
            {selectedStudent && modalType === "add" && (
                <Modal
                    title={`Add Marks for ${selectedStudent.name}`}
                    onClose={() => setSelectedStudent(null)}
                >
                    <AddMarks
                        studentId={selectedStudent.id}
                        studentName={selectedStudent.name}
                        onClose={() => setSelectedStudent(null)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default StudentList;
