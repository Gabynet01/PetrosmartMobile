//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import Helpers from '../../Utilities/Helpers';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import ActionBarImage from '../../Utilities/ActionBarImage';
import Icon from 'react-native-ionicons';
import { Picker } from '@react-native-picker/picker';
import MainOptionsMenuView from '../../OptionsMenu/MainOptionsMenu';
import NotAssignedManagerStatusView from './PaymentStatusViews/NotAssignedManagerView';
import CompanyPoolStatusView from './PaymentStatusViews/CompanyPoolView';
import MultipleVoucherStatusView from './PaymentStatusViews/MultipleVoucherView';
import SingleVoucherStatusView from './PaymentStatusViews/SingleVoucherView';
import location from '../../../images/vectors/location.png';
import car from '../../../images/vectors/car.png';
import fuel_pump from '../../../images/vectors/fuel_pump.png';
import pencil from '../../../images/vectors/pencil.png';
import moment from 'moment';

const win = Dimensions.get('window');

// create a component
class GeneratePaymentCodeView extends React.Component {
    constructor(props) {
        super(props);

        objectClass = new Helpers();

        // Declare variables here
        this.state = {
            drivername: '',
            usermobile: '',
            selectedPaymentType: '',
            isVoucherSelected: false,
            voucherCodeEntered: '',
            isLoading: false,
            isSingleVoucherView: false,
            isMultipleVoucherView: false,
            isAssignedFleetManagerView: false,
            isCompanyPoolView: false,
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

    //check picker value to show or hide voucher code Box
    // checkPickerVlue(itemValue) {
    //     this.setState({ selectedPaymentType: itemValue })
    //     if (itemValue == "VOUCHER") {
    //         //unhide the voucher drop down
    //         this.setState({ isVoucherSelected: true })
    //     }
    //     else {
    //         this.setState({ isVoucherSelected: false })
    //     }
    // }

    //on button cancel press
    onButtonCancelPress() {
        this.props.navigation.navigate("DashboardPage");
    }

    //on button confirm press
    // onButtonConfirmPress() {
    //     //some checks
    //     if (this.state.selectedPaymentType == "" || this.state.selectedPaymentType == undefined) {
    //         // display toast activity
    //         objectClass.displayToast("Please select a payment type");
    //         return false;
    //     }

    //     else if (this.state.selectedPaymentType == "POS") {
    //         this.generatePaymentCode();
    //     }

    //     else if ((this.state.selectedPaymentType == "VOUCHER") && (this.state.voucherCodeEntered == "" || this.state.voucherCodeEntered == undefined)) {
    //         // display toast activity
    //         objectClass.displayToast("Please enter voucher code");
    //         return false;
    //     } else {
    //         //lets validate the voucher code
    //         // Make the API call here
    //         fetch(this.state.baseUrl + this.state.apiRoute + 'payment/validate/voucher', {
    //             method: 'POST',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 driverId: this.props.navigation.state.params.driverID,
    //                 voucherCode: this.state.voucherCodeEntered
    //             }),
    //         })
    //             .then((response) => response.json())
    //             .then((responseJson) => {

    //                 //console.log("my response for validate voucher ->>>>>")
    //                 //console.log(responseJson)

    //                 if (responseJson.code == "200") {

    //                     this.hideLoader();
    //                     //make the api call to generate the code
    //                     objectClass.displayToast(objectClass.toTitleCase(responseJson.message))
    //                     this.generatePaymentCode();
    //                 }

    //                 else {
    //                     this.hideLoader();
    //                     objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
    //                 }
    //             })
    //             .catch((error) => {
    //                 this.hideLoader();
    //                 objectClass.displayToast("Could not connect to server");
    //             });

    //     }

    // }

    //generate payment code 
    generatePaymentCode() {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'payment/generate/code', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // paymentType: this.state.selectedPaymentType,
                transactionId: this.props.navigation.state.params.transactionID
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for generate payment code ->>>>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {
                    this.hideLoader();
                    //lets set the data fetched from the API to states
                    var allData = responseJson.data[0];

                    this.confirmGeneratedPaymentCode(allData["payment_code"]);

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

    //confirm the generated payment code 
    confirmGeneratedPaymentCode(payment_code) {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'payment/confirm/code', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentCode: payment_code
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for confirm generated payment code->>>>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    this.hideLoader();
                    //lets set the data fetched from the API to states
                    var allData = responseJson.data[0];

                    //lets call the auto transaction payment API

                    this.autoPaymentAPI(allData["payment_code"]);

                }

                else {
                    this.hideLoader();

                    this.setState({ isAssignedFleetManagerView: false });
                    this.setState({ isCompanyPoolView: false });
                    this.setState({ isMultipleVoucherView: false });
                    this.setState({ isSingleVoucherView: false });

                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                this.hideLoader();

                this.setState({ isAssignedFleetManagerView: false });
                this.setState({ isCompanyPoolView: false });
                this.setState({ isMultipleVoucherView: false });
                this.setState({ isSingleVoucherView: false });

                objectClass.displayToast("Could not connect to server");
            });


    }

    //final call to process the payment
    autoPaymentAPI(payment_code) {
        // initiate loader here 
        this.showLoader();

        //lets get the station iD from the params that were passed
        var driverId = this.props.navigation.state.params["driverID"];
        var stationId = this.props.navigation.state.params["fuelStationDetails"]["station_id"];

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'payment/auto/transact', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driverId: driverId,
                stationId: stationId,
                paymentCode: payment_code
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for verify auto transact ->>>>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    this.hideLoader();
                    //display response
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message))

                    //lets check the payment TYPE
                    var paymentType = responseJson.paymentType;
                    //console.log("payment type is--->>>>")
                    //console.log(responseJson.paymentType)

                    if (paymentType == "NO_ASSIGNED_FLEETMANAGER") {
                        this.setState({ isAssignedFleetManagerView: true });
                        this.setState({ isCompanyPoolView: false });
                        this.setState({ isMultipleVoucherView: false });
                        this.setState({ isSingleVoucherView: false });
                    }

                    //check if it is company pool 
                    if (paymentType == "COMPANYPOOL") {
                        this.setState({ isAssignedFleetManagerView: false });
                        this.setState({ isCompanyPoolView: true });
                        this.setState({ isMultipleVoucherView: false });
                        this.setState({ isSingleVoucherView: false });
                    }

                    if (paymentType == "MULTIPLE_VOUCHER") {
                        this.setState({ isAssignedFleetManagerView: false });
                        this.setState({ isCompanyPoolView: false });
                        this.setState({ isMultipleVoucherView: true });
                        this.setState({ isSingleVoucherView: false });
                    }

                    if (paymentType == "SINGLE_VOUCHER") {
                        this.setState({ isAssignedFleetManagerView: false });
                        this.setState({ isCompanyPoolView: false });
                        this.setState({ isMultipleVoucherView: false });
                        this.setState({ isSingleVoucherView: true });
                    }

                }

                else {
                    this.hideLoader();

                    this.setState({ isAssignedFleetManagerView: false });
                    this.setState({ isCompanyPoolView: false });
                    this.setState({ isMultipleVoucherView: false });
                    this.setState({ isSingleVoucherView: false });

                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                this.hideLoader();
                this.setState({ isAssignedFleetManagerView: false });
                this.setState({ isCompanyPoolView: false });
                this.setState({ isMultipleVoucherView: false });
                this.setState({ isSingleVoucherView: false });

                objectClass.displayToast("Could not connect to server");
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

                        <View style={styles.profileContainer} >
                            <Text style={styles.currentDate}>{moment().format('Do, MMMM, YYYY')}</Text>
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.mainText}>Purchase Details</Text>
                            <View style={styles.bannerCard}>
                                <View style={styles.innerCardText}>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <View>
                                            <Text style={styles.smallLabel}>Station Location</Text>
                                            <Text style={styles.bigLabel}>{objectClass.toTitleCase(this.props.navigation.state.params.fuelStationDetails.station_name)}</Text>
                                            <Text style={styles.mediumLabel}>{objectClass.toTitleCase(this.props.navigation.state.params.fuelStationDetails.station_address)}</Text>
                                        </View>
                                        <View style={styles.vectorContainer}>
                                            <Image style={styles.vectorIcon} source={location} />
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.formBody}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',

                                }}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                        <View style={styles.vectorContainer3}>
                                            <Image style={styles.vectorIcon3} source={pencil} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',

                                }}>
                                    <View>
                                        <View style={styles.vehicleInfo}>
                                            <Text style={styles.smallLabelText}>Vehicle</Text>
                                            <Text style={styles.inputLabelText}>{objectClass.toTitleCase(this.props.navigation.state.params.vehicleDetails.name)}</Text>
                                            <Text style={styles.smallLabelText2}>{objectClass.toTitleCase(this.props.navigation.state.params.vehicleDetails.number_plate)}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.vectorContainer2}>
                                            <Image style={styles.vectorIcon2} source={car} />
                                        </View>
                                    </View>

                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',

                                }}>
                                    <View>
                                        <View style={styles.purchaseInfo}>
                                            <Text style={styles.smallLabelText}>Fuel Type and Amount</Text>
                                            <Text style={styles.inputLabelText}>GHC {objectClass.toUPPERCASE(this.props.navigation.state.params.purchaseAmount)}</Text>
                                            <Text style={styles.smallLabelText2}>{objectClass.toTitleCase(this.props.navigation.state.params.vehicleDetails.fuel_type)}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.vectorContainer2}>
                                            <Image style={styles.vectorIcon2X} source={fuel_pump} />
                                        </View>
                                    </View>

                                </View>

                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.solidButtonContainer}
                                    onPress={() => this.generatePaymentCode()}>
                                    <Text style={styles.solidButtonText}>Confirm Purchase</Text>
                                </TouchableOpacity>

                            </View>

                            {/* NO FLEET MANAGER ASSIGNED */}

                            {this.state.isAssignedFleetManagerView ? (
                                <View>
                                    <NotAssignedManagerStatusView />
                                </View>
                            ) : null}

                            {/* FLEET MANAGER APPROVAL PENDING */}
                            {this.state.isCompanyPoolView ? (
                                <View>
                                    <CompanyPoolStatusView />
                                </View>
                            ) : null}

                            {/* MULTIPLE VOUCHER PAYMENT */}
                            {this.state.isMultipleVoucherView ? (
                                <View>
                                    <MultipleVoucherStatusView />
                                </View>
                            ) : null}

                            {/* SINGLE VOUCHER PAYMENT */}
                            {this.state.isSingleVoucherView ? (
                                <View>
                                    <SingleVoucherStatusView />
                                </View>
                            ) : null}

                            {/* Show loader */}
                            {this.state.isLoading ? (
                                <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
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
    profileContainer: {
        marginTop: 5,
        paddingRight: 28,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    currentDate: {
        marginTop: 25,
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 15.18,
        color: '#9E9B9B'
    },
    vehicleInfo: {
        marginTop: -12,
        marginBottom: 22
    },
    purchaseInfo: {
        marginBottom: 16
    },
    smallLabelText: {
        marginLeft: 25,
        marginTop: 5,
        color: '#999797',
        fontSize: 12,
        lineHeight: 15,
        fontWeight: 'normal',
        fontStyle: 'normal',
        
    },
    smallLabelText2: {
        marginLeft: 25,
        color: '#999797',
        fontSize: 12,
        lineHeight: 15,
        fontWeight: 'normal',
        fontStyle: 'normal',
        
    },
    inputLabelText: {
        marginLeft: 25,
        marginTop: 5,
        marginBottom: 7,
        color: '#605C56',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'normal',
        fontStyle: 'normal',
        
    },
    input: {
        height: 50,
        backgroundColor: '#FAFAFA',
        marginLeft: 19,
        marginRight: 19,
        borderRadius: 4,
        paddingLeft: 17,
        color: '#999797',
        fontSize: 13,
        lineHeight: 16,
        fontWeight: 'normal',
        fontStyle: 'normal',
        
    },
    mainText: {
        paddingLeft: 32,
        marginTop: 13,
        fontSize: 18,
        lineHeight: 23,
        fontStyle: 'normal',
        fontWeight: '500',
        color: '#380507',
        
    },
    mainText2: {
        paddingLeft: 32,
        marginTop: 35,
        fontSize: 18,
        lineHeight: 23,
        fontStyle: 'normal',
        fontWeight: '500',
        color: '#380507',
        
    },
    bannerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginTop: 25,
        marginLeft: 30,
        marginRight: 30
    },
    innerCardText: {
        marginTop: 14,
        marginLeft: 23,
        marginBottom: 18
    },
    smallLabel: {
        fontSize: 12,
        lineHeight: 15,
        color: '#999797',
        fontStyle: 'normal',
        fontWeight: 'normal',
        
        marginBottom: 5
    },
    bigLabel: {
        fontSize: 16,
        lineHeight: 20,
        color: '#605C56',
        fontStyle: 'normal',
        fontWeight: '600',
        
        marginBottom: 7
    },
    mediumLabel: {
        fontSize: 14,
        lineHeight: 18,
        color: '#999797',
        fontStyle: 'normal',
        fontWeight: '500',
        
    },
    vectorContainer: {
        width: 40,
        height: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FFFAE0",
        marginRight: 24,
        marginTop: 20
    },
    vectorIcon: {
        marginLeft: 11,
        marginTop: 10,
        width: 16,
        height: 18
    },
    vectorContainer2: {
        width: 40,
        height: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FFFAE0",
        marginRight: 24,
        marginTop: 20
    },
    vectorIcon2: {
        marginLeft: 8,
        marginTop: 10,
        width: 21,
        height: 15
    },
    vectorIcon2X: {
        marginLeft: 11,
        marginTop: 10,
        width: 16,
        height: 17
    },
    vectorContainer3: {
        width: 48,
        height: 48,
        borderRadius: 100,
        backgroundColor: "#F3931C",
        marginRight: 10,
        marginTop: -20
    },
    vectorIcon3: {
        marginLeft: 17,
        marginTop: 18,
        width: 13,
        height: 13
    },
    formBody: {
        marginTop: 52,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 16
    },
    buttonContainer: {
        marginTop: 35,
        paddingLeft: 43,
        paddingRight: 51,
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
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },

});

//make this component available to the app
export default withNavigation(GeneratePaymentCodeView);