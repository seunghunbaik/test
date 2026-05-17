import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { saveReceipt, getReceipts, updateReceipt } from '../utils/storage';
import { Receipt, CATEGORIES, ReceiptCategory } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type RouteType = RouteProp<RootStackParamList, 'AddReceipt'>;

const today = () => new Date().toISOString().split('T')[0];

const AddReceiptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const editId = route.params?.receiptId;

  const [restaurantName, setRestaurantName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState<ReceiptCategory>('한식');
  const [paidBy, setPaidBy] = useState('');
  const [attendees, setAttendees] = useState('1');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!editId) return;
    getReceipts().then(all => {
      const r = all.find(x => x.id === editId);
      if (!r) return;
      setRestaurantName(r.restaurantName);
      setAmount(String(r.amount));
      setDate(r.date.split('T')[0]);
      setCategory(r.category);
      setPaidBy(r.paidBy);
      setAttendees(String(r.attendees));
      setNotes(r.notes ?? '');
    });
  }, [editId]);

  const handleSave = async () => {
    if (!restaurantName.trim()) {
      Alert.alert('입력 오류', '식당명을 입력해주세요.');
      return;
    }
    const numAmount = Number(amount.replace(/,/g, ''));
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('입력 오류', '올바른 금액을 입력해주세요.');
      return;
    }
    if (!paidBy.trim()) {
      Alert.alert('입력 오류', '결제자를 입력해주세요.');
      return;
    }

    const receipt: Receipt = {
      id: editId ?? uuidv4(),
      restaurantName: restaurantName.trim(),
      amount: numAmount,
      date: new Date(date).toISOString(),
      category,
      paidBy: paidBy.trim(),
      attendees: Math.max(1, Number(attendees) || 1),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    if (editId) {
      await updateReceipt(receipt);
    } else {
      await saveReceipt(receipt);
    }
    navigation.goBack();
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Field label="식당명 *">
            <TextInput
              style={styles.input}
              value={restaurantName}
              onChangeText={setRestaurantName}
              placeholder="식당 이름을 입력하세요"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
            />
          </Field>

          <Field label="금액 (원) *">
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="예) 45000"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
            />
          </Field>

          <Field label="날짜 *">
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9CA3AF"
            />
          </Field>

          <Field label="음식 카테고리">
            <View style={styles.categoryRow}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.categoryBtn, category === c && styles.categoryBtnActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.categoryBtnText, category === c && styles.categoryBtnTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label="결제자 *">
            <TextInput
              style={styles.input}
              value={paidBy}
              onChangeText={setPaidBy}
              placeholder="결제한 사람 이름"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
            />
          </Field>

          <Field label="인원수">
            <TextInput
              style={styles.input}
              value={attendees}
              onChangeText={setAttendees}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#9CA3AF"
            />
          </Field>

          <Field label="메모">
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="추가 메모 (선택)"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </Field>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>
              {editId ? '✓ 수정 완료' : '+ 영수증 저장'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  form: { padding: 20, paddingBottom: 40 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: { height: 90 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  categoryBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  categoryBtnText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  categoryBtnTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 17,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddReceiptScreen;
