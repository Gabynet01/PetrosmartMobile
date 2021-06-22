//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import ActionBarImage from '../Utilities/ActionBarImage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { BottomSheet } from 'react-native-elements';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import FleetManagerOptionsMenuView from '../OptionsMenu/FleetManagerOptionsMenu';
import { Avatar, Card } from 'react-native-elements';
import OneSignal from 'react-native-onesignal';

const win = Dimensions.get('window');

// create a component
class FleetManagerDashboard extends React.Component {
    static navigationOptions = {
        // headerTitle: () => <ActionBarImage />,
        title: "etrosmart",
        headerLeft: () => <ActionBarImage />,
        headerRight: () => <FleetManagerOptionsMenuView />,
        // headerRight: <MapBarIcon />,
        headerStyle: {
            backgroundColor: '#4c4c4c',
            height: 80
        },
        headerTitleStyle: {
            color: '#fff',
            marginLeft: -15
        }
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

    //go to Pending
    gotoPendingRequests = () => {
        this.props.navigation.navigate("FleetManagerPendingPage");
    }

    gotoApprovedRequests = () => {
        this.props.navigation.navigate("FleetManagerApprovedPage");
    }

    gotoRejectedRequests = () => {
        this.props.navigation.navigate("FleetManagerRejectedPage");
    }

    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        <View style={styles.container}>

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <View>
                                    <Text style={styles.profileText}>{this.state.loggedInUserName}</Text>
                                </View>

                                <View>
                                    <Text style={styles.profileNumberText}>{this.state.usermobile}</Text>

                                </View>

                            </View>

                            <Card containerStyle={{
                                paddingTop: 30,
                                paddingBottom: 45,
                                backgroundColor: "#f9f9f9",
                                borderRadius: 7,
                                borderWidth: 1,
                                borderColor: '#f9f9f9',
                                shadowColor: "#455A64",
                                shadowOpacity: 0.1,
                                elevation: 0.1,
                            }}>
                                <TouchableOpacity style={styles.solidButtonContainer}
                                    onPress={() => this.gotoPendingRequests()}>
                                    <Text style={styles.solidButtonText}>PENDING</Text>
                                </TouchableOpacity>
                            </Card>

                            <Card containerStyle={{
                                paddingTop: 30,
                                paddingBottom: 45,
                                backgroundColor: "#f9f9f9",
                                borderRadius: 7,
                                borderWidth: 1,
                                borderColor: '#f9f9f9',
                                shadowColor: "#455A64",
                                shadowOpacity: 0.1,
                                elevation: 0.1,
                            }}>
                                <TouchableOpacity style={styles.otherButtonContainer}
                                    onPress={() => this.gotoApprovedRequests()}>
                                    <Text style={styles.otherButtonText}>APPROVED</Text>
                                </TouchableOpacity>
                            </Card>

                            <Card containerStyle={{
                                paddingTop: 30,
                                paddingBottom: 45,
                                backgroundColor: "#f9f9f9",
                                borderRadius: 7,
                                borderWidth: 1,
                                borderColor: '#f9f9f9',
                                shadowColor: "#455A64",
                                shadowOpacity: 0.1,
                                elevation: 0.1,
                            }}>
                                <TouchableOpacity style={styles.rejectedButtonContainer}
                                    onPress={() => this.gotoRejectedRequests()}>
                                    <Text style={styles.rejectedButtonText}>REJECTED</Text>
                                </TouchableOpacity>
                            </Card>

                        </View>

                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: win.height / 6.5
    },
    cardContainer: {
        padding: 56,
        paddingBottom: win.height / 6.5
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    profileText: {
        color: '#212121',
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18
    },
    profileNumberText: {
        color: '#f3931c',
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18
    },
    solidButtonContainer: {
        backgroundColor: '#f15a29',
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    solidButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18
    },
    otherButtonContainer: {
        backgroundColor: '#f3931c',
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    otherButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18
    },
    rejectedButtonContainer: {
        backgroundColor: '#4c4c4c',
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: '#FFF',
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    rejectedButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18
    },
});

//make this component available to the app
export default FleetManagerDashboard;