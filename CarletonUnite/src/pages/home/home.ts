import { Component } from '@angular/core';
import { Events, App, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import {BrowsePage} from '../browse/browse'
import {MyProfilePage} from '../my-profile/my-profile'
import {MyCoursesPage} from '../my-courses/my-courses'
import {LoginPage} from '../login/login'
import {MessagesPage} from '../messages/messages';
import Parse from 'parse'
//import {Push, PushToken} from '@ionic/cloud-angular'
import {Firebase} from 'ionic-native';


@Component({
  selector: 'home',
 templateUrl: 'home.html'})

export class HomePage {
currentUser; query;

  browsePage = BrowsePage;
  myCoursesPage = MyCoursesPage;
  myProfilePage = MyProfilePage;
  chatPage = MessagesPage;


  constructor(
    public app: App, 
    public navCtrl: NavController, 
    public alrtCtrl: AlertController,
    public events: Events,
    public platform: Platform
  ) {

    events.subscribe('eventLogout', (data) => {
      this.logOut();
    });

    this.currentUser = Parse.User.current();

    //this.initFirebase();
    //this.tempInitPushNotification();
    

  }

  
  logOut(){
    var me = this;
    
    this.alrtCtrl.create({
        title: "Log Out",
        message: "Are you sure you want to log out?",
        buttons: [{text: 'Cancel'}, {
          text: 'Log Out',
          handler: ()=>{
            Parse.User.logOut().then(() => {

              // this will now be null
              Parse.LiveQuery.close();
              
              me.events.unsubscribe('eventLogout');
              me.navCtrl.setRoot(LoginPage);
            }).catch((error)=>{
               me.events.publish('toast:event', {message:error.message, timer:4000, position: "top"});
              console.error(error);
            });
          }
        }]
      }).present();
  }



}
