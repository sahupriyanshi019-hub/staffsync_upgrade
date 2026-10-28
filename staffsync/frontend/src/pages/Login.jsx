import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="login-wrap">
      <div className="card p-4" style={{ width: 380 }}>
        <h3 className="brand text-primary text-center mb-1">StaffSync</h3>
        <p className="text-center text-muted">Sign in to continue</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-primary w-100">Login</button>
        </form>
        <div className="small text-muted mt-3">
          Demo: hr@staffsync.com / hr1234<br />
          manager@staffsync.com / manager1234<br />
          employee@staffsync.com / employee1234
        </div>
      </div>
    </div>
  );
}
