# 🍱 점심 영수증 정리 (웹)

회사 점심 영수증을 간편하게 기록하고 관리하는 웹 애플리케이션입니다.

## 주요 기능

| 페이지 | 기능 |
|--------|------|
| **홈** | 이번 달 지출 요약, 최근 영수증 목록 |
| **목록** | 월별 필터, 수정/삭제, 합계 표시 |
| **통계** | 카테고리별·월별 지출 차트, 1인당 평균 |
| **추가/수정** | 영수증 등록 폼 (식당명, 금액, 날짜, 카테고리, 결제자, 인원수, 메모) |

## 기술 스택

- **React 18** + **TypeScript**
- **Vite** — 빠른 개발 서버 및 빌드
- **React Router v6** — SPA 라우팅
- **localStorage** — 브라우저 로컬 저장소
- **UUID** — 영수증 고유 ID

## 시작하기

```bash
cd lunch-receipt-web
npm install
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

## 프로젝트 구조

```
src/
├── App.tsx                  # 라우터 + 레이아웃
├── index.css                # 전역 스타일
├── pages/
│   ├── HomePage.tsx         # 대시보드
│   ├── AddReceiptPage.tsx   # 추가/수정 폼
│   ├── ReceiptListPage.tsx  # 목록 + 필터
│   └── SummaryPage.tsx      # 통계 차트
├── types/index.ts           # Receipt 타입
└── utils/
    ├── storage.ts           # localStorage CRUD
    └── helpers.ts           # 포맷 함수, 통계 계산
```

## 데이터 모델

```typescript
interface Receipt {
  id: string;          // UUID
  restaurantName: string;
  amount: number;      // 원 단위
  date: string;        // ISO 8601
  category: '한식' | '중식' | '일식' | '양식' | '분식' | '기타';
  paidBy: string;      // 결제자 이름
  attendees: number;   // 인원수
  notes?: string;
  createdAt: string;
}
```
