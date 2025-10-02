import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { CartProvider } from '@/contexts/CartContext';
import { OrdersProvider } from '@/contexts/OrdersContext';
import { ReviewsProvider } from '@/contexts/ReviewsContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { useColorScheme } from '@/hooks/use-color-scheme';


export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <OrdersProvider>
        <CartProvider>
          <WishlistProvider>
            <ReviewsProvider>
              <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ title: "Login / Register" }} />
          <Stack.Screen name="dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
          <Stack.Screen name="order-success" options={{ title: 'Order Placed' }} />
              </Stack>
            </ReviewsProvider>
          </WishlistProvider>
        </CartProvider>
      </OrdersProvider>
      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}
