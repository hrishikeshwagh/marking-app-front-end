import { Link } from 'react-router-dom';
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/students">Dashboard</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/students">Students</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/add-student">Add Student</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/assignments">Add Assignment</Link>
                        </li>
                    </ul>
                    <Link className="btn btn-danger" to="/logout">Logout</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
