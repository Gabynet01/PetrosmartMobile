//import liraries
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, Dimensions, TouchableOpacity } from 'react-native';
import Helpers from '../../Utilities/Helpers';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import MainMenuOptionsView from '../MainOptionsMenu';
import moment from 'moment';
import Icon from 'react-native-ionicons';
import petrosmartlogo from '../../../images/petrosmart-logo.png';

const win = Dimensions.get('window');

// create a component
class AboutAppView extends React.Component {

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
                            <View>
                                <View style={styles.mainHeading}>
                                    <Text style={styles.headingTxt}>About App</Text>
                                </View>
                            </View>

                            <View style={styles.formBody}>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 33,
                                    marginTop: 25
                                }}>
                                    <View style={styles.logoBody}>
                                        <Image style={styles.logoContainer}
                                            source={petrosmartlogo}
                                        />
                                    </View>
                                    <View>
                                        <View style={styles.mainHeading2}>
                                            <Text style={styles.smallHeading}>App Name</Text>
                                            <Text style={styles.headingTxt}>Petrosmart</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={styles.mainHeading2}>
                                            <Text style={styles.smallHeading}>Version</Text>
                                            <Text style={styles.headingTxt}>2.0.1</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.headingTxt2}>About Company</Text>
                                <Text style={styles.contentTxt}>Id posuere ultrices proin in adipiscing velit, at eget risus. Ac nulla morbi ut in enim. Ipsum bibendum consequat sit mauris ultrices ipsum nulla quam. Nunc sit molestie gravida nulla tellus id ut fames. Egestas vel sit diam non, id enim. Elementum condimentum auctor nibh quis. Dictum blandit quis iaculis ornare quis quam netus. Erat mauris, at e eget massa orci. Lorem a pellentesque varius in quis senectus. Sapien enim, sed sit napellentesque ornare a blandit sociis. Vitae semper id etiam non ultricies neque sed pretium eget. Sem suspendisse ipsum ipsum laoreet turpis quam purus ut. Justo amet, turpis nisl congum. Lectus nam id vitae eu. Facilisi id auctor venenatis, elit eget molestie. Duis lacinia pellentesque eget tortor etiam luctus quis.</Text>
                            </View>

                            <View>
                                <Text style={styles.headingTxt2}>Terms &amp; Privacy Policy</Text>
                                <Text style={styles.contentTxt}>Id posuere ultrices proin in adipiscing velit, at eget risus. Ac nulla morbi ut in enim. Ipsum bibendum consequat sit mauris ultrices ipsum nulla quam. Nunc sit molestie gravida nulla tellus id ut fames. Egestas vel sit diam non, id enim. Elementum condimentum auctor nibh quis. Dictum blandit quis iaculis ornare quis quam netus. Erat mauris, at pellentesque ornare a blandit sociis. Vitae semper id etiam non ultricies neque sed pretium eget. Sem suspendisse ipsum ipsum laoreet turpis quam purus ut. Justo amet, turpis nisl congue eget massa orci. Lorem a pellentesque varius in quis senectus. Sapien enim, sed sit nam. Lectus nam id vitae eu. Facilisi id auctor venenatis, elit eget molestie. Duis lacinia pellentesque eget tortor etiam luctus quis. </Text>
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
    logoContainer: {
        width: 62.65,
        height: 80,
    },
    logoBody: {
        marginLeft: 33,
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
        marginTop: 30,
        marginLeft: 21,
        marginRight: 21,
        backgroundColor: '#FFFFFF',
        borderRadius: 16
    },
    mainHeading: {
        marginTop: 19,
        marginLeft: 32
    },
    mainHeading2: {
        marginRight: 40
    },
    headingTxt2: {
        marginTop: 24,
        marginLeft: 28,
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 23,
        color: '#380507'
    },
    contentTxt: {
        marginTop: 11,
        marginLeft: 28,
        marginRight: 29,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 16,
        lineHeight: 20,
        color: '#999797'
    },
    headingTxt: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 18,
        lineHeight: 23,
        color: '#380507'
    },
    smallHeading: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: 12,
        lineHeight: 15,
        color: '#999797'
    },
   
});

//make this component available to the app
export default withNavigation(AboutAppView);
