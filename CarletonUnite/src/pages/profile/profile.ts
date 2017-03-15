import { Component } from '@angular/core';
import { Events,NavController, NavParams, AlertController } from 'ionic-angular';
import {ChatPage} from '../chat/chat';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  user;
  imgSrc;
  constructor(public navCtrl: NavController,
              public alrtCtrl: AlertController,
              public navParams: NavParams,
              public events: Events) {

                  this.user = navParams.get("user");
                  this.imgSrc = this.user.get("profilePic");
                  if (this.imgSrc == null) this.imgSrc="assets/images/person.png";
                 // var parseUser = Parse.User.find(user);
                  console.log("User is " + this.user.get("name"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  openChat(){
    this.navCtrl.push(ChatPage, {
      user: this.user
    });
  }

  logOut(){
    this.events.publish("eventLogout");
  }

}
