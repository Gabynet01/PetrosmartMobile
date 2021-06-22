//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { FlatList, SafeAreaView, StyleSheet, RefreshControl, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Helpers from '../Utilities/Helpers';
import Icon from 'react-native-ionicons';
import { ListItem, SearchBar, Badge } from "react-native-elements";
import MainMenuOptionsView from '../OptionsMenu/MainOptionsMenu';
import noDataImage from '../../images/noData.png';
import oopsImage from '../../images/oops.png';
import moment from 'moment';
import profileImage from '../../images/avatarImage.jpg';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import successIcon from '../../images/vectors/success.png';
import successBox from '../../images/vectors/successBox.png';
import pendingIcon from '../../images/vectors/pending.png';
import pendingBox from '../../images/vectors/pendingBox.png';
import failedIcon from '../../images/vectors/failed.png';

const win = Dimensions.get('window');

// create a component
class TransactionListView extends React.Component {
    // Constructor for this component
    constructor(props) {

        objectClass = new Helpers();

        super(props);
        this.state = {
            textDisable: false,
            isListReady: false,
            isFetching: false,
            isNoDataImage: false,
            isErrorImage: false,
            isDatePickerVisible: false,
            driverId: "",
            dateText: "",
            selectedDateText: "",
            value: '',
            data: [],
            monthOptions: [],
            // chosenMonth: moment().format("MMMM"),
            chosenMonth: "",
            transactionsData: [],
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

                    var listOptions = [];

                    for (var i = 1; i <= 12; i++) {
                        var monthName = objectClass.getFullMonthsValue(i);
                        var mainData = { "month": monthName, "monthValue": i }
                        listOptions.push(mainData);
                    }

                    //console.log("List options here", listOptions);

                    //set the monthOptions to hold the new data 
                    this.setState({ monthOptions: listOptions });

                    var allUserData = JSON.parse(result);
                    this.setState({ driverId: allUserData[0]["driver_id"] })

                    //lets make the call next
                    this.fetchList();
                })
        }
    }


    // make the API call to fecth driver transactioons by ID
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
        const newData = this.state.transactionsData.filter(item => {
            const itemData = `${item.VehicleName.toUpperCase()} ${item.StationName.toUpperCase()} ${item.StationAddress.toUpperCase()} ${item.amount.toUpperCase()}`;
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

            {item.payment_code_status.toUpperCase() == "INACTIVE" ? (
                <ImageBackground source={successBox} style={styles.imageBg}>
                    <Image source={successIcon} style={styles.imageAvatar} />
                </ImageBackground>

            ) : null}

            {item.payment_code_status.toUpperCase() == "ACTIVE" ? (
                <ImageBackground source={pendingBox} style={styles.imageBg}>
                    <Image source={pendingIcon} style={styles.imageAvatar} />
                </ImageBackground>

            ) : null}

            {/* <ListItem.Content> */}
            <View style={styles.listContentView}>
                <Text numberOfLines={1} style={styles.titleStyle}>{objectClass.toTitleCase(item.StationName) + ", " + objectClass.toTitleCase(item.StationAddress)}</Text>
                <Text numberOfLines={1} style={styles.subTitleStyle}>{
                    "Purchased GHC " + item.amount
                    // " for " + objectClass.toTitleCase(item.VehicleName) +
                    // " with Reg.No. " + item.VehicleRegNo +
                    // " on " + moment(item.created_at).format('DD-MM-YYYY hh:mm A')
                }
                </Text>

                {/* footer text - success */}
                {item.payment_code_status.toUpperCase() == "INACTIVE" ? (
                    <View style={styles.footerView}>
                        <Text style={styles.transactionDate}>{moment(item.created_at).format('D MMM')}</Text>
                        <Badge
                            value={"Success"}
                            badgeStyle={{ backgroundColor: '#E8FAE5' }}
                            textStyle={{ color: '#61DD4B', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontFamily: 'circularstd-book' }}
                        />
                    </View>
                ) : null}

                {/* footer text - pending */}
                {item.payment_code_status.toUpperCase() == "ACTIVE" ? (
                    <View style={styles.footerView}>
                        <Text style={styles.transactionDate}>{moment(item.created_at).format('D MMM')}</Text>
                        <Badge
                            value={"Pending"}
                            badgeStyle={{ backgroundColor: '#FFFEF5' }}
                            textStyle={{ color: '#FFDB0F', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontFamily: 'circularstd-book' }}
                        />
                    </View>
                ) : null}
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
                <Text style={styles.mainText}>Transactions</Text>

                {/* Arrange the month and year pickers */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 25
                }}>
                    <TextInput
                        style={styles.input}
                        placeholder={moment().format('MMMM, YYYY')}
                        value={this.state.dateText}
                        editable={this.state.textDisable}
                    ></TextInput>
                    <TouchableOpacity onPress={this.showDatePicker} style={styles.calendarIcon}>
                        <Icon name="calendar" size={20} color="#999797" />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={this.state.isDatePickerVisible}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                    />

                    {/* allow user to select the month they want to see the chart */}
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={this.state.chosenMonth}
                            onValueChange={(itemValue, index) =>
                                this.getTransactionsData(itemValue)}
                        >
                            <Picker.Item label="Month" value="" />
                            {this.state.monthOptions.map((item, index) => {
                                return (<Picker.Item label={item.month} value={item.monthValue} key={index} />)
                            })}

                        </Picker>

                    </View>
                </View>
            </>
        );
    };


    // This is called when an item is clicked
    viewDetails(rowData) {
        this.props.navigation.navigate('TransactionDetailsPage', { TransactionItemData: rowData });
    }

    //Date Picker components
    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false });
    };

    handleConfirm = (date) => {
        this.setState({ isDatePickerVisible: false });
        //console.log("date selected from picker--->", date);
        const monthAndYear = moment(date).format("MMMM, YYYY");
        const selectedDate = moment(date).format("M/YYYY");
        this.setState({ dateText: monthAndYear })
        this.setState({ selectedDateText: selectedDate })

        //console.log("selected month and year -->>", monthAndYear)
        //console.log("selected date -->>", selectedDate)

        //lets split the selected date into month and year 
        var splittedDate = selectedDate.split("/");
        var selectedMonth = splittedDate[0];
        var selectedYear = splittedDate[1];
        //console.log("splitted Month and yearrr-->", selectedMonth, selectedYear);
        this.filterTransactionsByDate(selectedMonth, selectedYear);
    };

    getTransactionsData(selectedMonth) {
        //console.log("Selected Month is-->>>", selectedMonth);
        this.setState({ chosenMonth: selectedMonth });
        var selectedYear = moment().format("YYYY");
        this.filterTransactionsByDate(selectedMonth, selectedYear);
    }

    //general function for both calendar and month picker
    // make the API call to fecth driver transactioons by ID
    filterTransactionsByDate(selectedMonth, selectedYear) {
        // initiate loader here 
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/get/transactions/' + this.state.driverId + "/month/" + selectedMonth + "/year/" + selectedYear + "/history", {
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


    render() {
        return (
            // <ScrollView>
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
                    <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
                ) : null}

                {/* Show NoData Image when data is empty */}
                {this.state.isNoDataImage ? (
                    <View style={styles.centerItems}>
                        <Image style={styles.logoContainer}
                            source={noDataImage}
                        />
                        <Text>No transaction found.</Text>
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
        flex: 1
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
        color: '#9E9B9B',
        fontFamily: 'circularstd-book'
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
        marginLeft: 10,
        marginRight: 30,
        paddingLeft: 17,
        color: '#FBFBFB',
        fontSize: 16,
        lineHeight: 20,
        backgroundColor: '#F35C24',
        borderRadius: 8,
        width: 125,
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
    titleStyle: {
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 7,
        color: "#380507",
        fontStyle: 'normal',
        fontWeight: 'normal',
    },
    subTitleStyle: {
        fontSize: 15,
        lineHeight: 19,
        color: "#999797",
        fontStyle: 'normal',
        fontWeight: '600',
        fontFamily: 'circularstd-book'
    },
    imageBg: {
        width: 50,
        height: 50,
        resizeMode: "cover",
        justifyContent: "center",
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
export default withNavigation(TransactionListView);