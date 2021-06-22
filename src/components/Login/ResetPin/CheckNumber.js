import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image } from "react-native";
import Helpers from '../../Utilities/Helpers';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import petrosmartlogo from '../../../images/petrosmart-logo.png';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';

const win = Dimensions.get('window');


class ResetCheckNumber extends Component {
    // Constructor for this component
    constructor(props) {
        super(props);
        // Initiate the helper class here
        objectClass = new Helpers();
        this.state = {
            usermobile: '',
            isModalVisible: true,
            isLoading: false,
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    toggleModal() {
        objectClass.displayToast(objectClass.toTitleCase("Please login")); //DISPLAY TOAST
        // Go to Home Page
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
    };

    // SHOW LOADER
    showLoader() {
        this.setState({ isLoading: true });
    };

    // HIDE LOADER
    hideLoader() {
        this.setState({ isLoading: false });
    };

    // make the API call
    onButtonPress() {
        // Validate input fields
        if ((this.state.usermobile == "" || this.state.usermobile == undefined)) {
            // display toast activity
            objectClass.displayToast("Mobile number cannot be empty");
            return false;
        }

        else {
            // initiate loader here 
            this.showLoader();

            // Make the API call here
            fetch(this.state.baseUrl + this.state.apiRoute + 'login/reset/check/number', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: this.state.usermobile
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {

                    //console.log("my response for reset check number")
                    //console.log(responseJson)

                    if (responseJson.code == "200") {

                        // Get the details of the user
                        var allUserData = responseJson.data;

                        this.hideLoader();

                        objectClass.displayToast("OTP sent successfully to " + this.state.usermobile + " via SMS"); //DISPLAY TOAST
                        // save user number
                        // AsyncStorage.setItem('userOtp',responseJson.otp);
                        AsyncStorage.setItem('otpUserNumber', this.state.usermobile);
                        // objectClass.displayToast(objectClass.toTitleCase(responseJson.otp)); //DISPLAY TOAST
                        // Go to Home Page
                        // Reset the navigation Stack for back button press
                        this.props
                            .navigation
                            .dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({
                                        routeName: 'ResetConfirmOtpPage'
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

            <Modal style={styles.modalContainer}
                animationType={'slide'}
                onBackdropPress={() => this.toggleModal()}
                isVisible={this.state.isModalVisible}>

                <Image style={styles.logoContainer}
                    source={petrosmartlogo}
                />

                <Text style={styles.forgotpinTxt}>Forgot PIN?</Text>

                <TextInput style={styles.input}
                    autoCapitalize="none"
                    returnKeyType="go"
                    onSubmitEditing={() => this.onButtonPress()}
                    autoCorrect={false}
                    keyboardType='number-pad'
                    returnKeyType="next"
                    maxLength={10}
                    placeholder='Enter mobile number'
                    placeholderTextColor='#999797'
                    onChangeText={(text) => this.setState({ usermobile: text })}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.solidButtonContainer}
                        onPress={() => this.onButtonPress()}>
                        <Text style={styles.solidButtonText}>Confirm</Text>
                    </TouchableOpacity>

                </View>
                {/* 
                <TouchableOpacity style={styles.solidButtonContainer}
                    onPress={() => this.onButtonPress()}>
                    <Text style={styles.solidButtonText}>CONFIRM</Text>
                </TouchableOpacity> */}

                {/* Show loader */}
                {this.state.isLoading ? (
                    <ProgressBar color="#F35C24" style={{ marginTop: 20, marginBottom: 20 }} />
                ) : null}

            </Modal>


        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        maxHeight: 305,
        marginTop: 152,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 32,
        marginLeft: 30,
        marginRight: 30
    },
    logoContainer: {
        width: 60,
        height: 77,
        resizeMode: 'contain',
        marginTop: 39,
        marginLeft: 148,
        marginRight: 148
    },
    solidButtonContainer: {
        marginTop: 24,
        marginLeft: 62,
        marginRight: 63,
        backgroundColor: '#F35C24',
        borderRadius: 8,
        height: 52,
        width: 232,
        marginBottom: 45
    },
    solidButtonText: {
        color: '#FBFBFB',
        textAlign: 'center',
        paddingTop: 16,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '500',
        fontStyle: 'normal',
        
    },
   
    input: {
        
        height: 52,
        borderColor: '#FAFAFA',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        marginBottom: 5,
        padding: 10,
        color: '#380507',
        borderRadius: 8,
        fontSize: 14,
        lineHeight: 18,
        width: win.width - 130,
        fontWeight: 'normal',
        fontStyle: 'normal',
        paddingLeft: 30,
    },
    forgotpinTxt: {
        color: '#212121',
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 15,
        fontSize: 18
    },
});


//make this component available to the app
export default withNavigation(ResetCheckNumber);