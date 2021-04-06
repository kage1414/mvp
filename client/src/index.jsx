import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import IncidentList from './components/IncidentList.jsx';
import Form from './components/Form.jsx';
// import Promise from 'bluebird';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      incidents: [],
      coords: '',
      loadingLocation: false,
      loadingData: false
    };
  }

  getPosition() {
    console.log('getPosition');
    this.setState({loadingLocation: true});
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((location) => {
        let coords = location.coords.latitude + ',' + location.coords.longitude;
        this.setState({
          coords: coords,
          loadingLocation: false});
        resolve(coords);
      });
    });
  }

  // Sending to API. Refactor to send to server
  ajax(coords) {
    console.log('ajax');
    this.setState({ loadingData: true });
    $.ajax({
      url: '/theft',
      type: 'POST',
      data: {
        coordinates: this.state.coords
      },
      success: (data) => {
        console.log(data);
        this.setState({ loadingData: false });
        this.setState(data);
      }
    });
  }

  getIncidents() {
    console.log('getIncidents');
    this.setState({ incidents: [] });

    this.getPosition()
      .then((coords) => {
        this.ajax(coords);
      });

  }

  render() {
    return (
      <div>
        <h1>Lockr</h1>
        <Form getIncidents={this.getIncidents.bind(this)}/>
        {/* {this.state.atRisk && <div style={{fontSize: '40px'}}>No</div>}
        {this.state.loadingLocation && <span><img src="./giphy.gif" style={{ padding: '5px', maxHeight: '20px', maxWidth: '20px'}}/>Getting Location</span>}
        {this.state.loadingData && <span><img src="./giphy.gif" style={{ padding: '5px', maxHeight: '20px', maxWidth: '20px' }}/>Retrieving Data From Server</span>} */}
        <IncidentList incidents={this.state.incidents} />
      </div>
    );
  }

}

ReactDOM.render(<App/>, document.getElementById('root'));