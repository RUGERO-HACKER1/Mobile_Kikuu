import { formatMoney, useCart } from "@/contexts/CartContext";
import { Order, useOrders } from "@/contexts/OrdersContext"; // FIX: Consolidated import and imported Order type
import { useReviews } from "@/contexts/ReviewsContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
    FontAwesome,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    useWindowDimensions,
    type ColorValue, // FIX: Import ColorValue for LinearGradient type
    type KeyboardTypeOptions,
    type StyleProp,
    type ViewStyle,
    type DimensionValue, // FIX: Import DimensionValue for flexBasis type
} from "react-native";

// ====================================================================================
//  Featured Products (single source of truth)
// ====================================================================================
const FEATURED_PRODUCTS = [
    {
        id: "p1",
        name: "Wireless Earbuds",
        priceCents: 499900,
        currency: "RWF",
        image: "https://images.unsplash.com/photo-1585386959984-a41552231658?w=400&auto=format&fit=crop&q=60",
    },
    {
        id: "p2",
        name: "Smartwatch",
        priceCents: 1999900,
        currency: "RWF",
        image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=400&auto=format&fit=crop&q=60",
    },
    {
        id: "p3",
        name: "Portable Speaker",
        priceCents: 755000,
        currency: "RWF",
        image: "https://images.unsplash.com/photo-1518444084346-85f9b2e5f329?w=400&auto=format&fit=crop&q=60",
    },
];

// ====================================================================================
//  Reusable UI Components
// ====================================================================================

type HeaderProps = { title: string };
const Header = ({ title }: HeaderProps) => (
    <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
    </View>
);

type CardProps = { title: string; value: string; icon: React.ReactNode; containerStyle?: StyleProp<ViewStyle> };
const Card = ({ title, value, icon, containerStyle }: CardProps) => (
    <View style={[styles.card, containerStyle]}>
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
            {icon}
        </View>
        <Text style={styles.cardValue}>{value}</Text>
    </View>
);

// Reusable gradient card matching the reference look
type GradientCardProps = {
    title: string;
    value?: string;
    icon?: React.ReactNode;
    // FIX(TS2769): Explicitly set a tuple type with at least two ColorValue elements.
    colors?: readonly [ColorValue, ColorValue, ...ColorValue[]]; 
    containerStyle?: StyleProp<ViewStyle>;
};

// FIX(TS2769): Ensure default colors satisfy the tuple type requirement.
const DEFAULT_COLORS: readonly [ColorValue, ColorValue] = ["#ff2f88", "#7a4dff"];

const GradientCard = ({ title, value, icon, colors = DEFAULT_COLORS, containerStyle }: GradientCardProps) => (
    <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gcard, containerStyle]}
    >
        <View style={styles.gcardHeader}>
            <Text style={styles.gcardTitle}>{title}</Text>
            {icon}
        </View>
        {!!value && <Text style={styles.gcardValue}>{value}</Text>}
    </LinearGradient>
);

// FIX(ESLint: unused-vars): Removed as requested by the linter, but kept here just in case it was needed elsewhere.
/*
type TotalOrdersCardProps = { containerStyle?: StyleProp<ViewStyle> };
const TotalOrdersCard = ({ containerStyle }: TotalOrdersCardProps) => {
    const { orders } = useOrders();
    return (
        <Card
            containerStyle={containerStyle}
            title="Total Orders"
            value={String(orders.length)}
            icon={<MaterialCommunityIcons name="shopping" size={24} color="#6366f1" />}
        />
    );
};
*/

type OrderCardProps = { orderId: string; date: string; status: string; total: string; onPress?: () => void };
const OrderCard = ({ orderId, date, status, total, onPress }: OrderCardProps) => {
    // FIX(TS7006): Explicitly define 'status' type in getStatusStyles
    const statusStyles = getStatusStyles(status as 'Pending' | 'Completed' | 'Aborted' | 'Other');
    const Container: React.ComponentType<any> = onPress ? TouchableOpacity : View;
    return (
        <Container style={styles.orderCard} onPress={onPress} activeOpacity={0.8}>
            <View>
                <Text style={styles.orderIdText}>Order {orderId}</Text>
                <Text style={styles.dateText}>Date: {date}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.totalText}>{total}</Text>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyles.backgroundColor },
                    ]}
                >
                    <Text
                        style={{
                            color: statusStyles.color,
                            fontSize: 12,
                            fontWeight: "600",
                        }}
                    >
                        {status}
                    </Text>
                </View>
            </View>
        </Container>
    );
};

// ====================================================================================
//  Screen Content Components
// ====================================================================================

const DashboardContent = () => {
    const { width } = useWindowDimensions();
    const isSmall = width < 360;
    const isMedium = width >= 360 && width < 768;
    const isLarge = width >= 768;
    
    // FIX(TS2322): flexBasis must be a number or a percentage string ('33.33%')
    // We use DimensionValue which includes string percentages, satisfying the ViewStyle type.
    const cardBasis: StyleProp<ViewStyle> = { 
        flexBasis: (isLarge ? '30%' : isMedium ? '47%' : '100%') as DimensionValue 
    }; 
    
    const { orders } = useOrders(); // FIX: Used orders to replace TotalOrdersCard logic
    const { count: wishlistCount } = useWishlist();
    const { count: reviewCount } = useReviews();
    return (
        <>
            {/* Profile gradient header */}
            {/* FIX(TS2769): Explicitly cast the string array to the required tuple type, though the original type definition should be sufficient here */}
            <LinearGradient
                colors={["#ff2f88", "#7a4dff"] as readonly [ColorValue, ColorValue]} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <View style={styles.profileRow}>
                    <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={28} color="#fff" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.profileName}>Your Name Here</Text>
                        <Text style={styles.profileSub}>@RUGERO</Text>
                    </View>
                    <Ionicons name="settings-outline" size={22} color="#fff" />
                </View>
            </LinearGradient>

            <Text style={[styles.title, isSmall && { fontSize: 20 }]}>
                Welcome Back! MR RUGERO
            </Text>
            <Text style={[styles.subtitle, isSmall && { fontSize: 14, marginBottom: 16 }]}>
                Here’s a summary of your account activity.
            </Text>
            <View style={[styles.cardRow, isSmall && { gap: 10 }]}>
                <GradientCard
                    containerStyle={cardBasis}
                    title="Total downloads"
                    value={String(orders.length)}
                    icon={<MaterialCommunityIcons name="download" size={22} color="#fff" />}
                    colors={["#ff2f88", "#ff7db3"]}
                />
                <GradientCard
                    containerStyle={cardBasis}
                    title="Wishlist"
                    value={String(wishlistCount)}
                    icon={<Ionicons name="heart" size={22} color="#fff" />}
                    colors={["#6a5af9", "#7a4dff"]}
                />
                <GradientCard
                    containerStyle={cardBasis}
                    title="Pending review"
                    value={String(reviewCount)}
                    icon={<Ionicons name="alert-circle" size={22} color="#fff" />}
                    colors={["#7a4dff", "#2f9bff"]}
                />
            </View>

            {/* Daily activity placeholder */}
            <LinearGradient
                colors={["#f7f7ff", "#efeaff"] as readonly [ColorValue, ColorValue]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.activityCard}
            >
                <Text style={styles.activityTitle}>Daily Activity</Text>
                <View style={styles.activityGraphRow}>
                    <View style={styles.activityBar} />
                    <View style={[styles.activityBar, { height: 22 }]} />
                    <View style={[styles.activityBar, { height: 30 }]} />
                    <View style={[styles.activityBar, { height: 18 }]} />
                    <View style={[styles.activityBar, { height: 28 }]} />
                    <View style={[styles.activityBar, { height: 16 }]} />
                    <View style={[styles.activityBar, { height: 34 }]} />
                </View>
            </LinearGradient>
        </>
    );
};

// FIX(ESLint: unused-vars): Removed unused alias
type OrderEntity = Order; 

const normalizeStatus = (status: string): 'Pending' | 'Completed' | 'Aborted' => {
    const s = status.toLowerCase();
    // Map statuses from OrderContext to the local display categories
    if (s.includes('deliver') || s === 'shipped' || s === 'completed') return 'Completed'; 
    if (s.includes('cancel') || s === 'aborted') return 'Aborted';
    return 'Pending'; // 'Processing' maps to 'Pending'
};

const OrdersContent = () => {
    const router = useRouter();
    const { orders } = useOrders();
    const [filter, setFilter] = React.useState<'All' | 'Pending' | 'Completed' | 'Aborted'>('All');

    const computed = React.useMemo(() => {
        // Cast to OrderEntity (which is now just Order)
        const withNorm = orders.map((o) => ({ ...o, norm: normalizeStatus(o.status) }));
        const counts = withNorm.reduce(
            (acc, o) => {
                acc.All += 1;
                acc[o.norm] += 1;
                return acc;
            },
            { All: 0, Pending: 0, Completed: 0, Aborted: 0 } as Record<'All' | 'Pending' | 'Completed' | 'Aborted', number>
        );
        const list = filter === 'All' ? withNorm : withNorm.filter((o) => o.norm === filter);
        return { counts, list };
    }, [orders, filter]);

    return (
        <>
            {/* Segmented filter */}
            <View style={styles.segmentRow}>
                {(['All', 'Pending', 'Completed', 'Aborted'] as const).map((key) => {
                    const active = filter === key;
                    return (
                        <TouchableOpacity key={key} style={[styles.segmentChip, active && styles.segmentChipActive]} onPress={() => setFilter(key)}>
                            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                                {key} ({computed.counts[key]})
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {computed.list.length === 0 ? (
                <View style={[styles.wishlistItem, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ color: '#6b7280' }}>No orders in {filter.toLowerCase()}.</Text>
                </View>
            ) : (
                computed.list.map((o) => (
                    <OrderCard
                        key={o.id}
                        orderId={o.id}
                        date={o.createdAt.split('T')[0]}
                        status={o.norm}
                        total={formatMoney(o.subtotalCents, o.currency)}
                        onPress={() => router.push(`/order/${o.id}`)}
                    />
                ))
            )}
        </>
    );
};

const WishlistContent = () => {
    const { items, remove } = useWishlist();
    if (items.length === 0) {
        return (
            <View style={[styles.wishlistItem, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={styles.itemName}>Wishlist is empty</Text>
            </View>
        );
    }
    return (
        <>
            {items.map((w) => (
                <View key={w.id} style={styles.wishlistItem}>
                    <View>
                        <Text style={styles.itemName}>{w.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => remove(w.id)}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </>
    );
};

const CartContent = () => {
    const { items, updateQuantity, removeItem, subtotalCents, currency, totalItems, addItem } = useCart();
    const router = useRouter();
    const featured = FEATURED_PRODUCTS;

    return (
        <>
            <Text style={[styles.title, { marginTop: 6 }]}>My Cart</Text>
            {items.length === 0 ? (
                <View style={[styles.wishlistItem, { alignItems: 'center', justifyContent: 'center' }]}>
                    <Text style={{ color: '#6b7280' }}>Your cart is empty</Text>
                </View>
            ) : (
                items.map((item) => (
                    <View key={item.id} style={styles.orderCard}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{formatMoney(item.priceCents, item.currency)}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtyBtnSm}>
                                    <Text style={{ color: '#111827', fontWeight: '700' }}>-</Text>
                                </TouchableOpacity>
                                <Text style={{ marginHorizontal: 10, fontWeight: '600' }}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtyBtnSm}>
                                    <Text style={{ color: '#111827', fontWeight: '700' }}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(item.id)}>
                            <Text style={{ color: '#ef4444', fontWeight: '700' }}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                ))
            )}

            <View style={[styles.settingRow, { marginTop: 8 }]}>
                <View>
                    <Text style={styles.label}>Subtotal ({totalItems} items)</Text>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>
                        {formatMoney(subtotalCents, currency)}
                    </Text>
                </View>
                <TouchableOpacity
                    disabled={items.length === 0}
                    style={[styles.primaryBtn, items.length === 0 && { opacity: 0.5 }]}
                    onPress={() => router.push('/checkout')}
                >
                    <Text style={styles.primaryText}>Checkout</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.title, { marginTop: 16 }]}>Featured Products</Text>
            {featured.map((p) => (
                <View key={p.id} style={styles.productRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {!!p.image && (
                            <Image
                                source={{ uri: p.image }}
                                style={styles.productThumb}
                                contentFit="cover"
                                transition={200}
                            />
                        )}
                        <View>
                            <Text style={styles.productName}>{p.name}</Text>
                            <Text style={styles.productPrice}>{formatMoney(p.priceCents, p.currency)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => addItem({ id: p.id, name: p.name, priceCents: p.priceCents, currency: p.currency })}
                    >
                        <Text style={styles.addBtnText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </>
    );
};

const SettingsContent = () => {
    const [notifications, setNotifications] = React.useState(true);
    const router = useRouter();
    const { clearCart } = useCart();

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

    return (
        <>
            <View style={styles.settingRow}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: "#767577", true: "#818cf8" }}
                    thumbColor={notifications ? "#4f46e5" : "#f4f3f4"}
                />
            </View>
            <View style={styles.settingRow}>
                <Text style={styles.label}>Change Password</Text>
                <TouchableOpacity
                    onPress={() =>
                        Alert.alert("Navigate", "Redirecting to change password screen...")
                    }
                >
                    <Text style={styles.actionText}>Change</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={22} color="#ef4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </>
    );
};

// ====================================================================================
//  <<< NEWLY INTEGRATED PAYMENT CONTENT >>>
// ====================================================================================
type PaymentMethodId = 'mobile' | 'visa' | 'bank' | 'card' | 'btc' | 'usdt' | 'paypal' | 'mpesa';
type PaymentMethod = { id: PaymentMethodId; name: string; icon: React.ReactNode };
type PaymentsContentProps = { setActiveSection: (section: string) => void };

const PaymentsContent = ({ setActiveSection }: PaymentsContentProps) => {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [paymentIdentifier, setPaymentIdentifier] = useState<string>("");

    const handlePaymentSelect = (method: PaymentMethod) => {
        if (selectedMethod && selectedMethod.id === method.id) {
            setSelectedMethod(null);
        } else {
            setSelectedMethod(method);
            setAmount("");
            setPaymentIdentifier("");
        }
    };

    const handlePaymentSubmit = () => {
        // FIX(TS18047): Add null check for selectedMethod
        if (!selectedMethod || !amount || !paymentIdentifier) {
            Alert.alert("Missing Information", "Please select a method and fill in all required fields.");
            return;
        }

        Alert.alert(
            "Payment Submitted",
            // FIX(TS18047): Use optional chaining or assertion since the null check passed
            `Method: ${selectedMethod!.name}\nAmount: $${amount}\nIdentifier: ${paymentIdentifier}`
        );

        setSelectedMethod(null);
        setAmount("");
        setPaymentIdentifier("");
        Keyboard.dismiss();
    };

    const renderPaymentInputs = () => {
        if (!selectedMethod) return null;

        let keyboardType: KeyboardTypeOptions = "default";
        let placeholder = "Enter details";

        if (["mobile", "mpesa"].includes(selectedMethod.id)) {
            keyboardType = "phone-pad";
            placeholder = "Enter Mobile Number";
        } else if (["visa", "card"].includes(selectedMethod.id)) {
            keyboardType = "numeric";
            placeholder = "Enter Card Number";
        }
        
        // Use a local constant for the id array to satisfy the TS type for PaymentMethod
        const numericOrPhoneMethods: PaymentMethodId[] = ["mobile", "mpesa", "visa", "card"];

        return (
            <View style={styles.payment_inputContainer}>
                <TextInput
                    style={styles.payment_input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    placeholderTextColor="#888"
                />
                {numericOrPhoneMethods.includes(selectedMethod.id) && (
                    <TextInput
                        style={styles.payment_input}
                        placeholder={placeholder}
                        keyboardType={keyboardType}
                        value={paymentIdentifier}
                        onChangeText={setPaymentIdentifier}
                        placeholderTextColor="#888"
                    />
                )}
                <TouchableOpacity
                    style={styles.payment_payButton}
                    onPress={handlePaymentSubmit}
                >
                    <Text style={styles.payment_payButtonText}>Pay Now</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                {/* --- IMPROVED Payment Methods Section --- */}
                <View style={styles.payment_section}>
                    <Text style={styles.payment_sectionTitle}>Choose Payment Method</Text>
                    <View style={styles.payment_methodContainer}>
                        {/* FIX(TS2345): All payment IDs must be strictly defined as PaymentMethodId (a literal union) */}
                        {([
                            {
                                id: "mobile", // FIX
                                name: "Mobile Money",
                                icon: <Ionicons name="wallet" size={22} color="#4CAF50" />,
                            },
                            {
                                id: "visa", // FIX
                                name: "Visa / Mastercard",
                                icon: <FontAwesome name="cc-visa" size={22} color="#1565C0" />,
                            },
                            {
                                id: "bank", // FIX
                                name: "Bank Transfer",
                                icon: <FontAwesome name="bank" size={22} color="#6A1B9A" />,
                            },
                            {
                                id: "card", // FIX
                                name: "Credit / Debit Card",
                                icon: (
                                    <MaterialIcons name="credit-card" size={22} color="#FF5722" />
                                ),
                            },
                            {
                                id: "btc", // FIX
                                name: "Bitcoin (BTC)",
                                icon: (
                                    <FontAwesome5 name="bitcoin" size={22} color="#FFC107" />
                                ),
                            },
                            {
                                id: "usdt", // FIX
                                name: "USDT (Tether)",
                                icon: <FontAwesome5 name="coins" size={22} color="#009688" />,
                            },
                            {
                                id: "paypal", // FIX
                                name: "PayPal",
                                icon: <FontAwesome5 name="paypal" size={22} color="#00457C" />,
                            },
                            {
                                id: "mpesa", // FIX
                                name: "M-Pesa (East Africa)",
                                icon: (
                                    <MaterialIcons name="payments" size={22} color="#388E3C" />
                                ),
                            },
                        ] as PaymentMethod[]).map((method) => ( // Cast to PaymentMethod[] for safety
                            <View key={method.id}>
                                <TouchableOpacity
                                    style={[
                                        styles.payment_methodItem,
                                        selectedMethod?.id === method.id &&
                                            styles.payment_selectedItem,
                                    ]}
                                    onPress={() => handlePaymentSelect(method)}
                                >
                                    {method.icon}
                                    <Text
                                        style={[
                                            styles.payment_methodText,
                                            selectedMethod?.id === method.id &&
                                                styles.payment_selectedText,
                                        ]}
                                    >
                                        {method.name}
                                    </Text>
                                </TouchableOpacity>

                                {selectedMethod?.id === method.id && renderPaymentInputs()}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

// ====================================================================================
//  Main App Component
// ====================================================================================

export default function App() {
    const { width } = useWindowDimensions();
    const isSmall = width < 360;
    const [activeSection, setActiveSection] = React.useState("dashboard");
    const params = useLocalSearchParams<{ tab?: string }>();
    React.useEffect(() => {
        if (params?.tab && typeof params.tab === 'string') {
            const normalized = params.tab.toLowerCase();
            if (["dashboard", "orders", "cart", "payments", "wishlist", "settings"].includes(normalized)) {
                setActiveSection(normalized);
            }
        }
    }, [params?.tab]);

    const menuItems = [
        { name: "dashboard", label: "Dashboard", icon: "home", iconFamily: "Ionicons" },
        { name: "orders", label: "Orders", icon: "shopping", iconFamily: "MaterialCommunityIcons" },
        { name: "cart", label: "Cart", icon: "cart", iconFamily: "Ionicons" },
        { name: "payments", label: "Payments", icon: "wallet", iconFamily: "Ionicons" }, // <-- ADDED
        { name: "wishlist", label: "Wishlist", icon: "heart", iconFamily: "Ionicons" },
        { name: "settings", label: "Settings", icon: "settings", iconFamily: "Ionicons" },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard": return <DashboardContent />;
            case "orders": return <OrdersContent />;
            case "cart": return <CartContent />;
            case "payments": return <PaymentsContent setActiveSection={setActiveSection} />; // <-- ADDED
            case "wishlist": return <WishlistContent />;
            case "settings": return <SettingsContent />;
            default: return null;
        }
    };

    const getHeaderTitle = () => {
        const item = menuItems.find((item) => item.name === activeSection);
        if (!item) return "Dashboard";
        // Special casing for better titles
        if (item.name === "orders") return "My Orders";
        return item.label;
    };

    // FIX(TS7006): Explicitly type 'item' and 'isActive' parameters
    const renderIcon = (item: typeof menuItems[0], isActive: boolean) => {
        const iconProps = {
            name: isActive ? item.icon : `${item.icon}-outline`,
            size: isActive ? 26 : 24,
            color: isActive ? "#4f46e5" : "#6b7280",
        };
        // FontAwesome5 and some MaterialCommunityIcons don't have standard '-outline' variants
        if (item.iconFamily === "FontAwesome5" || item.icon === "shopping") {
            iconProps.name = item.icon;
            iconProps.size = isActive ? 24 : 22;
        }

        switch (item.iconFamily) {
            case "Ionicons": return <Ionicons {...iconProps as any} />; // Use 'as any' for iconProps due to varying icon families
            case "MaterialCommunityIcons": return <MaterialCommunityIcons {...iconProps as any} />;
            case "FontAwesome5": return <FontAwesome5 {...iconProps as any} />;
            default: return null;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={{ flex: 1 }}>
                <Header title={getHeaderTitle()} />
                <ScrollView contentContainerStyle={[
                    styles.contentContainer,
                    isSmall && { padding: 12, paddingBottom: 20 }
                ]}>
                    {renderContent()}
                </ScrollView>
                <View style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
                    {/* FIX(TS2769): Explicitly cast the string array to the required tuple type */}
                    <LinearGradient
                        colors={["#ffffff", "#f3e8ff"] as readonly [ColorValue, ColorValue]} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.bottomNav, isSmall && { height: 56, paddingBottom: 2 }]}
                    >
                        {menuItems.map((item) => {
                            const isActive = activeSection === item.name;
                            return (
                                <TouchableOpacity
                                    key={item.name}
                                    style={styles.navItem}
                                    onPress={() => setActiveSection(item.name)}
                                >
                                    {renderIcon(item, isActive)}
                                    <Text
                                        style={[styles.navLabel, isSmall && { fontSize: 10 }, isActive && styles.navLabelActive]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </LinearGradient>
                </View>
            </View>
        </SafeAreaView>
    );
}

// ====================================================================================
//  Helper Functions
// ====================================================================================

// FIX(TS7006): Explicitly type 'status' parameter
const getStatusStyles = (status: 'Pending' | 'Completed' | 'Aborted' | 'Other') => {
    switch (status) {
        case "Completed": return { backgroundColor: "#dcfce7", color: "#166534" };
        case "Pending": return { backgroundColor: "#fef3c7", color: "#92400e" };
        case "Aborted": return { backgroundColor: "#fee2e2", color: "#b91c1c" };
        default: return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
};

// ====================================================================================
//  Styles
// ====================================================================================

const styles = StyleSheet.create({
    // --- CORE DASHBOARD STYLES ---
    safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
    header: {
        backgroundColor: "#fff",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    headerGradient: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    profileRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.25)",
        alignItems: "center",
        justifyContent: "center",
    },
    profileName: { color: "#fff", fontWeight: "700", fontSize: 16 },
    profileSub: { color: "#f5f5f5", marginTop: 2, fontSize: 12 },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 8,
    },
    subtitle: { fontSize: 16, color: "#6b7280", marginBottom: 24 },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: 12,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        flexGrow: 1,
        minWidth: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    gcard: {
        borderRadius: 14,
        padding: 16,
        flexGrow: 1,
        minWidth: 100,
    },
    gcardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    gcardTitle: { color: "#fff", fontSize: 13, fontWeight: "600" },
    gcardValue: { color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 8 },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    cardTitle: { color: "#6b7280", fontSize: 13, fontWeight: "500" },
    cardValue: { fontSize: 22, fontWeight: "bold", color: "#111827" },
    orderCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2.0,
    },
    orderIdText: { fontWeight: "600", fontSize: 16, color: "#1f2937" },
    dateText: { color: "#6b7280", marginTop: 2 },
    totalText: { fontWeight: "bold", fontSize: 16, color: "#1f2937" },
    statusBadge: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 4,
    },
    wishlistItem: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 2,
    },
    itemName: { fontWeight: "600", fontSize: 16, color: "#1f2937" },
    itemPrice: { color: "#6b7280" },
    removeText: { color: "#ef4444", fontWeight: "600" },
    inputGroup: { marginBottom: 16 },
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: "#374151",
        fontWeight: "500",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#fff",
        fontSize: 16,
    },
    primaryBtn: {
        backgroundColor: "#4f46e5",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 12,
    },
    primaryText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    settingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 1,
    },
    actionText: { color: "#4f46e5", fontWeight: "600" },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fee2e2",
        padding: 14,
        borderRadius: 8,
        marginTop: 24,
    },
    logoutText: {
        color: "#ef4444",
        fontWeight: "bold",
        marginLeft: 8,
        fontSize: 16,
    },
    bottomNav: {
        flexDirection: "row",
        height: 65,
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#fff",
        paddingBottom: 5,
        borderRadius: 24,
    },
    navItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    navLabel: { fontSize: 11, color: "#6b7280", marginTop: 2 },
    navLabelActive: { color: "#4f46e5", fontWeight: "600" },

    // --- Orders segmented control ---
    segmentRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 15,
        marginBottom: 15,
        gap: 5,
    },
    segmentChip: {
        backgroundColor: "#f3f4f6",
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 12, // Increased horizontal padding
        flex: 1, // Added to make them equally sized
        alignItems: 'center',
    },
    segmentChipActive: {
        backgroundColor: "#e0e7ff",
        borderWidth: 1,
        borderColor: "#6366f1",
    },
    segmentText: { color: "#374151", fontWeight: "600", fontSize: 13 },
    segmentTextActive: { color: "#4338ca" },

    // --- Featured product rows within CartContent ---
    productRow: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 1,
    },
    productThumb: {
        width: 54,
        height: 54,
        borderRadius: 12,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    productName: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
    productPrice: { color: "#6b7280" },
    addBtn: {
        backgroundColor: "#4f46e5",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
    qtyBtnSm: {
        backgroundColor: '#f3f4f6',
        borderRadius: 4,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        marginTop: 12,
    },
    activityTitle: { fontWeight: '700', fontSize: 16, color: '#374151', marginBottom: 12 },
    activityGraphRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end', height: 40, borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 2 },
    activityBar: { flex: 1, height: 25, backgroundColor: '#818cf8', borderRadius: 4 },

    // --- Payment Styles ---
    payment_section: {
        marginTop: 12,
    },
    payment_sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 10,
    },
    payment_methodContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
    },
    payment_methodItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 8,
        backgroundColor: '#f9fafb',
    },
    payment_selectedItem: {
        borderColor: "#4f46e5",
        backgroundColor: "#eff6ff",
    },
    payment_methodText: {
        marginLeft: 10,
        fontSize: 16,
        color: "#374151",
        flex: 1,
    },
    payment_selectedText: {
        fontWeight: '700',
        color: "#4f46e5",
    },
    payment_inputContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4f46e5',
        marginBottom: 10,
    },
    payment_input: {
        height: 44,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 6,
        paddingHorizontal: 12,
        marginBottom: 8,
        fontSize: 16,
    },
    payment_payButton: {
        backgroundColor: "#4f46e5",
        padding: 12,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 4,
    },
    payment_payButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});