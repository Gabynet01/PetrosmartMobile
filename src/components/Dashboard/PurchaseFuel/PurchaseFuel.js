//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import Helpers from '../../Utilities/Helpers';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import ActionBarImage from '../../Utilities/ActionBarImage';
import PromptPurchase from './PromptDriverPurchase';
import MainOptionsMenuView from '../../OptionsMenu/MainOptionsMenu';
import profileImage from '../../../images/avatarImage.jpg';
import moment from 'moment';
import Icon from 'react-native-ionicons';

const win = Dimensions.get('window');

// create a component
class PurchaseFuelForms extends React.Component {
    constructor(props) {
        super(props);

        objectClass = new Helpers();
        // Declare variables here
        this.state = {
            drivername: '',
            usermobile: '',
            enterPin: '',
            confirmPin: '',
            isLoading: false,
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    static navigationOptions = ({ navigation, screenProps }) => {
        return {
            title: "",
            headerStyle: {
                backgroundColor: '#F6F6F6',
                elevation: 0, // remove shadow on Android
                shadowOpacity: 0, // remove shadow on iOS
            },
            headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
        }
    };

    // This is called when the user profile image is clicked
    onProfileImagePress() {
        this.props.navigation.navigate('UserProfilePage');
    }

    // SHOW LOADER
    showLoader() {
        this.setState({ isLoading: true });
    };

    // HIDE LOADER
    hideLoader() {
        this.setState({ isLoading: false });
    };

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
                    this.setState({ drivername: objectClass.toTitleCase(allUserData[0].name) })

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

                        <View style={styles.profileContainer} >
                            <TouchableOpacity onPress={() => this.onProfileImagePress()}>
                                <Image style={styles.profileImage}
                                    source={profileImage}
                                />
                            </TouchableOpacity>
                            <Text style={styles.currentDate}>{moment().format('Do, MMMM, YYYY')}</Text>
                        </View>

                        <View style={styles.container} >
                            <PromptPurchase />
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
        marginBottom: 130
    },
    profileContainer: {
        marginTop: 35,
        paddingRight: 40,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 16
    },
    currentDate: {
        marginTop: 25,
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 15.18,
        color: '#9E9B9B'
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
    formContainer: {
        padding: 16,
        paddingBottom: win.height / 2
    },
    logoContainer: {
        flex: 1,
        aspectRatio: 0.4,
        resizeMode: 'contain',
    },
    logoBody: {
        backgroundColor: Colors.white,
    },
    centerItems: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainerCenter: {
        marginTop: 32,
        marginBottom: 22,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    input: {
        height: 52,
        borderColor: '#212121',
        borderWidth: 1,
        marginBottom: 5,
        padding: 10,
        color: '#212121',
        borderRadius: 7
    },
    solidButtonContainer: {
        backgroundColor: '#F35C24',
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#F35C24',
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    solidButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18
    },
});

//make this component available to the app
export default withNavigation(PurchaseFuelForms);