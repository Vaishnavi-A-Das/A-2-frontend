import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';
const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE || 'https://a-2-backend-1.onrender.com'}/students`,
          { timeout: 5000 }
        );
        setStudents(response.data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', {
          message: err.message,
          response: err.response?.data
        });
        setError(err.response?.data?.message || err.message || 'Failed to load students');
        toast.error('Failed to load student data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE || 'https://a-2-backend-1.onrender.com'}/students/${id}`,
        { timeout: 5000 }
      );
      setStudents(students.filter((student) => student._id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      console.error('Delete error:', {
        message: err.message,
        response: err.response?.data
      });
      toast.error(
        err.response?.data?.message || 
        err.message || 
        'Failed to delete student'
      );
    }
  };

  if (isLoading) return <div className="container">Loading students...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Student List</h2>
        <Link to="/add" className="btn btn-primary">
          Add New Student
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>{student.year}</td>
                <td>
                  <div className="btn-group">
                    <button
                      onClick={() => navigate(`/edit/${student._id}`)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {students.length === 0 && (
        <div className="alert alert-info">No students found</div>
      )}
    </div>
  );
};

export default StudentList;
