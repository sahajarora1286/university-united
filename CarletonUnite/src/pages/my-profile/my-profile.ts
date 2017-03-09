import { Component } from '@angular/core';
import { Events,NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login'
import { HomePage } from '../home/home'
import Parse from 'parse';


@Component({
  templateUrl: 'my-profile.html'
})
export class MyProfilePage {
   user;
  constructor(
    public navCtrl: NavController,
    public alrtCtrl: AlertController,
    public events: Events
            ){
          this.user = Parse.User.current();

          if (this.user){
            //found current user
          } else {
            this.navCtrl.setRoot(LoginPage);
          }

          console.log(this.user.get);
          
        
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }

  logOut(){
    this.events.publish("eventLogout");
  }

  
}
