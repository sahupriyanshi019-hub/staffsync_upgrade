import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

const empty = { name: '', email: '', password: '', role: 'employee', department: '', designation: '', phone: '', address: '', manager: '' };

export default function Employees() {
  const { user } = useAuth();
  const isHR = user.role === 'hr';
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [q, setQ] = useState('');

  const load = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
    if (isHR) setManagers(data.filter((u) => u.role === 'manager'));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (editId && !payload.password) delete payload.password;
      if (editId) await api.put(`/users/${editId}`, payload);
      else await api.post('/users', payload);
      setMsg({ type: 'success', text: editId ? 'Employee updated' : 'Employee added' });
      setForm(empty); setEditId(null); setShow(false);
      load();
    } catch (err) {
      setMsg({ type: 'danger', text: errMsg(err) });
    }
  };

  const edit = (u) => {
    setForm({ ...empty, ...u, password: '', manager: u.manager?._id || '' });
    setEditId(u._id); setShow(true);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try { await api.delete(`/users/${id}`); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const filtered = users.filter((u) => (u.name + u.email + u.department).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{isHR ? 'Employees' : 'My Team'}</h4>
        {isHR && <button className="btn btn-primary" onClick={() => { setForm(empty); setEditId(null); setShow(!show); }}>+ Add Employee</button>}
      </div>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {show && isHR && (
        <form className="card p-3 mb-3" onSubmit={submit}>
          <div className="row g-2">
            <div className="col-md-4"><input className="form-control" placeholder="Name" required value={form.name} onChange={set('name')} /></div>
            <div className="col-md-4"><input type="email" className="form-control" placeholder="Email" required value={form.email} onChange={set('email')} /></div>
            <div className="col-md-4"><input type="password" className="form-control" placeholder={editId ? 'New password (optional)' : 'Password'} required={!editId} minLength={6} value={form.password} onChange={set('password')} /></div>
            <div className="col-md-3">
              <select className="form-select" value={form.role} onChange={set('role')}>
                <option value="employee">Employee</option><option value="manager">Manager</option><option value="hr">HR</option>
              </select>
            </div>
            <div className="col-md-3"><input className="form-control" placeholder="Department" value={form.department} onChange={set('department')} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Designation" value={form.designation} onChange={set('designation')} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Phone" value={form.phone} onChange={set('phone')} /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Address" value={form.address} onChange={set('address')} /></div>
            <div className="col-md-6">
              <select className="form-select" value={form.manager} onChange={set('manager')}>
                <option value="">No manager</option>
                {managers.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-success me-2">{editId ? 'Update' : 'Save'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>Cancel</button>
          </div>
        </form>
      )}

      <input className="form-control mb-3" placeholder="Search by name, email or department" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="card table-responsive">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-light">
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Designation</th><th>Manager</th>{isHR && <th />}</tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td>
                <td><span className="badge bg-secondary text-uppercase">{u.role}</span></td>
                <td>{u.department}</td><td>{u.designation}</td><td>{u.manager?.name || '-'}</td>
                {isHR && (
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(u)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-3">No records</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
