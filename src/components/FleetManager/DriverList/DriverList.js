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
import profileImage from '../../../images/avatarImage.jpg';

const win = Dimensions.get('window');

// create a component
class DriverListView extends React.Component {
    // Constructor for this component
    constructor(props) {

        objectClass = new Helpers();

        super(props);
        this.state = {
            isListReady: false,
            isFetching: false,
            isNoDataImage: false,
            isErrorImage: false,
            allSelected: true,
            branchSelected: false,
            rankSelected: false,
            allNotSelected: false,
            branchNotSelected: true,
            rankNotSelected: true,
            driverId: "",
            value: '',
            data: [],
            vouchersData: [],
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    static navigationOptions = {
        headerShown: true,
        title: "",
        headerStyle: {
            backgroundColor: '#F6F6F6',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0, // remove shadow on iOS
        },
        headerLeft: () => <Icon name="arrow-back" size={25} color="#000000" style={{ paddingLeft: 31.6 }} onPress={() => navigation.goBack()} />,
    };

    // Handle pull to refresh
    onRefresh() {
        this.setState({ isFetching: true },
            function () {
                this.fetchList();
            }
        );
    }

    // This is called when the user profile image is clicked
    onProfileImagePress() {
        this.props.navigation.navigate('UserProfilePage');
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
                    this.setState({ driverId: "33" })
                    // this.setState({ driverId: allUserData[0]["driver_id"] })

                    //lets make the call next
                    this.fetchList();
                })
        }
    }


    // make the API call to fecth driver list by 
    fetchList() {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/get/transactions/' + this.state.driverId + "/history", {
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
                    this.setState({ transactionsData: responseJson.data });

                    //call this function to populate the list items
                    this.setState({ isListReady: true });
                    this.setState({ isFetching: false });
                    this.setState({ isNoDataImage: false });
                    this.setState({ isErrorImage: false });

                    this.hideLoader();

                    // objectClass.displayToast(responseJson.message); //DISPLAY TOAST
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

    // handle the searching
    searchFilterFunction = text => {
        // save what the user is searching for
        this.setState({
            value: text
        });

        // construct the new filtered data
        const newData = this.state.vouchersData.filter(item => {
            const itemData = `${item.voucher_type.toUpperCase().slice(0, -4)} ${item.CompanyName.toUpperCase()} ${item.usage_status.toUpperCase()}`;
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

        <ListItem titleNumberOfLines={1} onPress={this.viewDetails.bind(this, item)} style={styles.listItemDiv}>
           
            <Image source={profileImage} style={styles.imageBg} />

            {/* <ListItem.Content> */}
            <View style={styles.listContentView}>
                <Text numberOfLines={1} style={styles.branchStyle} > <Text numberOfLines={1} style={styles.dotStyle} >.</Text> Madina Branch</Text>
                <Text numberOfLines={1} style={styles.titleStyle}>{objectClass.toTitleCase("Benjamin Kubla")}</Text>
                <Text numberOfLines={1} style={styles.subTitleStyle}>{
                    "No 219"
                }
                </Text>
                
                <View style={styles.footerView}>
                    <Text style={styles.transactionDate}></Text>
                    <Badge
                        value={"Lv. 1"}
                        badgeStyle={{ backgroundColor: '#E0F1FF', marginTop: -20 }}
                        textStyle={{ color: '#0085F9', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontFamily: 'circularstd-book' }}
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
                <Text style={styles.mainText}>Driver List</Text>

                <View style={{
                    marginTop: 21,
                    marginLeft: 22,
                    marginRight: 19,
                    marginBottom: 24
                }}>
                    <SearchBar
                        lightTheme
                        round
                        searchIcon={<Icon name={'search'} color="#86939e" />}
                        clearIcon={<Icon name={'close'} color="#86939e" />}
                        inputContainerStyle={{ backgroundColor: '#FFFFFF' }}
                        containerStyle={styles.searchBarContainer}
                        placeholder="Search driver here"
                        value={this.state.value}
                        onChangeText={text => this.searchFilterFunction(text)}
                    />
                </View>


                {/* Arrange the month and year pickers */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 24,
                    marginLeft: 31,
                    marginRight: 28
                }}>
                    {/* Selected buttons */}

                    {this.state.allSelected ? (
                        <View style={styles.mainButtonContainer}>
                            <TouchableOpacity style={styles.mainButton}
                                onPress={() => this.onAllPress()}>
                                <Text style={styles.mainButtonText}>All</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.allNotSelected ? (
                        <View style={styles.otherButtonContainer}>
                            <TouchableOpacity style={styles.otherButton}
                                onPress={() => this.onAllPress()}>
                                <Text style={styles.otherButtonText}>All</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.branchSelected ? (
                        <View style={styles.mainButtonContainer}>
                            <TouchableOpacity style={styles.mainButton}
                                onPress={() => this.onBranchPress()}>
                                <Text style={styles.mainButtonText}>Branch</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.branchNotSelected ? (
                        <View style={styles.otherButtonContainer}>
                            <TouchableOpacity style={styles.otherButton}
                                onPress={() => this.onBranchPress()}>
                                <Text style={styles.otherButtonText}>Branch</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.rankSelected ? (
                        <View style={styles.mainButtonContainer}>
                            <TouchableOpacity style={styles.mainButton}
                                onPress={() => this.onRankPress()}>
                                <Text style={styles.mainButtonText}>Rank</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.rankNotSelected ? (
                        <View style={styles.otherButtonContainer}>
                            <TouchableOpacity style={styles.otherButton}
                                onPress={() => this.onRankPress()}>
                                <Text style={styles.otherButtonText}>Rank</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                </View>
            </>
        );
    };


    // This is called when an item is clicked
    viewDetails(rowData) {
        this.props.navigation.navigate('DriverInfoView', { listItemData: rowData });
    }

    //handle button clicks
    onAllPress() {
        this.searchFilterFunction("");
        this.setState(
            {
                allSelected: true,
                allNotSelected: false,
                branchSelected: false,
                branchNotSelected: true,
                rankSelected: false,
                rankNotSelected: true
            }
        )
    }

    onBranchPress() {
        this.searchFilterFunction("Branch");
        this.setState(
            {
                allSelected: false,
                allNotSelected: true,
                branchSelected: true,
                branchNotSelected: false,
                rankSelected: false,
                rankNotSelected: true
            }
        )
    }

    onRankPress() {
        this.searchFilterFunction("Rank");
        this.setState(
            {
                allSelected: false,
                allNotSelected: true,
                branchSelected: false,
                branchNotSelected: true,
                rankSelected: true,
                rankNotSelected: false
            }
        )
    }


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
                        <Text>No request found at this time.</Text>
                        <TouchableOpacity onPress={() => this.fetchList()}>
                            <Text style={styles.refreshTxt}>Tap to try again <Icon name={'arrow-forward'} color="#F35C24" size={16} /></Text>
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
                        <TouchableOpacity onPress={() => this.fetchList()}>
                            <Text style={styles.refreshTxt}>Tap to try again <Icon name={'arrow-forward'} color="#F35C24" size={16} /></Text>
                        </TouchableOpacity>
                    </View>
                ) : null}


            </View>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: win.height / 6.5
    },
    mainText: {
        paddingLeft: 32,
        marginTop: 41,
        fontSize: 18,
        lineHeight: 23,
        fontStyle: 'normal',
        fontWeight: '500',
        color: '#380507',

    },
    searchBarContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0, //no effect
        shadowColor: 'white', //no effect
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        borderRadius: 8,
        height: 54
    },
    mainButtonContainer: {
        width: 105
    },
    mainButton: {
        backgroundColor: '#ECC484',
        borderRadius: 8,
        height: 54,
    },
    mainButtonText: {
        color: '#380507',
        textAlign: 'center',
        paddingTop: 16,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '500',
        fontStyle: 'normal',

    },
    otherButtonContainer: {
        width: 105
    },
    otherButton: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        height: 54,
    },
    otherButtonText: {
        color: '#999797',
        textAlign: 'center',
        paddingTop: 16,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'normal',
        fontStyle: 'normal',

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
    input: {
        marginTop: 15,
        height: 54,
        width: 200,
        backgroundColor: '#FFFFFF',
        marginLeft: 31,
        borderRadius: 8,
        paddingLeft: 21,
        color: '#380507',
        fontSize: 16,
        lineHeight: 20,
        fontWeight: 'normal',
        fontStyle: 'normal',

    },
    calendarIcon: {
        marginTop: 32,
        marginLeft: -68
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
        marginBottom: -20
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
    dotStyle: {
        alignSelf: 'flex-end',
        fontSize: 24,
        lineHeight: 15,
        color: "#F35C24",
        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    branchStyle: {
        alignSelf: 'flex-end',
        fontSize: 12,
        lineHeight: 15,
        color: "#F35C24",
        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    titleStyle: {
        marginTop: -5,
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 6,
        color: "#380507",
        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    subTitleStyle: {
        fontSize: 16,
        lineHeight: 20,
        color: "#999797",
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'circularstd-book'
    },
    imageBg: {
        width: 42,
        height: 42,
        resizeMode: "cover",
        justifyContent: "center",
        borderRadius: 42/2

    },
    imageAvatar: {
        width: 20,
        height: 20,
        marginLeft: 15,
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
export default withNavigation(DriverListView);