import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteEvent, fetchEvent } from '../../util/http.js';

export default function EventDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    },
  });

  function onDelete(id) {
    deleteMutate({id});
  }

  if (isLoading) return <p>Loading event...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{event.title}</h1>
          <nav>
            <button onClick={() => onDelete(id)} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          {event.image && <img src={`http://localhost:3000/${event.image}`} alt={event.title} />}
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{event.location}</p>
              <time dateTime={event.date}>
                {' '}
                {new Date(event.date).toLocaleString()}
              </time>
            </div>
            <p id="event-details-description">{event.description}</p>
          </div>
        </div>
      </article>
    </>
  );
}
