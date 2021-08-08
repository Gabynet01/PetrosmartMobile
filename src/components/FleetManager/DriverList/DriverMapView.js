//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, PermissionsAndroid, Image, Dimensions, TouchableOpacity } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import MapView, { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-ionicons';
import Geolocation from 'react-native-geolocation-service';
import mapMarkerIcon from '../../../images/vectors/map_marker_icon.png';

const win = Dimensions.get('window');
const screenWidth = Dimensions.get("window").width;

// create a component
class DriverMapViewCard extends React.Component {

    // Constructor for this component
    constructor(props) {
        super(props);
        // Declare variables here
        this.state = {
            driverId: '',
            latitude: 0.1,
            longitude: 0.1,
            lastPosition: '',
            loggedInUserName: '',
            isLoading: false,
            markers: [],
            usermobile: '',
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    static navigationOptions = {
        headerShown: null
    };

    // SHOW LOADER
    showLoader() {
        this.setState({ isLoading: true });
    };

    // HIDE LOADER
    hideLoader() {
        this.setState({ isLoading: false });
    };


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
                        //console.log("latitude --->" + parseFloat(position.coords.latitude));
                        //console.log("longitude --->" + parseFloat(position.coords.longitude));

                        this.setState({
                            latitude: parseFloat(position.coords.latitude),
                            longitude: parseFloat(position.coords.longitude)
                        })

                        //make the call to fetch all fuel stations
                        this.getAllFuelStations();
                    },
                    (error) => {
                        // See error code charts below.
                        //console.log(error.code, error.message);
                        objectClass.displayToast(error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );

                this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
                    //console.log("Last position--->>>", lastPosition);
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

    // go to map dashboard page
    gotoMapPage() {
        // this.props.navigation.navigate("MapDashboardPage");
        var userCoordinates = { "userLatitude": parseFloat(this.state.latitude), "userLongitude": parseFloat(this.state.longitude) }
        // navigate to the class
        this.props.navigation.navigate("MapDashboardPage", { mapProps: userCoordinates });
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
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

                    //request for device permissions to use GEOLOCATION services
                    this.requestLocationPermission();
                    var allUserData = JSON.parse(result);
                    this.setState({ driverId: allUserData[0]["driver_id"] });
                })
        }
    }


    //get all fuel stations
    getAllFuelStations() {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/' + this.state.driverId + "/fuel/stations/", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for fetch all fuel stations api is--->>>")
                //console.log(responseJson)
                this.hideLoader();

                if (responseJson.code == "200") {
                    this.fineTuneDataSet(responseJson.data);
                    // objectClass.displayToast(responseJson.message); //DISPLAY TOAST
                }

                else {
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                this.hideLoader();
                objectClass.displayToast("Could not connect to server");
            });

    }

    // This handles all the data
    fineTuneDataSet(allData) {
        var markersPayload = [];

        if (allData.length == 0) {
            objectClass.displayToast("Sorry, there are no available filling stations at this time, please try again later");
            return false;
        }

        allData.forEach(element => {
            // Declare variables for the callout view
            var stationName = element.station_name;
            var stationAddress = element.station_address;
            var stationId = element.station_id;

            // Variables for coordinates
            var latitude = parseFloat((element.latitude).trim());
            var longitude = parseFloat((element.longitude).trim());

            // //console.log('latitude, latitude')
            // //console.log(latitude, latitude)

            item = {}
            coordinates = {}
            item["stationName"] = stationName;
            item["stationAddress"] = stationAddress;
            item["stationId"] = stationId;

            // create coordinates here
            coordinates["latitude"] = latitude;
            coordinates["longitude"] = longitude;

            // push coordinates into array
            item["coordinates"] = coordinates;

            markersPayload.push(item);
        });

        this.setState({
            markers: markersPayload
        });

    }


    render() {
        return (
            <View style={styles.bannerCard}>
                <View style={styles.innerCardText}>
                    <MapView
                        style={{ flex: 1 }}
                        region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                    >
                        {this.state.markers.map((marker, i) => (
                            <Marker
                                key={i}
                                image={mapMarkerIcon}
                                coordinate={marker.coordinates}
                            >
                                <Callout>
                                    <Text style={styles.headertext}>{marker.stationName}</Text>
                                    <Text style={styles.normalText}>Address: {marker.stationAddress}</Text>
                                </Callout>
                            </Marker>
                        ))}

                    </MapView>

                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => this.gotoMapPage()}>
                        <Text style={styles.findText}>Driver current location <Icon name={'arrow-forward'} color="#380507" size={12} /></Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    bannerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 24,
        width: screenWidth - 56,
        height: 168,
        borderRadius: 16,
        shadowOpacity: 0.1,
        elevation: 0.1,
        shadowColor: "#455A64"
    },
    innerCardText: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 7,
        width: screenWidth - 76,
        height: 120
    },
    mediumLabel: {
        fontSize: 16,
        lineHeight: 20,
        color: '#605C56',
        fontStyle: 'normal',
        fontWeight: 'normal',

    },
    percentLabel: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 15.3214,
        lineHeight: 19,
        color: '#000000',
        textAlign: 'center',
        paddingTop: 17
    },
    findText: {
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 20,
        color: '#380507'
    },
    headertext: {
        color: "#282828",
        fontWeight: "bold",
    },
    normalText: {
        color: "#282828"
    }

});

//make this component available to the app
export default withNavigation(DriverMapViewCard);