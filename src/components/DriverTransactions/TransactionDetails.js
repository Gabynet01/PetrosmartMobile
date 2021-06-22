//import liraries
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import Helpers from '../Utilities/Helpers';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import MainMenuOptionsView from '../OptionsMenu/MainOptionsMenu';
import { Badge } from "react-native-elements";
import moment from 'moment';
import Icon from 'react-native-ionicons';

const win = Dimensions.get('window');

// create a component
class TransactionDetailsView extends React.Component {

    constructor(props) {
        super(props);
        objectClass = new Helpers();
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

    render() {
        return (


            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>

                        <View style={styles.container}>

                            <View style={styles.profileContainer} >
                                <Text style={styles.currentDate}>{moment().format('Do, MMMM, YYYY')}</Text>
                            </View>


                            <View style={styles.formBody}>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 19
                                }}>
                                    <View>
                                        <View style={styles.mainHeading}>
                                            <Text style={styles.headingTxt}>Transaction Details</Text>
                                        </View>
                                    </View>
                                    <View>

                                        {this.props.route.params.TransactionItemData.payment_code_status.toUpperCase() == "INACTIVE" ? (
                                            <View style={styles.badgeContainer}>
                                                <Badge
                                                    value={"Success"}
                                                    badgeStyle={{ backgroundColor: '#E8FAE5', marginTop: 5 }}
                                                    textStyle={{ color: '#61DD4B', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontStyle: 'normal', fontFamily: 'circularstd-book', marginLeft: 6, marginRight: 6, marginBottom: 6, marginTop: 6 }}
                                                />
                                            </View>
                                        ) : null}

                                        {this.props.route.params.TransactionItemData.payment_code_status.toUpperCase() == "ACTIVE" ? (
                                            <View style={styles.badgeContainer}>
                                                <Badge
                                                    value={"Pending"}
                                                    badgeStyle={{ backgroundColor: '#FFFEF5', marginTop: 3 }}
                                                    textStyle={{ color: '#FFDB0F', fontSize: 9, lineHeight: 11, fontWeight: 'normal', fontStyle: 'normal', fontFamily: 'circularstd-book', marginLeft: 6, marginRight: 6, marginBottom: 6, marginTop: 6 }}
                                                />
                                            </View>
                                        ) : null}


                                    </View>

                                </View>

                                <View style={styles.customHr}></View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 24,
                                    marginLeft: 25
                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.smallHeading}>Vehicle</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 5,
                                    marginLeft: 25
                                }}>
                                    <View>
                                        <Text style={styles.contentHeadTxt}>{this.props.route.params.TransactionItemData.VehicleName}</Text>
                                    </View>                                   
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 7,
                                    marginLeft: 25
                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.mediumHeading}>{this.props.route.params.TransactionItemData.VehicleRegNo}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 24,
                                    marginLeft: 25
                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.smallHeading}>Station</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: 25
                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.contentHeadTxt} numberOfLines={2}>{objectClass.toTitleCase(this.props.route.params.TransactionItemData.StationName)}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 24,
                                    marginLeft: 25
                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.smallHeading}>Amount</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: 25,
                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.contentHeadTxt}>GHC {this.props.route.params.TransactionItemData.amount}</Text>
                                        </View>
                                    </View>

                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 24,
                                    marginLeft: 25
                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.smallHeading}>Date</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginLeft: 25,
                                    marginBottom: 82

                                }}>
                                    <View>
                                        <View>
                                            <Text style={styles.contentHeadTxt} numberOfLines={2}>{moment(this.props.route.params.TransactionItemData.created_at).format('D MMMM, YYYY')}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {

    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    profileContainer: {
        marginTop: 15,
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
    formBody: {
        marginTop: 25,
        marginLeft: 29,
        marginRight: 28,
        backgroundColor: '#FFFFFF',
        borderRadius: 16
    },
    mainHeading: {
        marginTop: 19,
        marginLeft: 22
    },
    headingTxt: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 17,
        lineHeight: 22,
        color: '#380507'
    },
    badgeContainer: {
        marginTop: 19,
        marginRight: 22
    },
    customHr: {
        borderBottomColor: "#FAFAF6",
        borderBottomWidth: 2,
        marginLeft: 21,
        marginRight: 26
    },
    smallHeading: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: 15,
        color: '#999797'
    },
    contentHeadTxt: {
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 20,
        marginTop: 5,
        color: '#605C56'
    },
    mediumHeading: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 18,
        color: '#999797'
    }
});

//make this component available to the app
export default withNavigation(TransactionDetailsView);
