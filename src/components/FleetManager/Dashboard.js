//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import ActionBarImage from '../Utilities/ActionBarImage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { BottomSheet } from 'react-native-elements';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import FleetManagerOptionsMenuView from '../OptionsMenu/FleetManagerOptionsMenu';
import { Avatar, Card } from 'react-native-elements';
import OneSignal from 'react-native-onesignal';

import RecentRequests from './RecentRequests';

const win = Dimensions.get('window');

// create a component
class FleetManagerDashboard extends React.Component {
    static navigationOptions = {
        
    };

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

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
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

    // // This will load immediately hits this screen
    // componentDidMount() {
    //     AsyncStorage.getItem("usermobile")
    //         .then((result) => {
    //             this.checkLogIn(result);
    //         })

    // }

    //send user device push notification id to DB
    // make the API call
    updatePushNotificationId(mobileNumber, notificationId) {
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
                <RecentRequests parent="Transaction" navigation={this.props.navigation} />
            </>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {

    },
    profileText: {
        color: '#380507',
        fontStyle: 'normal',
        fontWeight: '500',
        marginLeft: 30,
        marginTop: 6,
        fontSize: 22,
        lineHeight: 28
    },
    greetingText: {
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 15.18,
        color: '#9E9B9B'
    },
    profileContainer: {
        marginTop: 20,
        marginRight: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    imageBg: {
        width: 80,
        height: 80,
        resizeMode: "cover",
        justifyContent: "center",
        shadowOpacity: 0.1,
        elevation: 0.1,
        shadowColor: "#455A64"
    },
    iconAvatar: {
        marginLeft: 30,
        marginTop: -15
    },
    imageAvatar: {
        width: 23,
        height: 23,
        shadowOpacity: 0.1,
        shadowColor: "#455A64",
        marginLeft: 28,
        marginTop: -20
    },
    bannerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
    },
    vectorBg: {
        width: 46,
        height: 46,
        resizeMode: "cover",
        justifyContent: "center",
        shadowOpacity: 0.1,
        elevation: 0.1,
        shadowColor: "#455A64"
    },
    vectorIcon: {
        marginLeft: 9,
        marginTop: 0,
        width: 26,
        height: 24
    },
    cardCount: {
        color: '#380507',
        fontStyle: 'normal',
        fontWeight: 'normal',
        marginTop: 6,
        fontSize: 32,
        lineHeight: 40
    },
    vehicleCardCount: {
        color: '#380507',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 32,
        lineHeight: 40,
        marginLeft: 12,
        marginTop: -6
    },
    vehicleCardText: {
        color: '#999797',
        fontStyle: 'normal',
        fontWeight: 'normal',
        marginTop: 1,
        fontSize: 16,
        lineHeight: 20,
        marginLeft: 12
    },
    cardText: {
        color: '#999797',
        fontStyle: 'normal',
        fontWeight: 'normal',
        marginTop: 6,
        fontSize: 16,
        lineHeight: 20
    },
});

//make this component available to the app
export default FleetManagerDashboard;