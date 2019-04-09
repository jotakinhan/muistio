import React, { Component } from 'react';
import Muistiinpanolista from './Muistiinpanolista';
import { haeKaikkiMuistiinpanot } from '../api/MuistiinpanoAPI';

/*const mat = [
  {
    otsikko: "Muistiinpano",
    kuvaus: "Tekstiä"
  }
];*/

class Muistiinpanotaulukko extends Component {
  constructor (props) {
      super(props);
      this.state = {muistiinpanot: []};
  }
  
  componentDidMount = () => {
	  haeKaikkiMuistiinpanot(this.kasitteleVastaus);
  }
  
  kasitteleVastaus = (data, status) => {
	  if (status !== 503) {
		 this.setState({muistiinpanot: data});
   } else {
     alert("Listaus ei onnistu");
     // Anna käyttäjälle virheilmoitus laittamalla tilaan sitä varten muuttuja
   }
  }
    
  render() {
    return (
      <div>
        <Muistiinpanolista muistiinpanot={this.state.muistiinpanot} />
      </div>
    );
  }
}

export default Muistiinpanotaulukko;
