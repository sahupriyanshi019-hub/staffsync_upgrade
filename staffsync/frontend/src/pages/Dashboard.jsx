import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get('/announcements').then((r) => setNews(r.data.slice(0, 5)));
  }, []);

  const tiles = [
    { to: '/leaves', title: 'Leaves', text: user.role === 'employee' ? 'Apply and track your leaves' : 'Apply / review leave requests' },
    { to: '/attendance', title: 'Attendance', text: 'Check in / check out and view records' },
    { to: '/training', title: 'Training', text: 'Training and development programs' },
    { to: '/profile', title: 'My Profile', text: 'Update your personal details' },
  ];
  if (user.role !== 'employee') tiles.unshift({ to: '/employees', title: 'Employees', text: user.role === 'hr' ? 'Manage employee records' : 'View your team' });

  return (
    <>
      <h4 className="mb-3">Welcome, {user.name}</h4>
      <div className="row g-3 mb-4">
        {tiles.map((t) => (
          <div className="col-md-4" key={t.to}>
            <Link to={t.to} className="text-decoration-none">
              <div className="card h-100 p-3">
                <h5 className="text-primary">{t.title}</h5>
                <div className="text-muted small">{t.text}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="card p-3">
        <h5>Latest Announcements</h5>
        {news.length === 0 && <div className="text-muted">No announcements yet.</div>}
        {news.map((n) => (
          <div key={n._id} className="border-bottom py-2">
            <strong>{n.title}</strong>
            <div className="small text-muted">{new Date(n.createdAt).toLocaleDateString()} - {n.postedBy?.name}</div>
            <div>{n.message}</div>
          </div>
        ))}
      </div>
    </>
  );
}
