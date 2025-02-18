import React, { useState } from "react";
import axios from "axios";

const AuthForm = ({ setIsAuthenticated, showNotification }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userId: "",
    password: "",
    isLogin: true,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = formData.isLogin 
        ? "https://railway-booking-system-blza.onrender.com/api/login" 
        : "https://railway-booking-system-blza.onrender.com/api/register";
      
      const payload = formData.isLogin
        ? { 
            email: formData.email,
            userId: formData.userId,
            password: formData.password 
          }
        : { 
            name: formData.name, 
            email: formData.email,
            userId: formData.userId,
            password: formData.password 
          };
      
      const { data } = await axios.post(endpoint, payload);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        
        setIsAuthenticated(true);
        
        if (showNotification) {
          showNotification('Success', data.message, 'success');
        }
      }
      
      setMessage(data.message || "Success");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      setMessage(errorMessage);
      
      if (showNotification) {
        showNotification('Error', errorMessage, 'error');
      }
    }
  };

  const toggleForm = () => {
    setFormData({
      name: "",
      email: "",
      userId: "",
      password: "",
      isLogin: !formData.isLogin
    });
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {formData.isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          {!formData.isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border rounded mb-2"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            name="userId"
            placeholder="User ID (4 characters)"
            value={formData.userId}
            onChange={handleChange}
            className="p-2 border rounded mb-2"
            minLength={4}
            maxLength={4}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border rounded mb-2"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors"
          >
            {formData.isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p 
          className="text-sm mt-2 cursor-pointer text-blue-500 hover:text-blue-600" 
          onClick={toggleForm}
        >
          {formData.isLogin 
            ? "Don't have an account? Register" 
            : "Already have an account? Login"}
        </p>
        {message && (
          <p className={`mt-2 ${message.includes("Success") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;