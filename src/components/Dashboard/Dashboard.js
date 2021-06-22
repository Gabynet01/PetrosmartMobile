//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import ActionBarImage from '../Utilities/ActionBarImage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { BottomSheet } from 'react-native-elements';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import {
    LineChart
} from "react-native-chart-kit";
import DashboardChart from './StatisticalChart';
import MainMenuOptionsView from '../OptionsMenu/MainOptionsMenu';
import OneSignal from 'react-native-onesignal';
import profileImage from '../../images/avatarImage.jpg';
import moment from 'moment';
import RecentTransaction from './RecentTransaction';

const win = Dimensions.get('window');

// create a component
class Dashboard extends React.Component {

    // Constructor for this component
    constructor(props) {
        super(props);
        // Declare variables here
        this.state = {
            loggedInUserName: '',
            usermobile: '',
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    static navigationOptions = {
        headerShown: null
    };


    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    // go to purchase fuel page
    goToPurchaseFuelPage() {
        this.props.navigation.navigate("PurchaseFuelPage");
    }

    //load immediately and initiate one signal
    async componentDidMount() {
        /* O N E S I G N A L   S E T U P */
        OneSignal.setAppId("92eddf81-35b0-462c-ae88-e813338f18a3");
        OneSignal.setLogLevel(6, 0);
        OneSignal.setRequiresUserPrivacyConsent(false);
        // OneSignal.promptForPushNotificationsWithUserResponse(response => {
        //    //console.log("Prompt response:", response);
        // });

        /* O N E S I G N A L  H A N D L E R S */
        OneSignal.setNotificationOpenedHandler(notification => {
            //console.log("OneSignal: notification opened:", notification);
        });
        OneSignal.addSubscriptionObserver(event => {
            //console.log("OneSignal: subscription changed:", event);
            this.setState({ isSubscribed: event.to.isSubscribed })
        });
        OneSignal.addPermissionObserver(event => {
            //console.log("OneSignal: permission changed:", event);
        });

        const deviceState = await OneSignal.getDeviceState();

        //console.log("device Subscribed State-->>", deviceState.isSubscribed);
        //console.log("device notification user Id-->>", deviceState.userId);

        this.setState({
            isSubscribed: deviceState.isSubscribed
        });

        AsyncStorage.getItem("usermobile")
            .then((result) => {
                this.checkLogIn(result, deviceState.userId);
            })

    }

    //send user device push notification id to DB
    // make the API call
    updatePushNotificationId(mobileNumber, notificationId) {
        //console.log("am sending the push notification ID to the DB")
        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'login/update/push/notification', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mobileNumber: mobileNumber,
                deviceNotificationId: notificationId
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for update device notification ID is")
                //console.log(responseJson)

                if (responseJson.code == "200") {
                    AsyncStorage.setItem('userNotificationID', notificationId);
                    //console.log("Device Push Notification ID update was successful for Mobile number-->>" + mobileNumber + " with notification ID-->>" + notificationId);
                }

                else {
                    //console.log("There was an error connecting to update push notification API-->>", responseJson);
                }
            })
            .catch((error) => {
                //console.log("Could not connect to server", error);
            });
    }


    // This will load immediately hits this screen
    // componentDidMount() {
    //     AsyncStorage.getItem("usermobile")
    //         .then((result) => {
    //             this.checkLogIn(result);
    //         })

    // }

    // Use this to check the user logged in 
    checkLogIn(dataStored, notificationId) {
        if (dataStored === null || dataStored === undefined) {
            this.props
                .navigation
                .dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({
                            routeName: 'LoginPage'
                        }),
                    ],
                }))
        }
        else {
            // lets get data in the storage
            AsyncStorage.getItem("allUserData")
                .then((result) => {

                    var allUserData = JSON.parse(result);
                    this.setState({ loggedInUserName: this.toTitleCase(allUserData[0].name) })

                })

            this.setState({ usermobile: dataStored });

            //lets check if notification ID has already being sent to DB 
            AsyncStorage.getItem("userNotificationID")
                .then((notificationIdStored) => {
                    //console.log("notificationID stored is", notificationIdStored);
                    //if it doesnt exist send it to DB
                    if (notificationIdStored === null || notificationIdStored === undefined) {
                        //call update push notification API
                        this.updatePushNotificationId(dataStored, notificationId);
                    }
                })
        }
    }


    render() {
        return (
            <>
                <RecentTransaction parent="Transaction" navigation={this.props.navigation}/>

            </>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
    },
});

//make this component available to the app
export default withNavigation(Dashboard);