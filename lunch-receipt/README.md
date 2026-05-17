# 🍱 점심 영수증 정리 앱

회사 점심 영수증을 간편하게 기록하고 관리하는 모바일 앱입니다.

## 주요 기능

| 화면 | 기능 |
|------|------|
| **홈** | 이번 달 지출 요약, 최근 영수증 목록 |
| **영수증 목록** | 월별 필터링, 수정/삭제, 합계 표시 |
| **통계** | 카테고리별·월별 지출 차트, 1인당 평균 |
| **영수증 추가/수정** | 식당명, 금액, 날짜, 카테고리, 결제자, 인원수, 메모 |

## 기술 스택

- **React Native** 0.73 + **TypeScript**
- **React Navigation** (Bottom Tabs + Native Stack)
- **AsyncStorage** — 로컬 데이터 저장
- **UUID** — 영수증 고유 ID 생성

## 프로젝트 구조

```
lunch-receipt/
├── App.tsx                   # 앱 진입점
├── index.js
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx  # 탭 + 스택 네비게이션
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── AddReceiptScreen.tsx
│   │   ├── ReceiptListScreen.tsx
│   │   └── SummaryScreen.tsx
│   ├── types/
│   │   └── index.ts          # Receipt, Category 타입 정의
│   └── utils/
│       ├── storage.ts        # AsyncStorage CRUD
│       └── helpers.ts        # 포맷 함수, 통계 계산
├── package.json
└── tsconfig.json
```

## 시작하기

```bash
cd lunch-receipt
npm install

# iOS
npx pod-install ios
npm run ios

# Android
npm run android
```

## 데이터 모델

```typescript
interface Receipt {
  id: string;            // UUID
  restaurantName: string;
  amount: number;        // 원 단위
  date: string;          // ISO 8601
  category: '한식' | '중식' | '일식' | '양식' | '분식' | '기타';
  paidBy: string;        // 결제자 이름
  attendees: number;     // 인원수
  notes?: string;
  createdAt: string;
}
```
