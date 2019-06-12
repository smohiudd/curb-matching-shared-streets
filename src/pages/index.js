import React, {Component} from "react"
import mapboxgl from 'mapbox-gl'
import Compare from 'mapbox-gl-compare'
import 'mapbox-gl/dist/mapbox-gl.css';
import 'mapbox-gl-compare/dist/mapbox-gl-compare.css';
import curbs from '../geojson/matched_curbs.json';
import curbs_unmatched from '../geojson/original_curb_data.json';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FhZGlxbSIsImEiOiJjamJpMXcxa3AyMG9zMzNyNmdxNDlneGRvIn0.wjlI8r1S_-xxtq2d-W5qPA';


class CurbMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: -114.0708,
      lat: 51.0486,
      zoom: 17,
    };
  }

  componentDidMount() {

    const {lng, lat, zoom } = this.state;
    this.map1 = new mapboxgl.Map({
      container: this.before,
      style: 'mapbox://styles/saadiqm/cjfnjiowo0zj62rpj0y1qpib0',
      center: [lng, lat],
      zoom
    });

    this.map2 = new mapboxgl.Map({
      container: this.after,
      style: 'mapbox://styles/saadiqm/cjfnjiowo0zj62rpj0y1qpib0',
      center: [lng, lat],
      zoom
    });

    this.mapcompare = new Compare(this.map1, this.map2, {
    });


    var scaledWidth = (width) => {return {
        "type": "exponential",
        "base": 2,
        "stops": [
            [10, width * Math.pow(2, (10 - 16))],
            [16, width * Math.pow(2, (16 - 16))]
        ]
    }};

    this.map1.on('load', () => {
        this.map1.addSource('Curbs', {
          type: 'geojson',
          data: curbs
        });

        this.map2.addSource('curbs-unmatched', {
          type: 'geojson',
          data: curbs_unmatched
        });

        this.map2.addLayer({
          "id": "unmatched_parking",
          "type": "line",
          "source": "curbs-unmatched",
          "paint": {
            "line-color": "#4286f4",
            "line-opacity": 0.5,
            "line-width": scaledWidth(8)
          }
        });

        this.map1.addLayer({
          "id": "matchedParkingRight",
          "type": "line",
          "source": "Curbs",
          "paint": {
            "line-color": "#FF0000",
            "line-width": scaledWidth(8),
            "line-offset": scaledWidth(12),
            "line-opacity": 0.5
          },
          filter:["==", "sideOfStreet", "right"]
        });

        this.map1.addLayer({
          "id": "matchedParkingLeft",
          "type": "line",
          "source": "Curbs",
          "paint": {
            "line-color": "#FF0000",
            "line-width": scaledWidth(8),
            "line-offset": scaledWidth(-12),
            "line-opacity": 0.5
          },
          filter:["==", "sideOfStreet", "left"]
        });
      });
  }


  render(){

    return(
      <div>

        <div ref={el => this.map1 = el} style={{position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%'}}/>

        // <div ref={el => this.before = el} style={{position: 'absolute',top: 0, bottom: 0, width: '100%',height: '100%'}}/>
        // <div ref={el => this.after = el} style={{position: 'absolute',top: 0,bottom: 0,width: '100%',height: '100%'}}/>
      </div>
    );
  }

}

export default CurbMap
