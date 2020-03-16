import { Component, NgZone } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Geocoder, ReverseGeocoder } = Plugins;
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { dayStyle } from '../map-styles'
import { nightStyle } from '../night-map-styles';
import { Platform } from '@ionic/angular';

// import { google } from "google-maps";

// declare var google : google;
declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: any;
  pickupLat: number;
  pickupLng: number;
  deliveryLat: number;
  deliveryLng: number;
  pickupAddress: string;
  pickupCity: string;
  deliveryAddress: string;
  deliveryCity: string;
  mStyle = [];
  accuracy: number;
  speed: number;
  google: any;


  constructor(private geolocation: Geolocation,
              private callNumber: CallNumber,
              private platform: Platform,
              public zone: NgZone) {}

    isNight(){
      //Returns true if the time is between
      //7pm to 5am
      let time = new Date().getHours();
      // time = 22;
      return (time > 5 && time < 19) ? false : true;
    }
    
  async getCurrentLocation() {
    const coordinates = await this.geolocation.getCurrentPosition({enableHighAccuracy: true});
      this.pickupLat = coordinates.coords.latitude;
      this.pickupLng = coordinates.coords.longitude;
      this.accuracy = coordinates.coords.accuracy;
      this.speed = coordinates.coords.speed;
      console.log('Location' + coordinates.coords.latitude + ',' + coordinates.coords.longitude, 'Speed: ' + this.speed);
  
      if(this.isNight()){
        this.mStyle = nightStyle 
      } else { this.mStyle = dayStyle}

    this.mStyle = dayStyle; //use only day style for now

    // let location = new google.maps.LatLng(coordinates.coords.latitude, coordinates.coords.longitude);
    // this.map.animateCamera({
    //   target: location,
    //     zoom: 14,
    //     tilt: 60,
    //     bearing: 140,
    //     duration: 2000
    //   }, function () { });
    

    this.map = new google.maps.Map(document.getElementById('map'), {

      // this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: this.pickupLat, lng: this.pickupLng },
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      styles: this.mStyle,
      camera: {
        'latLng': { lat: this.pickupLat, lng: this.pickupLng },
        'tilt': 20,
        'zoom': 17,
        'bearing': 0
      }
      // zoomControl: true,
      // zoomControlOptions: {
      // position: google.maps.ControlPosition.RIGHT_CENTER
      // }

    });

    // this.marker = new google.maps.Marker({
    //   map: this.map,
    //   draggable: true,
    //   animation: google.maps.Animation.DROP,
    //   position: {lat: this.pickupLat, lng: this.pickupLng},
    //   icon: { path: google.maps.SymbolPath.CIRCLE,
    //     scale: 10
    //   }
    // });
    // this.marker.addListener('click', this.toggleBounce);
  
  
    // load online drivers
    // this.onlineDrivers = this.requestService.onlineUsers;
    // this.addMarkers(this.onlineDrivers);

  }

  

  ionViewDidEnter() {
    this.getCurrentLocation();
  }
}
