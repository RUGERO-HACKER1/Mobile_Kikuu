// app/(admin)/dashboard.tsx
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts'; 

import StatCard from '../component/admin/StatCard';
import SectionHeader from '../component/admin/SectionHeader';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;




const adminStats = [
    {
        id: '1',
        title: 'Total Revenue',
        value: '$12,485',
        iconName: 'cash-outline',
        colors: ['#22D3EE', '#0891B2'],
    },
    {
        id: '2',
        title: 'New Users',
        value: '241',
        iconName: 'people-outline',
        colors: ['#A78BFA', '#7C3AED'],
    },
    {
        id: '3',
        title: 'Orders Today',
        value: '89',
        iconName: 'cube-outline',
        colors: ['#FBBF24', '#D97706'],
    },
];

const weeklyRevenueData = [
    { value: 1500, label: 'Mon' },
    { value: 2100, label: 'Tue' },
    { value: 1800, label: 'Wed' },
    { value: 2800, label: 'Thu' },
    { value: 2500, label: 'Fri' },
    { value: 3200, label: 'Sat' },
    { value: 3000, label: 'Sun' },
];

const recentActivities = [
    { id: 'a1', type: 'order', icon: 'receipt-outline', text: 'New order #KIKU7891', subtext: '$125.50 - 2m ago'},
    { id: 'a2', type: 'user', icon: 'person-add-outline', text: 'New user signed up', subtext: 'john.d@example.com - 1h ago'},
    { id: 'a3', type: 'review', icon: 'star-outline', text: 'New product review', subtext: '5 stars for "Smart Watch" - 3h ago'},
];


const transactionData = [
    { icon: 'heart', color: '#7DBF8B', text: 'Health and beauty', value: '322$', type: 'value' },
    { icon: 'card', color: '#FBBF24', text: 'Transfers from card', value: '422$', type: 'value' },
    { icon: 'close-circle', color: '#7DBF8B', text: 'Cafes and restaurants', value: '30%', type: 'percentage' },
    { icon: 'person', color: '#EF4444', text: 'The rest', value: '10$', type: 'value' },
];

const barChartData = [
    { value: 450, label: 'Mon', frontColor: '#7DBF8B' },
    { value: 780, label: 'Tue', frontColor: '#7DBF8B' },
    { value: 900, label: 'Wed', frontColor: '#7DBF8B' },
    { value: 550, label: 'Thu', frontColor: '#7DBF8B' },
    { value: 820, label: 'Fri', frontColor: '#7DBF8B' },
    { value: 300, label: 'Sat', frontColor: '#7DBF8B' },
    { value: 700, label: 'Sun', frontColor: '#7DBF8B' },
];


const lineChartData1 = [
    { value: 40, label: 'Mon' }, { value: 60, label: 'Tue' }, { value: 45, label: 'Wed' }, 
    { value: 70, label: 'Thu' }, { value: 55, label: 'Fri' }, { value: 65, label: 'Sat' }, 
    { value: 50, label: 'Sun' }
];
const lineChartData2 = [
    { value: 20, label: 'Jan' }, { value: 30, label: 'Feb' }, { value: 25, label: 'Mar' }, 
    { value: 40, label: 'Apr' }, { value: 35, label: 'May' }, { value: 28, label: 'Jun' }, 
    { value: 22, label: 'Jul' }
];



type OrderStatus = 'Pending' | 'Completed' | 'Delivered' | 'Aborted';

interface Order {
    id: string;
    client: string;
    product: string;
    quantity: number;
    amount: number;
    payment: 'Card' | 'Cash' | 'Crypto';
    status: OrderStatus;
    date: string;
}

const mockOrders: Order[] = [
    { id: 'KIKU7891', client: 'Jane Doe', product: 'Smart Watch X9', quantity: 1, amount: 125.50, payment: 'Card', status: 'Delivered', date: '2025-10-01' },
    { id: 'KIKU7892', client: 'John Smith', product: 'Gaming Headset', quantity: 2, amount: 79.98, payment: 'Cash', status: 'Pending', date: '2025-10-01' },
    { id: 'KIKU7893', client: 'Alice Johnson', product: 'Wireless Mouse', quantity: 5, amount: 99.75, payment: 'Crypto', status: 'Completed', date: '2025-09-30' },
    { id: 'KIKU7894', client: 'Bob Williams', product: 'Mechanical Keyboard', quantity: 1, amount: 89.99, payment: 'Card', status: 'Aborted', date: '2025-09-29' },
    { id: 'KIKU7895', client: 'Eva Brown', product: '4K Monitor', quantity: 1, amount: 349.00, payment: 'Card', status: 'Delivered', date: '2025-09-28' },
];


const tabs = [
    { key: 'dashboard', title: 'Dashboard', icon: 'analytics-outline' },
    { key: 'card', title: 'Card', icon: 'card-outline' }, 
    { key: 'statistics', title: 'Statistics', icon: 'stats-chart-outline' }, 
    { key: 'history', title: 'History', icon: 'time-outline' }, 
    { key: 'orders', title: 'Orders', icon: 'list-circle-outline' }, // <-- NEW ORDERS TAB
];


const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
        case 'Delivered':
            return { backgroundColor: '#D1FAE5', color: '#059669', icon: 'checkmark-circle-outline' }; // Green
        case 'Completed':
            return { backgroundColor: '#D9F7FF', color: '#0891B2', icon: 'cube-outline' }; // Blue
        case 'Pending':
            return { backgroundColor: '#FEF3C7', color: '#D97706', icon: 'time-outline' }; // Yellow/Orange
        case 'Aborted':
            return { backgroundColor: '#FEE2E2', color: '#EF4444', icon: 'close-circle-outline' }; // Red
        default:
            return { backgroundColor: '#E5E7EB', color: '#4B5563', icon: 'help-circle-outline' };
    }
};


const DashboardContent = ({ router }: { router: ReturnType<typeof useRouter> }) => (
    <>
        <FlatList
            data={adminStats}
            renderItem={({ item }) => (
                <StatCard
                    title={item.title}
                    value={item.value}
                    iconName={item.iconName as any}
                    colors={item.colors as [string, string]}
                />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
        />
        <SectionHeader title="Revenue Analytics" onSeeAll={() => router.push('/profile')} />
        <View style={styles.chartContainer}>
            <BarChart
                data={weeklyRevenueData}
                barWidth={22}
                initialSpacing={10}
                spacing={25}
                barBorderRadius={4}
                frontColor="#0891B2"
                yAxisTextStyle={{ color: '#6B7280' }}
                xAxisLabelTextStyle={{ color: '#6B7280', paddingTop: 5 }}
                isAnimated
            />
        </View>
        <SectionHeader title="Recent Activity" onSeeAll={() => router.push('/profile')} />
        <View style={styles.activityListContainer}>
            {recentActivities.map(activity => (
                <View key={activity.id} style={styles.activityItem}>
                    <View style={[styles.activityIcon, {backgroundColor: activity.type === 'order' ? '#E0F2FE' : '#EDE9FE'}]}>
                        <Ionicons name={activity.icon as any} size={22} color={activity.type === 'order' ? '#0891B2' : '#7C3AED'}/>
                    </View>
                    <View style={styles.activityTextContainer}>
                        <Text style={styles.activityText}>{activity.text}</Text>
                        <Text style={styles.activitySubtext}>{activity.subtext}</Text>
                    </View>
                </View>
            ))}
        </View>
    </>
);


const CardContent = () => (
    <View style={styles.cardTabContainer}>
        <View style={styles.cardHeader}>
            <Ionicons name="menu-outline" size={28} color="#333" />
            <Text style={styles.cardHeaderText}>Card</Text>
            <Ionicons name="person-circle-outline" size={28} color="#333" />
        </View>
        <View style={styles.cardStackContainer}>
            <View style={[styles.creditCard, styles.creditCardBack1]}></View>
            <View style={[styles.creditCard, styles.creditCardBack2]}></View>
            <View style={[styles.creditCard, styles.creditCardFront]}>
                <Text style={styles.bankName}>BK</Text>
                <View style={styles.chip}></View>
                <Text style={styles.cardNumber}>1234 1234 1234 1234</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardHolderName}>RUGERO</Text>
                    <Text style={styles.expiryDate}>02/00</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.addCardButton}>
                <Ionicons name="add-circle-outline" size={30} color="#0891B2" />
            </TouchableOpacity>
        </View>
        <View style={styles.cardStatsContainer}>
            <View style={styles.cardStatItem}>
                <Text style={styles.cardStatValue}>44</Text>
                <Text style={styles.cardStatLabel}>Interactions</Text>
            </View>
            <View style={styles.cardStatItem}>
                <Text style={styles.cardStatValue}>740</Text>
                <Text style={styles.cardStatLabel}>Views</Text>
                <Text style={styles.cardStatChange}>+ 5% from last week</Text>
            </View>
            <View style={styles.cardStatItem}>
                <Text style={styles.cardStatValue}>9 101.50</Text>
                <Text style={styles.cardStatLabel}>Profit</Text>
                <View style={styles.progressBarBackground}>
                    <View style={styles.progressBarFill}></View>
                </View>
            </View>
        </View>
        <View style={styles.savedCardsContainer}>
            <View style={styles.savedCardItem}>
                <View style={styles.savedCardLabel}>
                    <Text style={styles.savedCardLabelText}>CARD</Text>
                </View>
                <Text style={styles.savedCardNumber}>**** **** **** 1234</Text>
                <TouchableOpacity style={[styles.removeButton, {backgroundColor: '#EF4444'}]}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.savedCardItem}>
                <View style={styles.savedCardLabel}>
                    <Text style={styles.savedCardLabelText}>CARD</Text>
                </View>
                <Text style={styles.savedCardNumber}>**** **** **** 6776</Text>
                <TouchableOpacity style={[styles.removeButton, {backgroundColor: '#EF4444'}]}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.analyticsSection}>
            <View style={styles.analyticsItem}>
                <Ionicons name="ellipse" size={8} color="#0891B2" style={styles.analyticsBullet} />
                <Text style={styles.analyticsText}>Day</Text>
                <Text style={styles.analyticsSubtext}>Analytics</Text>
                <View style={styles.analyticsBarContainer}>
                    <Ionicons name="bar-chart-outline" size={20} color="#0891B2" />
                    <View style={[styles.analyticsBar, {width: '80%'}]}></View>
                </View>
            </View>
            <View style={styles.analyticsItem}>
                <Ionicons name="ellipse" size={8} color="#0891B2" style={styles.analyticsBullet} />
                <Text style={styles.analyticsText}>Week</Text>
                <Text style={styles.analyticsSubtext}>Analytics</Text>
                <View style={styles.analyticsBarContainer}>
                    <Ionicons name="bar-chart-outline" size={20} color="#0891B2" />
                    <View style={[styles.analyticsBar, {width: '95%'}]}></View>
                </View>
            </View>
            <View style={styles.analyticsItem}>
                <Ionicons name="ellipse" size={8} color="#0891B2" style={styles.analyticsBullet} />
                <Text style={styles.analyticsText}>Month</Text>
                <Text style={styles.analyticsSubtext}>Analytics</Text>
                <View style={styles.analyticsBarContainer}>
                    <Ionicons name="bar-chart-outline" size={20} color="#0891B2" />
                    <View style={[styles.analyticsBar, {width: '60%'}]}></View>
                </View>
            </View>
        </View>
    </View>
);
 const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: () => {
                        clearCart();
                        router.replace("/profile");
                    },
                },
            ]
        );
    };

const StatisticsContent = () => {
    return (
        <View style={styles.statsTabContainer}>
            <View style={styles.statsHeader}>
                <Ionicons name="menu-outline" size={28} color="#333" />
                <Text style={styles.statsHeaderText}>Statistics</Text>
                <Ionicons name="person-circle-outline" size={28} color="#333" />
            </View>
            <View style={styles.statsSectionContainer}>
                <View style={styles.statsHeaderRow}>
                    <Text style={styles.statsSectionTitle}>Week</Text>
                    <Ionicons name="ellipsis-horizontal-circle-outline" size={20} color="#94A3B8" />
                </View>
                <Text style={styles.statsSubtitle}>Analytics</Text>
                <View style={styles.gaugeContainer}>
                    {/* Gauge Circle Simulation */}
                    <View style={styles.gaugeCircle}>
                        <View style={styles.gaugeInnerCircle}>
                            <Text style={styles.gaugeText}>CARD</Text>
                            <Text style={styles.gaugeSubtext}>CARD</Text>
                            <Text style={styles.gaugePercentage}>50%</Text>
                        </View>
                        <View style={styles.gaugeFill}>
                            <View style={styles.gaugeNeedle}></View>
                        </View>
                    </View>
                    <View style={styles.gaugeLabels}>
                        <Text style={styles.gaugeLabel}>Start 0%</Text>
                        <Text style={styles.gaugeLabel}>Pro 100%</Text>
                    </View>
                </View>
            </View>
            <View style={styles.statsSectionContainer}>
                <View style={styles.statsHeaderRow}>
                    <Text style={styles.statsSectionTitle}>General</Text>
                    <TouchableOpacity style={styles.selectButton}>
                        <Text style={styles.selectButtonText}>Select</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.chartContainerStats}>
                    <LineChart 
                        data={lineChartData1}
                        areaChart
                        curved
                        color="#4CAF50"
                        startFillColor="#7DBF8B"
                        endFillColor="#E8F5E9"
                        startOpacity={0.8}
                        endOpacity={0.1}
                        hideDataPoints
                        hideRules
                        hideAxesAndRules
                        initialSpacing={0}
                        spacing={30}
                        height={100}
                        showYAxisIndices
                        hideOrigin
                        disableScroll
                    />
                                <TouchableOpacity  onPress={handleLogout}>
                                    <MaterialCommunityIcons name="logout" size={22} color="#ef4444" />
                                    <Text> Logout</Text>
                                </TouchableOpacity>
                </View>
            </View>
            <View style={styles.statsSectionContainer}>
                <View style={styles.statsHeaderRow}>
                    <Text style={styles.statsSectionTitle}>General</Text>
                    <TouchableOpacity style={styles.selectButton}>
                        <Text style={styles.selectButtonText}>Select</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.chartContainerStats}>
                     <LineChart 
                        data={lineChartData2}
                        curved
                        color="#4CAF50"
                        hideDataPoints
                        hideRules
                        hideAxesAndRules
                        initialSpacing={0}
                        spacing={35}
                        height={100}
                        showYAxisIndices
                        hideOrigin
                        disableScroll
                    />
                </View>
            </View>
            <View style={styles.infoCardsRow}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Deposit</Text>
                    <Text style={styles.infoCardText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
                    <Ionicons name="wallet-outline" size={24} color="#4CAF50" style={styles.infoCardIcon} />
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Financial</Text>
                    <Text style={styles.infoCardText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</Text>
                    <Ionicons name="bar-chart-outline" size={24} color="#4CAF50" style={styles.infoCardIcon} />
                </View>
            </View>
        </View>
    );
};


const HistoryContent = () => {
    return (
        <View style={styles.historyTabContainer}>
           
            <View style={styles.historyHeader}>
                <Ionicons name="menu-outline" size={28} color="#333" />
                <Text style={styles.historyHeaderText}>History</Text>
                <Ionicons name="person-circle-outline" size={28} color="#333" />
            </View>

          
            <View style={styles.donutChartWrapper}>
                <View style={styles.donutChartContainer}>
                    <View style={styles.donutOuterRing}>
                        <View style={[styles.donutSegment, { backgroundColor: '#7DBF8B', transform: [{ rotate: '0deg' }] }]} />
                        <View style={[styles.donutSegment, { backgroundColor: '#FBBF24', transform: [{ rotate: '90deg' }] }]} />
                        <View style={[styles.donutSegment, { backgroundColor: '#EF4444', transform: [{ rotate: '180deg' }] }]} />
                        <View style={[styles.donutSegment, { backgroundColor: '#7DBF8B', transform: [{ rotate: '270deg' }] }]} />
                    </View>

                    <View style={styles.donutInnerCircle}>
                        <Text style={styles.donutCenterValue}>900</Text>
                        <Text style={styles.donutCenterLabel}>February</Text>
                    </View>
                </View>
            </View>

          
            <Text style={styles.transactionHistoryTitle}>Transaction History</Text>
            <Text style={styles.transactionHistorySubtitle}>Aug 01, 20 11:42 pm</Text>

            <View style={styles.transactionListContainer}>
                {transactionData.map((item, index) => (
                    <View key={index} style={styles.transactionItem}>
                        <View style={styles.transactionIconText}>
                            <View style={[styles.transactionIconBg, { backgroundColor: item.color + '30' }]}>
                                <Ionicons name={item.icon as any} size={18} color={item.color} />
                            </View>
                            <Text style={styles.transactionText}>{item.text}</Text>
                        </View>
                        <Text style={[styles.transactionValue, { color: item.type === 'value' ? '#333' : '#7DBF8B' }]}>
                            {item.value}
                        </Text>
                    </View>
                ))}
            </View>

            
            <View style={styles.analysisContainer}>
                <View style={styles.analysisHeaderRow}>
                    <View>
                        <Text style={styles.analysisTitle}>Analysis</Text>
                        <Text style={styles.analysisSubtext}>Selected details</Text>
                    </View>
                    <View style={styles.analysisRightColumn}>
                        <Text style={styles.analysisRightText}>All Profit</Text>
                        <Text style={styles.analysisRightText}>Hidden accounts</Text>
                    </View>
                </View>

                <View style={styles.analysisChartContainer}>
                    <BarChart
                        data={barChartData}
                        barWidth={10}
                        spacing={35}
                        frontColor="#7DBF8B"
                        yAxisTextStyle={{ color: '#94A3B8', fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: '#94A3B8', fontSize: 10 }}
                        isAnimated
                        showGrid={false}
                        showXAxisIndices={false}
                        hideOrigin={false}
                        height={120}
                        disableScroll
                        showYAxisIndices
                        showValuesAsDataPointsText={false}
                        yAxisLabelTexts={['0', '200', '400', '600', '800']}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        width={width - 80}
                    />
                </View>
            </View>
        </View>
    );
};


const OrdersContent = () => {
    
    const [orders, setOrders] = useState(mockOrders);

    const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        // In a real app, you would make an API call here.
        console.log(`Updating order ${orderId} status to ${newStatus}`);
    };

    const renderOrderItem = ({ item }: { item: Order }) => {
        const statusStyles = getStatusStyles(item.status);
        // const allStatuses: OrderStatus[] = ['Pending', 'Completed', 'Delivered', 'Aborted']; // Kept for logic reference

        return (
            <View style={styles.orderItemCard}>
                {/* Order ID and Date */}
                <View style={styles.orderDetailRow}>
                    <Text style={styles.orderIdText}>Order **#{item.id}**</Text>
                    <Text style={styles.orderDateText}>{item.date}</Text>
                </View>

                {/* Product and Client Info */}
                <View style={styles.orderProductInfo}>
                    <Ionicons name="bag-handle-outline" size={20} color="#64748B" style={{ marginRight: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.orderProductText}>{item.product} (x{item.quantity})</Text>
                        <Text style={styles.orderClientText}>Client: {item.client}</Text>
                    </View>
                </View>

                {/* Payment Method and Amount */}
                <View style={styles.orderDetailRow}>
                    <View style={styles.orderPaymentContainer}>
                        <Ionicons name="card-outline" size={16} color="#4B5563" />
                        <Text style={styles.orderPaymentText}>{item.payment}</Text>
                    </View>
                    <Text style={styles.orderAmountText}>${item.amount.toFixed(2)}</Text>
                </View>

                {/* Status Management */}
                <View style={styles.orderStatusContainer}>
                    {/* Current Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusStyles.backgroundColor }]}>
                        <Ionicons name={statusStyles.icon as any} size={14} color={statusStyles.color} />
                        <Text style={[styles.statusText, { color: statusStyles.color }]}>{item.status}</Text>
                    </View>

                    {/* Status Update Button (Simulates opening a selection tool) */}
                    <TouchableOpacity 
                        style={styles.updateStatusButton} 
                        onPress={() => console.log(`Opening full status details for ${item.id}`)}
                    >
                        <Text style={styles.updateStatusButtonText}>Update Status</Text>
                        <Ionicons name="chevron-down-outline" size={14} color="#0891B2" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.ordersTabContainer}>
            {/* Header */}
            <View style={styles.ordersHeader}>
                <Ionicons name="list-circle-outline" size={28} color="#333" />
                <Text style={styles.ordersHeaderText}>Client Orders</Text>
                <TouchableOpacity style={styles.filterButton}>
                     <Ionicons name="filter-outline" size={24} color="#0891B2" />
                </TouchableOpacity>
            </View>

            {/* Orders List */}
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.ordersListContent}
                ListEmptyComponent={() => (
                    <View style={styles.placeholderContainer}>
                        <Ionicons name="sad-outline" size={50} color="#94A3B8" />
                        <Text style={styles.placeholderText}>No orders found.</Text>
                    </View>
                )}
            />
        </View>
    );
};


// --- MAIN COMPONENT ---
const AdminDashboard = () => {
    const router = useRouter();
    // Set 'orders' as the initial active tab 
    const [activeTab, setActiveTab] = useState(tabs[4].key); 

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardContent router={router} />;
            case 'card':
                return <CardContent />; 
            case 'statistics':
                return <StatisticsContent />; 
            case 'history':
                return <HistoryContent />; 
            case 'orders':
                return <OrdersContent />; // <-- Renders the new component
            default:
                return null;
        }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {/* Only show default header for Dashboard tab */}
      {activeTab === 'dashboard' && ( 
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome, Admin</Text>
            <Text style={styles.headerSubtitle}>Here is your Kikuu summary.</Text>
          </View>
      )}

      {/* --- Custom Tab Bar --- */}
      <View style={styles.tabBar}>
          {tabs.map((tab) => (
              <TouchableOpacity
                  key={tab.key}
                  style={styles.tabItem}
                  onPress={() => setActiveTab(tab.key)}
              >
                  <Ionicons 
                      name={tab.icon as any} 
                      size={20} 
                      color={activeTab === tab.key ? '#0891B2' : '#64748B'}
                  />
                  <Text style={[
                      styles.tabText, 
                      { color: activeTab === tab.key ? '#0891B2' : '#64748B' }
                  ]}>
                      {tab.title}
                  </Text>
                  {activeTab === tab.key && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
          ))}
      </View>
      {/* --- End Custom Tab Bar --- */}

      <ScrollView contentContainerStyle={styles.container}>
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        paddingVertical: 20,
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#64748B',
        marginTop: 4,
    },
    
    // --- Tab Bar Styles ---
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginHorizontal: 20, 
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 4,
        position: 'relative',
    },
    tabText: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: -10,
        height: 3,
        width: '60%',
        backgroundColor: '#0891B2',
        borderRadius: 1.5,
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        minHeight: 300,
    },
    placeholderText: {
        marginTop: 10,
        fontSize: 18,
        color: '#94A3B8',
        fontWeight: '500',
    },
    
    // --- Dashboard Content Styles ---
    chartContainer: { marginHorizontal: 20, padding: 20, backgroundColor: 'white', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 20, },
    activityListContainer: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16, padding: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, },
    activityItem: { flexDirection: 'row', alignItems: 'center', padding: 10, },
    activityIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 16, },
    activityTextContainer: { flex: 1, },
    activityText: { fontSize: 15, fontWeight: '600', color: '#334155', },
    activitySubtext: { fontSize: 13, color: '#64748B', marginTop: 2, },
    
    // --- Card Content Styles ---
    cardTabContainer: { flex: 1, paddingHorizontal: 0, },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, marginTop: -10, },
    cardHeaderText: { fontSize: 22, fontWeight: 'bold', color: '#333', },
    cardStackContainer: { alignItems: 'center', marginBottom: 30, height: 200, position: 'relative', },
    creditCard: { width: CARD_WIDTH, height: CARD_WIDTH * 0.6, borderRadius: 15, position: 'absolute', backgroundColor: '#2D9CDB', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5, padding: 20, justifyContent: 'space-between', },
    creditCardBack1: { backgroundColor: '#7DBF8B', top: 0, left: (width - CARD_WIDTH) / 2 + 10, transform: [{ rotate: '-3deg' }], opacity: 0.7, height: CARD_WIDTH * 0.55, },
    creditCardBack2: { backgroundColor: '#61A36F', top: 5, left: (width - CARD_WIDTH) / 2 - 10, transform: [{ rotate: '3deg' }], opacity: 0.8, height: CARD_WIDTH * 0.58, },
    creditCardFront: { backgroundColor: '#4CAF50', top: 20, left: (width - CARD_WIDTH) / 2, justifyContent: 'space-between', },
    bankName: { color: 'white', fontSize: 16, fontWeight: 'bold', alignSelf: 'flex-start', },
    chip: { width: 40, height: 30, backgroundColor: '#FFD700', borderRadius: 5, alignSelf: 'flex-start', marginTop: 10, },
    cardNumber: { color: 'white', fontSize: 20, letterSpacing: 2, fontWeight: 'bold', alignSelf: 'center', },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    cardHolderName: { color: 'white', fontSize: 14, textTransform: 'uppercase', },
    expiryDate: { color: 'white', fontSize: 14, },
    addCardButton: { position: 'absolute', bottom: 0, right: 30, backgroundColor: 'white', borderRadius: 25, padding: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, },
    cardStatsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', paddingHorizontal: 20, marginTop: 20, marginBottom: 30, },
    cardStatItem: { alignItems: 'center', flex: 1, },
    cardStatValue: { fontSize: 20, fontWeight: 'bold', color: '#333', },
    cardStatLabel: { fontSize: 12, color: '#666', marginTop: 2, },
    cardStatChange: { fontSize: 10, color: '#28A745', marginTop: 2, },
    progressBarBackground: { width: '80%', height: 5, backgroundColor: '#E0E0E0', borderRadius: 2.5, marginTop: 5, },
    progressBarFill: { width: '70%', height: '100%', backgroundColor: '#28A745', borderRadius: 2.5, },
    savedCardsContainer: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, },
    savedCardItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', },
    savedCardLabel: { backgroundColor: '#E0E0E0', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4, marginRight: 10, },
    savedCardLabelText: { fontSize: 10, fontWeight: 'bold', color: '#666', },
    savedCardNumber: { flex: 1, fontSize: 14, color: '#333', },
    removeButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5, },
    removeButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold', },
    analyticsSection: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 10, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, },
    analyticsItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, },
    analyticsBullet: { marginRight: 8, },
    analyticsText: { fontSize: 15, fontWeight: '600', color: '#333', width: 50, },
    analyticsSubtext: { fontSize: 13, color: '#999', flex: 1, },
    analyticsBarContainer: { flexDirection: 'row', alignItems: 'center', flex: 2, },
    analyticsBar: { height: 8, backgroundColor: '#0891B2', borderRadius: 4, marginLeft: 10, },
    
    // --- Statistics Content Styles ---
    statsTabContainer: { flex: 1, },
    statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, marginTop: -10, },
    statsHeaderText: { fontSize: 22, fontWeight: 'bold', color: '#333', },
    statsSectionContainer: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, },
    statsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, },
    statsSectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', },
    statsSubtitle: { fontSize: 13, color: '#94A3B8', marginBottom: 10, },
    selectButton: { backgroundColor: '#4CAF50', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, },
    selectButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold', },
    gaugeContainer: { alignItems: 'center', paddingVertical: 10, },
    gaugeCircle: { width: 150, height: 75, borderRadius: 75, borderTopLeftRadius: 75, borderTopRightRadius: 75, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, overflow: 'hidden', backgroundColor: '#E8F5E9', marginBottom: 10, position: 'relative', transform: [{ scaleX: 2 }], },
    gaugeInnerCircle: { position: 'absolute', width: '50%', height: '100%', backgroundColor: 'white', top: 0, left: '25%', transform: [{ scaleX: 0.5 }], justifyContent: 'center', alignItems: 'center', paddingTop: 15, },
    gaugeFill: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent', transform: [{ rotate: '50deg' }, { scaleX: 0.5 }], overflow: 'hidden', },
    gaugeNeedle: { width: 5, height: 75, backgroundColor: '#4CAF50', position: 'absolute', bottom: 0, left: '50%', marginLeft: -2.5, transform: [{ rotate: '-100deg' }], },
    gaugeText: { fontSize: 12, fontWeight: 'bold', color: '#666', },
    gaugeSubtext: { fontSize: 10, color: '#999', marginBottom: 5, },
    gaugePercentage: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', },
    gaugeLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginTop: -20, },
    gaugeLabel: { fontSize: 12, color: '#999', },
    chartContainerStats: { paddingHorizontal: 5, paddingBottom: 10, },
    infoCardsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, },
    infoCard: { backgroundColor: 'white', borderRadius: 16, padding: 15, width: '48%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, position: 'relative', minHeight: 120, },
    infoCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5, },
    infoCardText: { fontSize: 12, color: '#666', paddingRight: 30, },
    infoCardIcon: { position: 'absolute', top: 10, right: 10, },

    // --- History Content Styles ---
    historyTabContainer: { flex: 1, },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, marginTop: -10, },
    historyHeaderText: { fontSize: 22, fontWeight: 'bold', color: '#333', },
    donutChartWrapper: { alignItems: 'center', marginVertical: 10, },
    donutChartContainer: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', position: 'relative', },
    donutOuterRing: { position: 'absolute', width: 150, height: 150, borderRadius: 75, overflow: 'hidden', },
    donutSegment: { position: 'absolute', width: '50%', height: '50%', top: '50%', left: '50%', transformOrigin: 'top left', },
    donutInnerCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', },
    donutCenterValue: { fontSize: 24, fontWeight: 'bold', color: '#333', },
    donutCenterLabel: { fontSize: 12, color: '#999', },
    transactionHistoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginHorizontal: 20, marginTop: 20, },
    transactionHistorySubtitle: { fontSize: 12, color: '#999', marginHorizontal: 20, marginBottom: 10, },
    transactionListContainer: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, },
    transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, },
    transactionIconText: { flexDirection: 'row', alignItems: 'center', flex: 1, },
    transactionIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15, },
    transactionText: { fontSize: 15, fontWeight: '500', color: '#333', flex: 1, },
    transactionValue: { fontSize: 15, fontWeight: '600', },
    analysisContainer: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, },
    analysisHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15, },
    analysisTitle: { fontSize: 18, fontWeight: '600', color: '#333', },
    analysisSubtext: { fontSize: 12, color: '#94A3B8', },
    analysisRightColumn: { alignItems: 'flex-end', },
    analysisRightText: { fontSize: 12, color: '#7DBF8B', marginBottom: 2, },
    analysisChartContainer: { paddingVertical: 10, },

    // --- NEW Orders Content Styles ---
    ordersTabContainer: {
        flex: 1,
    },
    ordersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        marginTop: -10,
    },
    ordersHeaderText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    filterButton: {
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#E0F2FE',
    },
    ordersListContent: {
        paddingHorizontal: 20,
    },
    orderItemCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
    },
    orderDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderIdText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    orderDateText: {
        fontSize: 12,
        color: '#94A3B8',
    },
    orderProductInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 10,
    },
    orderProductText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
    },
    orderClientText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    orderPaymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderPaymentText: {
        fontSize: 14,
        color: '#4B5563',
        marginLeft: 5,
    },
    orderAmountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#059669', 
    },
    orderStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    updateStatusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    updateStatusButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0891B2',
        marginRight: 5,
    },
});

export default AdminDashboard;