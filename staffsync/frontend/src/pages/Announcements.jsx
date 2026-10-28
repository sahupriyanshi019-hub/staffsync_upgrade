import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Announcements() {
  const { user } = useAuth();
  const isHR = user.role === 'hr';
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', message: '' });
  const [error, setError] = useState('');

  const load = async () => setItems((await api.get('/announcements')).data);
  useEffect(() => { load(); }, []);

  const post = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', form);
      setForm({ title: '', message: '' });
      setError('');
      load();
    } catch (err) { setError(errMsg(err)); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete announcement?')) return;
    await api.delete(`/announcements/${id}`);
    load();
  };

  return (
    <>
      <h4>Announcements & News</h4>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {isHR && (
        <form className="card p-3 mb-4" onSubmit={post}>
          <input className="form-control mb-2" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="form-control mb-2" rows="3" placeholder="Message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <div><button className="btn btn-primary">Post</button></div>
        </form>
      )}
      {items.length === 0 && <div className="text-muted">No announcements yet.</div>}
      {items.map((n) => (
        <div className="card p-3 mb-2" key={n._id}>
          <div className="d-flex justify-content-between">
            <h5 className="mb-0">{n.title}</h5>
            {isHR && <button className="btn btn-sm btn-outline-danger" onClick={() => remove(n._id)}>Delete</button>}
          </div>
          <div className="small text-muted mb-2">{new Date(n.createdAt).toLocaleString()} - {n.postedBy?.name}</div>
          <div>{n.message}</div>
        </div>
      ))}
    </>
  );
}
