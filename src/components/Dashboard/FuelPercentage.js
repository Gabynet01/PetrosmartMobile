//import liraries
import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';

import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import gasPump from '../../images/vectors/gas-pump.png';

const win = Dimensions.get('window');


// create a component
class FuelPercentageCard extends React.Component {

    // Constructor for this component
    constructor(props) {
        super(props);
        // Declare variables here
        this.state = {
            loggedInUserName: '',
            usermobile: '',
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    static navigationOptions = {
        headerShown: null
    };

    // go to purchase fuel page
    goToPurchaseFuelPage() {
        this.props.navigation.navigate("Purchase");                
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

                })
        }
    }


    render() {
        return (
            <View style={styles.bannerCard}>
                <View style={styles.innerCardText}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginLeft: 0,
                        marginTop: 20
                    }}>
                        <View style={styles.percentContainer}>
                            <Text style={styles.percentLabel}>100%</Text>
                        </View>

                        <View style={{ flex: 1, marginRight: 5 }}>
                            <Text style={styles.mediumLabel}>Your current fuel percentage is 100%, Initiate a top up</Text>
                        </View>

                        <View>
                            <Image style={styles.vectorIcon} source={gasPump} />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.solidButtonContainer}
                            onPress={() => this.goToPurchaseFuelPage()}>
                            <Text style={styles.solidButtonText}>Top up now</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    bannerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 24
    },
    innerCardText: {
        marginLeft: 14,
        marginRight: 15,
        marginBottom: 14
    },
    mediumLabel: {
        fontSize: 16,
        lineHeight: 20,
        color: '#605C56',
        fontStyle: 'normal',
        fontWeight: 'normal',  
        
    },
    percentLabel: {
        
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 15.3214,
        lineHeight: 19,
        color: '#000000',
        textAlign: 'center',
        paddingTop: 17
    },
    percentContainer: {
        width: 66,
        height: 66,
        borderRadius: 50,
        borderWidth: 7,
        borderColor: "#6BD321",
        marginRight: 11

    },
    vectorIcon: {
        marginTop: -8,
        width: 16,
        height: 21
    },
    buttonContainer: {
        alignItems: 'flex-end'
    },
    solidButtonContainer: {
        backgroundColor: '#F35C24',
        borderRadius: 8,
    },
    solidButtonText: {
        color: '#FBFBFB',
        textAlign: 'center',
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '600',
        fontStyle: 'normal',
        
    },
});

//make this component available to the app
export default withNavigation(FuelPercentageCard);