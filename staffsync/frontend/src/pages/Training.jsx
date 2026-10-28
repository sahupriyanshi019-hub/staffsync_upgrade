import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

const empty = { title: '', description: '', startDate: '', endDate: '', status: 'upcoming', assignedEmployees: [] };
const badge = { upcoming: 'info', ongoing: 'warning', completed: 'success' };
const fmt = (d) => new Date(d).toLocaleDateString();

export default function Training() {
  const { user } = useAuth();
  const canManage = user.role !== 'employee';
  const [items, setItems] = useState([]);
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setItems((await api.get('/trainings')).data);
    if (canManage) setTeam((await api.get('/users')).data.filter((u) => u.role === 'employee'));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/trainings/${editId}`, form);
      else await api.post('/trainings', form);
      setForm(empty); setEditId(null); setError('');
      load();
    } catch (err) { setError(errMsg(err)); }
  };

  const edit = (t) => {
    setEditId(t._id);
    setForm({
      title: t.title, description: t.description, status: t.status,
      startDate: t.startDate.slice(0, 10), endDate: t.endDate.slice(0, 10),
      assignedEmployees: t.assignedEmployees.map((a) => a._id),
    });
    window.scrollTo(0, 0);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this program?')) return;
    await api.delete(`/trainings/${id}`);
    load();
  };

  const toggle = (id) =>
    setForm((f) => ({
      ...f,
      assignedEmployees: f.assignedEmployees.includes(id)
        ? f.assignedEmployees.filter((x) => x !== id)
        : [...f.assignedEmployees, id],
    }));

  return (
    <>
      <h4>Training & Development</h4>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {canManage && (
        <form className="card p-3 mb-4" onSubmit={submit}>
          <div className="row g-2">
            <div className="col-md-6"><input className="form-control" placeholder="Program title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="col-md-2"><input type="date" className="form-control" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div className="col-md-2"><input type="date" className="form-control" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            <div className="col-md-2">
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="upcoming">Upcoming</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-12"><textarea className="form-control" rows="2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="col-12">
              <div className="small fw-bold mb-1">Assign employees</div>
              {team.length === 0 && <div className="text-muted small">No employees available.</div>}
              {team.map((u) => (
                <label key={u._id} className="me-3">
                  <input type="checkbox" className="form-check-input me-1" checked={form.assignedEmployees.includes(u._id)} onChange={() => toggle(u._id)} />
                  {u.name}
                </label>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary me-2">{editId ? 'Update Program' : 'Create Program'}</button>
            {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
          </div>
        </form>
      )}

      <div className="row g-3">
        {items.map((t) => (
          <div className="col-md-6" key={t._id}>
            <div className="card p-3 h-100">
              <div className="d-flex justify-content-between">
                <h5>{t.title}</h5><span className={`badge bg-${badge[t.status]} align-self-start`}>{t.status}</span>
              </div>
              <div className="small text-muted">{fmt(t.startDate)} - {fmt(t.endDate)} | By {t.createdBy?.name}</div>
              <p className="mt-2 mb-2">{t.description}</p>
              {canManage && (
                <>
                  <div className="small">Assigned: {t.assignedEmployees.map((a) => a.name).join(', ') || 'None'}</div>
                  <div className="mt-2">
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(t)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(t._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-muted">No training programs.</div>}
      </div>
    </>
  );
}
