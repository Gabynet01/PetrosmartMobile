import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image } from "react-native";
import Helpers from '../../Utilities/Helpers';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';

const win = Dimensions.get('window');

class GetHelpModalView extends Component {
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
        this.props
            .navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'UserProfilePage'
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

    }

    render() {
        return (

            <Modal style={styles.modalContainer}
                animationType={'slide'}
                onBackdropPress={() => this.toggleModal()}
                isVisible={this.state.isModalVisible}>

                <Text style={styles.modalTxt}>Who would you like to chat with?</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.solidButtonContainer}>
                        <Text style={styles.solidButtonText}>Chat Fleet Manager</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.outlineButtonContainer}>
                        <Text style={styles.outlineButtonText}>Chat Petrosmart</Text>
                    </TouchableOpacity>

                </View>

                {/* Show loader */}
                {this.state.isLoading ? (
                    <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
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
    buttonContainer: {
        marginTop: 35,
        paddingLeft: 61,
        paddingRight: 66,
    },
    solidButtonContainer: {
        backgroundColor: '#F35C24',
        borderRadius: 8,
        height: 52,
        width: 226
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
    outlineButtonContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        height: 52,
        width: 226,
        borderWidth: 1,
        borderColor: "#F35C24",
        marginTop: -23
    },
    outlineButtonText: {
        color: '#F35C24',
        textAlign: 'center',
        paddingTop: 16,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '500',
        fontStyle: 'normal',

    },
    modalTxt: {
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 26,
        lineHeight: 33,
        textAlign: "center",
        color: "#380507",
        marginLeft: 60,
        marginRight: 59,
    },
});


//make this component available to the app
export default withNavigation(GetHelpModalView);