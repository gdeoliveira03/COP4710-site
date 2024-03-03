import React, { useState, useEffect } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventId, setEventId] = useState('');
  const [searchedEvent, setSearchedEvent] = useState(null);

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
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setEventId(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/get_event/${eventId}`);
      if (!response.ok) {
        throw new Error('Error fetching event');
      }
      const data = await response.json();
      setSearchedEvent(data);
    } catch (error) {
      setError(error.message);
    }
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
      <ul>
        {events.map(event => (
          <li key={event.event_id}>
            <strong>Name:</strong> {event.name}<br />
            <strong>Category:</strong> {event.category}<br />
            <strong>Description:</strong> {event.description}<br />
            <hr />
          </li>
        ))}
      </ul>
      <h2>Search Event by ID</h2>
      <form onSubmit={handleSearch}>
        <label>
          Event ID:
          <input type="text" value={eventId} onChange={handleInputChange} />
        </label>
        <button type="submit">Search</button>
      </form>
      {searchedEvent && (
        <div>
          <h3>Event Details</h3>
          <p><strong>Name:</strong> {searchedEvent.name}</p>
          <p><strong>Category:</strong> {searchedEvent.category}</p>
          <p><strong>Description:</strong> {searchedEvent.description}</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
