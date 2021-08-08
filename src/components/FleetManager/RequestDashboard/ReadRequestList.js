//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { FlatList, SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Helpers from '../../Utilities/Helpers';
import Icon from 'react-native-ionicons';
import { ListItem, SearchBar, Badge } from "react-native-elements";
import noDataImage from '../../../images/noData.png';
import oopsImage from '../../../images/oops.png';
import moment from 'moment';
import RectangleBox from '../../../images/vectors/white-rectangle.png';
import NotifyIcon from '../../../images/vectors/notify_icon.png';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const win = Dimensions.get('window');

// create a component
class ReadRequestListView extends React.Component {
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
            successSelected: false,
            failedSelected: false,
            allNotSelected: false,
            successNotSelected: true,
            failedNotSelected: true,
            userId: "",
            value: '',
            isDatePickerVisible: false,
            driverId: "",
            dateText: "",
            selectedDateText: "",
            value: '',
            data: [],
            dayOptions: [],
            apiListData: [],
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    //navigation options 
    static navigationOptions = {

    };

    
    //handle button clicks
    onAllPress() {
        this.searchFilterFunction("");
        this.setState(
            {
                allSelected: true,
                allNotSelected: false,
                successSelected: false,
                successNotSelected: true,
                failedSelected: false,
                failedNotSelected: true
            }
        )
    }

    onSuccessPress() {
        this.searchFilterFunction("Branch");
        this.setState(
            {
                allSelected: false,
                allNotSelected: true,
                successSelected: true,
                successNotSelected: false,
                failedSelected: false,
                failedNotSelected: true
            }
        )
    }

    onFailedPress() {
        this.searchFilterFunction("Rank");
        this.setState(
            {
                allSelected: false,
                allNotSelected: true,
                successSelected: false,
                successNotSelected: true,
                failedSelected: true,
                failedNotSelected: false
            }
        )
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

                    for (var i = 1; i <= 7; i++) {
                        var dayName = objectClass.getFullDaysValue(i);
                        var mainData = { "day": dayName, "dayValue": i }
                        listOptions.push(mainData);
                    }

                    //console.log("List options here", listOptions);

                    //set the dayOptions to hold the new data 
                    this.setState({ dayOptions: listOptions });


                    var allUserData = JSON.parse(result);
                    this.setState({ userId: allUserData[0]["user_id"] })

                    //lets make the call next
                    this.fetchList();
                })
        }
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


    // This is called when an item is clicked
    viewDetails(rowData) {
        this.props.navigation.navigate('FleetManagerDetailsPage', { apiListItemData: rowData, headerBarColor: "#f15a29", refreshFetchList: () => this.refreshFetchList() });
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
        this.setState({ chosenDay: selectedMonth });
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

    render() {
        return (

            // <ScrollView>
            <View style={styles.container}>

                {this.state.isListReady ? (
                    <>
                        <View style={styles.customHr}></View>

                        {/* Arrange the month and year pickers */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 25
                        }}>
                            <TextInput
                                style={styles.input}
                                placeholder={moment().format('D, MMMM YYYY')}
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
                                    selectedValue={this.state.chosenDay}
                                    onValueChange={(itemValue, index) =>
                                        this.getTransactionsData(itemValue)}
                                >
                                    <Picker.Item label="Day" value="" />
                                    {this.state.dayOptions.map((item, index) => {
                                        return (<Picker.Item label={item.day} value={item.dayValue} key={index} />)
                                    })}

                                </Picker>

                            </View>
                        </View>

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

                            {this.state.successSelected ? (
                                <View style={styles.mainButtonContainer}>
                                    <TouchableOpacity style={styles.mainButton}
                                        onPress={() => this.onSuccessPress()}>
                                        <Text style={styles.mainButtonText}>Success</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.successNotSelected ? (
                                <View style={styles.otherButtonContainer}>
                                    <TouchableOpacity style={styles.otherButton}
                                        onPress={() => this.onSuccessPress()}>
                                        <Text style={styles.otherButtonText}>Success</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.failedSelected ? (
                                <View style={styles.mainButtonContainer}>
                                    <TouchableOpacity style={styles.mainButton}
                                        onPress={() => this.onFailedPress()}>
                                        <Text style={styles.mainButtonText}>Failed</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.failedNotSelected ? (
                                <View style={styles.otherButtonContainer}>
                                    <TouchableOpacity style={styles.otherButton}
                                        onPress={() => this.onFailedPress()}>
                                        <Text style={styles.otherButtonText}>Failed</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                        </View>

                        {this.state.data.map((item, i) => (
                            <ListItem key={objectClass.randomString()} titleNumberOfLines={2} onPress={this.viewDetails.bind(this, item)} style={styles.listItemDiv}>

                                {/* <ListItem.Content> */}
                                <View style={styles.listContentView}>
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
    profileContainer: {
        marginTop: 20,
        marginRight: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
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
        marginLeft: 30,
        marginTop: -15
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
        width: 95,
        fontStyle: 'normal',
        fontWeight: 'normal',

        alignSelf: 'flex-end',
    },
    input: {
        marginTop: 15,
        height: 54,
        width: 240,
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
    customHr: {
        marginTop: 26,
        borderBottomColor: "#ECE8E4",
        borderBottomWidth: 2,
        marginLeft: 29,
        marginRight: 29
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
export default ReadRequestListView;