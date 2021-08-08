//import liraries
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Helpers from '../../Utilities/Helpers';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import Icon from 'react-native-ionicons';
import { ListItem, SearchBar, Badge } from "react-native-elements";
import profileImage from '../../../images/avatarImage.jpg';

const win = Dimensions.get('window');

// create a component
class VehicleInfoView extends React.Component {

    constructor(props) {
        super(props);
        objectClass = new Helpers();
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

    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        <View style={styles.container}>
                            <Text style={styles.mainText}>Vehicle Details</Text>

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
                                        <Text style={styles.headingTxt2}>{'Toyota Corolla'}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.smallHeading}>Branch</Text>
                                        <Text style={styles.headingTxt2}>{'Branch'}</Text>
                                    </View>
                                    <View></View>

                                </View>

                                <View style={{
                                    marginLeft: 32,
                                    marginTop: 16,
                                    marginBottom: 26
                                }}>
                                    <Text style={styles.smallHeading}>Reg. Number</Text>
                                    <Text style={styles.headingTxt2}>{'GT 0761 12'}</Text>
                                </View>

                                <View style={styles.customHr}></View>

                            </View>

                            <View style={{
                                marginLeft: 32,
                                marginTop: 21,
                            }}>
                                <Text style={styles.smallHeading}>Driver(s) assigned to vehicle</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                marginLeft: 32,
                                marginTop: 12,
                                marginBottom: 26
                            }}>

                                <View>
                                    <Image source={profileImage} style={styles.imageBg} />
                                </View>
                                <View style={styles.listContentView}>
                                    <Text numberOfLines={1} style={styles.titleStyle}>{objectClass.toTitleCase("Benjamin Kubla")}</Text>
                                    <Text numberOfLines={1} style={styles.subTitleStyle}>{
                                        "No 219"
                                    }
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.customHr}></View>

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
    mainText: {
        paddingLeft: 32,
        marginTop: 41,
        fontSize: 18,
        lineHeight: 23,
        fontStyle: 'normal',
        fontWeight: '500',
        color: '#380507',

    },
    listContentView: {
        marginLeft: 24
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
        borderRadius: 42 / 2

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
        color: '#605C56'
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
export default withNavigation(VehicleInfoView);
