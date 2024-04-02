import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState({
    category: '',
    university: '',
    isRSO: false,
    isPublic: false
  });

  useEffect(() => {
    fetchEvents();
  }, []);


  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/public_events');
      if (!response.ok) {
        throw new Error('Error fetching events');
      }
  
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    if ((name === 'isRSO' && checked) || (name === 'isPublic' && checked)) {
      // If one of the checkboxes is checked, uncheck the other
      setFilter(prevFilter => ({
        ...prevFilter,
        isRSO: name === 'isRSO' ? checked : false,
        isPublic: name === 'isPublic' ? checked : false
      }));
    } else {
      // Otherwise, update the filter normally
      setFilter(prevFilter => ({
        ...prevFilter,
        [name]: name === 'isRSO' || name === 'isPublic' ? checked : value
      }));
    }
  };

  const clearFilter = () => {
    // Reset the filter state
    setFilter({
      category: '',
      university: '',
      isRSO: false,
      isPublic: false
    });
  };

  useEffect(() => {
    // Apply filters when filter state changes
    applyFilters();
  }, [filter]);

  const applyFilters = () => {
    let filtered = events.filter(event => {
      let condition = true;
      if (filter.category && event.category !== filter.category) {
        condition = false;
      }
      if (filter.isRSO && !event.is_rso_event) {
        condition = false;
      }
      if (filter.isPublic && !event.is_public) {
        condition = false;
      }
      return condition;
    });
    setFilteredEvents(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Event List</h2>
      <div>
        <label>Category:</label>
        <select name="category" value={filter.category} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="Seminar">Seminar</option>
          <option value="TED Talk">TED Talk</option>
          <option value="Presentation">Presentation</option>
          <option value="Recreational/Social">Recreational/Social</option>
          <option value="Exhibition">Exhibition</option>
          <option value="Promotion">Promotion</option>
          <option value="Other">Other</option>
        </select>
        <label>
          <input type="checkbox" name="isRSO" checked={filter.isRSO} onChange={handleFilterChange} />
          RSO Event
        </label>
        <label>
          <input type="checkbox" name="isPublic" checked={filter.isPublic} onChange={handleFilterChange} />
          Public Event
        </label>
        <button onClick={clearFilter}>Clear Filter</button>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
      <ul>
        {filteredEvents.map(event => (
          <li key={event.event_id}>
            <strong>Name:</strong> {event.name}<br />
            <strong>Category:</strong> {event.category}<br />
            <strong>Description:</strong> {event.description}<br />
            <strong>Date:</strong> {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}<br />
    <strong>Time:</strong> {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}<br />
            <strong>Location:</strong> {event.location}<br />
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;