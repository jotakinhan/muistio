import React from 'react';

function Muistiinpano(props) {
    return (
      <div>
        Otsikko: { props.muistiinpano.otsikko.toUpperCase() }<br />
        Kuvaus: { props.muistiinpano.kuvaus }<br /><br />
      </div>
    );
}

export default Muistiinpano;
