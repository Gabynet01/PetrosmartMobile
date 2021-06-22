//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import ActionBarImage from '../Utilities/ActionBarImage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Avatar, Card } from 'react-native-elements';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { CommonActions } from '@react-navigation/native';
import MainMenuOptionsView from '../OptionsMenu/MainOptionsMenu';
import petrosmartlogo from '../../images/petrosmart-logo.png';
import Icon from 'react-native-ionicons';
import settingsIcon from '../../images/vectors/settings.png';
import RectangleBox from '../../images/vectors/white-rectangle.png';
import profileImage from '../../images/avatarImage.jpg';
import CarIcon from '../../images/vectors/car.png';
import helpIcon1 from '../../images/vectors/help_1.png';
import helpIcon2 from '../../images/vectors/help_2.png';
import CarBg from '../../images/vectors/car_bg.png';
import helpBg from '../../images/vectors/help_bg.png';
import angleRightIcon from '../../images/vectors/angle-right.png';
import aboutBg from '../../images/vectors/about_bg.png';
import aboutIcon from '../../images/vectors/about_icon.png';
import feedbackBg from '../../images/vectors/feedback_bg.png';
import feedbackIcon from '../../images/vectors/feedbackIcon.png';
import thumbLike from '../../images/vectors/thumbLike.png';
import GetHelpModal from './UserProfileClicks/GetHelpModal';

const win = Dimensions.get('window');

// create a component
class UserProfileView extends React.Component {

    static navigationOptions = {
        headerShown: null
    };

    // Constructor for this component
    constructor(props) {
        super(props);
        // Declare variables here
        this.state = {
            drivername: '',
            usermobile: '',
            getHelpSection: false,
        }
    }

    gotoDashboard() {
        this.props.navigation.navigate('DriverNavigationPage');
    }

    goToAboutApp() {
        this.props.navigation.navigate('AboutAppPage');
    }

    goToSubmitFeedback() {
        this.props.navigation.navigate('SubmitFeedbackPage');
    }

    goToCarInfo() {
        this.props.navigation.navigate('CarInfoPage');
    }

    openHelpModal() {
        this.setState({ getHelpSection: true });
    }

    //go to logout 
    gotoLogout = () => {
        // this.hideBottomNavigationView();

        //show this
        Alert.alert(
            //title
            'Are you sure?',
            //body
            'By logging out, all your session data wil be cleared. Do you want to log out?',
            [
                {
                    text: 'Yes', style: "default", onPress: () => {
                        // Clear storage
                        AsyncStorage.clear();
                        // Display Logout Message
                        objectClass.displayToast("You are logged out");
                        // Reset the navigation Stack for back button press
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
                },
                { text: 'No', onPress: () => objectClass.displayToast("Welcome Back"), style: 'cancel' },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        )
    }


    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    // This will load immediately hits this screen
    componentDidMount() {
        AsyncStorage.getItem("usermobile")
            .then((result) => {
                this.checkLogIn(result);
            })

    }

    // Use this to check the user logged in 
    checkLogIn(dataStored) {
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
                    this.setState({ drivername: this.toTitleCase(allUserData[0].name) })

                })

            this.setState({ usermobile: dataStored });
        }
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

                            <View style={styles.profileContainer}>
                                <ImageBackground source={RectangleBox} style={styles.imageBg}>
                                    <Icon name="cog" size={24} color="#999797" style={styles.iconAvatar} onPress={() => this.gotoLogout()} />
                                    {/* <Image source={settingsIcon} style={styles.imageAvatar} /> */}
                                </ImageBackground>
                            </View>

                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20
                            }}>
                                <Image source={profileImage} style={styles.imageAvatar} />
                                <Text style={styles.driverName}>{this.state.drivername}</Text>
                                <Text style={styles.driverNumber}>{this.state.usermobile}</Text>
                            </View>

                            <TouchableOpacity onPress={() => this.goToCarInfo()} style={styles.bannerCard} parent="CarInfoPage" navigation={this.props.navigation}>
                                <View style={styles.innerCardText}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        marginTop: 10,
                                        marginBottom: 10,
                                        marginRight: 26
                                    }}>
                                        <View style={styles.vectorContainer}>
                                            <ImageBackground source={CarBg} style={styles.vectorBg}>
                                                <Image style={styles.vectorIcon} source={CarIcon} />
                                            </ImageBackground>
                                        </View>
                                        <View style={styles.textContainer1}>
                                            <Text style={styles.bigLabel}>Your Car Information</Text>
                                        </View>
                                        <View style={styles.iconContainer}>
                                            <Image style={styles.angleRightIcon} source={angleRightIcon} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.openHelpModal()} style={styles.bannerCard} parent="Dashboard" navigation={this.props.navigation}>
                                <View style={styles.innerCardText}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        marginTop: 10,
                                        marginBottom: 10,
                                        marginRight: 26
                                    }}>
                                        <View style={styles.vectorContainer}>
                                            <ImageBackground source={helpBg} style={styles.vectorBg}>
                                                <Image style={styles.vectorIcon2x} source={helpIcon1} />
                                                <Image style={styles.vectorIcon2y} source={helpIcon2} />
                                            </ImageBackground>
                                        </View>
                                        <View style={styles.textContainer2}>
                                            <Text style={styles.bigLabel}>Get Help</Text>
                                        </View>
                                        <View style={styles.iconContainer}>
                                            <Image style={styles.angleRightIcon} source={angleRightIcon} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.goToSubmitFeedback()} style={styles.bannerCard} parent="SubmitFeedbackPage" navigation={this.props.navigation}>
                                <View style={styles.innerCardText}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        marginTop: 10,
                                        marginBottom: 10,
                                        marginRight: 26
                                    }}>
                                        <View style={styles.vectorContainer}>
                                            <ImageBackground source={feedbackBg} style={styles.vectorBg}>
                                                <Image style={styles.vectorIcon3x} source={feedbackIcon} />
                                                <Image style={styles.vectorIcon3y} source={thumbLike} />
                                            </ImageBackground>
                                        </View>
                                        <View style={styles.textContainer3}>
                                            <Text style={styles.bigLabel}>Submit Feedback</Text>
                                        </View>
                                        <View style={styles.iconContainer}>
                                            <Image style={styles.angleRightIcon} source={angleRightIcon} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.goToAboutApp()} style={styles.bannerCard} parent="UserProfilePage" navigation={this.props.navigation}>
                                <View style={styles.innerCardText}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        marginTop: 10,
                                        marginBottom: 10,
                                        marginRight: 26
                                    }}>
                                        <View style={styles.vectorContainer}>
                                            <ImageBackground source={aboutBg} style={styles.vectorBg}>
                                                <Image style={styles.vectorIcon4} source={aboutIcon} />
                                            </ImageBackground>
                                        </View>
                                        <View style={styles.textContainer4}>
                                            <Text style={styles.bigLabel}>About App</Text>
                                        </View>
                                        <View style={styles.iconContainer}>
                                            <Image style={styles.angleRightIcon} source={angleRightIcon} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Text onPress={() => this.gotoDashboard()} style={styles.gotoDashboardTxt}>Back to Dashboard <Icon name={'arrow-forward'} color="#F35C24" size={16} onPress={() => this.gotoDashboard()} /></Text>
                            <View style={styles.borderContainer}>
                                <View style={styles.border} />
                            </View>

                            {this.state.getHelpSection ? (
                                <View>
                                    <GetHelpModal />
                                </View>
                            ) : null}
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
        marginBottom: 100
    },
    profileContainer: {
        marginTop: 30,
        marginRight: 25,
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
    vectorBg: {
        width: 40,
        height: 40,
        resizeMode: "cover",
        justifyContent: "center",
        shadowOpacity: 0.1,
        elevation: 0.1,
        shadowColor: "#455A64"
    },
    driverName: {
        marginTop: 30,
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 22,
        lineHeight: 28,
        color: "#380507"
    },
    driverNumber: {
        marginTop: 7,
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 18,
        lineHeight: 23,
        color: "#999797"
    },
    iconAvatar: {
        marginLeft: 30,
        marginTop: -20
    },
    imageAvatar: {
        width: 130,
        height: 130,
        borderRadius: 16,
        shadowOpacity: 0.1,
        shadowColor: "#455A64"
    },
    textContainer1: {
        marginTop: 11,
        marginLeft: 10,
        marginRight: 95
    },
    textContainer2: {
        marginTop: 11,
        marginLeft: 10,
        marginRight: 180
    },
    textContainer3: {
        marginTop: 11,
        marginLeft: 10,
        marginRight: 118
    },
    textContainer4: {
        marginTop: 11,
        marginLeft: 10,
        marginRight: 163
    },
    iconContainer: {
        marginTop: 12,
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    normalText: {
        color: '#212121',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18
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
    bannerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginTop: 25,
        marginLeft: 30,
        marginRight: 30,
        height: 64
    },
    innerCardText: {
        marginLeft: 15,
    },
    bigLabel: {
        fontSize: 16,
        lineHeight: 20,
        color: '#605C56',
        fontStyle: 'normal',
        fontWeight: 'normal',
        color: "#380507"
    },
    vectorContainer: {
        width: 40,
        height: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FFFAE0",
        marginRight: 5,
    },
    vectorIcon: {
        marginLeft: 9,
        marginTop: 0,
        width: 21,
        height: 15
    },
    vectorIcon3x: {
        marginLeft: 11,
        marginTop: -5,
        width: 17,
        height: 14
    },
    vectorIcon3y: {
        marginLeft: 20,
        marginTop: -20,
        width: 8,
        height: 11
    },
    vectorIcon4: {
        marginLeft: 9,
        marginTop: 0,
        width: 18,
        height: 18
    },
    vectorIcon2x: {
        marginLeft: 9,
        marginTop: 0,
        width: 16,
        height: 16
    },
    vectorIcon2y: {
        marginLeft: 17,
        marginTop: -9,
        width: 13,
        height: 13
    },
    angleRightIcon: {
        marginTop: 5,
        width: 6,
        height: 12,
        marginRight: 5,
    },
    gotoDashboardTxt: {
        color: '#F35C24',
        textAlign: 'center',
        paddingRight: 33.5,
        fontStyle: 'normal',
        fontWeight: '600',
        marginTop: 51,
        fontSize: 16,
        lineHeight: 20
    },
    borderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 23,
        marginTop: 7
    },
    border: {
        flex: 0.34,
        borderBottomWidth: 1,
        borderBottomColor: '#F35C24',
    },

});

//make this component available to the app
export default withNavigation(UserProfileView);