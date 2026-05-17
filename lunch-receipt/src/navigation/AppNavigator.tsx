import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AddReceiptScreen from '../screens/AddReceiptScreen';
import ReceiptListScreen from '../screens/ReceiptListScreen';
import SummaryScreen from '../screens/SummaryScreen';

export type RootStackParamList = {
  Main: undefined;
  AddReceipt: { receiptId?: string };
};

export type TabParamList = {
  Home: undefined;
  List: undefined;
  Summary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  List: '📋',
  Summary: '📊',
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: () => <Text style={{ fontSize: 20 }}>{TAB_ICONS[route.name]}</Text>,
      tabBarActiveTintColor: '#2563EB',
      tabBarInactiveTintColor: '#6B7280',
      headerStyle: { backgroundColor: '#2563EB' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
    <Tab.Screen name="List" component={ReceiptListScreen} options={{ title: '영수증 목록' }} />
    <Tab.Screen name="Summary" component={SummaryScreen} options={{ title: '통계' }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="AddReceipt"
        component={AddReceiptScreen}
        options={{
          title: '영수증 추가',
          headerStyle: { backgroundColor: '#2563EB' },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
