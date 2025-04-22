import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API Configuration - Replace with your actual API keys
const NUTRITIONIX_APP_ID = '90e7d4dd';
const NUTRITIONIX_API_KEY = 'b507779a6507465176b49ece39bda091';
const SHEETY_API_URL = 'https://api.sheety.co/2bc84ac6fbd8b74aeb1d38aa96484e5c/workoutTracker/sheet1';

// API Functions
async function getExerciseData(query) {
  try {
    const response = await axios.post(
      'https://trackapi.nutritionix.com/v2/natural/exercise',
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
        },
      }
    );
    
    return response.data.exercises;
  } catch (error) {
    console.error('Error getting exercise data:', error);
    throw new Error('Failed to get exercise data from Nutritionix');
  }
}

async function addWorkoutToSheety(workoutData) {
  try {
    const response = await axios.post(
      SHEETY_API_URL,
      {
        sheet1: workoutData,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data.sheet1;
  } catch (error) {
    console.error('Error adding workout to Sheety:', error);
    throw new Error('Failed to save workout data to Sheety');
  }
}

async function fetchWorkouts() {
  try {
    const response = await axios.get(SHEETY_API_URL);
    return response.data.sheet1 || [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw new Error('Failed to fetch workouts from Sheety');
  }
}

// Components
const WorkoutList = ({ workouts }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!workouts || workouts.length === 0) {
    return (
      <div className="workout-card empty-list">
        <div className="empty-message">
          No workouts found. Add your first workout above!
        </div>
      </div>
    );
  }

  return (
    <div className="workout-card">
      <div className="workout-list">
        {workouts.map((workout, index) => (
          <div 
            key={workout.id || index} 
            className={`workout-item ${hoveredIndex === index ? 'hovered' : ''} ${index === workouts.length - 1 ? 'last-item' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="workout-header">
              <div className="workout-details">
                <h3 className="workout-title">{workout.exercise}</h3>
                <p className="workout-calories">{workout.calories} calories</p>
                <p className="workout-duration">{workout.duration} minutes</p>
                {workout.notes && <p className="workout-notes">{workout.notes}</p>}
              </div>
              <div className="workout-date">
                {new Date(workout.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkoutForm = ({ onWorkoutAdded }) => {
  const [formData, setFormData] = useState({
    exercise: '',
    duration: '',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!formData.exercise.trim()) {
        throw new Error('Please enter an exercise name');
      }

      // Step 1: Get exercise data from Nutritionix
      const exercises = await getExerciseData(formData.exercise);
      
      if (!exercises || exercises.length === 0) {
        throw new Error('No exercise data found. Please try a different exercise description.');
      }
      
      // Use the first exercise returned
      const exercise = exercises[0];
      
      // Step 2: Prepare workout data for Sheety
      const workoutData = {
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        exercise: exercise.name || formData.exercise,
        duration: parseInt(formData.duration) || exercise.duration_min,
        calories: exercise.nf_calories,
        notes: formData.notes || '',
      };
      
      // Step 3: Add workout to Sheety
      const savedWorkout = await addWorkoutToSheety(workoutData);
      
      onWorkoutAdded(savedWorkout);
      setSuccess(true);
      
      // Reset form
      setFormData({
        exercise: '',
        duration: '',
        notes: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to add workout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-card">
      <h2 className="card-subtitle">Add New Workout</h2>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          Workout added successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="exercise" className="form-label">
            Exercise *
          </label>
          <input
            type="text"
            id="exercise"
            name="exercise"
            value={formData.exercise}
            onChange={handleChange}
            placeholder="e.g., running 3 miles, 30 mins yoga"
            className="form-input"
            required
          />
          <p className="helper-text">
            Enter exercise type and quantity (e.g., "ran 5k" or "30 pushups")
          </p>
        </div>
        
        <div className="form-group">
          <label htmlFor="duration" className="form-label">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 30"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional details about your workout"
            className="form-textarea"
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`form-button ${loading ? 'button-disabled' : ''}`}
        >
          {loading ? 'Adding...' : 'Add Workout'}
        </button>
      </form>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );
};

// Main App Component
export function Apps() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkouts();
        setWorkouts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load workouts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getWorkouts();
  }, []);

  const addWorkout = (newWorkout) => {
    setWorkouts([...workouts, newWorkout]);
  };

  return (
    <div className="workout-app">
      <style>
        {`
          /* Dark Theme Styles */
          .workout-app {
            background-color: #121212;
            min-height: 100vh;
            padding: 32px 0;
            color: white;
            font-family: 'Arial', sans-serif;
          }
          
          .app-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
          
          .app-title {
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 32px;
            color: white;
          }
          
          .app-content {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .workout-card {
            background-color: #1e1b24;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            padding: 24px;
            margin-bottom: 24px;
          }
          
          .card-subtitle {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: white;
            position: relative;
            display: inline-block;
          }
          
          .card-subtitle::after {
            content: "";
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 60px;
            height: 3px;
            background-color: #9333ea;
            border-radius: 2px;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: #d1d5db;
          }
          
          .form-input,
          .form-textarea {
            width: 100%;
            padding: 12px 14px;
            font-size: 16px;
            border: 1px solid #333;
            border-radius: 8px;
            box-sizing: border-box;
            background-color: #2d2a35;
            color: white;
            transition: border-color 0.3s;
          }
          
          .form-input:focus,
          .form-textarea:focus {
            border-color: #9333ea;
            outline: none;
          }
          
          .form-textarea {
            min-height: 100px;
            font-family: inherit;
            resize: vertical;
          }
          
          .helper-text {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 4px;
          }
          
          .form-button {
            background-color: #9333ea;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 14px 24px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            margin-top: 16px;
            transition: background-color 0.3s;
          }
          
          .form-button:hover {
            background-color: #7e22ce;
          }
          
          .button-disabled {
            background-color: #6b46c1;
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .alert {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          
          .alert-error {
            background-color: rgba(220, 38, 38, 0.1);
            color: #f87171;
            border: 1px solid rgba(220, 38, 38, 0.3);
          }
          
          .alert-success {
            background-color: rgba(22, 163, 74, 0.1);
            color: #86efac;
            border: 1px solid rgba(22, 163, 74, 0.3);
          }
          
          .section-title {
            font-size: 24px;
            font-weight: 600;
            margin: 40px 0 20px;
            color: white;
          }
          
          .workout-list {
            border-radius: 8px;
            overflow: hidden;
          }
          
          .workout-item {
            padding: 16px;
            border-bottom: 1px solid #333;
            transition: background-color 0.2s;
          }
          
          .workout-item.hovered {
            background-color: #2d2a35;
          }
          
          .workout-item.last-item {
            border-bottom: none;
          }
          
          .workout-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .workout-title {
            font-size: 18px;
            font-weight: 500;
            margin: 0 0 8px 0;
            color: white;
          }
          
          .workout-calories {
            font-size: 14px;
            color: #a78bfa;
            margin: 0 0 4px 0;
            font-weight: 500;
          }
          
          .workout-duration {
            font-size: 14px;
            color: #9ca3af;
            margin: 0 0 4px 0;
          }
          
          .workout-notes {
            font-size: 14px;
            color: #d1d5db;
            margin-top: 8px;
            line-height: 1.5;
          }
          
          .workout-date {
            font-size: 14px;
            color: #9ca3af;
            margin-left: 16px;
          }
          
          .empty-message {
            text-align: center;
            padding: 24px;
            color: #9ca3af;
          }
          
          .loading-container {
            display: flex;
            justify-content: center;
            padding: 32px;
          }
          
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top: 4px solid #9333ea;
            animation: spinner-rotate 1s linear infinite;
          }
          
          @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .workout-header {
              flex-direction: column;
            }
            
            .workout-date {
              margin-left: 0;
              margin-top: 8px;
            }
            
            .app-title {
              font-size: 28px;
            }
            
            .card-subtitle {
              font-size: 20px;
            }
          }
        `}
      </style>

      <div className="app-container">
        <h1 className="app-title">Workout Tracker</h1>
        
        <div className="app-content">
          <WorkoutForm onWorkoutAdded={addWorkout} />
          
          <h2 className="section-title">Your Workouts</h2>
          
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="alert alert-error">
              {error}
            </div>
          ) : (
            <WorkoutList workouts={workouts} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Apps;