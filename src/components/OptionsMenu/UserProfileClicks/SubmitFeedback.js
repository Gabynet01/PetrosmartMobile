//import liraries
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Helpers from '../../Utilities/Helpers';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Icon from 'react-native-ionicons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import FeedBackStatusView from './FeedbackModal/FeedbackStatus'
const win = Dimensions.get('window');

// create a component
class SubmitFeedbackView extends React.Component {

    constructor(props) {
        super(props);

        objectClass = new Helpers();
        // Declare variables here
        this.state = {
            driverId: '',
            selectedTitle: "",
            isLoading: false,
            feedbackOptions: [],
            selectedIndex: 0,
            feedbackMessage: "",
            isFeedbackStatusReady: false,

            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    //navigation options 
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
                    this.setState({ driverId: allUserData[0]["driver_id"] })

                    var allFeedbackOptions = [
                        {
                            "name": "Station Report",
                        },
                        {
                            "name": "Voucher Report",
                        },
                    ]
                    this.setState({ feedbackOptions: allFeedbackOptions })

                })
        }
    }


    onButtonPress() {
        //some checks
        if ((this.state.selectedTitle == "" || this.state.selectedTitle == undefined) && (this.state.feedbackMessage == "" || this.state.feedbackMessage == undefined)) {
            // display toast activity
            objectClass.displayToast("All fields required");
            return false;
        }
        if (this.state.selectedTitle == "" || this.state.selectedTitle == undefined) {
            // display toast activity
            objectClass.displayToast("Please select a report title");
            return false;
        }
        if (this.state.feedbackMessage == "" || this.state.feedbackMessage == undefined) {
            // display toast activity
            objectClass.displayToast("Feedback message cannot be empty");
            return false;
        }

        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'petrosmart/submit/feedback/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.state.driverId,
                userType: "DRIVER",
                title: this.state.selectedTitle,
                message: this.state.feedbackMessage
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for submit feedbakck Info API-->>>>>")
                //console.log(responseJson)
                this.hideLoader();
                if (responseJson.code == "200") {
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display message
                    this.setState({isFeedbackStatusReady: true});
                }
                else {
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                    this.setState({isFeedbackStatusReady: false});
                }
            })
            .catch((error) => {
                this.hideLoader();
                objectClass.displayToast("Could not connect to server");
                this.setState({isFeedbackStatusReady: false});
            });

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
                            <View>
                                <View style={styles.mainHeading}>
                                    <Text style={styles.headingTxt}>Submit Feedback</Text>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.headingTxt2}>Report Title</Text>
                            </View>

                            <View style={styles.pickerContainer}>
                                <Picker
                                    itemStyle={{ height: 54, color: '#380507', fontSize: 13, backgroundColor: '#FFF' }}
                                    selectedValue={this.state.selectedTitle}
                                    onValueChange={(itemValue, index) =>
                                        this.setState({ selectedTitle: itemValue, selectedIndex: index })
                                    }>

                                    <Picker.Item label="Please select" value="" />

                                    {this.state.feedbackOptions.map((item, index) => {
                                        return (<Picker.Item label={item.name} value={item.name} key={index} />)
                                    })}
                                </Picker>
                            </View>

                            <View>
                                <Text style={styles.headingTxt2}>Message</Text>
                            </View>

                            <View style={styles.textAreaContainer} >
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="E.g Type something"
                                    returnKeyType="go"
                                    onSubmitEditing={() => this.onButtonPress()}
                                    autoCorrect={true}
                                    value={this.state.feedbackMessage}
                                    placeholderTextColor='#999797'
                                    onChangeText={(text) => this.setState({ feedbackMessage: text })}
                                    multiline={true}
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.solidButtonContainer}
                                    onPress={() => this.onButtonPress()}>
                                    <Text style={styles.solidButtonText}>Submit Feedback</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Status of feedback */}
                            {this.state.isFeedbackStatusReady ? (
                                <View>
                                    <FeedBackStatusView />
                                </View>
                            ) : null}

                            {/* Show loader */}
                            {this.state.isLoading ? (
                                <ProgressBar color="#F35C24" style={{ marginTop: 20, marginBottom: 20 }} />
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
        marginBottom: 130
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    mainHeading: {
        marginTop: 19,
        marginLeft: 30
    },
    headingTxt2: {
        marginTop: 24,
        marginLeft: 30,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 18,
        lineHeight: 23,
        color: '#380507'
    },
    headingTxt: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 22,
        lineHeight: 28,
        color: '#380507'
    },
    pickerContainer: {
        height: 54,
        marginLeft: 30,
        marginRight: 34,
        paddingLeft: 17,
        color: '#999797',
        fontSize: 14,
        lineHeight: 18,
        backgroundColor: '#FFF',
        borderRadius: 8,
        fontStyle: 'normal',
        fontWeight: 'normal',
        marginTop: 12
        // width: win.width - 95,
    },
    textAreaContainer: {
        backgroundColor: '#FFF',
        marginLeft: 32,
        marginRight: 32,
        marginTop: 12,
        borderRadius: 8,
        fontStyle: 'normal',
        fontWeight: 'normal',
        paddingLeft: 17,
        paddingRight: 17
    },
    textArea: {
        height: 192,
        justifyContent: "flex-start",
        color: '#380507',
        fontSize: 14,
        lineHeight: 18,
        fontStyle: 'normal',
        fontWeight: 'normal',

    },
    buttonContainer: {
        marginTop: 24,
        paddingLeft: 42,
        paddingRight: 42,
    },
    solidButtonContainer: {
        backgroundColor: '#F35C24',
        borderRadius: 8,
        height: 52
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
export default withNavigation(SubmitFeedbackView);
