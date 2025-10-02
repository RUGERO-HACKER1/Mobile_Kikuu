import { formatMoney, useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CheckoutScreen() {
  const { items, subtotalCents, currency, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { addMany: addPendingReviews } = useReviews();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [method, setMethod] = useState<'mobile' | 'card' | 'cod'>('mobile');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const placeOrder = () => {
    if (!fullName || !address || !city || !phone) {
      Alert.alert('Missing info', 'Please fill shipping details');
      return;
    }
    // Enforce OTP for mobile money
    if (method === 'mobile') {
      if (!otpSent) {
        Alert.alert('Phone confirmation required', 'Please send a confirmation code to your phone.');
        return;
      }
      if (!otpVerified) {
        Alert.alert('Enter code', 'Please verify the code we sent to your phone.');
        return;
      }
    }
    // Create an order record
    const orderId = `#${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'Processing',
      items: items.map((it) => ({ id: it.id, name: it.name, priceCents: it.priceCents, currency: it.currency, quantity: it.quantity })),
      subtotalCents,
      currency: currency ?? 'RWF',
    };
    addOrder(order);
    addPendingReviews(order.items.map((it) => ({ orderId: order.id, productId: it.id, productName: it.name })));
    clearCart();
    router.replace('/order-success');
  };

  const sendOtp = async () => {
    if (!phone) {
      Alert.alert('Phone required', 'Enter your phone number first.');
      return;
    }
    try {
      setIsSending(true);
      await new Promise((res) => setTimeout(res, 1000));
      setOtpSent(true);
      setOtpVerified(false);
      Alert.alert('Code sent', `We sent a 8-digit code to ${phone}.`);
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = () => {
    if (otpInput.trim() === '20070825') {
      setOtpVerified(true);
      Alert.alert('Verified', 'Phone number confirmed.');
    } else {
      setOtpVerified(false);
      Alert.alert('Invalid code', 'Please check the code and try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Shipping Details</Text>
      <TextInput style={styles.input} placeholder="Full name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.sectionTitle}>Order Summary</Text>
      {items.map((it) => (
        <View key={it.id} style={styles.summaryRow}>
          <Text style={styles.summaryText}>{it.name} x {it.quantity}</Text>
          <Text style={styles.summaryText}>{formatMoney(it.priceCents * it.quantity, it.currency)}</Text>
        </View>
      ))}
      <View style={[styles.summaryRow, { marginTop: 8 }]}> 
        <Text style={styles.summaryTotal}>Subtotal</Text>
        <Text style={styles.summaryTotal}>{formatMoney(subtotalCents, currency)}</Text>
      </View>

      {method === 'mobile' && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ marginBottom: 6, color: '#333' }}>Confirm your phone to approve payment</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={sendOtp} disabled={isSending} style={[styles.methodBtn, styles.sendBtn, isSending && { opacity: 0.6 }]}>
              <Text style={[styles.methodText, styles.sendBtnText]}>{isSending ? 'Sending...' : (otpSent ? 'Resend Code' : 'Send Code')}</Text>
            </TouchableOpacity>
          </View>
          {otpSent && (
            <View style={{ marginTop: 10 }}>
              <TextInput
                style={styles.input}
                placeholder="Enter 8-digit code"
                keyboardType="number-pad"
                maxLength={8}
                value={otpInput}
                onChangeText={setOtpInput}
              />
              <TouchableOpacity onPress={verifyOtp} style={[styles.methodBtn, styles.verifyBtn]}>
                <Text style={[styles.methodText, styles.verifyBtnText]}>Verify Code</Text>
              </TouchableOpacity>
              {otpVerified && <Text style={{ color: '#16a34a', marginTop: 6 }}>Phone verified</Text>}
            </View>
          )}
        </View>
      )}

      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.methodsRow}>
        {(['mobile','card','cod'] as const).map((m) => (
          <TouchableOpacity key={m} onPress={() => setMethod(m)} style={[styles.methodBtn, method === m && styles.methodBtnActive]}>
            <Text style={[styles.methodText, method === m && styles.methodTextActive]}>
              {m === 'mobile' ? 'Mobile Money' : m === 'card' ? 'Card' : 'Cash on Delivery'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.placeBtn} onPress={placeOrder}>
        <Text style={styles.placeText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 10,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryText: { color: '#333' },
  summaryTotal: { fontWeight: '700', fontSize: 16 },
  methodsRow: { flexDirection: 'row', gap: 10, marginVertical: 10 },
  methodBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  methodBtnActive: { backgroundColor: '#E3F2FD', borderColor: '#2196F3' },
  methodText: { color: '#333' },
  methodTextActive: { color: '#0b63c5', fontWeight: '700' },
  sendBtn: { backgroundColor: '#111827', borderColor: '#111827' },
  sendBtnText: { color: '#fff' },
  verifyBtn: { backgroundColor: '#16a34a', borderColor: '#16a34a', marginTop: 6 },
  verifyBtnText: { color: '#fff' },
  placeBtn: { backgroundColor: '#16a34a', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  placeText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});


