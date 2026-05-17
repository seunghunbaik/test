import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getReceipts } from '../utils/storage';
import { getMonthlySummary, formatCurrency } from '../utils/helpers';
import { Receipt, CATEGORIES } from '../types';

const BAR_COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#8B5CF6'];

const SummaryScreen = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  useFocusEffect(
    useCallback(() => {
      getReceipts().then(setReceipts);
    }, []),
  );

  const changeMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setMonth(m);
    setYear(y);
  };

  const summary = getMonthlySummary(receipts, year, month);

  const monthlyReceipts = receipts.filter(r => {
    const d = new Date(r.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const perPersonAvg = monthlyReceipts.length > 0
    ? Math.round(monthlyReceipts.reduce((sum, r) => sum + r.amount / r.attendees, 0) / monthlyReceipts.length)
    : 0;

  const maxCatAmount = Math.max(...CATEGORIES.map(c => summary.categoryBreakdown[c] ?? 0), 1);

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    let m = month - 5 + i;
    let y = year;
    while (m < 1) { m += 12; y -= 1; }
    while (m > 12) { m -= 12; y += 1; }
    return { label: `${m}월`, total: getMonthlySummary(receipts, y, m).totalAmount };
  });
  const maxMonthly = Math.max(...last6Months.map(x => x.total), 1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.monthNav}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navBtn}>
          <Text style={styles.navArrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{year}년 {month}월</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navBtn}>
          <Text style={styles.navArrow}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: '총 지출', value: formatCurrency(summary.totalAmount) },
          { label: '영수증 수', value: `${summary.receiptCount}건` },
          { label: '건당 평균', value: formatCurrency(summary.averageAmount) },
          { label: '1인당 평균', value: formatCurrency(perPersonAvg) },
        ].map(({ label, value }) => (
          <View key={label} style={styles.statCard}>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>카테고리별 지출</Text>
        {CATEGORIES.map((cat, i) => {
          const amt = summary.categoryBreakdown[cat] ?? 0;
          return (
            <View key={cat} style={styles.barRow}>
              <Text style={styles.barLabel}>{cat}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(amt / maxCatAmount) * 100}%`,
                      backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                    },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{formatCurrency(amt)}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>월별 지출 추이 (최근 6개월)</Text>
        {last6Months.map(({ label, total }) => (
          <View key={label} style={styles.barRow}>
            <Text style={styles.barLabel}>{label}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${(total / maxMonthly) * 100}%`, backgroundColor: '#2563EB' },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{formatCurrency(total)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navBtn: { padding: 12 },
  navArrow: { fontSize: 16, color: '#2563EB' },
  monthTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', width: 130, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statLabel: { fontSize: 12, color: '#6B7280', marginBottom: 6 },
  statValue: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  card: {
    margin: 12,
    marginTop: 4,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 14 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  barLabel: { width: 38, fontSize: 12, color: '#374151' },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 7,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: { height: '100%', borderRadius: 7, minWidth: 4 },
  barValue: { width: 72, fontSize: 11, color: '#374151', textAlign: 'right' },
});

export default SummaryScreen;
