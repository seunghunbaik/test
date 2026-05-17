import React, { useState, useEffect } from 'react';
import { getReceipts } from '../utils/storage';
import { getMonthlySummary, formatCurrency } from '../utils/helpers';
import { Receipt, CATEGORIES } from '../types';

const BAR_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#8B5CF6'];

const SummaryPage: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  useEffect(() => { setReceipts(getReceipts()); }, []);

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m); setYear(y);
  };

  const summary = getMonthlySummary(receipts, year, month);
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthReceipts = receipts.filter(r => r.date.startsWith(prefix));

  const perPersonAvg = monthReceipts.length > 0
    ? Math.round(monthReceipts.reduce((s, r) => s + r.amount / r.attendees, 0) / monthReceipts.length)
    : 0;

  const maxCat = Math.max(...CATEGORIES.map(c => summary.categoryBreakdown[c] ?? 0), 1);

  const last6 = Array.from({ length: 6 }, (_, i) => {
    let m = month - 5 + i;
    let y = year;
    while (m < 1) { m += 12; y -= 1; }
    while (m > 12) { m -= 12; y += 1; }
    return {
      label: `${String(m).padStart(2, '0')}월`,
      total: getMonthlySummary(receipts, y, m).totalAmount,
      isCurrent: y === year && m === month,
    };
  });
  const maxMonthly = Math.max(...last6.map(x => x.total), 1);

  return (
    <div>
      <div className="month-nav">
        <button className="month-nav-btn" onClick={() => changeMonth(-1)}>◀</button>
        <span className="month-nav-title">{year}년 {month}월</span>
        <button className="month-nav-btn" onClick={() => changeMonth(1)}>▶</button>
      </div>

      <div className="stats-grid">
        {[
          { label: '총 지출', value: formatCurrency(summary.totalAmount) },
          { label: '영수증 수', value: `${summary.receiptCount}건` },
          { label: '건당 평균', value: formatCurrency(summary.averageAmount) },
          { label: '1인당 평균', value: formatCurrency(perPersonAvg) },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="card section">
        <div className="card-title">카테고리별 지출</div>
        {CATEGORIES.map((cat, i) => {
          const amt = summary.categoryBreakdown[cat] ?? 0;
          return (
            <div key={cat} className="bar-row">
              <span className="bar-label">{cat}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(amt / maxCat) * 100}%`, backgroundColor: BAR_COLORS[i] }}
                />
              </div>
              <span className="bar-value">{formatCurrency(amt)}</span>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-title">월별 지출 추이 (최근 6개월)</div>
        {last6.map(({ label, total, isCurrent }) => (
          <div key={label} className="bar-row">
            <span className="bar-label" style={isCurrent ? { color: 'var(--primary)', fontWeight: 700 } : {}}>
              {label}
            </span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(total / maxMonthly) * 100}%`,
                  backgroundColor: isCurrent ? 'var(--primary)' : '#93C5FD',
                }}
              />
            </div>
            <span className="bar-value">{formatCurrency(total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryPage;
