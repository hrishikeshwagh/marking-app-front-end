import React, { useState } from 'react';

const AddAssignment: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Assignment Added:', { title, description });
        alert(`Assignment "${title}" added successfully!`);
        setTitle('');
        setDescription('');
    };

    return (
        <div className="container mt-4">
            <h2>Add Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success">Add Assignment</button>
            </form>
        </div>
    );
};

export default AddAssignment;
