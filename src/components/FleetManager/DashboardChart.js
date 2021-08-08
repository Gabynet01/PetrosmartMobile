//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import Helpers from '../Utilities/Helpers';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import {
    BarChart,
    LineChart
} from "react-native-chart-kit";
import moment from 'moment';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get("window").width;

// create a component
class DashboardChart extends React.Component {
    // Constructor for this component
    constructor(props) {
        super(props);

        objectClass = new Helpers();
        // Declare variables here
        this.state = {
            driverId: '',
            chosenYear: moment().format("YYYY"),
            // date: new Date("2020"),
            isLoading: false,
            isDashboardReady: false,
            weekSelected: false,
            monthSelected: false,
            yearSelected: true,
            weekNotSelected: true,
            monthNotSelected: true,
            yearNotSelected: false,
            yearOptions: [],
            dashboardMonths: [""],
            dashboardAmount: [0],
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    //handle button clicks
    onWeekPress() {
        // this.searchFilterFunction("");
        this.setState(
            {
                weekSelected: true,
                weekNotSelected: false,
                monthSelected: false,
                monthNotSelected: true,
                yearSelected: false,
                yearNotSelected: true
            }
        );

        //lets make the API Call here
        this.onButtonPress(this.state.driverId, '/weekly/')
    }

    onMonthPress() {
        // this.searchFilterFunction("Multiple");
        this.setState(
            {
                weekSelected: false,
                weekNotSelected: true,
                monthSelected: true,
                monthNotSelected: false,
                yearSelected: false,
                yearNotSelected: true
            }
        );
        this.onButtonPress(this.state.driverId, '/monthly/')
    }

    onYearPress() {
        // this.searchFilterFunction("single");
        this.setState(
            {
                weekSelected: false,
                weekNotSelected: true,
                monthSelected: false,
                monthNotSelected: true,
                yearSelected: true,
                yearNotSelected: false
            }
        );
        this.onButtonPress(this.state.driverId, '/yearly/')
    }


    // SHOW LOADER
    showLoader() {
        this.setState({ isLoading: true });
        this.setState({ isDashboardReady: false });
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

            //lets create the years list here to populate the picker
            // var defaultYear = Number(2020);
            // var currentYear = Number(moment().format('YYYY'));

            // var difference = currentYear - defaultYear;
            // var listOptions = [];

            // //console.log("difference in years is-->>", difference)

            // for (var i = 0; i <= difference; i++) {
            //     var mainData = { "year": '' + defaultYear++ }
            //     listOptions.push(mainData);
            // }

            // //console.log("List options here", listOptions);

            // //set the yearOptions to hold the new data 
            // this.setState({ yearOptions: listOptions });


            // lets get data in the storage
            AsyncStorage.getItem("allUserData")
                .then((result) => {

                    var allUserData = JSON.parse(result);
                    this.setState({driverId : allUserData[0]["driver_id"]});
                    // allUserData[0]["name"]
                    this.onButtonPress(allUserData[0]["driver_id"], '/yearly/');
                })

        }
    }

    //when the year picker is selected do this
    // getChartData(chosenYear) {
    //     // check if nothing was selected
    //     if (chosenYear == "" || chosenYear == undefined) {
    //         objectClass.displayToast("Please select year");
    //         return false;
    //     }
    //     //set the state
    //     this.setState({ chosenYear: chosenYear });
    //     //console.log("selected year -->>> ", chosenYear)
    //     AsyncStorage.getItem("allUserData")
    //         .then((result) => {

    //             var allUserData = JSON.parse(result);

    //             this.onButtonPress(allUserData[0]["driver_id"], allUserData[0]["name"], chosenYear);
    //         })
    // }


    // make the API call
    onButtonPress(driverId, routeToCall) {
        // initiate loader here 
        this.showLoader();
        // driverId = "26"

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'drivers/chart/' + driverId + routeToCall, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for dashboard api is--->>>")
                //console.log(responseJson)

                if (responseJson.code == "200") {

                    // lets rearrange the data to build the chart

                    var dashboardData = responseJson.data;

                    if (dashboardData.length == 0 || dashboardData == null) {
                        //set empty data to the chart
                        var monthsData = ["0"];
                        var amountData = [0];
                        // now lets set these values into the states and use them
                        this.setState({ dashboardMonths: monthsData });
                        this.setState({ dashboardAmount: amountData });
                        this.hideLoader();
                        this.setState({ isDashboardReady: true });
                        objectClass.displayToast("No Transaction Data Found");
                    }

                    else {

                        // for loop

                        var monthsData = [];
                        var amountData = [];
                        for (i = 0; i < dashboardData.length; i++) {
                            mainData = dashboardData[i];
                            for (var key in mainData) {
                                // check if key is month
                                if (key == "month") {
                                    if (mainData[key] == null) {
                                        monthsData.push("0");
                                    }
                                    else {
                                        monthsData.push(objectClass.getMonthsValue(mainData[key]));
                                    }
                                }

                                if (key == "total_amount") {
                                    if (mainData[key] == null) {
                                        amountData.push(0);
                                    }
                                    else {
                                        amountData.push(mainData[key]);
                                    }
                                }

                            }
                        }

                        // now lets set these values into the states and use them
                        this.setState({ dashboardMonths: monthsData });
                        this.setState({ dashboardAmount: amountData });

                        this.hideLoader();
                        this.setState({ isDashboardReady: true });
                        // objectClass.displayToast("Welcome, " + objectClass.toTitleCase(driverName)); //DISPLAY TOAST


                        //console.log("monthsData", monthsData)
                        //console.log("amountData", amountData)
                    }
                }

                else {
                    this.hideLoader();
                    this.setState({ isDashboardReady: true });
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }

            })
            .catch((error) => {
                this.hideLoader();
                this.setState({ isDashboardReady: true });
                objectClass.displayToast("Could not connect to server");
            });


    }


    // render the view here
    render() {
        return (

            <View>
                {this.state.isDashboardReady ? (

                    <View style={styles.container}>
                        {/* <View style={styles.container}>
                            <DateTimePicker value={this.state.date} dateFormat="YYYY" onChange={(date) => this.getChartData(date)} />
                        </View> */}

                        {/* <Text style={styles.profileText}>My Purchase Chart</Text> */}
                        {/* allow user to select the year they want to see the chart */}
                        {/* <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={this.state.chosenYear}
                                onValueChange={(itemValue, index) =>
                                    this.getChartData(itemValue)
                                }>
                                <Picker.Item label="Select Year" value="" />
                                {this.state.yearOptions.map((item, index) => {
                                    return (<Picker.Item label={item.year} value={item.year} key={index} />)
                                })}

                            </Picker>

                        </View> */}
            
                        <Text style={styles.mainText}>Driver Purchase History</Text>
                        {/* Arrange the month and year pickers */}
                        <View style={{
                            backgroundColor: "#FFFFFF",
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 15,
                            marginBottom: 15,
                            marginLeft: 31,
                            marginRight: 28,
                            borderRadius: 16
                        }}>
                            {/* Selected buttons */}

                            {this.state.weekSelected ? (
                                <View style={styles.mainButtonContainer}>
                                    <TouchableOpacity style={styles.mainButton}
                                        onPress={() => this.onWeekPress()}>
                                        <Text style={styles.mainButtonText}>This week</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.weekNotSelected ? (
                                <View style={styles.otherButtonContainer}>
                                    <TouchableOpacity style={styles.otherButton}
                                        onPress={() => this.onWeekPress()}>
                                        <Text style={styles.otherButtonText}>This week</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.monthSelected ? (
                                <View style={styles.mainButtonContainer}>
                                    <TouchableOpacity style={styles.mainButton}
                                        onPress={() => this.onMonthPress()}>
                                        <Text style={styles.mainButtonText}>This month</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.monthNotSelected ? (
                                <View style={styles.otherButtonContainer}>
                                    <TouchableOpacity style={styles.otherButton}
                                        onPress={() => this.onMonthPress()}>
                                        <Text style={styles.otherButtonText}>This month</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.yearSelected ? (
                                <View style={styles.mainButtonContainer}>
                                    <TouchableOpacity style={styles.mainButton}
                                        onPress={() => this.onYearPress()}>
                                        <Text style={styles.mainButtonText}>This year</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                            {this.state.yearNotSelected ? (
                                <View style={styles.otherButtonContainer}>
                                    <TouchableOpacity style={styles.otherButton}
                                        onPress={() => this.onYearPress()}>
                                        <Text style={styles.otherButtonText}>This year</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : null}

                        </View>


                        <BarChart
                            data={{
                                labels: this.state.dashboardMonths,
                                datasets: [
                                    {
                                        data: this.state.dashboardAmount,
                                    }
                                ]
                            }}

                            width={screenWidth - 56}
                            height={173}
                            fromZero={true}
                            withInnerLines={false}
                            showBarTops={false}
                            chartConfig={{
                                backgroundColor: '#FFFFFF',
                                backgroundGradientFrom: '#FFFFFF',
                                backgroundGradientTo: '#FFFFFF',
                                fillShadowGradient: '#DAA9F7',
                                fillShadowGradientOpacity: 1,
                                barRadius: 8,
                                decimalPlaces: 0,
                                data: this.state.dashboardAmount,
                                color: () => '#DAA9F7',
                                labelColor: () => '#CCCED0',
                            }}
                            style={{
                                marginLeft: 30,
                                borderRadius: 16,
                            }}
                        />

                    </View>

                ) : null}


                {/* Show loader */}
                {this.state.isLoading ? (
                    <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
                ) : null}
            </View>


        );
    }
}

// define your styles
const styles = StyleSheet.create({
    mainText: {
        marginLeft: 30,
        fontSize: 18,
        lineHeight: 23,
        fontStyle: 'normal',
        fontWeight: '500',
        color: '#380507',
    },
    mainButtonContainer: {
        width: 106
    },
    mainButton: {
        backgroundColor: '#F35C24',
        borderRadius: 8,
        height: 42,
    },
    mainButtonText: {
        color: '#FBFBFB',
        textAlign: 'center',
        paddingTop: 12,
        fontSize: 12,
        lineHeight: 15,
        fontWeight: '600',
        fontStyle: 'normal',
    },
    otherButtonContainer: {
        width: 106
    },
    otherButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        height: 42,
    },
    otherButtonText: {
        color: '#999797',
        textAlign: 'center',
        paddingTop: 12,
        fontSize: 12,
        lineHeight: 15,
        fontWeight: 'normal',
        fontStyle: 'normal',
    },
    pickerContainer: {
        height: 52,
        alignSelf: 'flex-end',
        borderColor: '#d3d3d3',
        borderWidth: 0.5,
        marginTop: 10,
        color: '#000',
        fontWeight: '600',
        borderRadius: 7,
        width: 155,
    },
    profileText: {
        color: '#212121',
        alignSelf: 'flex-start',
        marginBottom: -47,
        fontSize: 16
    },

});

//make this component available to the app
export default DashboardChart;