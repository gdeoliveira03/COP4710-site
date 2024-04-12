import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState({
    category: '',
    isRSO: false,
    isPublic: false
  });

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const uniId = localStorage.getItem('userUniId');
      const publicResponse = await fetch(`http://localhost:5000/public_events/${uniId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const rsoResponse = await fetch(`http://localhost:5000/rso_events/${uniId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!publicResponse.ok || !rsoResponse.ok) {
        throw new Error('Error fetching events');
      }

      const publicEvents = await publicResponse.json();
      const rsoEvents = await rsoResponse.json();

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

    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: checked
    }));
  };

  const applyFilters = (events) => {
    let filtered = events.filter(event => {
      let condition = true;
      if (filter.category && event.category !== filter.category) {
        condition = false;
      }
      if (filter.isPublic && !event.is_public) {
        condition = false;
      }
      return condition;
    });
    if (filter.isRSO) {
      filtered = filtered.filter(event => event.is_rso);
    }
    setFilteredEvents(filtered);
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
        <Link to="/DeleteComment">Edit Your Comments</Link>
      </div>
      {filteredEvents.length > 0 ? (
        <ul>
          {filteredEvents.map(event => (
            <li key={event.event_id}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Name:</strong> {event.name}<br />
                <strong>Category:</strong> {event.category}<br />
                <strong>Description:</strong> {event.description}<br />
                <strong>Date:</strong> {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}<br />
                <strong>Time:</strong> {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}<br />
                <strong>Location:</strong> {event.location}<br />
              </div>
              <ReadComments eventId={event.event_id} />
            </li>
          ))}
        </ul>
      ) : (
        <div>No events found</div>
      )}
    </div>
  );
};

const ReadComments = ({ eventId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get_comments_by_event/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
        if (!response.ok) {
          throw new Error('Error fetching comments');
        }
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.length > 0 ? (
          comments.map(comment => (
            <li key={comment.comment_id}>
              <div style={{ marginBottom: '5px' }}>
                <strong>Username:</strong> {comment.username}<br />
                <strong>Comment:</strong> {comment.content}<br />
                <strong>Rating:</strong> {comment.rating}<br />
              </div>
              <hr />
            </li>
          ))
        ) : (
          <div>No comments found</div>
        )}
      </ul>
    </div>
  );
};

export default EventList;
