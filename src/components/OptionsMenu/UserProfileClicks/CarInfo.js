//import liraries
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Helpers from '../../Utilities/Helpers';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Icon from 'react-native-ionicons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import noDataImage from '../../../images/noData.png';
import oopsImage from '../../../images/oops.png';

const win = Dimensions.get('window');

// create a component
class CarInfoView extends React.Component {

    constructor(props) {
        super(props);

        objectClass = new Helpers();
        // Declare variables here
        this.state = {
            driverId: '',
            selectedTitle: "",
            isLoading: false,
            isListReady: false,
            isFetching: false,
            isNoDataImage: false,
            isErrorImage: false,
            data: [],
            allData: [],
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
                    this.setState({ driverId: allUserData[0]["driver_id"] });

                    this.fetchList();

                })
        }
    }

    // Handle pull to refresh
    onRefresh() {
        this.setState({ isFetching: true },
            function () {
                this.fetchList();
            }
        );
    }

    // Set the list items elements here
    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <View>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginLeft: 32,
                marginTop: 16
            }}>
                <View>
                    <Text style={styles.smallHeading}>Make &amp; Model</Text>
                    <Text style={styles.headingTxt2}>{item.name}</Text>
                </View>
                <View>
                    <Text style={styles.smallHeading}>Branch</Text>
                    <Text style={styles.headingTxt2}>{item.branch_name}</Text>
                </View>
                <View></View>

            </View>

            <View style={{
                marginLeft: 32,
                marginTop: 16,
                marginBottom: 26
            }}>
                <Text style={styles.smallHeading}>Plate Number</Text>
                <Text style={styles.headingTxt2}>{item.number_plate.toUpperCase()}</Text>
            </View>

            <View style={styles.customHr}></View>

        </View>

    )

        // make the API call to fecth driver transactioons by ID
        fetchList() {
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
    
                    //console.log("my response for fetch driver transactions history by ID api is--->>>")
                    //console.log(responseJson)
    
                    if (responseJson.code == "200") {
    
                        //lets check if list is empty
                        if (responseJson.data.length == 0) {
                            this.setState({ isListReady: false });
                            this.setState({ isFetching: false });
                            this.setState({ isNoDataImage: true });
                            this.setState({ isErrorImage: false });
    
                            return;
                        }
    
                        //this will be used to populate the list items
                        this.setState({ data: responseJson.data });
    
                        //call this function to populate the list items
                        this.setState({ isListReady: true });
                        this.setState({ isFetching: false });
                        this.setState({ isNoDataImage: false });
                        this.setState({ isErrorImage: false });
    
                        this.hideLoader();
    
                        objectClass.displayToast(responseJson.message); //DISPLAY TOAST
                    }
    
                    else {
                        this.hideLoader();
                        this.setState({ isListReady: false });
                        this.setState({ isFetching: false });
    
                        //image hider
                        this.setState({ isNoDataImage: true });
                        this.setState({ isErrorImage: false });
                        objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                    }
                })
                .catch((error) => {
                    this.hideLoader();
                    this.setState({ isListReady: false });
                    this.setState({ isFetching: false });
    
                    //image hider
                    this.setState({ isNoDataImage: false });
                    this.setState({ isErrorImage: true });
                    objectClass.displayToast("Could not connect to server");
                });
    
        }

    // render the SearchBar here as the header of the list
    renderHeader = () => {
        return (
            <>
                <View>
                    <View style={styles.mainHeading}>
                        <Text style={styles.headingTxt}>Your Car Information</Text>
                    </View>
                </View>
            </>
        );
    };


    render() {
        return (
            <View style={styles.container}>
                {this.state.isListReady ? (
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        // ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                    // stickyHeaderIndices={[0]}
                    />

                ) : null}

                {/* Show loader */}
                {this.state.isLoading ? (
                    <ProgressBar color="#F35C24" style={{ marginTop: 20, marginBottom: 20 }} />
                ) : null}

                {/* Show NoData Image when data is empty */}
                {this.state.isNoDataImage ? (
                    <View style={styles.centerItems}>
                        <Image style={styles.logoContainer}
                            source={noDataImage}
                        />
                        <Text>No Car Info found.</Text>
                        <TouchableOpacity onPress={() => this.fetchList()}>
                            <Text style={styles.refreshTxt}>Tap to refresh <Icon name={'arrow-forward'} color="#F35C24" size={16} /></Text>
                        </TouchableOpacity>
                    </View>
                ) : null}

                {/* Show Error Image when there is an error */}
                {this.state.isErrorImage ? (
                    <View style={styles.centerItems}>
                        <Image style={styles.logoContainer}
                            source={oopsImage}
                        />
                        <Text>OOPS!, Something went wrong.</Text>
                    </View>
                ) : null}

            </View>
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
        marginLeft: 32
    },
    headingTxt: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 23,
        color: '#380507'
    },
    headingTxt2: {
        marginTop: 5,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 20,
        color: '#380507'
    },
    customHr: {
        borderBottomColor: "#ECE8E4",
        borderBottomWidth: 2,
        marginLeft: 29,
        marginRight: 29
    },
    smallHeading: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: 15,
        color: '#999797'
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
export default withNavigation(CarInfoView);
