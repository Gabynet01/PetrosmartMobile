//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import Helpers from '../../Utilities/Helpers';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import petrosmartlogo from '../../../images/petrosmart-logo.png';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';

const win = Dimensions.get('window');

// create a component
class ResetEnterNewPin extends React.Component {
    constructor(props) {
        super(props);

        objectClass = new Helpers();

        // Declare variables here
        this.state = {
            enterPin: '',
            confirmPin: '',
            isLoading: false,
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    static navigationOptions = {
        title: "Reset PIN - Enter PIN",
        headerShown: null,
        headerStyle: {
            backgroundColor: "#F35C24"
        }
    };

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
        AsyncStorage.getItem("otpUserNumber")
            .then((result) => {
                this.checkLogIn(result);
            })

    }

    // Use this to check if the user has an OTP
    checkLogIn(dataStored) {
        if (dataStored === null || dataStored === undefined) {
            objectClass.displayToast("NO OTP User Number detected");
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
    }

    // get all data from storage
    getStorageData() {
        AsyncStorage.getItem("otpUserNumber")
            .then((result) => {
                this.onButtonPress(result);
            })
    }

    // make the API call
    onButtonPress(result) {
        // Validate input fields
        if ((this.state.enterPin == "" || this.state.enterPin == undefined)) {
            // display toast activity
            objectClass.displayToast("Please enter PIN");
            return false;
        }

        else if ((this.state.confirmPin == "" || this.state.confirmPin == undefined)) {
            // display toast activity
            objectClass.displayToast("Please confirm PIN");
            return false;
        }

        else if ((this.state.enterPin != this.state.confirmPin)) {
            // display toast activity
            objectClass.displayToast("PIN does not match");
            return false;
        }

        else {
            // initiate loader here 
            this.showLoader();

            // Make the API call here
            fetch(this.state.baseUrl + this.state.apiRoute + 'login/reset/accept/pin', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: result,
                    pin: this.state.confirmPin
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {

                    //console.log("my response for reset enter pin")
                    //console.log(responseJson)

                    if (responseJson.code == "200") {

                        this.hideLoader();

                        objectClass.displayToast(responseJson.message); //DISPLAY TOAST
                        // save otp

                        // Go to Login Page
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

                    else {
                        this.hideLoader();
                        objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                    }
                })
                .catch((error) => {
                    this.hideLoader();
                    objectClass.displayToast("Could not connect to server");
                });

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

                        <View style={styles.logoBody}>
                            <View style={styles.centerItems}>
                                <Image style={styles.logoContainer}
                                    source={petrosmartlogo}
                                />
                            </View>
                        </View>
                        <View style={styles.formBody}>
                            <View style={styles.sectionContainerCenter}>
                                <Text style={styles.sectionTitle}>Enter your new PIN</Text>
                                {/* <Text>Please enter the OTP that was sent to your mobile number</Text> */}
                            </View>
                            <View style={styles.formContainer}>

                                <TextInput style={styles.input}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    onSubmitEditing={() => this.pinInput.focus()}
                                    autoCorrect={false}
                                    keyboardType='number-pad'
                                    returnKeyType="next"
                                    placeholder='Enter PIN'
                                    maxLength={4}
                                    placeholderTextColor='#999797'
                                    onChangeText={(text) => this.setState({ enterPin: text })}
                                />

                                <TextInput style={styles.input2}
                                    ref={(input) => this.pinInput = input}
                                    autoCapitalize="none"
                                    returnKeyType="go"
                                    onSubmitEditing={() => this.getStorageData()}
                                    autoCorrect={false}
                                    maxLength={4}
                                    keyboardType='number-pad'
                                    placeholder='Confirm PIN'
                                    placeholderTextColor='#999797'
                                    onChangeText={(text) => this.setState({ confirmPin: text })}
                                />

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.solidButtonContainer}
                                        onPress={() => this.getStorageData()}>
                                        <Text style={styles.solidButtonText}>Confirm</Text>
                                    </TouchableOpacity>

                                </View>
                                {/* 
                                <TouchableOpacity style={styles.solidButtonContainer}
                                    onPress={() => this.getStorageData()}>
                                    <Text style={styles.solidButtonText}>CONFIRM</Text>
                                </TouchableOpacity> */}

                                {/* Show loader */}
                                {this.state.isLoading ? (
                                    <ProgressBar color="#F35C24" style={{ marginTop: 20, marginBottom: 20 }} />
                                ) : null}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    formContainer: {
        padding: 16,
        paddingBottom: win.height / 6.5
    },
    logoContainer: {
        marginTop: 36,
        width: 130,
        height: 166,
    },
    formBody: {
        marginTop: 74,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 26,
        borderBottomLeftRadius: 0,
        borderBottomEndRadius: 0
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
        color: '#380507',
        fontSize: 18,
        lineHeight: 23,
        fontWeight: '600',
        fontStyle: 'normal',
    },
    input: {
        height: 56,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        paddingLeft: 30,
        color: '#380507',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 'normal',
        fontStyle: 'normal',

    },
    input2: {
        flex: 1,
        height: 56,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        paddingLeft: 30,
        color: '#380507',
        fontSize: 14,
        lineHeight: 18,
        fontWeight: 'normal',
        fontStyle: 'normal',
        marginTop: 12

    },
    buttonContainer: {
        marginTop: 20,
        paddingLeft: 44,
        paddingRight: 44,
    },
    solidButtonContainer: {
        backgroundColor: '#F35C24',
        borderRadius: 8,
        height: 52,
    },
    solidButtonText: {
        color: '#FBFBFB',
        textAlign: 'center',
        paddingTop: 16,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '600',
        fontStyle: 'normal',

    },
});

//make this component available to the app
export default withNavigation(ResetEnterNewPin);