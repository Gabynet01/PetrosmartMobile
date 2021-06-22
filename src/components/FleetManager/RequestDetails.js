//import liraries
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import Helpers from '../Utilities/Helpers';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ProgressBar } from '@react-native-community/progress-bar-android';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import FleetManagerOptionsMenuView from '../OptionsMenu/FleetManagerOptionsMenu';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';

const win = Dimensions.get('window');

// create a component
class FleetManagerRequestDetailsView extends React.Component {

    constructor(props) {
        super(props);
        objectClass = new Helpers();

        // Declare variables here
        this.state = {
            isLoading: false,
            isMainPage: true,
            isRejectedClicked: false,
            selectedComment: "",
            commentOptions: [],
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    //navigation options 
    static navigationOptions = {
        // headerTitle: () => <ActionBarImage />,
        title: "Request Info",
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

    //refresh data in the main list page
    componentWillUnmount() {
        this.props.navigation.state.params.refreshFetchList()
    }

    // SHOW LOADER
    showLoader() {
        this.setState({ isLoading: true });
    };

    // HIDE LOADER
    hideLoader() {
        this.setState({ isLoading: false });
    };

    //approve only pending transactions
    showApprovalConfirmationAlert = () => {
        //show this
        Alert.alert(
            //title
            'Are you sure?',
            //body
            'By clicking yes, this transaction will be approved for ' + this.props.navigation.state.params.apiListItemData.DriverName,
            [
                {
                    text: 'Yes', style: "default", onPress: () => {
                        //Lets make the API call to approve
                        // objectClass.displayToast("Making API call to approve");
                        this.approvePendingRequest();
                    }
                },
                { text: 'No', onPress: () => objectClass.displayToast("Request is still pending"), style: 'cancel' },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        )
    }

    //reject button clicked
    showRejectionPageView = () => {
        this.setState({ isMainPage: false });
        this.setState({ isRejectedClicked: true });
        var options = [{
            "label": "Funds not loaded",
            "value": "Funds not loaded",
        },
        {
            "label": "Contact Office",
            "value": "Contact Office",
        }]

        this.setState({ commentOptions: options });
    }


    //cancel reject button clicked
    cancelRejectRequest = () => {
        this.setState({ isMainPage: true });
        this.setState({ isRejectedClicked: false });
    }

    //approve the pending requests
    approvePendingRequest() {
        this.showLoader();

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'payment/fleetmanager/companypool/request', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestType: "APPROVED",
                requestId: this.props.navigation.state.params.apiListItemData.request_id,
                fleetManagerId: this.props.navigation.state.params.apiListItemData.fleet_manager_id,
                stationId: this.props.navigation.state.params.apiListItemData.station_id,
                paymentCode: this.props.navigation.state.params.apiListItemData.payment_code,
                driverId: this.props.navigation.state.params.apiListItemData.driver_id
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for approving pending request by fleet manager api ", responseJson)
                if (responseJson.code == "200") {
                    //go to approval page
                    this.props.navigation.goBack();

                    // this.props.navigation.push("FleetManagerApprovedPage");
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message));
                }

                else {
                    this.hideLoader();
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                this.hideLoader();
                objectClass.displayToast("Could not connect to server");
            });

    }

    //reject the pending requests
    rejectPendingRequest() {

        if (this.state.selectedComment == "" || this.state.selectedComment == undefined) {
            // display toast activity
            objectClass.displayToast("Please select a comment");
            return false;
        }

        this.showLoader();


        //console.log("rejectionComment ", this.state.selectedComment)

        // Make the API call here
        fetch(this.state.baseUrl + this.state.apiRoute + 'payment/fleetmanager/companypool/request', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                requestType: "REJECTED",
                rejectionComment: this.state.selectedComment,
                requestId: this.props.navigation.state.params.apiListItemData.request_id,
                fleetManagerId: this.props.navigation.state.params.apiListItemData.fleet_manager_id,
                stationId: this.props.navigation.state.params.apiListItemData.station_id,
                paymentCode: this.props.navigation.state.params.apiListItemData.payment_code,
                driverId: this.props.navigation.state.params.apiListItemData.driver_id
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log("my response for rejecting pending request by fleet manager api ", responseJson)
                if (responseJson.code == "200") {
                    //go to approval page
                    this.props.navigation.goBack();

                    // this.props.navigation.push("FleetManagerApprovedPage");
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message));
                }

                else {
                    this.hideLoader();
                    objectClass.displayToast(objectClass.toTitleCase(responseJson.message)); //display Error message
                }
            })
            .catch((error) => {
                this.hideLoader();
                objectClass.displayToast("Could not connect to server");
            });

    }

    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>

                        {/* REJECTED VIEW */}
                        {this.state.isRejectedClicked ? (
                            <View style={styles.container}>

                                <Card containerStyle={{
                                    paddingTop: 30,
                                    paddingBottom: 45,
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: 7,
                                    borderWidth: 1,
                                    borderColor: '#f9f9f9',
                                    shadowColor: "#455A64",
                                    shadowOpacity: 0.1,
                                    elevation: 0.1,
                                }}>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            itemStyle={{ height: 50 }}
                                            selectedValue={this.state.selectedComment}
                                            onValueChange={(itemValue, index) =>
                                                this.setState({ selectedComment: itemValue, selectedIndex: index })
                                            }>

                                            <Picker.Item label="Please tap to select a reason" value="" />

                                            {this.state.commentOptions.map((item, index) => {
                                                return (<Picker.Item label={item.label} value={item.value} key={index} />)
                                            })}

                                        </Picker>

                                    </View>

                                    <TouchableOpacity style={styles.solidButtonContainer}
                                        onPress={() => this.rejectPendingRequest()}>
                                        <Text style={styles.solidButtonText}>CONFIRM</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.outlineButtonContainer}
                                        onPress={() => this.cancelRejectRequest()}>
                                        <Text style={styles.outlineButtonText}>CANCEL</Text>
                                    </TouchableOpacity>

                                </Card>


                                {/* Show loader */}
                                {this.state.isLoading ? (
                                    <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
                                ) : null}
                            </View>
                        ) : null}

                        {/* MAIN PAGE VIEW */}
                        {this.state.isMainPage ? (
                            <View style={styles.container}>

                                <Card containerStyle={{
                                    paddingTop: 30,
                                    paddingBottom: 45,
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: 7,
                                    borderWidth: 1,
                                    borderColor: '#f9f9f9',
                                    shadowColor: "#455A64",
                                    shadowOpacity: 0.1,
                                    elevation: 0.1,
                                }}>
                                    <Card.Title>
                                        <Text style={{ fontWeight: '600' }} numberOfLines={2}  >{this.props.navigation.state.params.apiListItemData.StationName.toUpperCase()}</Text>
                                        <View>
                                            <Text style={{ fontWeight: 'normal' }} numberOfLines={2}  >{objectClass.toTitleCase(this.props.navigation.state.params.apiListItemData.StationAddress)}</Text>
                                        </View>

                                    </Card.Title>
                                    <Card.Divider />
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10
                                    }}>
                                        <View>
                                            <Text>Driver: </Text>
                                        </View>

                                        <View>
                                            <Text style={{ fontWeight: '600' }} numberOfLines={2}  >{objectClass.toTitleCase(this.props.navigation.state.params.apiListItemData.DriverName)}</Text>
                                        </View>

                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10
                                    }}>
                                        <View>
                                            <Text>Amount: </Text>
                                        </View>

                                        <View>
                                            <Text style={{ fontWeight: '600' }} numberOfLines={2}  >GHC{this.props.navigation.state.params.apiListItemData.amount}</Text>
                                        </View>

                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10
                                    }}>
                                        <View>
                                            <Text>Company: </Text>
                                        </View>

                                        <View>
                                            <Text style={{ fontWeight: '600' }} numberOfLines={2}  >{objectClass.toTitleCase(this.props.navigation.state.params.apiListItemData.CompanyName)}</Text>
                                        </View>

                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10
                                    }}>
                                        <View>
                                            <Text>Company Wallet: </Text>
                                        </View>

                                        <View>
                                            <Text style={{ fontWeight: '600' }} numberOfLines={2}  >{this.props.navigation.state.params.apiListItemData.CompanyWallet}</Text>
                                        </View>

                                    </View>

                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10
                                    }}>
                                        <View>
                                            <Text>Station Wallet: </Text>
                                        </View>

                                        <View>
                                            <Text style={{ fontWeight: '600' }} numberOfLines={2}  >{this.props.navigation.state.params.apiListItemData.StationWallet}</Text>
                                        </View>

                                    </View>

                                    {/* <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 10
                                }}>
                                    <View>
                                        <Text>Date: </Text>
                                    </View>

                                    <View>
                                        <Text style={{ fontWeight: '600' }} numberOfLines={2}  > {moment(this.props.navigation.state.params.apiListItemData.created_at).format('DD-MM-YYYY hh:mm A') }</Text>
                                    </View>

                                </View> */}



                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginBottom: 10
                                    }}>
                                        <View>
                                            <Text>Status: </Text>
                                        </View>

                                        <View>
                                            <Text style={{ fontWeight: '600' }} numberOfLines={2}  >{this.props.navigation.state.params.apiListItemData.approval_flag.toUpperCase()}</Text>
                                        </View>

                                    </View>

                                    {this.props.navigation.state.params.apiListItemData.approval_flag.toUpperCase() == "PENDING" ? (
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 10
                                        }}>
                                            <View>
                                                <Text>Request Date: </Text>
                                            </View>

                                            <View>
                                                <Text style={{ fontWeight: '600' }} numberOfLines={2}  > {moment(this.props.navigation.state.params.apiListItemData.created_at).format('DD-MM-YYYY hh:mm A')}</Text>
                                            </View>

                                        </View>

                                    ) : null}


                                    {this.props.navigation.state.params.apiListItemData.approval_flag.toUpperCase() == "APPROVED" ? (
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 10
                                        }}>
                                            <View>
                                                <Text>Approved Date: </Text>
                                            </View>

                                            <View>
                                                <Text style={{ fontWeight: '600' }} numberOfLines={2}  > {moment(this.props.navigation.state.params.apiListItemData.approval_date).format('DD-MM-YYYY hh:mm A')}</Text>
                                            </View>

                                        </View>

                                    ) : null}

                                    {this.props.navigation.state.params.apiListItemData.approval_flag.toUpperCase() == "REJECTED" ? (
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 10
                                        }}>
                                            <View>
                                                <Text>Rejected Date: </Text>
                                            </View>

                                            <View>
                                                <Text style={{ fontWeight: '600' }} numberOfLines={2}  > {moment(this.props.navigation.state.params.apiListItemData.rejection_date).format('DD-MM-YYYY hh:mm A')}</Text>
                                            </View>

                                        </View>

                                    ) : null}

                                    {this.props.navigation.state.params.apiListItemData.approval_flag.toUpperCase() == "REJECTED" ? (
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginBottom: 10
                                        }}>
                                            <View>
                                                <Text>Comment: </Text>
                                            </View>

                                            <View>
                                                <Text style={{ fontWeight: '600' }} numberOfLines={2}  > {this.props.navigation.state.params.apiListItemData.rejection_comment}</Text>
                                            </View>

                                        </View>

                                    ) : null}



                                </Card>


                                {/* Button to perform approval */}
                                {this.props.navigation.state.params.apiListItemData.approval_flag.toUpperCase() == "PENDING" ? (
                                    <View style={styles.container}>
                                        <TouchableOpacity style={styles.solidButtonContainer}
                                            onPress={() => this.showApprovalConfirmationAlert()}>
                                            <Text style={styles.solidButtonText}>APPROVE</Text>
                                        </TouchableOpacity>

                                    </View>

                                ) : null}

                                {/* Button to perform approval */}
                                {this.props.navigation.state.params.apiListItemData.approval_flag.toUpperCase() == "PENDING" ? (
                                    <View style={styles.outlineContainer}>
                                        <TouchableOpacity style={styles.outlineButtonContainer}
                                            onPress={() => this.showRejectionPageView()}>
                                            <Text style={styles.outlineButtonText}>REJECT</Text>
                                        </TouchableOpacity>

                                    </View>

                                ) : null}

                                {/* Show loader */}
                                {this.state.isLoading ? (
                                    <ProgressBar color="#F35C24" style={{marginTop: 20, marginBottom: 20}}/>
                                ) : null}
                            </View>
                        ) : null}
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 5
        // paddingBottom: win.height / 6.5
    },
    pickerContainer: {
        height: 52,
        borderColor: '#212121',
        borderWidth: 1,
        marginBottom: 5,
        color: '#212121',
        borderRadius: 7,
        width: win.width - 100,
    },
    outlineContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 5
        // paddingBottom: win.height / 6.5
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    normalText: {
        color: '#212121',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18
    },
    profileText: {
        color: '#212121',
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18
    },
    profileNumberText: {
        color: '#f3931c',
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 18
    },
    solidButtonContainer: {
        backgroundColor: '#F35C24',
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#F35C24',
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    solidButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontSize: 18
    },
    outlineButtonContainer: {
        backgroundColor: '#F9F9F9',
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#F35C24',
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    outlineButtonText: {
        color: '#F35C24',
        textAlign: 'center',
        fontSize: 18
    },
});

//make this component available to the app
export default withNavigation(FleetManagerRequestDetailsView);
