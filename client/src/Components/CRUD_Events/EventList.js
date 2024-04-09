import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReadComments from '../CRUD_Comments/ReadComments';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState({
    category: '',
    isRSO: false,
    isPublic: true
  });

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      let publicEvents = [];
      let rsoEvents = [];

      if (filter.isPublic) {
        const publicResponse = await fetch('http://localhost:5000/public_events');
        if (!publicResponse.ok) {
          throw new Error('Error fetching public events');
        }
        publicEvents = await publicResponse.json();
      }

      if (filter.isRSO) {
        const rsoResponse = await fetch('http://localhost:5000/rso_events');
        if (!rsoResponse.ok) {
          throw new Error('Error fetching RSO events');
        }
        rsoEvents = await rsoResponse.json();
      }

      const combinedEvents = [...publicEvents, ...rsoEvents];
      setEvents(combinedEvents);
      applyFilters(combinedEvents);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    
    if (checked) {
      if (name === 'isRSO') {
        setFilter(prevFilter => ({
          ...prevFilter,
          isRSO: true,
          isPublic: false
        }));
      } else if (name === 'isPublic') {
        setFilter(prevFilter => ({
          ...prevFilter,
          isRSO: false,
          isPublic: true
        }));
      }
    } else {
      setFilter(prevFilter => ({
        ...prevFilter,
        [name]: false
      }));
    }
  };

  const applyFilters = async () => {
    try {
      let filtered;
      if (!filter.isRSO && !filter.isPublic) {
        try {
          const responsePublic = await fetch('http://localhost:5000/public_events');
          const responseRSO = await fetch('http://localhost:5000/rso_events');
    
          if (!responsePublic.ok || !responseRSO.ok) {
            throw new Error('Error fetching events');
          }
    
          const dataPublic = await responsePublic.json();
          const dataRSO = await responseRSO.json();
    
          filtered = [...dataPublic, ...dataRSO];
        } catch (error) {
          console.error('Error fetching events:', error);
          setError('Error fetching events');
          return;
        }
      } else if (filter.isRSO && !filter.isPublic) {
        const responseRSO = await fetch('http://localhost:5000/rso_events');
        if (!responseRSO.ok) {
          throw new Error('Error fetching RSO events');
        }
        const dataRSO = await responseRSO.json();
        filtered = dataRSO;
      } else {
        const responsePublic = await fetch('http://localhost:5000/public_events');
        if (!responsePublic.ok) {
          throw new Error('Error fetching public events');
        }
        const dataPublic = await responsePublic.json();
        filtered = dataPublic.filter(event => {
          let condition = true;
          if (filter.category && event.category !== filter.category) {
            condition = false;
          }
          if (filter.isPublic && !event.is_public) {
            condition = false;
          }
          return condition;
        });
      }
      setFilteredEvents(filtered);
    } catch (error) {
      setError(error.message);
    }
  };

  const clearFilter = () => {
    setFilter({
      category: '',
      isRSO: false,
      isPublic: false
    });
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
        <label>
          <input type="checkbox" name="isRSO" checked={filter.isRSO} onChange={handleFilterChange} />
          RSO Event
        </label>
        <label>
          <input type="checkbox" name="isPublic" checked={filter.isPublic} onChange={handleFilterChange} />
          Public Event
        </label>
        <button onClick={clearFilter}>Clear Filter</button>
        <Link to="/dashboard">Back to Dashboard</Link>{' '}
  <Link to="/CreateComment">Create Comment</Link>{' '}
  <Link to="/DeleteComment">Edit Comments</Link>
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
      <ReadComments />
    </div>
  );
};

export default EventList;
