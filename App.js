import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Thumbnail, Body, Left, Right, Container, Content, List, ListItem, Button, Form,
   Item, Label, Input } from 'native-base';
import { SQLite, ImagePicker, Location, Permissions, Constants } from 'expo';
import { Icon } from 'react-native-elements';

const db = SQLite.openDatabase('muistiinpanot.db');

class AloitusScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{fontSize: 40, color: "blue"}}>Muistio</Text>
		<Text>Voit lisätä muistiinpanoja "Uusi"-välilehdellä</Text>
      </View>
    );
  }
}

class MuistiinpanotScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { muistiinpanot: [] };
  }

  componentDidMount =  () => {
    db.transaction(tx => {
      let sql =
        'CREATE TABLE if not exists muistiinpano (' +
        'id integer PRIMARY KEY NOT NULL, ' +
        'otsikko text NOT NULL, ' +
        'paiva date NOT NULL, ' +
        'paikka text NOT NULL, ' +
        'kuva blob, ' +
        'kuvaus text )';

      tx.executeSql(sql, null, null, this.virhe);
    });
  };

  haemuistiinpanot = () => {
    db.transaction(tx => {
      tx.executeSql('select * from muistiinpano', null, this.ok, this.virhe);
    });
  };

  ok = (tx, results) => {
    this.setState({ muistiinpanot: results.rows._array });
  };

  virhe = (tx, error) => {
    alert('Yhtään muistiinpanoa ei löytynyt. Lisää muistiinpano.'/* + error*/);
  };

  renderItem = muistiinpano => {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: muistiinpano.kuva }} />
        </Left>
        <Body>
          <Text>{muistiinpano.otsikko}</Text>
          <Text note>{muistiinpano.paikka}</Text>
          <Text note>{muistiinpano.kuvaus}</Text>
        </Body>
        <Right>
          <Text note>{muistiinpano.paiva}</Text>
        </Right>
      </ListItem>
    );
  };

  render() {
    this.haemuistiinpanot();
    if (this.state.muistiinpanot.length === 0) {
      return (
        <Container>
        <Content>
        <Text>Ei vielä muistiinpanoja</Text>
        <Button
                danger
                iconLeft
                rounded
                style={/*{ padding: 10 }*/styles.button}
                onPress={this.haemuistiinpanot}>
                <Icon name="update" color="yellow" />
                <Text>Päivitä</Text>
              </Button>
        </Content>
      </Container>
      )
    }
    return (
      <Container>
        <Content>
          <List dataArray={this.state.muistiinpanot} renderRow={this.renderItem} />
          <Button
                danger
                iconLeft
                rounded
                style={/*{ padding: 10 }*/styles.button}
                onPress={this.haemuistiinpanot}>
                <Icon name="update" color="yellow" />
                <Text>Päivitä</Text>
              </Button>
        </Content>
      </Container>
    );
  }

}




class UusiScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      otsikko: '',
      paiva: this.teePaiva(),
      paikka: '',
      kuvaus: '',
      kuva: null,
      viesti: '',
    };
  }

  teePaiva = () => {
    let tanaan = new Date();
    let kk = tanaan.getMonth() + 1;
    let pp = tanaan.getDate();
    let vv = tanaan.getFullYear();

    let pvm = pp + '.' + '' + kk + '.' + vv;
    return pvm;
  };

  componentDidMount = async () => {
    /*
    db.transaction(tx => {
        tx.executeSql('delete from muistiinpano');
    });
   */
    let lupa = await Permissions.askAsync(Permissions.LOCATION);
    if (lupa.status === 'granted') {
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      let paikka = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      let gecode = await Location.reverseGeocodeAsync(paikka);

      this.setState({ paikka: gecode[0].city });
    }
  };

  lisaa = () => {
    db.transaction(tx => {
      let sql =
        'CREATE TABLE if not exists muistiinpano (' +
        'id integer PRIMARY KEY NOT NULL, ' +
        'otsikko text NOT NULL, ' +
        'paiva date NOT NULL, ' +
        'paikka text NOT NULL, ' +
        'kuva blob, ' +
        'kuvaus text )';
      tx.executeSql(sql, null, this.lisays, this.virhe);
    });
  };

  lisays = () => {
    db.transaction(tx => {
      let sql =
        'INSERT INTO muistiinpano (otsikko, paiva, paikka, kuva, kuvaus) ' +
        ' VALUES (?, ?, ?, ?, ?)';

      tx.executeSql(
        sql,
        [
          this.state.otsikko,
          this.state.paiva,
          this.state.paikka,
          this.state.kuva,
          this.state.kuvaus,
        ],
        this.ok,
        this.virhe
      );
    });
  };

  poisto = () => {
    db.transaction(tx => {
      let sql =
        'DROP TABLE muistiinpano; ' +
        'CREATE TABLE if not exists muistiinpano (' +
        'id integer PRIMARY KEY NOT NULL, ' +
        'otsikko text NOT NULL, ' +
        'paiva date NOT NULL, ' +
        'paikka text NOT NULL, ' +
        'kuva blob, ' +
        'kuvaus text )';

      tx.executeSql(
        sql
      );
    });
  };

  ok = () => {
    this.setState({ viesti: 'Lisätty muistiinpanoihin' });
    this.tyhjenna();
  };

  virhe = (tx, error) => {
    this.setState({ viesti: 'Virhe lisättäessä muistiinpanoa' });
  };

  tyhjenna = () => {
    this.setState({
      otsikko: '',
      paiva: this.teePaiva(),
      paikka: '',
      kuvaus: '',
      kuva: null,
    });
  };

  otaKuva = async () => {
    let camera = await Permissions.askAsync(Permissions.CAMERA);
    let cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRoll.status === 'granted' && camera.status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
      });

      if (!result.cancelled) {
        this.setState({ kuva: result.uri });
      }
    }
  };

  haeKuva = async () => {
    let camera = await Permissions.askAsync(Permissions.CAMERA);
    let cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRoll.status === 'granted' && camera.status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
      });

      if (!result.cancelled) {
        this.setState({ kuva: result.uri });
      }
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <Form>
            <View style={styles.buttonContainer}>
              <Button
                iconLeft
                light
                rounded
                style={styles.button}
                onPress={this.otaKuva}>
                <Icon name="camera" color="yellow" />
                <Text>Ota kuva</Text>
              </Button>

              <Button
                iconLeft
                light
                rounded
                style={styles.button}
                onPress={this.haeKuva}>
                <Icon name="image" type="font-awesome" color="yellow" />
                <Text>Hae kuva</Text>
              </Button>
            </View>
            {this.state.kuva && (
              <Image source={{ uri: this.state.kuva }} style={styles.image} />
            )}

            <Item inlineLabel>
              <Label>Otsikko</Label>
              <Input
                value={this.state.otsikko}
                onChangeText={text =>
                  this.setState({ viesti: '', otsikko: text })
                }
              />
            </Item>
            <Item inlineLabel>
              <Label>Päivä</Label>
              <Input
                value={this.state.paiva}
                onChangeText={text =>
                  this.setState({ viesti: '', paiva: text })
                }
              />
            </Item>
            <Item inlineLabel>
              <Label>Paikka</Label>
              <Input
                value={this.state.paikka}
                onChangeText={text =>
                  this.setState({ viesti: '', paikka: text })
                }
              />
            </Item>
            <Item inlineLabel>
              <Label>Kuvaus</Label>
              <Input
                multiline
                style={{ height: 80 }}
                value={this.state.kuvaus}
                onChangeText={text =>
                  this.setState({ viesti: '', kuvaus: text })
                }
              />
            </Item>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Button
                iconLeft
                rounded
                style={/*{ padding: 10, marginRight: 10 }*/styles.button}
                onPress={this.lisaa}>
                <Icon name="create" color="yellow" />
                <Text>Lisää</Text>
              </Button>

              <Button
                danger
                iconLeft
                rounded
                style={/*{ padding: 10 }*/styles.button}
                onPress={this.tyhjenna}>
                <Icon name="backspace" color="yellow" />
                <Text>Tyhjennä</Text>
              </Button>

              
            </View>
            <Button
                danger
                iconLeft
                rounded
                style={/*{ padding: 10 }*/styles.button}
                onPress={this.poisto}>
                <Icon name="delete" color="yellow" />
                <Text>Poista kaikki muistiinpanot</Text>
              </Button>
          </Form>
          <Text style={{ color: 'green', textAlign: 'center' }}>
            {this.state.viesti}
          </Text>
        </Content>
      </Container>
    );
  }
}

const RootNavigator = TabNavigator({
  Aloitus: { screen: AloitusScreen },
  Muistiinpanot: { screen: MuistiinpanotScreen },
  Uusi: { screen: UusiScreen },
});

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <RootNavigator />
      </View>
    )
  }
}

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
/*height: 45,*/
fontSize: 15,
height: 55,
alignItems: 'center',
backgroundColor: '#add8e6',
padding: 10
},
});
