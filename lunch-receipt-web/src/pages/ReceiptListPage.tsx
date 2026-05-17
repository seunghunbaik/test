import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getReceipts, deleteReceipt } from '../utils/storage';
import { formatCurrency, formatDate, toYearMonth } from '../utils/helpers';
import { Receipt } from '../types';

const ReceiptListPage: React.FC = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const load = useCallback(() => {
    const all = getReceipts().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setReceipts(all);
  }, []);

  useEffect(() => { load(); }, [load]);

  const months = Array.from(new Set(receipts.map(r => toYearMonth(r.date)))).sort().reverse();
  const filtered = receipts.filter(r => r.date.startsWith(selectedMonth));
  const total = filtered.reduce((s, r) => s + r.amount, 0);

  const handleDelete = (r: Receipt) => {
    if (!window.confirm(`"${r.restaurantName}" 영수증을 삭제할까요?`)) return;
    deleteReceipt(r.id);
    load();
  };

  return (
    <div>
      <div className="section-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>영수증 목록</h1>
        <Link to="/add" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>+ 추가</Link>
      </div>

      {months.length > 0 && (
        <div className="month-filter">
          {months.map(m => (
            <button
              key={m}
              className={`month-chip${selectedMonth === m ? ' active' : ''}`}
              onClick={() => setSelectedMonth(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      <div className="list-summary">
        <span>{filtered.length}건</span>
        <span>·</span>
        <span>합계 <span className="list-summary-amount">{formatCurrency(total)}</span></span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p className="empty-text">이 달의 영수증이 없습니다.</p>
        </div>
      ) : (
        <div className="receipt-list">
          {filtered.map(r => (
            <div key={r.id} className="receipt-item" style={{ cursor: 'default' }}>
              <span className="receipt-badge">{r.category}</span>
              <div className="receipt-info">
                <div className="receipt-name">{r.restaurantName}</div>
                <div className="receipt-meta">
                  {formatDate(r.date)} · {r.paidBy} 결제 · {r.attendees}명
                  {r.notes && <span> · 💬 {r.notes}</span>}
                </div>
              </div>
              <span className="receipt-amount">{formatCurrency(r.amount)}</span>
              <div className="receipt-actions">
                <button className="icon-btn" onClick={() => navigate(`/edit/${r.id}`)}>✏️</button>
                <button className="icon-btn danger" onClick={() => handleDelete(r)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptListPage;
