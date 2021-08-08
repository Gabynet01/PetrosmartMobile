import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../Dashboard/Dashboard';
import PurchaseFuel from '../Dashboard/PurchaseFuel/PurchaseFuel';
import TransactionListView from '../DriverTransactions/TransactionList';
import VoucherListView from '../DriverVouchers/VoucherList';
import { Image } from 'react-native';
import Icon from 'react-native-ionicons';
import dashboard from '../../images/vectors/dashboard.png';
import dashboardSelect from '../../images/vectors/dashboard-select.png';
import request from '../../images/vectors/request.png';
import requestSelect from '../../images/vectors/request-select.png';
import chat from '../../images/vectors/chat.png';
import chatSelect from '../../images/vectors/chat-select.png';
import profile from '../../images/vectors/profile.png';
import profileSelect from '../../images/vectors/profile-select.png';
import GeneratePaymentCode from '../Dashboard/PurchaseFuel/GeneratePaymentCode';
import TransactionDetails from '../DriverTransactions/TransactionDetails';
import VoucherDetails from '../DriverVouchers/VoucherDetails';
import RecentTransaction from '../Dashboard/RecentTransaction';
import UserProfile from '../OptionsMenu/UserProfile';
import AboutApp from '../OptionsMenu/UserProfileClicks/AboutApp';
import SubmitFeedback from '../OptionsMenu/UserProfileClicks/SubmitFeedback';
import CarInfo from '../OptionsMenu/UserProfileClicks/CarInfo';
import FleetManagerDashboard from '../FleetManager/Dashboard';
import DriverList from '../FleetManager/DriverList/DriverList';
import VehicleList from '../FleetManager/VehicleList/VehicleList';
import StationList from '../FleetManager/StationList/StationList';
import FleetManagerRequestListView from '../FleetManager/RequestDashboard/RequestList';

const Tab = createBottomTabNavigator();

// Create navigation screens here

// Dashboard Pages Stack
const DashboardStack = createStackNavigator();

function DashboardStackScreen({ navigation }) {
    return (
        <DashboardStack.Navigator>
            <DashboardStack.Screen
                name="Dashboard"
                component={FleetManagerDashboard}
                options={{
                    headerShown: null
                }}
            />
            <DashboardStack.Screen
                name="FleetManagerNavigationPage"
                component={FleetManagerDashboard}
                options={{
                    headerShown: null
                }}
            />
            <DashboardStack.Screen
                name="DriverListPage"
                component={DriverList}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <DashboardStack.Screen
                name="VehicleListPage"
                component={VehicleList}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <DashboardStack.Screen
                name="StationListPage"
                component={StationList}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />

        </DashboardStack.Navigator>
    );
}

// Purchase Pages Stack
const RequestStack = createStackNavigator();

function RequestStackScreen() {
    return (
        <RequestStack.Navigator>
            <RequestStack.Screen
                name="Request"
                component={FleetManagerRequestListView}
                options={{
                    headerShown: null
                }}
            />
        </RequestStack.Navigator>
    );
}

// Transaction Pages Stack
const TransactionStack = createStackNavigator();

function TransactionStackScreen({ navigation }) {
    return (
        <TransactionStack.Navigator>
            <TransactionStack.Screen
                name="Transaction"
                component={TransactionListView}
                options={{
                    headerShown: null
                }}
            />
            <TransactionStack.Screen
                name="TransactionListPage"
                component={TransactionListView}
                options={{
                    headerShown: null
                }}
            />
            <TransactionStack.Screen
                name="TransactionDetailsPage"
                component={TransactionDetails}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <TransactionStack.Screen
                name="UserProfilePage"
                component={UserProfile}
                options={{
                    headerShown: null
                }} />

            <TransactionStack.Screen
                name="AboutAppPage"
                component={AboutApp}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <TransactionStack.Screen
                name="SubmitFeedbackPage"
                component={SubmitFeedback}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <TransactionStack.Screen
                name="CarInfoPage"
                component={CarInfo}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
        </TransactionStack.Navigator>
    );
}

// Voucher Pages Stack
const VoucherStack = createStackNavigator();

function VoucherStackScreen({ navigation }) {
    return (
        <VoucherStack.Navigator>
            <VoucherStack.Screen
                name="VoucherListView"
                component={VoucherListView}
                options={{
                    headerShown: null
                }}
            />
            <VoucherStack.Screen
                name="VoucherDetailsPage"
                component={VoucherDetails}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <VoucherStack.Screen
                name="UserProfilePage"
                component={UserProfile}
                options={{
                    headerShown: null
                }} />

            <VoucherStack.Screen
                name="AboutAppPage"
                component={AboutApp}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <VoucherStack.Screen
                name="SubmitFeedbackPage"
                component={SubmitFeedback}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <VoucherStack.Screen
                name="CarInfoPage"
                component={CarInfo}
                options={{
                    headerShown: true,
                    title: "",
                    headerStyle: {
                        backgroundColor: '#F6F6F6',
                        elevation: 0, // remove shadow on Android
                        shadowOpacity: 0, // remove shadow on iOS
                    },
                    headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />

        </VoucherStack.Navigator>
    );
}


class FleetManagerNavigation extends React.Component {
    static navigationOptions = {
        headerShown: null
    };

    render() {
        return (
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Dashboard') {
                                iconName = focused
                                    ? dashboardSelect
                                    : dashboard;
                            } else if (route.name === 'Request') {
                                iconName = focused ? requestSelect : request;
                            } else if (route.name === 'Chat') {
                                iconName = focused ? chatSelect : chat;
                            } else if (route.name === 'Profile') {
                                iconName = focused ? profileSelect : profile;
                            }

                            // You can return any component that you like here!
                            return <Image source={iconName} size={size} color={color} />;
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: '#F35C24',
                        inactiveTintColor: '#CFCBC7',
                        tabStyle: {
                            marginBottom: 5,
                            fontSize: 12
                        },
                        style: { borderTopLeftRadius: 32, borderTopRightRadius: 32 },
                    }}
                >
                    <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
                    <Tab.Screen name="Request" component={RequestStackScreen} />
                    <Tab.Screen name="Chat" component={TransactionStackScreen} />
                    <Tab.Screen name="Profile" component={VoucherStackScreen} />
                </Tab.Navigator>
            </NavigationContainer >
        );

    }
}
export default FleetManagerNavigation;