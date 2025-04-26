import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: '',
    email: '',
    course: '',
    year: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE || 'https://a-2-backend-1.onrender.com'}/students/${id}`,
          { timeout: 5000 }
        );
        setStudent(response.data);
      } catch (err) {
        console.error('Fetch error:', {
          message: err.message,
          response: err.response?.data
        });
        toast.error(`Failed to load student: ${err.response?.data?.message || err.message}`);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE || 'https://a-2-backend-1.onrender.com'}/students/${id}`,
        student,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        }
      );

      toast.success('Student updated successfully!');
      navigate('/');
    } catch (err) {
      console.error('Update error:', {
        message: err.message,
        config: err.config,
        response: err.response?.data
      });
      toast.error(
        err.response?.data?.message || 
        err.message || 
        'Failed to update student'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="container">Loading student data...</div>;

  return (
    <div className="container">
      <h2>Edit Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={student.course}
            onChange={handleChange}
            placeholder="Course"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={student.year}
            onChange={handleChange}
            placeholder="Year"
            min="1"
            max="5"
            required
            className="form-control"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Student'}
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
