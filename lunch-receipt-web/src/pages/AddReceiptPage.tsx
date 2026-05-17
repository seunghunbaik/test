import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { saveReceipt, updateReceipt, getReceiptById } from '../utils/storage';
import { Receipt, CATEGORIES, ReceiptCategory } from '../types';

const today = () => new Date().toISOString().split('T')[0];

const AddReceiptPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [restaurantName, setRestaurantName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState<ReceiptCategory>('한식');
  const [paidBy, setPaidBy] = useState('');
  const [attendees, setAttendees] = useState('1');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const r = getReceiptById(id);
    if (!r) return;
    setRestaurantName(r.restaurantName);
    setAmount(String(r.amount));
    setDate(r.date.split('T')[0]);
    setCategory(r.category);
    setPaidBy(r.paidBy);
    setAttendees(String(r.attendees));
    setNotes(r.notes ?? '');
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount.replace(/,/g, ''));
    if (!restaurantName.trim()) { setError('식당명을 입력해주세요.'); return; }
    if (!amount || isNaN(num) || num <= 0) { setError('올바른 금액을 입력해주세요.'); return; }
    if (!paidBy.trim()) { setError('결제자를 입력해주세요.'); return; }
    setError('');

    const receipt: Receipt = {
      id: id ?? uuidv4(),
      restaurantName: restaurantName.trim(),
      amount: num,
      date: new Date(date).toISOString(),
      category,
      paidBy: paidBy.trim(),
      attendees: Math.max(1, Number(attendees) || 1),
      notes: notes.trim() || undefined,
      createdAt: isEdit ? (getReceiptById(id!)?.createdAt ?? new Date().toISOString()) : new Date().toISOString(),
    };

    if (isEdit) { updateReceipt(receipt); } else { saveReceipt(receipt); }
    navigate('/');
  };

  return (
    <div>
      <h1 className="page-title">{isEdit ? '영수증 수정' : '영수증 추가'}</h1>
      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#DC2626', fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-row">
            <div className="field">
              <label>식당명 *</label>
              <input
                type="text"
                value={restaurantName}
                onChange={e => setRestaurantName(e.target.value)}
                placeholder="예) 한솥도시락"
                autoFocus
              />
            </div>
            <div className="field">
              <label>금액 (원) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="예) 45000"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>날짜 *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="field">
              <label>인원수</label>
              <input
                type="number"
                value={attendees}
                onChange={e => setAttendees(e.target.value)}
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="field">
            <label>음식 카테고리</label>
            <div className="category-group">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`category-btn${category === c ? ' selected' : ''}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>결제자 *</label>
            <input
              type="text"
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              placeholder="결제한 사람 이름"
            />
          </div>

          <div className="field">
            <label>메모</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="추가 메모를 입력하세요 (선택)"
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} style={{ flex: 1 }}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
              {isEdit ? '✓ 수정 완료' : '+ 저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReceiptPage;
