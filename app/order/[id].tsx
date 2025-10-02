import { formatMoney } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { orders } = useOrders();

	const order = orders.find(o => o.id === id);

	if (!order) {
		return (
			<View style={styles.container}> 
				<Text style={styles.title}>Order not found</Text>
				<TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
					<Text style={styles.primaryText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Order {order.id}</Text>
			<Text style={styles.meta}>Date: {order.createdAt.split('T')[0]}</Text>
			<Text style={styles.meta}>Status: {order.status}</Text>

			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Items</Text>
				{order.items.map(item => (
					<View key={item.id} style={styles.itemRow}>
						<View style={{ flex: 1 }}>
							<Text style={styles.itemName}>{item.name}</Text>
							<Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
						</View>
						<Text style={styles.itemPrice}>{formatMoney(item.priceCents * item.quantity, item.currency)}</Text>
					</View>
				))}
				<View style={styles.divider} />
				<View style={styles.totalRow}>
					<Text style={styles.totalLabel}>Subtotal</Text>
					<Text style={styles.totalValue}>{formatMoney(order.subtotalCents, order.currency)}</Text>
				</View>
			</View>

			<TouchableOpacity
				style={[styles.primaryBtn, { marginTop: 16 }]}
				onPress={() => router.push({ pathname: '/dashboard', params: { tab: 'payments' } })}
			>
				<Text style={styles.primaryText}>Pay Now</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 6 },
	meta: { color: '#6b7280', marginBottom: 4 },
	card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 12 },
	sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111827' },
	itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
	itemName: { fontWeight: '600', fontSize: 15, color: '#1f2937' },
	itemMeta: { color: '#6b7280', marginTop: 2 },
	itemPrice: { fontWeight: '700', color: '#111827' },
	divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },
	totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	totalLabel: { color: '#374151', fontWeight: '600' },
	totalValue: { color: '#111827', fontWeight: '800' },
	primaryBtn: { backgroundColor: '#4f46e5', padding: 14, borderRadius: 8, alignItems: 'center' },
	primaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
