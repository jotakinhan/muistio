import React, { Component } from 'react';
import Otsikko from '../components/Otsikko';
import Muistiinpanolomake from '../components/Muistiinpanolomake';

class LisaaMuistiinpano extends Component {
  render() {
    return (
    <div>
        <Otsikko teksti="Lisää muistiinpano" />
        <Muistiinpanolomake />
    </div>
    );
  }
}

export default LisaaMuistiinpano;