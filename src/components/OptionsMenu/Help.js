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

const win = Dimensions.get('window');

// create a component
class HelpView extends React.Component {
    static navigationOptions = {
        // headerTitle: () => <ActionBarImage />,
        title: "Support Center",
        // headerLeft: () => <ActionBarImage />,
        // headerRight: () => <MainMenuOptionsView />,
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

    render() {
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>

                        <View style={styles.container}>

                            <View style={styles.logoBody}>
                                <View style={styles.centerItems}>
                                    <Image style={styles.logoContainer}
                                        source={petrosmartlogo}
                                    />
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
                                <Card.Title>Contact Info</Card.Title>
                                <Card.Divider />
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 10
                                }}>
                                    <View>
                                        <Text>Hotline: </Text>
                                    </View>


                                    <View>
                                        <Text style={{ fontWeight: '600' }} numberOfLines={2}  >030XXXXXXX</Text>
                                    </View>

                                </View>


                            </Card>

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
                                <Card.Title>About App</Card.Title>
                                <Card.Divider />
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 10
                                }}>
                                    <View>
                                        <Text>Name: </Text>
                                    </View>


                                    <View>
                                        <Text style={{ fontWeight: '600' }} numberOfLines={2}  >Petrosmart</Text>
                                    </View>

                                </View>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 10
                                }}>
                                    <View>
                                        <Text>Version: </Text>
                                    </View>


                                    <View>
                                        <Text style={{ fontWeight: '600' }} numberOfLines={2}  >1.0</Text>
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
    logoContainer: {
        flex: 1,
        aspectRatio: 0.3,
        resizeMode: 'contain',
    },
    logoBody: {
        marginTop: -70,
        marginBottom: -70
    },
    centerItems: {
        justifyContent: 'center',
        alignItems: 'center',
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
export default HelpView;