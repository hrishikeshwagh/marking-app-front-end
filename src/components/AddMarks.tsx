import React, { useState, useEffect } from "react";

interface Marks {
    component_id: number;
    marks_obtained: number;
}

interface Assignment {
    id: number;
    student_id: number;
    title: string;
    status: string;
    grade: string;
    marks: Marks[];
}

interface Task {
    student_id: number;
    assignments: Assignment[];
}

interface StudentAssignmentListProps {
    studentId: number;
    studentName: string;
    onClose: () => void;
}

const AddMarks: React.FC<StudentAssignmentListProps> = ({ studentId, studentName, onClose }) => {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [updatedMarks, setUpdatedMarks] = useState<Marks[]>([]);

    useEffect(() => {
        fetch(`http://192.168.31.125:8000/api/assignments/student/${studentId}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch assignments");
                return response.json();
            })
            .then((data) => {
                setTask(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [studentId]);

    // Open the popup and initialize marks (either add or edit)
    const openEditModal = (assignment: Assignment) => {
        setSelectedAssignment(assignment);

        if (assignment.marks.length > 0) {
            // If marks exist, allow editing
            setUpdatedMarks([...assignment.marks]);
        } else {
            // If no marks exist, initialize with empty values
            setUpdatedMarks([
                { component_id: 1, marks_obtained: 0 },
                { component_id: 2, marks_obtained: 0 },
                { component_id: 3, marks_obtained: 0 },
                { component_id: 4, marks_obtained: 0 },
            ]);
        }
    };

    // Handle input change for marks
    const handleMarksChange = (componentId: number, value: number) => {
        setUpdatedMarks((prevMarks) =>
            prevMarks.map((mark) =>
                mark.component_id === componentId ? { ...mark, marks_obtained: value } : mark
            )
        );
    };

    // Save or Add marks to the API
    const saveMarks = async () => {
        if (!selectedAssignment) return;

        try {
            const response = await fetch("http://192.168.31.125:8000/api/store-marks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignment_id: selectedAssignment.id,
                    student_id: studentId,
                    marks: updatedMarks,
                }),
            });

            if (!response.ok) throw new Error("Failed to update/add marks");

            // Update UI with the new marks
            setTask((prevTask) => {
                if (!prevTask) return prevTask;
                return {
                    ...prevTask,
                    assignments: prevTask.assignments.map((assignment) =>
                        assignment.id === selectedAssignment.id
                            ? { ...assignment, marks: updatedMarks }
                            : assignment
                    ),
                };
            });

            alert("Marks saved successfully!");
            setSelectedAssignment(null); // Close modal
        } catch (error) {
            alert("Error saving marks.");
            console.error("Update Error:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Assignments for {studentName}</h3>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}

            {task && task.assignments.length > 0 ? (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Grade</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {task.assignments.map((assignment) => (
                            <tr key={assignment.id}>
                                <td>{assignment.title}</td>
                                <td>{assignment.status}</td>
                                <td>{assignment.grade}</td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => openEditModal(assignment)}>
                                        {assignment.marks.length > 0 ? "Edit Marks" : "Add Marks"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No assignments found.</p>
            )}

            <button className="btn btn-secondary mt-3" onClick={onClose}>
                Close
            </button>

            {/* Popup Modal for Adding/Editing Marks */}
            {selectedAssignment && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedAssignment.marks.length > 0 ? "Edit Marks" : "Add Marks"} - {selectedAssignment.title}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedAssignment(null)}></button>
                            </div>
                            <div className="modal-body">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Component</th>
                                            <th>Marks Obtained</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {updatedMarks.map((mark, index) => (
                                            <tr key={mark.component_id}>
                                                <td>Component {index + 1}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={mark.marks_obtained}
                                                        onChange={(e) =>
                                                            handleMarksChange(mark.component_id, Number(e.target.value))
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={saveMarks}>
                                    Save
                                </button>
                                <button className="btn btn-secondary" onClick={() => setSelectedAssignment(null)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMarks;
