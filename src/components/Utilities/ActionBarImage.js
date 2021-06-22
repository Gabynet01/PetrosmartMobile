import React, { Component } from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';

export default class ActionBarImage extends Component {
  render() {
    return (
      // <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 10,  marginBottom: 10 }}>
      //   <Image
      //     source={require('../../images/petrosmart-logo.png')}
      //     style={{
      //       width: 100,
      //       height: 100,
      //       resizeMode: 'contain',
      //     }}
      //   />
      // </View>

      <View style={{ flexDirection: 'row' }}>
        <Image
          source={require('../../images/petrosmart-logo.png')}
          style={{
            width: 60,
            height: 60,
            margin: 5,
            resizeMode: 'contain'
            // borderRadius: 40 / 2
          }}
        />
      </View>
    );
  }
}