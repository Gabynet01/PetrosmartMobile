//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { FlatList, SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Helpers from '../Utilities/Helpers';
import Icon from 'react-native-ionicons';
import { ListItem, SearchBar, Badge } from "react-native-elements";
import MainMenuOptionsView from '../OptionsMenu/MainOptionsMenu';
import noDataImage from '../../images/noData.png';
import oopsImage from '../../images/oops.png';
import moment from 'moment';
import profileImage from '../../images/avatarImage.jpg';

const win = Dimensions.get('window');

// create a component
class VoucherListView extends React.Component {
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
            multipleSelected: false,
            singleSelected: false,
            allNotSelected: false,
            multipleNotSelected: true,
            singleNotSelected: true,
            driverId: "",
            value: '',
            data: [],
            vouchersData: [],
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
                this.fetchVoucherList();
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
                    this.setState({ driverId: allUserData[0]["driver_id"] })

                    //lets make the call next
                    this.fetchVoucherList();
                })
        }
    }

    // make the API call to fecth driver vouchers by ID
    fetchVoucherList() {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/get/vouchers/' + this.state.driverId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for fetch driver vouchers by ID api is--->>>")
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
                    this.setState({ vouchersData: responseJson.data });

                    //call this function to populate the list items
                    this.setState({ isListReady: true });
                    this.setState({ isFetching: false });

                    //image hider
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

        <>
            {item.voucher_type.toUpperCase() == "MULTIPLE_USE" ? (
                <ListItem
                    titleNumberOfLines={1}
                    onPress={this.viewDetails.bind(this, item)}
                    style={styles.listItemMultipleDiv}
                    containerStyle={{ backgroundColor: "#F7DDB5" }}
                >
                    {/* <ListItem.Content> */}
                    <View style={styles.listContentView}>
                        <View style={styles.titleView}>
                            <Text style={styles.titleStyle}>{item.voucher_code.toUpperCase()}</Text>
                            <Text style={styles.smallTextStyle}>Balance</Text>
                        </View>

                        <View style={styles.middleView}>
                            <Text style={styles.voucherTypeStyle}>{objectClass.toTitleCase(item.voucher_type.slice(0, -4))} Voucher</Text>
                            <Text style={styles.amountStyle}>GHC {item.balance}</Text>
                        </View>

                        <View style={styles.lastView}>
                            <Text style={styles.expiryDateStyleMultiple}>Expiry: {moment(item.expiry_date).format('DD-MM-YYYY')}</Text>
                            <Badge
                                value={"GHC " + parseInt(item.amount - item.balance) + " USED"}
                                badgeStyle={{ backgroundColor: '#FDE3E4' }}
                                textStyle={{ color: '#F94322', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontFamily: 'circularstd-book' }}
                            />
                        </View>
                    </View>

                    {/* </ListItem.Content> */}

                </ListItem>
            ) : null}

            {item.voucher_type.toUpperCase() == "SINGLE_USE" ? (
                <ListItem
                    titleNumberOfLines={1}
                    onPress={this.viewDetails.bind(this, item)}
                    style={styles.listItemSingleDiv}
                    containerStyle={{ backgroundColor: "#A2DEC0" }}
                >
                    {/* <ListItem.Content> */}
                    <View style={styles.listContentView}>
                        <View style={styles.titleView}>
                            <Text style={styles.titleStyle}>{item.voucher_code.toUpperCase()}</Text>
                            <Text style={styles.smallTextStyle}>Balance</Text>
                        </View>

                        <View style={styles.middleView}>
                            <Text style={styles.voucherTypeStyle}>{objectClass.toTitleCase(item.voucher_type.slice(0, -4))}-Use Voucher</Text>
                            <Text style={styles.amountStyle}>GHC {item.balance}</Text>
                        </View>

                        <View style={styles.lastView}>
                            <Text style={styles.expiryDateStyleSingle}>Expiry: {moment(item.expiry_date).format('DD-MM-YYYY')}</Text>
                            <Badge
                                value={item.usage_status.toUpperCase()}
                                badgeStyle={{ backgroundColor: '#FFFFFF' }}
                                textStyle={{ color: '#61DD4B', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontFamily: 'circularstd-book' }}

                            />
                        </View>
                    </View>

                    {/* </ListItem.Content> */}

                </ListItem>
            ) : null}

        </>
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
            // <SearchBar
            //     lightTheme
            //     round
            //     searchIcon={<Icon name={'search'} color="#86939e" />}
            //     clearIcon={<Icon name={'close'} color="#86939e" />}
            //     inputContainerStyle={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#FFF' }}
            //     containerStyle={{ backgroundColor: 'white', borderColor: 'white' }}
            //     placeholder="Type to filter"
            //     value={this.state.value}
            //     onChangeText={text => this.searchFilterFunction(text)}
            // />
            <>
                <View style={styles.profileContainer} >
                    <TouchableOpacity onPress={() => this.onProfileImagePress()}>
                        <Image style={styles.profileImage}
                            source={profileImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.currentDate}>{moment().format('Do, MMMM, YYYY')}</Text>
                </View>
                <Text style={styles.mainText}>Vouchers</Text>
                {/* Arrange the month and year pickers */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                    marginBottom: 15,
                    marginLeft: 31,
                    marginRight: 28
                }}>
                    {/* Selected buttons */}

                    {this.state.allSelected ? (
                        <View style={styles.mainButtonContainer}>
                            <TouchableOpacity style={styles.mainButton}
                                onPress={() => this.onAllPress()}>
                                <Text style={styles.mainButtonText}>ALL</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.allNotSelected ? (
                        <View style={styles.otherButtonContainer}>
                            <TouchableOpacity style={styles.otherButton}
                                onPress={() => this.onAllPress()}>
                                <Text style={styles.otherButtonText}>ALL</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.multipleSelected ? (
                        <View style={styles.mainButtonContainer}>
                            <TouchableOpacity style={styles.mainButton}
                                onPress={() => this.onMultiplePress()}>
                                <Text style={styles.mainButtonText}>MULTIPLE</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.multipleNotSelected ? (
                        <View style={styles.otherButtonContainer}>
                            <TouchableOpacity style={styles.otherButton}
                                onPress={() => this.onMultiplePress()}>
                                <Text style={styles.otherButtonText}>MULTIPLE</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.singleSelected ? (
                        <View style={styles.mainButtonContainer}>
                            <TouchableOpacity style={styles.mainButton}
                                onPress={() => this.onSinglePress()}>
                                <Text style={styles.mainButtonText}>SINGLE</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {this.state.singleNotSelected ? (
                        <View style={styles.otherButtonContainer}>
                            <TouchableOpacity style={styles.otherButton}
                                onPress={() => this.onSinglePress()}>
                                <Text style={styles.otherButtonText}>SINGLE</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                </View>
            </>
        );
    };


    // This is called when an item is clicked
    viewDetails(rowData) {
        this.props.navigation.navigate('VoucherDetailsPage', { VoucherItemData: rowData });
    }

    //handle button clicks
    onAllPress() {
        this.searchFilterFunction("");
        this.setState(
            {
                allSelected: true,
                allNotSelected: false,
                multipleSelected: false,
                multipleNotSelected: true,
                singleSelected: false,
                singleNotSelected: true
            }
        )
    }

    onMultiplePress() {
        this.searchFilterFunction("Multiple");
        this.setState(
            {
                allSelected: false,
                allNotSelected: true,
                multipleSelected: true,
                multipleNotSelected: false,
                singleSelected: false,
                singleNotSelected: true
            }
        )
    }

    onSinglePress() {
        this.searchFilterFunction("single");
        this.setState(
            {
                allSelected: false,
                allNotSelected: true,
                multipleSelected: false,
                multipleNotSelected: true,
                singleSelected: true,
                singleNotSelected: false
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
                        <TouchableOpacity onPress={() => this.fetchVoucherList()}>
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
                        <TouchableOpacity onPress={() => this.fetchVoucherList()}>
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
    profileContainer: {
        marginTop: 35,
        paddingRight: 40,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 16
    },
    currentDate: {
        marginTop: 25,
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 15.18,
        color: '#9E9B9B'
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
    pickerContainer: {
        height: 54,
        marginLeft: 20,
        marginRight: 30,
        paddingLeft: 17,
        color: '#FBFBFB',
        fontSize: 16,
        lineHeight: 20,
        backgroundColor: '#F35C24',
        borderRadius: 8,
        width: 105,
        fontStyle: 'normal',
        fontWeight: 'normal',

        alignSelf: 'flex-end',
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
    listContentView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    listItemMultipleDiv: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: "#F7DDB5",
        marginLeft: 28,
        marginRight: 29,
        borderRadius: 16,
        marginBottom: 15
    },
    listItemSingleDiv: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: "#A2DEC0",
        marginLeft: 28,
        marginRight: 29,
        borderRadius: 16,
        marginBottom: 15
    },
    titleView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingLeft: 27,
        paddingRight: 29,
    },
    middleView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        paddingLeft: 27,
        paddingRight: 29,
    },
    lastView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingLeft: 27,
        paddingRight: 29,
    },
    titleStyle: {
        fontSize: 18,
        lineHeight: 23,
        color: "#380507",

        fontStyle: 'normal',
        fontWeight: '500',
    },
    voucherTypeStyle: {
        fontSize: 16,
        lineHeight: 20,
        color: "#380507",

        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    expiryDateStyleSingle: {
        fontSize: 12,
        lineHeight: 15,
        color: "#838181",
        fontStyle: 'normal',
        fontWeight: '400',
    },
    expiryDateStyleMultiple: {
        fontSize: 12,
        lineHeight: 17,
        color: "#605C56",
        fontStyle: 'normal',
        fontWeight: '300',
    },
    smallTextStyle: {
        fontSize: 9,
        lineHeight: 11,
        color: "#380507",

        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    amountStyle: {
        fontSize: 22,
        lineHeight: 28,
        color: "#380507",
        fontFamily: 'circularstd-book',
        fontStyle: 'normal',
        fontWeight: '600',
        marginTop: -15
    },
    mainButtonContainer: {
        width: 105
    },
    mainButton: {
        backgroundColor: '#F35C24',
        borderRadius: 8,
        height: 54,
    },
    mainButtonText: {
        color: '#FBFBFB',
        textAlign: 'center',
        paddingTop: 16,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '600',
        fontStyle: 'normal',

    },
    otherButtonContainer: {
        width: 105
    },
    otherButton: {
        backgroundColor: '#FFFFFF',
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
    singleButtonText: {
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
});

//make this component available to the app
export default withNavigation(VoucherListView);