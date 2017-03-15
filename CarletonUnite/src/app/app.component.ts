import { Component } from '@angular/core';
import { Platform, ToastController, Events, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { Http, Headers, Request, RequestMethod} from '@angular/http';
import {Parse} from 'parse';
import { HTTP } from 'ionic-native';
import { Firebase } from 'ionic-native';





@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  rootPage;
  currentUser;
 

  constructor( 
    public platform: Platform,
    private toastCtrl: ToastController,
    public events: Events, public http: Http,
    public alertCtrl: AlertController 
  ) {
    let me = this;
    
    

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      Parse.initialize('carletonunite1286');
    
    Parse.serverURL = 'http://173.35.92.227:8020/carletonuniteserver';
    events.subscribe('toast:event', (data) => {
      me.presentToast(data);
    });


    this.currentUser = Parse.User.current();
    if (this.currentUser) {
       // User is already logged in
       this.rootPage = HomePage;
       
    } else {
       this.rootPage = LoginPage;
    }
    });
      
      StatusBar.styleDefault();
      Splashscreen.hide();

     
  }

  

  presentToast(data) {
    let toast = this.toastCtrl.create({
      message: data.message,
      duration: data.timer,
      position: data.position
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  
}
