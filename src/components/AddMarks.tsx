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
    const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/assignments/student/${studentId}`)
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

    const openEditModal = (assignment: Assignment) => {
        setSelectedAssignment(assignment);

        if (assignment.marks.length > 0) {
            setUpdatedMarks([...assignment.marks]);
        } else {
            setUpdatedMarks([
                { component_id: 1, marks_obtained: 0 },
                { component_id: 2, marks_obtained: 0 },
                { component_id: 3, marks_obtained: 0 },
                { component_id: 4, marks_obtained: 0 },
            ]);
        }

        setValidationErrors({});
    };

    const handleMarksChange = (componentId: number, value: number) => {
        const limits = {
            1: 40,
            2: 30,
            3: 20,
            4: 10
        } as const;

        setUpdatedMarks((prevMarks) =>
            prevMarks.map((mark) =>
                mark.component_id === componentId ? { ...mark, marks_obtained: value } : mark
            )
        );

        if (value > limits[componentId as keyof typeof limits]) {
            setValidationErrors((prevErrors) => ({
                ...prevErrors,
                [componentId]: `Marks cannot exceed ${limits[componentId as keyof typeof limits]}`
            }));
        } else {
            setValidationErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[componentId];
                return newErrors;
            });
        }
    };

    const saveMarks = async () => {
        if (!selectedAssignment) return;

        if (Object.keys(validationErrors).length > 0) {
            alert("Please correct the errors before saving.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/store-marks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignment_id: selectedAssignment.id,
                    student_id: studentId,
                    marks: updatedMarks,
                }),
            });

            if (!response.ok) throw new Error("Failed to update/add marks");

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
            setSelectedAssignment(null);
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
                                                        placeholder={mark.marks_obtained.toString()}
                                                        onChange={(e) =>
                                                            handleMarksChange(mark.component_id, Number(e.target.value))
                                                        }
                                                    />
                                                    {validationErrors[mark.component_id] && (
                                                        <div className="text-danger">{validationErrors[mark.component_id]}</div>
                                                    )}
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
