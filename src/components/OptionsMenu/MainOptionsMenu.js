// import React in our code
import React, { Component } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, View, Text, Button, Alert } from 'react-native';
import Icon from 'react-native-ionicons';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Helpers from '../Utilities/Helpers';

//import to show social icons
import { BottomSheet, ListItem } from 'react-native-elements';


class MainMenuOptionsView extends Component {

    constructor(props) {
        super(props);
        objectClass = new Helpers();
        // Declare variables here
        this.state = {
            isVisible: false,
            list: [
                {
                    title: 'Home',
                    icon: 'home',
                    onPress: () => this.gotoHome(),
                },
                {
                    title: ' Profile',
                    icon: 'person',
                    onPress: () => this.gotoProfile(),
                },
                {
                    title: 'Vouchers',
                    icon: 'cash',
                    onPress: () => this.gotoMyVouchers(),
                },
                {
                    title: 'Transactions',
                    icon: 'wallet',
                    onPress: () => this.gotoMyTransactions(),
                },
                {
                    title: 'Help',
                    icon: 'help-circle',
                    onPress: () => this.gotoHelp(),
                },
                {
                    title: 'Logout',
                    icon: 'log-out',
                    onPress: () => this.gotoLogout(),
                },

                // {
                //     title: 'Exit',
                //     icon: 'arrow-back',
                //     // containerStyle: { backgroundColor: 'red' },
                //     // titleStyle: { color: 'white' },
                //     onPress: () => this.hideBottomNavigationView(),
                // },
            ],
            baseUrl: "http://test.petrosmartgh.com:7777/",
            apiRoute: "api/"
        }
    }

    //go home
    gotoHome = () => {
        this.hideBottomNavigationView();
        this.props
            .navigation
            .dispatch(StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'DashboardPage'
                    }),
                ],
            }))
    }

    //go to profile
    gotoProfile = () => {
        this.hideBottomNavigationView();
        this.props.navigation.navigate("UserProfilePage");
    }

    //go to MyVouchers
    gotoMyVouchers = () => {
        this.hideBottomNavigationView();
        this.props.navigation.navigate("VoucherListPage");
    }

    //go to MyTransactions
    gotoMyTransactions = () => {
        this.hideBottomNavigationView();
        this.props.navigation.navigate("TransactionListPage");
    }

    //go to Help
    gotoHelp = () => {
        this.hideBottomNavigationView();
        this.props.navigation.navigate("HelpPage");
    }

    //go to logout 
    gotoLogout = () => {
        // this.hideBottomNavigationView();

        //show this
        Alert.alert(
            //title
            'Are you sure?',
            //body
            'By logging out, all your session data wil be cleared. Do you want to log out?',
            [
                {
                    text: 'Yes', style: "default", onPress: () => {
                        // Clear storage
                        AsyncStorage.clear();
                        // Display Logout Message
                        objectClass.displayToast("You are logged out");
                        this.hideBottomNavigationView();
                        // Reset the navigation Stack for back button press
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
                },
                { text: 'No', onPress: () => objectClass.displayToast("Welcome Back"), style: 'cancel' },
            ],
            { cancelable: false }
            //clicking out side of alert will not cancel
        )
    }

    // if the basket icon is clicked
    showBottomNavigationView = () => {
        // navigate to the class
        this.setState({ isVisible: true });
    }

    hideBottomNavigationView = () => {
        // navigate to the class
        this.setState({ isVisible: false });
    }

    render() {
        return (
            <View style={styles.container}>

                <View>
                    <Icon style={styles.headerIconRight} name={'menu'} onPress={this.showBottomNavigationView} />
                </View>


                <BottomSheet isVisible={this.state.isVisible} onBackdropPress={this.hideBottomNavigationView}>
                    <View style={styles.bottomNavigationView}>
                        <Text onPress={this.hideBottomNavigationView}
                            style={{
                                textAlign: "center",
                                margin: 5,
                                paddingRight: 10
                            }}>
                            <Icon style={styles.iconClose} name={'close-circle'} onPress={this.hideBottomNavigationView} />
                        </Text>

                        {this.state.list.map((l, i) => (
                            <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress} bottomDivider>
                                <Icon style={styles.iconList} name={l.icon} />
                                <ListItem.Content>
                                    <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ))}
                    </View>
                </BottomSheet>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    iconList: {
        color: "#4c4c4c",
        // fontSize: 40,
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    iconClose: {
        color: "#4c4c4c",
        fontSize: 40,
        shadowColor: "#455A64",
        shadowOpacity: 0.1,
        elevation: 0.1,
    },
    headerIconRight: {
        margin: 16,
        color: "#fff",
    },
    bottomNavigationView: {
        backgroundColor: '#fff',
        // width: '100%',
        // height: 300,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
});

export default withNavigation(MainMenuOptionsView);