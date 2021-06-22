//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import AsyncStorage from '@react-native-community/async-storage';
import Helpers from '../Utilities/Helpers';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import ResetCheckNumber from './ResetPin/CheckNumber';
import Icon from 'react-native-ionicons';

const win = Dimensions.get('window');

// create a component
class LoginForm extends React.Component {

    // Constructor for this component
    constructor(props) {
        super(props);

        objectClass = new Helpers();

        // Declare variables here
        this.state = {
            hidden: true,
            usermobile: '',
            pin: '',
            viewSection: false,
            isLoading: false,
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/",
            hideEyeIcon: true,
            viewEyeIcon: false
        }
    }

    // SHOW LOADER
    showLoader() {
        this.setState({ isLoading: true });
    };

    // HIDE LOADER
    hideLoader() {
        this.setState({ isLoading: false });
    };

    // Open the reset pin alert box
    openResetCheckNumber() {
        this.setState({ viewSection: true });
    }


    // This function will be called when the login button is clicked
    onButtonPress() {
        // Validate input fields
        if ((this.state.usermobile == "" || this.state.usermobile == undefined) && (this.state.pin == "" || this.state.pin == undefined)) {
            // display toast activity
            objectClass.displayToast("All fields are required");
            return false;
        }
        else if ((this.state.usermobile == "" || this.state.usermobile == undefined)) {
            // display toast activity
            objectClass.displayToast("Mobile number cannot be empty");
            return false;
        }
        else if ((this.state.pin == "" || this.state.pin == undefined)) {
            // display toast activity
            objectClass.displayToast("PIN cannot be empty");
            return false;
        }

        else {
            // initiate loader here 
            this.showLoader();

            // Make the API call here
            fetch(this.state.baseUrl + this.state.apiRoute + 'login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: this.state.usermobile,
                    pin: this.state.pin
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {

                    //console.log("my response for login")
                    //console.log(responseJson)

                    if (responseJson.code == "200") {

                        // Get the details of the user
                        var allUserData = responseJson.data;

                        // Store Data in ASYNC STORAGE

                        AsyncStorage.setItem('allUserData', JSON.stringify(allUserData));
                        AsyncStorage.setItem('usermobile', this.state.usermobile);
                        AsyncStorage.setItem('userType', responseJson.userType.toUpperCase());

                        this.hideLoader();

                        objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //DISPLAY TOAST

                        //check the usertype to know which view to show
                        if (responseJson.userType.toUpperCase() == "DRIVER") {
                            // Go to Home Page
                            // Reset the navigation Stack for back button press
                            this.props
                                .navigation
                                .dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({
                                            routeName: 'DriverNavigationPage'
                                        }),
                                    ],
                                }))
                        }

                        //check the usertype to know which view to show
                        if (responseJson.userType.toUpperCase() == "FLEETMANAGER") {
                            // Go to Home Page
                            // Reset the navigation Stack for back button press
                            this.props
                                .navigation
                                .dispatch(StackActions.reset({
                                    index: 0,
                                    actions: [
                                        NavigationActions.navigate({
                                            routeName: 'FleetManagerDashboardPage'
                                        }),
                                    ],
                                }))
                        }

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


    // RENDER THE VIEW
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.formInputBody}>

                    <Text style={styles.inputLabelText}>Phone Number</Text>

                    <TextInput style={styles.input}
                        autoCapitalize="none"
                        onSubmitEditing={() => this.pinInput.focus()}
                        autoCorrect={false}
                        keyboardType='number-pad'
                        returnKeyType="next"
                        maxLength={10}
                        placeholder='Eg. 054 981 1145'
                        placeholderTextColor='#999797'
                        onChangeText={(text) => this.setState({ usermobile: text })}
                    />

                    <Text style={styles.inputLabelText2}>PIN</Text>
                    <View style={styles.eyeSection}>

                        <TextInput style={styles.inputPin}
                            returnKeyType="go"
                            ref={(input) => this.pinInput = input}
                            onSubmitEditing={() => this.onButtonPress()}
                            keyboardType='number-pad'
                            maxLength={4}
                            placeholder='Eg. 8234'
                            placeholderTextColor='#999797'
                            secureTextEntry={this.state.hidden}
                            onChangeText={(text) => this.setState({ pin: text })}
                        />

                        {this.state.viewEyeIcon ? (
                            <Icon onPress={() => this.setState({ hidden: !this.state.hidden, hideEyeIcon: true, viewEyeIcon: false })} style={styles.eyeIcon} name="eye" size={22} color="#999797" />
                        ) : null}

                        {this.state.hideEyeIcon ? (
                            <Icon onPress={() => this.setState({ hidden: !this.state.hidden, hideEyeIcon: false, viewEyeIcon: true })} style={styles.eyeIcon} name="eye-off" size={22} color="#999797" />
                        ) : null}
                    </View>
                </View>

                {/* <TouchableOpacity style={styles.solidButtonContainer}
                    onPress={() => this.openResetCheckNumber()}>
                    <Text style={styles.solidButtonText}>Forgot pin?</Text>
                </TouchableOpacity> */}

                <Text onPress={() => this.openResetCheckNumber()} style={styles.forgotpinTxt}>Forgot pin ?</Text>
                <View style={styles.borderContainer}>
                    <View style={styles.border} />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.solidButtonContainer}
                        onPress={() => this.onButtonPress()}>
                        <Text style={styles.solidButtonText}>Log In</Text>
                    </TouchableOpacity>

                </View>

                {this.state.viewSection ? (
                    <View>
                        <ResetCheckNumber />
                    </View>
                ) : null}

                {/* Show loader */}
                {this.state.isLoading ? (
                    <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
                ) : null}

            </View>
        );
    }

}

// define your styles
const styles = StyleSheet.create({
    container: {
        paddingBottom: 88
    },
    formInputBody: {
        paddingLeft: 32,
        paddingRight: 32,
    },
    inputLabelText: {
        marginTop: 39,
        marginBottom: 12,
        color: '#380507',
        fontSize: 18,
        lineHeight: 23,
        fontWeight: 'normal',
        fontStyle: 'normal',
        
    },
    inputLabelText2: {
        marginTop: 23,
        marginBottom: 12,
        color: '#380507',
        fontSize: 18,
        lineHeight: 23,
        fontWeight: 'normal',
        fontStyle: 'normal',
        
    },
    eyeSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    eyeIcon: {
        marginLeft: -40,
        marginRight: 20
    },
    inputPin: {
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
    buttonContainer: {
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
    forgotpinTxt: {
        color: '#F35C24',
        textAlign: 'right',
        paddingRight: 33.5,
        fontWeight: 'normal',
        marginTop: 12,
        marginBottom: 5,
        fontSize: 16,
        lineHeight: 20
    },
    borderContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: 36.5,
        paddingRight: 32
    },
    border: {
        flex: 0.24,
        borderBottomWidth: 1,
        borderBottomColor: '#F35C24',
    },
});

//make this component available to the app
export default withNavigation(LoginForm);
