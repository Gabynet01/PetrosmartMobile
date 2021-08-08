//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { FlatList, SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Helpers from '../../Utilities/Helpers';
import Icon from 'react-native-ionicons';
import { ListItem, SearchBar, Badge } from "react-native-elements";
import noDataImage from '../../../images/noData.png';
import oopsImage from '../../../images/oops.png';
import moment from 'moment';
import RectangleBox from '../../../images/vectors/white-rectangle.png';
import NotifyIcon from '../../../images/vectors/notify_icon.png';
import ReadRequestListView from './ReadRequestList';

const win = Dimensions.get('window');

// create a component
class FleetManagerRequestListView extends React.Component {
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
        fetch(this.state.baseUrl + this.state.apiRoute + 'fleetmanager/fetch/assigned/' + this.state.userId + "/requests/pending", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for refresh fetch fleet manager pending requests by ID api is--->>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    // this.hideLoader();

                    // objectClass.displayToast(responseJson.message); //DISPLAY TOAST

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

                    // Image hider
                    this.setState({ isNoDataImage: true });
                    this.setState({ isErrorImage: false });
                    // objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                // this.hideLoader();
                this.setState({ isListReady: false });
                this.setState({ isFetching: false });

                //image hider
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
        fetch(this.state.baseUrl + this.state.apiRoute + 'fleetmanager/fetch/assigned/' + this.state.userId + "/requests/pending", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for fetch fleet manager pending requests by ID api is--->>>")
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

                    // objectClass.displayToast(responseJson.message); //DISPLAY TOAST
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

        <ListItem titleNumberOfLines={2} onPress={this.viewDetails.bind(this, item)} style={styles.listItemDiv}>

            {/* <ListItem.Content> */}
            <View style={styles.listContentView}>
                <Text numberOfLines={1} style={styles.branchStyle} >NEW</Text>
                <Text numberOfLines={1} style={styles.titleStyle}>Fuel purchase request from driver</Text>
                <Text numberOfLines={1} style={styles.subTitleStyle}><Text style={{ fontWeight: '600' }}>{item.driver_id}</Text> with <Text style={{ fontWeight: '600' }}>{item.StationName}</Text></Text>

                <View style={styles.footerView}>
                    <Text style={styles.transactionDate}>{moment(item.created_at).format('D MMM')}</Text>
                    <Badge
                        value={"Pending"}
                        badgeStyle={{ backgroundColor: '#FFFAE0' }}
                        textStyle={{ color: '#FFDB0F', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontFamily: 'circularstd-book' }}
                    />
                </View>
            </View>
            {/* </ListItem.Content> */}
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
            <>
                <View style={styles.profileContainer}>
                    <ImageBackground source={RectangleBox} style={styles.imageBg}>
                        {/* <Icon name="ios-notifications-outline" size={31} color="#999797" style={styles.iconAvatar} onPress={() => this.gotoLogout()} /> */}
                        <Image source={NotifyIcon} style={styles.imageAvatar} />
                    </ImageBackground>
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginLeft: 31,
                    marginRight: 30

                }}>
                    <Text style={styles.currentDate}>{moment().format('Do, MMMM, YYYY')}</Text>
                </View>

                <Text style={styles.mainText}>Purchase Request</Text>

                <View style={{
                    marginLeft: 31,
                    marginRight: 30
                }}>
                    <Text style={styles.newLabel}>NEW <Text style={styles.dotStyle}>.</Text> <Text style={styles.currentTime}>7mins ago</Text></Text>
                </View>
            </>
        );
    };


    // This is called when an item is clicked
    viewDetails(rowData) {
        this.props.navigation.navigate('FleetManagerDetailsPage', { apiListItemData: rowData, headerBarColor: "#f15a29", refreshFetchList: () => this.refreshFetchList() });
    }


    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    {this.state.isListReady ? (
                        <>
                            <View style={styles.profileContainer}>
                                <ImageBackground source={RectangleBox} style={styles.imageBg}>
                                    {/* <Icon name="ios-notifications-outline" size={31} color="#999797" style={styles.iconAvatar} onPress={() => this.gotoLogout()} /> */}
                                    <Image source={NotifyIcon} style={styles.imageAvatar} />
                                </ImageBackground>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginLeft: 31,
                                marginRight: 30

                            }}>
                                <Text style={styles.currentDate}>{moment().format('Do, MMMM, YYYY')}</Text>
                            </View>

                            <Text style={styles.mainText}>Purchase Request</Text>

                            <View style={{
                                marginLeft: 31,
                                marginRight: 30
                            }}>
                                <Text style={styles.newLabel}>NEW <Text style={styles.dotStyle}>.</Text> <Text style={styles.currentTime}>7mins ago</Text></Text>
                            </View>

                            {this.state.data.slice(0, 2).map((item, i) => (

                                <ListItem key={objectClass.randomString()} titleNumberOfLines={2} onPress={this.viewDetails.bind(this, item)} style={styles.listItemDiv}>

                                    {/* <ListItem.Content> */}
                                    <View style={styles.listContentView}>
                                        <Text numberOfLines={1} style={styles.branchStyle} >NEW</Text>
                                        <Text numberOfLines={1} style={styles.titleStyle}>Fuel purchase request from driver</Text>
                                        <Text numberOfLines={1} style={styles.subTitleStyle}><Text style={{ fontWeight: '600' }}>{item.driver_id}</Text> with <Text style={{ fontWeight: '600' }}>{item.StationName}</Text></Text>

                                        <View style={styles.footerView}>
                                            <Text style={styles.transactionDate}>{moment(item.created_at).format('D MMM')}</Text>
                                            <Badge
                                                value={"Pending"}
                                                badgeStyle={{ backgroundColor: '#FFFAE0' }}
                                                textStyle={{ color: '#FFDB0F', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontFamily: 'circularstd-book' }}
                                            />
                                        </View>
                                    </View>
                                    {/* </ListItem.Content> */}
                                </ListItem>

                            ))}
                        </>
                    ) : null}
                  
                    {this.state.isListReady ? (
                        <ReadRequestListView />
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

            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: win.height / 6.5
    },
    profileContainer: {
        marginTop: 20,
        marginRight: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    imageBg: {
        width: 75,
        height: 75,
        resizeMode: "cover",
        justifyContent: "center",
        shadowOpacity: 0.1,
        elevation: 0.1,
        shadowColor: "#455A64"
    },
    iconAvatar: {
        marginLeft: 30,
        marginTop: -15
    },
    imageAvatar: {
        width: 18,
        height: 18,
        shadowOpacity: 0.1,
        shadowColor: "#455A64",
        marginLeft: 28,
        marginTop: -20
    },
    mainText: {
        paddingLeft: 32,
        marginTop: 13,
        fontSize: 18,
        lineHeight: 23,
        fontStyle: 'normal',
        fontWeight: '500',
        color: '#380507'
    },
    newLabel: {
        fontSize: 11,
        lineHeight: 14,
        color: "#EB1C24",
        fontStyle: 'normal',
        fontWeight: '600',
    },
    dotStyle: {
        fontSize: 40,
        lineHeight: 43,
        color: "#EB1C24",
        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    currentTime: {
        fontSize: 11,
        lineHeight: 14,
        color: "#605C56",
        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    listItemDiv: {
        marginLeft: 31,
        marginRight: 29,
        marginBottom: 15,
        borderRadius: 16,
        overflow: 'hidden'
    },
    listContentView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    footerView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 0,
        marginTop: 8
    },
    transactionDate: {
        fontSize: 12,
        lineHeight: 15,
        color: '#999797'
    },
    branchStyle: {
        marginRight: 10,
        alignSelf: 'flex-end',
        fontSize: 11,
        lineHeight: 15,
        color: "#EB1C24",
        fontStyle: 'normal',
        fontWeight: '600',
    },
    titleStyle: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 7,
        color: "#605C56",
        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    subTitleStyle: {
        fontSize: 16,
        lineHeight: 20,
        color: "#605C56",
        fontStyle: 'normal',
        fontWeight: '600',
        fontFamily: 'circularstd-book'
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
export default FleetManagerRequestListView;