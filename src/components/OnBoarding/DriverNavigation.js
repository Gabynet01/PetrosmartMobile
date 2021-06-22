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
import purchase from '../../images/vectors/purchase.png';
import purchaseSelect from '../../images/vectors/purchase-select.png';
import transaction from '../../images/vectors/transaction.png';
import transactionSelect from '../../images/vectors/transaction-select.png';
import voucher from '../../images/vectors/voucher.png';
import voucherSelect from '../../images/vectors/voucher-select.png';
import GeneratePaymentCode from '../Dashboard/PurchaseFuel/GeneratePaymentCode';
import TransactionDetails from '../DriverTransactions/TransactionDetails';
import VoucherDetails from '../DriverVouchers/VoucherDetails';
import RecentTransaction from '../Dashboard/RecentTransaction';
import UserProfile from '../OptionsMenu/UserProfile';
import AboutApp from '../OptionsMenu/UserProfileClicks/AboutApp';
import SubmitFeedback from '../OptionsMenu/UserProfileClicks/SubmitFeedback';
import CarInfo from '../OptionsMenu/UserProfileClicks/CarInfo';

const Tab = createBottomTabNavigator();

// Create navigation screens here

// Dashboard Pages Stack
const DashboardStack = createStackNavigator();

function DashboardStackScreen({ navigation }) {
    return (
        <DashboardStack.Navigator>
            <DashboardStack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    headerShown: null
                }}
            />
            <DashboardStack.Screen
                name="DriverNavigationPage"
                component={Dashboard}
                options={{
                    headerShown: null
                }}
            />
            <DashboardStack.Screen
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
            <DashboardStack.Screen
                name="UserProfilePage"
                component={UserProfile}
                options={{
                    headerShown: null,
                    // title: "",
                    // headerStyle: {
                    //     backgroundColor: '#F6F6F6',
                    //     elevation: 0, // remove shadow on Android
                    //     shadowOpacity: 0, // remove shadow on iOS
                    // },
                    // headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
                }}
            />
            <DashboardStack.Screen
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
            <DashboardStack.Screen
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
            <DashboardStack.Screen
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
        </DashboardStack.Navigator>
    );
}

// Purchase Pages Stack
const PurchaseStack = createStackNavigator();

function PurchaseStackScreen() {
    return (
        <PurchaseStack.Navigator>
            <PurchaseStack.Screen
                name="Purchase"
                component={PurchaseFuel}
                options={{
                    headerShown: null
                }}
            />
            <PurchaseStack.Screen name="GeneratePaymentCode" component={GeneratePaymentCode} />
            <PurchaseStack.Screen
                name="UserProfilePage"
                component={UserProfile} options={{
                    headerShown: null
                }} />
            <PurchaseStack.Screen
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
            <PurchaseStack.Screen
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
            <PurchaseStack.Screen
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
            <PurchaseStack.Screen name="TransactionListView" component={TransactionListView} />
        </PurchaseStack.Navigator>
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


class DriverNavigation extends React.Component {
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
                            } else if (route.name === 'Purchase') {
                                iconName = focused ? purchaseSelect : purchase;
                            } else if (route.name === 'Transaction') {
                                iconName = focused ? transactionSelect : transaction;
                            } else if (route.name === 'Voucher') {
                                iconName = focused ? voucherSelect : voucher;
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
                    <Tab.Screen name="Purchase" component={PurchaseStackScreen} />
                    <Tab.Screen name="Transaction" component={TransactionStackScreen} />
                    <Tab.Screen name="Voucher" component={VoucherStackScreen} />
                </Tab.Navigator>
            </NavigationContainer >
        );

    }
}
export default DriverNavigation;