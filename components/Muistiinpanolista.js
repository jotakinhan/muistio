import React from 'react';
import Muistiinpano from './Muistiinpano';

function Muistiinpanolista (props) {
    let muistiinpanot = props.muistiinpanot.map(function(muistiinpano, index) {
        return (<Muistiinpano muistiinpano={muistiinpano} key={index} />)
    });
    return (<div>{muistiinpanot}</div>);
}

export default Muistiinpanolista;