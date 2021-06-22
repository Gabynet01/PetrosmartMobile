//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, Text, Dimensions, PermissionsAndroid, TextInput, TouchableOpacity, Image } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import Helpers from '../../Utilities/Helpers';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Geolocation from 'react-native-geolocation-service';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-ionicons';
import location from '../../../images/vectors/location.png';
import noDataImage from '../../../images/noData.png';

const win = Dimensions.get('window');

// create a component
class PromptPurchase extends React.Component {
    // Constructor for this component
    constructor(props) {
        super(props);

        objectClass = new Helpers();
        // Declare variables here
        this.state = {
            driverId: '',
            purchaseAmount: '',
            location: "",
            fuelStationId: "",
            selectedVehicle: "",
            lastPosition: "",
            isLoading: false,
            isPromptReady: false,
            fuelStationName: "",
            fuelStationAddress: "",
            vehicleOptions: [],
            fuelPurchaseId: "",
            selectedIndex: 0,
            fuelStationDetails: [],
            isNoDataImage: false,
            latitude: 0.1,
            longitude: 0.1,

            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    // this will enforce user to accept permissions
    async requestLocationPermission() {
        /*LOCATION : */
        //Grant the permission for Location

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Petrosmart Location Permission',
                'message': 'Petrosmart App needs access to your location ',
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            })

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            try {
                Geolocation.getCurrentPosition(
                    (position) => {
                        //console.log("My current location", JSON.stringify(position));

                        // this.setState({
                        //     location: (position.coords.latitude.toString() + ", " + position.coords.longitude.toString())
                        // })

                        this.setState({
                            latitude: parseFloat(position.coords.latitude),
                            longitude: parseFloat(position.coords.longitude)
                        })

                        //make the prompt driver to purchasde call here
                        this.promptDriverPurchaseApi();
                    },
                    (error) => {
                        // See error code charts below.
                        //console.log(error.code, error.message);
                        objectClass.displayToast(error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );

                this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
                    this.setState({ lastPosition: lastPosition });
                });
            }
            catch (e) {
                //console.log("Error has been caught when getting location coordinates of users", e);
            }
        }
        else {
            //console.log("Location permission denied");
            objectClass.displayToast("Location permission denied");
        }

        //----LOCATION END----//
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
    }

    // SHOW LOADER
    showLoader() {
        this.setState({ isLoading: true });
        this.setState({ isPromptReady: false });
        this.setState({ isNoDataImage: false });
    };

    // HIDE LOADER
    hideLoader() {
        this.setState({ isLoading: false });
    };

    // This will load immediately hits this screen
    componentDidMount() {
        AsyncStorage.getItem("usermobile")
            .then((result) => {
                // //console.log("this is the value of result", result)
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
                    //request for device permissions to use GEOLOCATION services
                    this.requestLocationPermission();
                    var allUserData = JSON.parse(result);
                    this.setState({ driverId: allUserData[0]["driver_id"] });
                })

        }
    }

    //prompt driver to purchase API
    promptDriverPurchaseApi() {
        // initiate loader here 
        this.showLoader();

        //console.log("driverID-->>>>", this.state.driverId)
        //console.log("location--->>>>", this.state.location)

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/nearest/fuel/stations', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driverId: this.state.driverId,
                latitude: (this.state.latitude).toString(),
                longitude: (this.state.longitude).toString(),
                // "latitude": "5.796178604108726",
                // "longitude": "-0.1280013852517811"
                // coordinates: this.state.location
                // coordinates: "5.576560135235284, -0.15190806975487298"
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for prompt driver to purchase")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    // objectClass.displayToast(responseJson.message); //DISPLAY TOAST

                    //check if item is null
                    if (responseJson.data.length == 0 || responseJson.data == null || responseJson.data == undefined) {
                        this.hideLoader();
                        objectClass.displayToast("No fuel stations found at this time");
                        this.setState({ isPromptReady: false });
                        this.setState({ isNoDataImage: true });
                        return false;
                    }

                    //lets set the data fetched from the API to states
                    var allData = responseJson.data[0];
                    console.log("allData----->>>", allData)

                    //set station name 
                    this.setState({ fuelStationDetails: allData })
                    this.setState({ fuelStationName: allData["station_name"] })
                    this.setState({ fuelStationAddress: allData["station_address"] })
                    this.setState({ fuelStationId: allData["station_id"] })

                    //set the station ID into storage
                    AsyncStorage.setItem('stationID', JSON.stringify(allData["station_id"]));

                    //make the API call to fetch driver vehicles by ID
                    this.fetchDriverVehiclesByID();

                }

                else {
                    this.hideLoader();
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                    this.setState({ isPromptReady: false });
                    this.setState({ isNoDataImage: true });
                }
            })
            .catch((error) => {
                this.hideLoader();
                objectClass.displayToast("Could not connect to server");
                this.setState({ isPromptReady: false });
                this.setState({ isNoDataImage: true });
            });

    }


    // make the API call to fecth driver vehicles by ID
    fetchDriverVehiclesByID() {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/get/vehicles/' + this.state.driverId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for fetch driver vehicles by ID api is--->>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    this.hideLoader();
                    this.setState({ isPromptReady: true });
                    this.setState({ isNoDataImage: false });
                    objectClass.displayToast("Prompting Driver to purchase Fuel"); //DISPLAY TOAST

                    // arrange the data for the picker to list the vehicles
                    this.setState({ vehicleOptions: responseJson.data });
                }

                else {
                    this.hideLoader();
                    this.setState({ isPromptReady: false });
                    this.setState({ isNoDataImage: true });
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                this.hideLoader();
                this.setState({ isPromptReady: false });
                this.setState({ isNoDataImage: true });
                objectClass.displayToast("Could not connect to server");
            });

    }

    /**
     * This will check the purchase of the user
     * Two(2) API's are called here
     * API(1)- Display purchase Info -- OnButtonPress
     * API(2)- Apply driver and vehicle rules -- ApplyDriverRules
     */

    onButtonPress() {
        this.setState({ isPromptReady: true });
        this.setState({ isNoDataImage: false });
        //some checks
        if ((this.state.purchaseAmount == "" || this.state.purchaseAmount == undefined) && (this.state.selectedVehicle == "" || this.state.selectedVehicle == undefined)) {
            // display toast activity
            objectClass.displayToast("All fields required");
            return false;
        }
        if (this.state.selectedVehicle == "" || this.state.selectedVehicle == undefined) {
            // display toast activity
            objectClass.displayToast("Please select a vehicle");
            return false;
        }
        if (this.state.purchaseAmount == "" || this.state.purchaseAmount == undefined) {
            // display toast activity
            objectClass.displayToast("Purchase amount cannot be empty");
            return false;
        }

        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/purchase/info', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driverId: this.state.driverId,
                vehicleId: this.state.selectedVehicle,
                amount: this.state.purchaseAmount,
                stationId: this.state.fuelStationId
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for display purchase Info API-->>>>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    //lets set the data fetched from the API to states
                    var allData = responseJson.data[0];

                    //set the station ID into storage
                    AsyncStorage.setItem('fuelPurchaseID', JSON.stringify(allData["purchase_id"]));

                    //make the API call to apply driver rules
                    this.applyDriverRules(allData["purchase_id"]);

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

    //API(2)---apply driver rules
    applyDriverRules(purchaseID) {
        this.setState({ isPromptReady: true });
        this.setState({ isNoDataImage: false });

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/apply/rules', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                purchaseId: purchaseID,
                driverId: this.state.driverId,
                vehicleId: this.state.selectedVehicle,
                amount: this.state.purchaseAmount,
                stationId: this.state.fuelStationId
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for confirm purchase by applying driver rules API-->>>>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {
                    this.hideLoader();
                    objectClass.displayToast("Purchase checked successfully");

                    //lets set the data fetched from the API to states
                    var allData = responseJson.data[0];

                    //set the station ID into storage
                    AsyncStorage.setItem('transactionID', JSON.stringify(allData["transaction_id"]));

                    this.props.navigation.navigate('GeneratePaymentCodePage', { fuelStationDetails: this.state.fuelStationDetails, vehicleDetails: this.state.vehicleOptions[this.state.selectedIndex - 1], transactionID: allData["transaction_id"], driverID: allData["user"], purchaseAmount: this.state.purchaseAmount });

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

    // render the view here
    render() {
        return (

            <View>
                {this.state.isPromptReady ? (

                    <View style={styles.container}>
                        <Text style={styles.mainText}>Today's Purchase</Text>

                        <View style={styles.bannerCard}>
                            <View style={styles.innerCardText}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <View>
                                        <Text style={styles.smallLabel}>Station Location</Text>
                                        <Text style={styles.bigLabel}>{this.state.fuelStationName}</Text>
                                        <Text style={styles.mediumLabel}>{objectClass.toTitleCase(this.state.fuelStationAddress)}</Text>
                                    </View>
                                    <View style={styles.vectorContainer}>
                                        <Image style={styles.vectorIcon} source={location} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.mainText2}>Purchase Information</Text>

                        <View style={styles.formBody}>
                            <Text style={styles.inputLabelText}>Vehicle</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    itemStyle={{ height: 54, color: '#999797', fontSize: 13 }}
                                    selectedValue={this.state.selectedVehicle}
                                    onValueChange={(itemValue, index) =>
                                        this.setState({ selectedVehicle: itemValue, selectedIndex: index })
                                    }>

                                    <Picker.Item label="Please tap to select a vehicle" value="" />

                                    {this.state.vehicleOptions.map((item, index) => {
                                        return (<Picker.Item label={item.name} value={item.veh_id} key={index} />)
                                    })}
                                </Picker>
                            </View>
                            <Text style={styles.smallLabelText}>Select a vehicle for your purchase</Text>

                            <Text style={styles.inputLabelText2}>Amount</Text>
                            <View>
                                <TextInput style={styles.input}
                                    autoCapitalize="none"
                                    returnKeyType="go"
                                    onSubmitEditing={() => this.onButtonPress()}
                                    autoCorrect={false}
                                    keyboardType='number-pad'
                                    placeholder='Eg. 200'
                                    value={this.state.purchaseAmount}
                                    placeholderTextColor='#999797'
                                    onChangeText={(text) => this.setState({ purchaseAmount: text })}
                                />
                            </View>
                            <Text style={styles.smallLabelText2}>Enter your purchase amount</Text>

                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.solidButtonContainer}
                                onPress={() => this.onButtonPress()}>
                                <Text style={styles.solidButtonText}>Purchase fuel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                ) : null}

                {/* Show NoData Image when data is empty */}
                {this.state.isNoDataImage ? (
                    <View style={styles.centerItems}>
                        <Image style={styles.logoContainer}
                            source={noDataImage}
                        />
                        <Text>No fuel station found at this time.</Text>
                        <TouchableOpacity onPress={() => this.requestLocationPermission()}>
                            <Text style={styles.refreshTxt}>Tap to try again <Icon name={'arrow-forward'} color="#F35C24" size={16} /></Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                {/* Show loader */}
                {this.state.isLoading ? (
                    <ProgressBar color="#F35C24" style={{ marginTop: 20, marginBottom: 20 }} />
                ) : null}
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    pickerContainer: {
        height: 54,
        marginLeft: 19,
        marginRight: 19,
        paddingLeft: 17,
        color: '#999797',
        fontSize: 13,
        lineHeight: 16,
        backgroundColor: '#FAFAFA',
        borderRadius: 4,
        // width: win.width - 95,
    },
    inputLabelText: {
        marginLeft: 16,
        marginTop: 19,
        marginBottom: 10,
        color: '#605C56',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'normal',
        fontStyle: 'normal',

    },
    smallLabelText: {
        marginLeft: 19,
        marginTop: 5,
        color: '#999797',
        fontSize: 9,
        lineHeight: 11,
        fontWeight: 'normal',
        fontStyle: 'normal',

    },
    smallLabelText2: {
        marginLeft: 19,
        marginTop: 5,
        marginBottom: 36,
        color: '#999797',
        fontSize: 9,
        lineHeight: 11,
        fontWeight: 'normal',
        fontStyle: 'normal',

    },
    inputLabelText2: {
        marginLeft: 19,
        marginTop: 15,
        marginBottom: 10,
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
        color: '#380507',
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
    formBody: {
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 16
    },
    buttonContainer: {
        marginTop: 35,
        paddingLeft: 61,
        paddingRight: 66,
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
    logoContainer: {
        flex: 1,
        aspectRatio: 0.4,
        resizeMode: 'contain',
    },
    centerItems: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    refreshTxt: {
        color: '#F35C24',
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '600',
        marginTop: 21,
        marginBottom: 21,
        fontSize: 16,
        lineHeight: 20
    },
});

//make this component available to the app
export default withNavigation(PromptPurchase);