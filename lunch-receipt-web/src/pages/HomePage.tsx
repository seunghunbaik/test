import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getReceipts } from '../utils/storage';
import { getMonthlySummary, formatCurrency, formatDate } from '../utils/helpers';
import { Receipt } from '../types';

const HomePage: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  useEffect(() => {
    const all = getReceipts().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setReceipts(all);
  }, []);

  const now = new Date();
  const summary = getMonthlySummary(receipts, now.getFullYear(), now.getMonth() + 1);
  const recent = receipts.slice(0, 6);

  return (
    <div>
      <div className="hero">
        <p className="hero-subtitle">이번 달 점심 현황</p>
        <h1 className="hero-title">
          {now.getFullYear()}년 {now.getMonth() + 1}월
        </h1>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-label">총 지출</div>
            <div className="hero-stat-value">{formatCurrency(summary.totalAmount)}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-label">영수증 수</div>
            <div className="hero-stat-value">{summary.receiptCount}건</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-label">건당 평균</div>
            <div className="hero-stat-value">{formatCurrency(summary.averageAmount)}</div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <span className="section-title">최근 영수증</span>
          <Link to="/list" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>전체 보기 →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🧾</span>
            <p className="empty-text">등록된 영수증이 없습니다.<br />상단 <strong>+ 추가</strong> 버튼으로 첫 영수증을 등록해보세요!</p>
          </div>
        ) : (
          <div className="receipt-list">
            {recent.map(r => (
              <Link to={`/edit/${r.id}`} key={r.id} className="receipt-item">
                <span className="receipt-badge">{r.category}</span>
                <div className="receipt-info">
                  <div className="receipt-name">{r.restaurantName}</div>
                  <div className="receipt-meta">{formatDate(r.date)} · {r.paidBy} 결제 · {r.attendees}명</div>
                </div>
                <span className="receipt-amount">{formatCurrency(r.amount)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link to="/add" className="btn btn-primary btn-full" style={{ marginTop: 8 }}>
        + 영수증 추가하기
      </Link>
    </div>
  );
};

export default HomePage;
