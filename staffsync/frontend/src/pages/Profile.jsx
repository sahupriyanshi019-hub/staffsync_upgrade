import { useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', form);
      setUser(data);
      setMsg({ type: 'success', text: 'Profile updated' });
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const changePw = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', pw);
      setPw({ currentPassword: '', newPassword: '' });
      setMsg({ type: 'success', text: 'Password changed' });
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <div className="row g-3">
      <div className="col-12">{msg.text && <div className={`alert alert-${msg.type} py-2 mb-0`}>{msg.text}</div>}</div>
      <div className="col-md-6">
        <form className="card p-3" onSubmit={save}>
          <h5>My Profile</h5>
          <div className="small text-muted mb-3">
            {user.email} | {user.role.toUpperCase()} | {user.department || 'No department'} | {user.designation || 'No designation'}<br />
            Joined: {new Date(user.joiningDate).toLocaleDateString()}
          </div>
          <label className="form-label">Name</label>
          <input className="form-control mb-2" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="form-label">Phone</label>
          <input className="form-control mb-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label className="form-label">Address</label>
          <textarea className="form-control mb-3" rows="2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div><button className="btn btn-primary">Save</button></div>
        </form>
      </div>
      <div className="col-md-6">
        <form className="card p-3" onSubmit={changePw}>
          <h5>Change Password</h5>
          <input type="password" className="form-control mb-2" placeholder="Current password" required value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          <input type="password" className="form-control mb-3" placeholder="New password (min 6)" required minLength={6} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <div><button className="btn btn-warning">Update Password</button></div>
        </form>
      </div>
    </div>
  );
}
