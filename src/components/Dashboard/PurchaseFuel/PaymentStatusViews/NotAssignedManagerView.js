import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image } from "react-native";
import Modal from "react-native-modal";
import petrosmartlogo from '../../../../images/petrosmart-logo.png';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';

const win = Dimensions.get('window');


class NotAssignedManagerStatusView extends Component {
    // Constructor for this component
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: true,

        }
    }

    toggleModal() {

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
    };



    render() {
        return (

            <Modal style={styles.modalContainer}
                animationType={'slide'}
                onBackdropPress={() => this.toggleModal()}
                isVisible={this.state.isModalVisible}>

                <Image style={styles.logoContainer}
                    source={petrosmartlogo}
                />

                <Text style={styles.modalTxt}>OOPS! No Fleet Manager has been assigned to you. Kindly contact your company</Text>
                
                <TouchableOpacity style={styles.solidButtonContainer}
                    onPress={() => this.toggleModal()}>
                    <Text style={styles.solidButtonText}>Back to Transactions</Text>
                </TouchableOpacity>

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
    modalTxt: {
        marginLeft: 43,
        marginRight: 43,
        marginTop: 24,
        
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 23,
        textAlign: 'center',
        color: '#605C56'
    },
});


//make this component available to the app
export default withNavigation(NotAssignedManagerStatusView);