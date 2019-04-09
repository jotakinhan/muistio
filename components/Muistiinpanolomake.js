import React, { Component } from 'react';
import { lisaaMuistiinpanoKantaan } from '../api/MuistiinpanoAPI';

class Muistiinpanolomake extends Component {
 constructor(props) {
     super(props);
     this.muuta = this.muuta.bind(this);
     this.tallenna = this.tallenna.bind(this);
     this.state = {otsikko: "", teksti: ""};
 }
    
 muuta (e) {
     this.setState({[e.target.name]: e.target.value});
 }
    
 tallenna (e) {
    e.preventDefault();
	lisaaMuistiinpanoKantaan({otsikko: this.state.otsikko, kuvaus: this.state.teksti}, this.kasitteleLisays);
 }
 
 lisaaKuva (e) {
    e.preventDefault();
	
	/*
	Valmiissa mobiiliversiossa voidaan muistiinpanoon liittää kuva
	*/
 }
 
 kasitteleLisays = (status) => {
   if (status === 200) {
     document.location='listaa';
   }
   else {
     alert(status);
     // Ilmoita käyttäjälle virheestä
  }
 }
    
  render() {
    return (
        <form>
            <label htmlFor="otsikko">Otsikko</label>
            <input type="text" value={this.state.otsikko} name="otsikko" onChange={ this.muuta } /><br />
        
            <label htmlFor="teksti">Teksti</label>
            <input type="text" value={this.state.teksti} name="teksti" onChange={ this.muuta } /><br />
        
            
			
			<input type="submit" value="Tallenna" onClick={ this.tallenna } />
        </form>
    );
  }
}

export default Muistiinpanolomake;
