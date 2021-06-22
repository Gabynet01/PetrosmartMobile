//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { FlatList, SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Helpers from '../../Utilities/Helpers';
import Icon from 'react-native-ionicons';
import { ListItem, SearchBar, Badge } from "react-native-elements";
import FleetManagerOptionsMenuView from '../../OptionsMenu/FleetManagerOptionsMenu';
import noDataImage from '../../../images/noData.png';
import oopsImage from '../../../images/oops.png';
import moment from 'moment';

const win = Dimensions.get('window');

// create a component
class FleetManagerApprovedRequestView extends React.Component {
    // Constructor for this component
    constructor(props) {

        objectClass = new Helpers();

        super(props);
        this.state = {
            isListReady: false,
            isFetching: false,
            isNoDataImage: false,
            isErrorImage: false,
            userId: "",
            value: '',
            data: [],
            apiListData: [],
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    //navigation options 
    static navigationOptions = {
        // headerTitle: () => <ActionBarImage />,
        title: "Approved Requests",
        // headerLeft: () => <ActionBarImage />,
        headerRight: () => <FleetManagerOptionsMenuView />,
        // headerRight: <MapBarIcon />,
        headerStyle: {
            backgroundColor: '#4c4c4c',
            height: 80
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
            color: '#fff',
            marginLeft: -15
        }
    };

    // Handle pull to refresh
    onRefresh() {
        this.setState({ isFetching: true },
            function () {
                this.fetchList();
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
                    this.setState({ userId: allUserData[0]["user_id"] })

                    //lets make the call next
                    this.fetchList();
                })


        }
    }


    // make the API call to fecth driver vouchers by ID
    refreshFetchList() {
        // initiate loader here 
        // this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'fleetmanager/fetch/assigned/' + this.state.userId + "/requests/approved", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for refresh fetch fleet manager approved requests by ID api is--->>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    // this.hideLoader();

                    // objectClass.displayToast(responseJson.message); //DISPLAY TOAST

                    if (responseJson.data.length == 0) {
                        this.setState({ isListReady: false });
                        this.setState({ isFetching: false });
                        this.setState({ isNoDataImage: true });
                        this.setState({ isErrorImage: false });

                        return;
                    }

                    //this will be used to populate the list items
                    this.setState({ data: responseJson.data });
                    this.setState({ apiListData: responseJson.data });

                    //call this function to populate the list items
                    this.setState({ isListReady: true });
                    this.setState({ isFetching: false });

                    // image hider
                    this.setState({ isNoDataImage: false });
                    this.setState({ isErrorImage: false });
                }

                else {
                    // this.hideLoader();
                    this.setState({ isListReady: false });
                    this.setState({ isFetching: false });

                    // image hider
                    this.setState({ isNoDataImage: true });
                    this.setState({ isErrorImage: false });
                    // objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                // this.hideLoader();
                this.setState({ isListReady: false });
                this.setState({ isFetching: false });

                // Image hider 
                this.setState({ isNoDataImage: false });
                this.setState({ isErrorImage: true });
                // objectClass.displayToast("Could not connect to server");
            });

    }

    // make the API call to fecth driver vouchers by ID
    fetchList() {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'fleetmanager/fetch/assigned/' + this.state.userId + "/requests/approved", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for fetch fleet manager approved requests by ID api is--->>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    if (responseJson.data.length == 0) {
                        this.setState({ isListReady: false });
                        this.setState({ isFetching: false });
                        this.setState({ isNoDataImage: true });
                        this.setState({ isErrorImage: false });

                        return;
                    }

                    //this will be used to populate the list items
                    this.setState({ data: responseJson.data });
                    this.setState({ apiListData: responseJson.data });

                    //call this function to populate the list items
                    this.setState({ isListReady: true });
                    this.setState({ isFetching: false });

                    // image hider
                    this.setState({ isNoDataImage: false });
                    this.setState({ isErrorImage: false });

                    this.hideLoader();

                    objectClass.displayToast(responseJson.message); //DISPLAY TOAST
                }

                else {
                    this.hideLoader();
                    this.setState({ isListReady: false });
                    this.setState({ isFetching: false });

                    // image hider
                    this.setState({ isNoDataImage: true });
                    this.setState({ isErrorImage: false });
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                this.hideLoader();
                this.setState({ isListReady: false });
                this.setState({ isFetching: false });

                // image hider
                this.setState({ isNoDataImage: false });
                this.setState({ isErrorImage: true });
                objectClass.displayToast("Could not connect to server");
            });

    }


    // handle the searching
    searchFilterFunction = text => {
        // save what the user is searching for
        this.setState({
            value: text
        });

        // construct the new filtered data
        const newData = this.state.apiListData.filter(item => {
            const itemData = `${item.DriverName.toUpperCase()} ${item.approval_flag.toUpperCase()} ${item.CompanyName.toUpperCase()} ${item.StationName.toUpperCase()} ${item.amount.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.includes(textData);
        });

        // Set the new filtered data to th
        this.setState({
            data: newData
        });
    };



    // Set the list items elements here
    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (

        <ListItem titleNumberOfLines={1} onPress={this.viewDetails.bind(this, item)}>

            <ListItem.Content>
                <ListItem.Title numberOfLines={1}>{objectClass.toTitleCase(item.StationName) + ", " + objectClass.toTitleCase(item.StationAddress)}</ListItem.Title>
                <ListItem.Subtitle numberOfLines={2}>{
                    objectClass.toTitleCase(item.DriverName) +
                    " from " + objectClass.toTitleCase(item.CompanyName) +
                    " purchased an amount of GHC" + item.amount +
                    " on " + moment(item.created_at).format('DD-MM-YYYY hh:mm A') 
                }
                </ListItem.Subtitle>
            </ListItem.Content>


            <Badge
                value={"Approved"}
                badgeStyle={{ backgroundColor: '#f3931c' }}
                textStyle={{ color: '#FFF' }}
                containerStyle={{ marginTop: 0 }}
            />


        </ListItem>
    )

    // render seperator
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: "96%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "4%"
                }}
            />
        );
    };

    // render the SearchBar here as the header of the list
    renderHeader = () => {
        return (
            <SearchBar
                lightTheme
                round
                searchIcon={<Icon name={'search'} color="#86939e" />}
                clearIcon={<Icon name={'close'} color="#86939e" />}
                inputContainerStyle={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#FFF' }}
                containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
                placeholder="Type to filter"
                value={this.state.value}
                onChangeText={text => this.searchFilterFunction(text)}
            />
        );
    };


    // This is called when an item is clicked
    viewDetails(rowData) {
        //refreshFetchList is passed to refresh on back button press
        this.props.navigation.navigate('FleetManagerDetailsPage', { apiListItemData: rowData, refreshFetchList: () => this.refreshFetchList() });
    }

    render() {
        return (

            // <ScrollView>
            <View style={styles.container}>
                {this.state.isListReady ? (
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                        onRefresh={() => this.onRefresh()}
                        refreshing={this.state.isFetching}
                        stickyHeaderIndices={[0]}
                    />

                ) : null}

                {/* Show loader */}
                {this.state.isLoading ? (
                    <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
                ) : null}

                {/* Show NoData Image when data is empty */}
                {this.state.isNoDataImage ? (
                    <View style={styles.centerItems}>
                        <Image style={styles.logoContainer}
                            source={noDataImage}
                        />
                        <Text>No request found at this time.</Text>
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

            // </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: win.height / 6.5
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    logoContainer: {
        flex: 1,
        aspectRatio: 0.2,
        resizeMode: 'contain',
    },
    centerItems: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

//make this component available to the app
export default FleetManagerApprovedRequestView;