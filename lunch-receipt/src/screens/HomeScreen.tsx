import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getReceipts } from '../utils/storage';
import { getMonthlySummary, formatCurrency, formatDate } from '../utils/helpers';
import { Receipt } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavProp>();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const loadData = useCallback(async () => {
    const data = await getReceipts();
    setReceipts(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const summary = getMonthlySummary(receipts, year, month);
  const recent = receipts.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>이번 달 점심 현황</Text>
        <Text style={styles.headerTitle}>{year}년 {month}월</Text>
        <View style={styles.summaryCards}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>총 지출</Text>
            <Text style={styles.cardValue}>{formatCurrency(summary.totalAmount)}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>영수증 수</Text>
            <Text style={styles.cardValue}>{summary.receiptCount}건</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>건당 평균</Text>
            <Text style={styles.cardValue}>{formatCurrency(summary.averageAmount)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 영수증</Text>
        {recent.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyText}>등록된 영수증이 없습니다.{"\n"}아래 버튼으로 추가해보세요!</Text>
          </View>
        ) : (
          recent.map(r => (
            <View key={r.id} style={styles.receiptItem}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{r.category}</Text>
              </View>
              <View style={styles.receiptInfo}>
                <Text style={styles.restaurantName}>{r.restaurantName}</Text>
                <Text style={styles.receiptMeta}>{formatDate(r.date)} · {r.paidBy} 결제 · {r.attendees}명</Text>
              </View>
              <Text style={styles.receiptAmount}>{formatCurrency(r.amount)}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddReceipt', {})}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ 영수증 추가</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#2563EB', padding: 24, paddingBottom: 32 },
  headerSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 4 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  summaryCards: { flexDirection: 'row', gap: 10 },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    padding: 14,
  },
  cardLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginBottom: 6 },
  cardValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  section: { margin: 16, marginTop: -16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    marginTop: 8,
  },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', lineHeight: 22 },
  receiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
  },
  categoryText: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
  receiptInfo: { flex: 1 },
  restaurantName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  receiptMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  receiptAmount: { fontSize: 14, fontWeight: 'bold', color: '#2563EB' },
  addButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;
