import React, { Component } from 'react';
import Otsikko from '../components/Otsikko';
import styles from '../App.css';

class Aloitus extends Component {
  render() {
    return (
    <div>
        <Otsikko teksti="Muistio"/> 
        <Otsikko teksti="Lisää muistiinpano painamalla Uusi"/>
    </div>
    );
  }
}

export default Aloitus;