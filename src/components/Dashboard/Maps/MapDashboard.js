//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList, SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, PermissionsAndroid, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Icon from 'react-native-ionicons';
import arrowBackIcon from '../../../images/vectors/arrowBack.png';
import RectangleBox from '../../../images/vectors/white-rectangle.png';
import Geolocation from 'react-native-geolocation-service';
import mapMarkerIcon from '../../../images/vectors/map_marker_icon.png';
import MapView, { Marker, Callout } from 'react-native-maps';
import { ListItem, SearchBar, Badge } from "react-native-elements";
import noDataImage from '../../../images/noData.png';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import angleRightIcon from '../../../images/vectors/angle-right.png';
import location from '../../../images/vectors/location.png';

const win = Dimensions.get('window');
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// create a component
class MapDashboardPage extends React.Component {

    // Constructor for this component
    constructor(props) {
        super(props);
        // Declare variables here
        this.state = {
            driverId: '',
            latitude: 0.1,
            longitude: 0.1,
            isFetching: false,
            isNoDataImage: false,
            isDataFound: false,
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

    // Handle pull to refresh
    onRefresh() {
        this.setState({ isFetching: true },
            function () {
                this.getNearestFuelStations();
            }
        );
    }

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
                        this.getNearestFuelStations();
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

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
    }

    gotoDashboard() {
        this.props.navigation.navigate("DriverNavigationPage");
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


    //prompt driver to purchase API
    getNearestFuelStations() {
        this.setState({ isNoDataImage: false, isDataFound: false, isFetching: false })
        // initiate loader here 
        this.showLoader();

        //console.log("driverID-->>>>", this.state.driverId)

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/nearest/fuel/stations', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driverId: this.state.driverId,
                // "latitude": "5.796178604108726",
                // "longitude": "-0.1280013852517811"
                latitude: (this.state.latitude).toString(),
                longitude: (this.state.longitude).toString()
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for get nearest fuel station api")
                //console.log(responseJson)

                this.hideLoader();

                if (responseJson.code == "200") {
                    //check if item is null
                    if (responseJson.data.length == 0 || responseJson.data == null || responseJson.data == undefined) {
                        this.hideLoader();
                        objectClass.displayToast("No fuel stations found at this time");
                        this.setState({ isDataFound: false });
                        this.setState({ isNoDataImage: true });
                        return false;
                    }
                    this.fineTuneDataSet(responseJson.data);
                }

                else {
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                    this.setState({ isDataFound: false });
                    this.setState({ isNoDataImage: true });
                }
            })
            .catch((error) => {
                this.hideLoader();
                objectClass.displayToast("Could not connect to server");
                this.setState({ isDataFound: false });
                this.setState({ isNoDataImage: true });
            });

    }


    // This handles all the data
    fineTuneDataSet(allData) {
        var markersPayload = [];

        if (allData.length == 0) {
            objectClass.displayToast("Sorry, there are no available filling stations at this time, please try again later");
            this.setState({ isNoDataImage: true, isDataFound: false })
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
            isNoDataImage: false,
            markers: markersPayload,
            isDataFound: true
        });

    }

    renderHeader = () => {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View>
                    <Text style={styles.stationsText}>Here are the stations closest to you</Text>
                </View>
                <View style={styles.vectorContainer}>
                    <Image style={styles.vectorIcon} source={location} />
                </View>
            </View>
        );
    }

    // Set the list items elements here
    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem titleNumberOfLines={1} onPress={this.goToPurchaseFuelPage.bind(this, item)} style={styles.stationsList}>
            <ListItem.Content>
                <ListItem.Title style={styles.titleStyle}>{item.stationName}</ListItem.Title>
                <ListItem.Subtitle style={styles.subTitleStyle}>{item.stationAddress}</ListItem.Subtitle>
            </ListItem.Content>
            <View style={styles.iconContainer}>
                <Image style={styles.angleRightIcon} source={angleRightIcon} />
            </View>
        </ListItem>
    )

    // This is called when an item is clicked
    goToPurchaseFuelPage(rowData) {
        console.log(rowData)
        this.props.navigation.navigate('MapPurchaseFuelPage', { FuelPurchaseItem: rowData });
    }

    render() {
        return (
            <View>
                <MapView
                    style={{ width: screenWidth, height: screenHeight - 283 }}
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

                <View
                    style={{
                        position: 'absolute',//use absolute position to show button on top of the map
                        top: '2%', //for center align
                        alignSelf: 'flex-start', //for align to right
                        marginLeft: 5,
                    }}
                >
                    <TouchableOpacity onPress={() => this.gotoDashboard()}>
                        <ImageBackground source={RectangleBox} style={styles.imageBg}>
                            <Icon name="arrow-back" size={25} color="#380507" style={styles.iconAvatar} />
                            {/* <Image source={arrowBackIcon} style={styles.iconAvatar} /> */}
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                <View style={styles.bannerCard}>
                    <View style={styles.innerCardText}>

                        {this.state.isDataFound ? (
                            <View style={styles.container}>
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.markers}
                                    renderItem={this.renderItem}
                                    ListHeaderComponent={this.renderHeader}
                                    onRefresh={() => this.onRefresh()}
                                    refreshing={this.state.isFetching}
                                />
                            </View>
                        ) : null}

                        {/* Show NoData Image when data is empty */}
                        {this.state.isNoDataImage ? (
                            <View style={styles.centerItems}>
                                <Image style={styles.logoContainer}
                                    source={noDataImage}
                                />
                                <Text>No fuel station found at this time.</Text>
                                <TouchableOpacity onPress={() => this.getNearestFuelStations()}>
                                    <Text style={styles.gotoDashboardTxt}>Tap to try again <Icon name={'arrow-forward'} color="#F35C24" size={16} /></Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        {/* Show loader */}
                        {this.state.isLoading ? (
                            <ProgressBar color="#F35C24" style={{ marginTop: 20, marginBottom: 20 }} />
                        ) : null}
                    </View>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bannerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        // width: screenWidth,
        // height: screenHeight,
        shadowOpacity: 0.1,
        elevation: 0.1,
        shadowColor: "#455A64",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32
    },
    innerCardText: {
        height: screenHeight,
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
    stationsText: {
        textAlign: 'left',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 20,
        color: '#380507',
        marginTop: 33,
        marginLeft: 30
    },
    stationsList: {
        marginLeft: 13,
    },
    titleStyle: {
        fontFamily: 'circularstd-book',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 20,
        color: '#605C56'
    },
    subTitleStyle: {
        fontSize: 14,
        lineHeight: 18,
        color: "#999797",
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'circularstd-book'
    },
    imageBg: {
        width: 80,
        height: 80,
        resizeMode: "cover",
        justifyContent: "center",
        shadowOpacity: 0.1,
        elevation: 0.1,
        shadowColor: "#455A64"
    },
    iconAvatar: {
        marginLeft: 32,
        marginTop: -20
    },
    gotoDashboardTxt: {
        color: '#F35C24',
        textAlign: 'center',
        fontStyle: 'normal',
        fontWeight: '600',
        marginTop: 21,
        marginBottom: 21,
        fontSize: 16,
        lineHeight: 20
    },
    logoContainer: {
        // flex: 1,
        aspectRatio: 0.5,
        resizeMode: 'contain',
        marginBottom: -25
    },
    centerItems: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    angleRightIcon: {
        marginTop: 5,
        width: 6,
        height: 12,
        marginRight: 24
    },
    vectorContainer: {
        width: 40,
        height: 40,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#FFFAE0",
        marginRight: 25,
        marginTop: 24
    },
    vectorIcon: {
        marginLeft: 11,
        marginTop: 10,
        width: 16,
        height: 18
    },
    headertext: {
        color: "#282828",
        fontWeight: "600",
    },
    normalText: {
        color: "#282828"
    }

});

//make this component available to the app
export default withNavigation(MapDashboardPage);