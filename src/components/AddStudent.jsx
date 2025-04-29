import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css';

const AddStudent = () => {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    course: '',
    year: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const baseUrl = (process.env.REACT_APP_API_BASE || 'https://a-2-backend-1.onrender.com').replace(/\/$/, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (student.year < 1 || student.year > 5) {
      toast.error('Year must be between 1 and 5');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting student data:', student);

      const response = await axios.post(
        `${baseUrl}/students`,
        student,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      console.log('API Response:', response);
      toast.success('Student added successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error details:', {
        message: err.message,
        config: err.config,
        response: err.response?.data
      });

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Failed to add student'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Course</label>
          <input
            type="text"
            name="course"
            value={student.course}
            onChange={handleChange}
            placeholder="Enter course"
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={student.year}
            onChange={handleChange}
            placeholder="Enter year"
            min="1"
            max="5"
            required
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
