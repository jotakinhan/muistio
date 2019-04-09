import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, List, ListItem } from 'react-native';
import { TabNavigator } from 'react-navigation';

class AloitusScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Muistio</Text>
		<Text>Lisää muistiinpano painamalla Uusi</Text>
      </View>
    );
  }
}

class MuistiinpanotScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Muistiinpano 1</Text>
		<Text>Muistiinpano 2</Text>
		<Text>Muistiinpano 3</Text>
      </View>
    );
  }
}

class UusiScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		<Text>Lisää muistiinpano</Text>
		
		<View style={styles.container}>
<Text>Otsikko</Text>
<TextInput style={styles.input} />
<Text>Teksti</Text>
<TextInput style={styles.input} />
<TouchableOpacity style={styles.button}>
<Text>Lisää</Text>
</TouchableOpacity>
</View>
      </View>
    );
  }
}

export default TabNavigator({
  Aloitus: { screen: AloitusScreen },
  Muistiinpanot: { screen: MuistiinpanotScreen },
  Uusi: { screen: UusiScreen },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
	paddingTop: 25,
	paddingLeft: 10,
	paddingRight: 10,
  },
  input: {
height: 30,
width: 250,
},
button: {
height: 45,
height: 75,
alignItems: 'center',
backgroundColor: '#0000ff',
padding: 10
},
});
