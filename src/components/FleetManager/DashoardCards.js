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
import Icon from 'react-native-ionicons';
import RectangleBox from '../../images/vectors/white-rectangle.png';
import NotifyIcon from '../../images/vectors/notify_icon.png';
import DriverCirlce from '../../images/vectors/driver-circle.png';
import DriverIcon from '../../images/vectors/drivers-img.png';
import VehicleCirlce from '../../images/vectors/vehicle-circle.png';
import VehicleIcon from '../../images/vectors/vehicles.png';
import StationCirlce from '../../images/vectors/stations-circle.png';
import StationIcon from '../../images/vectors/station-img.png';
import moment from 'moment';
import DashboardChart from './DashboardChart';

const win = Dimensions.get('window');

// create a component
class FleetManagerDashboardCards extends React.Component {
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

    // // This will load immediately hits this screen
    componentDidMount() {
        AsyncStorage.getItem("usermobile")
            .then((result) => {
                this.checkLogIn(result);
            })

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
        }
    }

    //go to Driver List Page
    gotoDriverList() {
        this.props.navigation.navigate("DriverListPage");
    }

    //go to Vehicle List Page
    gotoVehicleList() {
        this.props.navigation.navigate("VehicleListPage");
    }

    //go to station List Page
    gotoStationList() {
        this.props.navigation.navigate("StationListPage");
    }

    // gotoApprovedRequests = () => {
    //     this.props.navigation.navigate("FleetManagerApprovedPage");
    // }

    // gotoRejectedRequests = () => {
    //     this.props.navigation.navigate("FleetManagerRejectedPage");
    // }

    render() {
        return (
            <>
                <View style={styles.container}>
                    <View style={styles.profileContainer}>
                        <ImageBackground source={RectangleBox} style={styles.imageBg}>
                            {/* <Icon name="ios-notifications-outline" size={31} color="#999797" style={styles.iconAvatar} onPress={() => this.gotoLogout()} /> */}
                            <Image source={NotifyIcon} style={styles.imageAvatar} />
                        </ImageBackground>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: 31,
                        marginRight: 30

                    }}>
                        <Text style={styles.greetingText}>Hello</Text>
                        <Text style={styles.currentDate}>{moment().format('Do, MMMM, YYYY')}</Text>
                    </View>

                    <View>
                        <Text style={styles.profileText}>{this.state.loggedInUserName}</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 32,
                        marginLeft: 31,
                        marginRight: 30,
                        marginBottom: 32
                    }}>
                        <TouchableOpacity onPress={() => this.gotoDriverList()}>
                            <View style={styles.bannerCard}>
                                <View style={styles.innerCardText}>
                                    <View style={{
                                        alignItems: 'center',
                                        marginLeft: 61,
                                        marginRight: 61,
                                        marginTop: 32,
                                        marginBottom: 44
                                    }}>
                                        <View style={styles.vectorContainer}>
                                            <ImageBackground source={DriverCirlce} style={styles.vectorBg}>
                                                <Image style={styles.vectorIcon} source={DriverIcon} />
                                            </ImageBackground>
                                        </View>
                                        <View>
                                            <Text style={styles.cardCount}>56</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.cardText}>Drivers</Text>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>

                            <TouchableOpacity onPress={() => this.gotoVehicleList()}>
                                <View style={styles.bannerCard}>
                                    <View style={styles.innerCardText}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginLeft: 12,
                                            marginTop: 14,
                                            marginRight: 29,
                                            marginBottom: 13
                                        }}>
                                            <View style={styles.vectorContainer}>
                                                <ImageBackground source={VehicleCirlce} style={styles.vectorBg}>
                                                    <Image style={styles.vectorIcon} source={VehicleIcon} />
                                                </ImageBackground>
                                            </View>
                                            <View>
                                                <Text style={styles.vehicleCardCount}>41</Text>
                                                <Text style={styles.vehicleCardText}>Vehicles</Text>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.gotoStationList()}>
                                <View style={styles.bannerCard}>
                                    <View style={styles.innerCardText}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginLeft: 12,
                                            marginTop: 14,
                                            marginRight: 29,
                                            marginBottom: 13
                                        }}>
                                            <View style={styles.vectorContainer}>
                                                <ImageBackground source={StationCirlce} style={styles.vectorBg}>
                                                    <Image style={styles.vectorIcon} source={StationIcon} />
                                                </ImageBackground>
                                            </View>
                                            <View>
                                                <Text style={styles.vehicleCardCount}>112</Text>
                                                <Text style={styles.vehicleCardText}>Stations</Text>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
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
export default withNavigation(FleetManagerDashboardCards);