import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';

const time = (d) => (d ? new Date(d).toLocaleTimeString() : '-');

export default function Attendance() {
  const { user } = useAuth();
  const isHR = user.role === 'hr';
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const todayStr = new Date().toISOString().slice(0, 10);

  const load = async () => {
    if (isHR) setRecords((await api.get('/attendance', { params: date ? { date } : {} })).data);
    else setRecords((await api.get('/attendance/my')).data);
  };
  useEffect(() => { load(); }, [date]);

  const act = async (kind) => {
    try {
      if (kind === 'in') await api.post('/attendance/check-in');
      else await api.put('/attendance/check-out');
      setMsg({ type: 'success', text: kind === 'in' ? 'Checked in' : 'Checked out' });
      load();
    } catch (err) { setMsg({ type: 'danger', text: errMsg(err) }); }
  };

  const todayRec = records.find((r) => r.date === todayStr);

  return (
    <>
      <h4>Attendance</h4>
      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {!isHR && (
        <div className="card p-3 mb-3 d-flex flex-row align-items-center gap-3">
          <div className="flex-grow-1">
            <strong>Today ({todayStr})</strong>
            <div className="small text-muted">In: {time(todayRec?.checkIn)} | Out: {time(todayRec?.checkOut)}</div>
          </div>
          <button className="btn btn-success" disabled={!!todayRec} onClick={() => act('in')}>Check In</button>
          <button className="btn btn-danger" disabled={!todayRec || !!todayRec?.checkOut} onClick={() => act('out')}>Check Out</button>
        </div>
      )}

      {isHR && (
        <div className="mb-3 d-flex gap-2">
          <input type="date" className="form-control" style={{ maxWidth: 220 }} value={date} onChange={(e) => setDate(e.target.value)} />
          <button className="btn btn-outline-secondary" onClick={() => setDate('')}>Clear</button>
        </div>
      )}

      <div className="card table-responsive">
        <table className="table mb-0">
          <thead className="table-light">
            <tr><th>Date</th>{isHR && <th>Employee</th>}<th>Check In</th><th>Check Out</th><th>Status</th></tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.date}</td>
                {isHR && <td>{r.employee?.name}<div className="small text-muted">{r.employee?.department}</div></td>}
                <td>{time(r.checkIn)}</td><td>{time(r.checkOut)}</td>
                <td><span className={`badge bg-${r.status === 'present' ? 'success' : 'warning'}`}>{r.status}</span></td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-3">No records</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
