import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './src/components/Login/Login';
import ResetConfirmOtp from './src/components/Login/ResetPin/ConfirmOtp';
import ResetEnterNewPin from './src/components/Login/ResetPin/EnterNewPin';
import Dashboard from './src/components/Dashboard/Dashboard';
import PurchaseFuelForms from './src/components/Dashboard/PurchaseFuel/PurchaseFuel';
import GeneratePaymentCodeView from './src/components/Dashboard/PurchaseFuel/GeneratePaymentCode';
import UserProfileView from './src/components/OptionsMenu/UserProfile';
import HelpView from './src/components/OptionsMenu/Help';
import VoucherListView from './src/components/DriverVouchers/VoucherList';
import VoucherDetailsView from './src/components/DriverVouchers/VoucherDetails';
import TransactionListView from './src/components/DriverTransactions/TransactionList';
import TransactionDetailsView from './src/components/DriverTransactions/TransactionDetails';
import FleetManagerDashboard from './src/components/FleetManager/Dashboard';
import FleetManagerRequestDetailsView from './src/components/FleetManager/RequestDetails';
import FleetManagerProfileView from './src/components/OptionsMenu/FleetManagerProfile';
import FleetManagerPendingRequestView from './src/components/FleetManager/Pending/PendingRequestList';
import FleetManagerApprovedRequestView from './src/components/FleetManager/Approved/ApprovedRequestList';
import StartPageView from './src/components/OnBoarding/StartPage';
import FleetManagerRejectedRequestView from './src/components/FleetManager/Rejected/RejectedRequestList';
import DriverNavigation from './src/components/OnBoarding/DriverNavigation';
import FuelPercentageCard from './src/components/Dashboard/FuelPercentage';
import RecentTransaction from './src/components/Dashboard/RecentTransaction';
import MapView from './src/components/Dashboard/MapView';
import MapDashboard from './src/components/Dashboard/Maps/MapDashboard';
import AboutApp from './src/components/OptionsMenu/UserProfileClicks/AboutApp';
import SubmitFeedback from './src/components/OptionsMenu/UserProfileClicks/SubmitFeedback';
import CarInfo from './src/components/OptionsMenu/UserProfileClicks/CarInfo';
import MapPromptDriver from './src/components/Dashboard/PurchaseFuel/MapPromptDriver';

const RootStack = createStackNavigator(
{
  //OnBoarding
  StartPage: {screen: StartPageView},
  DriverNavigationPage: {screen: DriverNavigation},
  LoginPage: { screen: Login },
  DashboardPage: { screen: Dashboard },
  ResetConfirmOtpPage: { screen: ResetConfirmOtp },
  ResetEnterPinPage: { screen: ResetEnterNewPin},
  FuelPercentagePage: { screen: FuelPercentageCard},
  MapviewPage: { screen: MapView},
  MapDashboardPage: { screen: MapDashboard},
  RecentTransactionsPage: { screen: RecentTransaction},
  PurchaseFuelPage: { screen: PurchaseFuelForms},
  MapPurchaseFuelPage: { screen: MapPromptDriver},
  GeneratePaymentCodePage: { screen: GeneratePaymentCodeView},
  UserProfilePage: { screen: UserProfileView},
  AboutAppPage: { screen: AboutApp},
  SubmitFeedbackPage: { screen: SubmitFeedback},
  CarInfoPage: { screen: CarInfo},
  HelpPage: { screen: HelpView},
  VoucherListPage: { screen: VoucherListView},
  VoucherDetailsPage: { screen:  VoucherDetailsView},
  TransactionListPage: { screen: TransactionListView},
  TransactionDetailsPage: { screen:  TransactionDetailsView},

  //Fleet Manager
  FleetManagerDashboardPage: { screen: FleetManagerDashboard},
  FleetManagerProfilePage: { screen: FleetManagerProfileView},
  FleetManagerPendingPage: { screen: FleetManagerPendingRequestView},
  FleetManagerApprovedPage: { screen: FleetManagerApprovedRequestView},
  FleetManagerRejectedPage: { screen: FleetManagerRejectedRequestView},
  FleetManagerDetailsPage: { screen: FleetManagerRequestDetailsView},
},
{
    initialRouteName: 'StartPage',
    defaultNavigationOptions: {headerShown: true, cardStyle: { backgroundColor: '#F6F6F6' }}

}
);

const App = createAppContainer(RootStack);

export default App;