import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

const badge = { pending: 'warning', approved: 'success', rejected: 'danger' };
const fmt = (d) => new Date(d).toLocaleDateString();

export default function Leaves() {
  const { user } = useAuth();
  const canApply = user.role !== 'hr';
  const canReview = user.role !== 'employee';
  const [mine, setMine] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ type: 'casual', fromDate: '', toDate: '', reason: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => {
    if (canApply) setMine((await api.get('/leaves/my')).data);
    if (canReview) setRequests((await api.get('/leaves')).data);
  };
  useEffect(() => { load(); }, []);

  const apply = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', form);
      setForm({ type: 'casual', fromDate: '', toDate: '', reason: '' });
      setMsg({ type: 'success', text: 'Leave applied' });
      load();
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const review = async (id, status) => {
    const reviewComment = window.prompt('Comment (optional)') || '';
    try { await api.put(`/leaves/${id}/review`, { status, reviewComment }); load(); }
    catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  return (
    <>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {canApply && (
        <>
          <h4>Apply for Leave</h4>
          <form className="card p-3 mb-4" onSubmit={apply}>
            <div className="row g-2">
              <div className="col-md-3">
                <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="casual">Casual</option><option value="sick">Sick</option>
                  <option value="earned">Earned</option><option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div className="col-md-3"><input type="date" required className="form-control" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} /></div>
              <div className="col-md-3"><input type="date" required className="form-control" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} /></div>
              <div className="col-md-3"><button className="btn btn-primary w-100">Apply</button></div>
              <div className="col-12"><input className="form-control" placeholder="Reason" required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></div>
            </div>
          </form>

          <h5>My Leaves</h5>
          <div className="card table-responsive mb-4">
            <table className="table mb-0">
              <thead className="table-light"><tr><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th>Reviewed by</th></tr></thead>
              <tbody>
                {mine.map((l) => (
                  <tr key={l._id}>
                    <td className="text-capitalize">{l.type}</td><td>{fmt(l.fromDate)}</td><td>{fmt(l.toDate)}</td><td>{l.reason}</td>
                    <td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td>
                    <td>{l.reviewedBy?.name || '-'}{l.reviewComment && <div className="small text-muted">{l.reviewComment}</div>}</td>
                  </tr>
                ))}
                {mine.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-3">No leaves yet</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {canReview && (
        <>
          <h4>{user.role === 'hr' ? 'All Leave Requests' : 'Team Leave Requests'}</h4>
          <div className="card table-responsive">
            <table className="table mb-0 align-middle">
              <thead className="table-light"><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th><th /></tr></thead>
              <tbody>
                {requests.map((l) => (
                  <tr key={l._id}>
                    <td>{l.employee?.name}<div className="small text-muted">{l.employee?.department}</div></td>
                    <td className="text-capitalize">{l.type}</td><td>{fmt(l.fromDate)}</td><td>{fmt(l.toDate)}</td><td>{l.reason}</td>
                    <td><span className={`badge bg-${badge[l.status]}`}>{l.status}</span></td>
                    <td className="text-end">
                      {l.status === 'pending' && (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => review(l._id, 'approved')}>Approve</button>
                          <button className="btn btn-sm btn-danger" onClick={() => review(l._id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-3">No requests</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
