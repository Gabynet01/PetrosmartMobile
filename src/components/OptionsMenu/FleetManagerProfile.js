//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import ActionBarImage from '../Utilities/ActionBarImage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Avatar, Card } from 'react-native-elements';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import MainMenuOptionsView from '../OptionsMenu/MainOptionsMenu';
import petrosmartlogo from '../../images/petrosmart-logo.png';
import FleetManagerOptionsMenuView from './FleetManagerOptionsMenu';

const win = Dimensions.get('window');

// create a component
class FleetManagerProfileView extends React.Component {
    static navigationOptions = {
        // headerTitle: () => <ActionBarImage />,
        title: "etrosmart",
        headerLeft: () => <ActionBarImage />,
        headerRight: () => <FleetManagerOptionsMenuView />,
        // headerRight: <MapBarIcon />,
        headerStyle: {
            backgroundColor: '#4c4c4c',
            height: 80
        },
        headerTitleStyle: {
            color: '#fff',
            marginLeft: -15
        }
    };

    // Constructor for this component
    constructor(props) {
        super(props);
        // Declare variables here
        this.state = {
            drivername: '',
            usermobile: ''
        }
    }

    toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

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
                    this.setState({ drivername: this.toTitleCase(allUserData[0].name) })

                })

            this.setState({ usermobile: dataStored });
        }
    }


    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>

                        <View style={styles.container}>

                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 30
                            }}>
                                <Avatar
                                    size="large"
                                    rounded
                                    source={petrosmartlogo}
                                />

                                <View>
                                    <Text style={{ fontWeight: '600' }}>{this.state.profileName}</Text>
                                </View>

                            </View>

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
                                <Card.Title>Profile Info</Card.Title>
                                <Card.Divider />
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 10
                                }}>
                                    <View>
                                        <Text>Full Name: </Text>
                                    </View>


                                    <View>
                                        <Text style={{ fontWeight: '600' }} numberOfLines={2}  >{this.state.drivername}</Text>
                                    </View>

                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 10
                                }}>
                                    <View>
                                        <Text>Phone Number: </Text>
                                    </View>


                                    <View>
                                        <Text style={{ fontWeight: '600' }}>{this.state.usermobile}</Text>
                                    </View>
                                </View>

                            </Card>
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
        padding: 16,
        paddingBottom: win.height / 6.5
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
    formBody: {
        marginTop: 10,
        borderTopEndRadius: 70,
        borderTopLeftRadius: 70,
        backgroundColor: '#f3931c',
        paddingBottom: win.height / 4,
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
});

//make this component available to the app
export default FleetManagerProfileView;