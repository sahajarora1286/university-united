import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { LoginPage } from '../login/login'
import Parse from 'parse';
/*
  Generated class for the Signup2 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'signup2',
  templateUrl: 'signup2.html'
})
export class Signup2Page {
  user: User = {
    name: "",
    email: "",
    password: "",
    major: ""
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public events: Events, public alertCtrl: AlertController) {
    this.user = navParams.get("user");
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup2Page');
  }

  signUp(){
    if (!this.user.major){
      this.events.publish('toast:event', {message:"Please enter your Major", timer:2000, position: "top"});
      return;
    }
    var me = this;
    var user = new Parse.User();
    user.set("username", this.user.email);
    user.set("password", this.user.password);
    user.set("email", this.user.email);
    user.set("name", this.user.name);
    user.set("major", this.user.major);

  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
      me.events.publish('toast:event', {message:"Account Created. Please Login.", timer:2000, position: "bottom"});
      me.navCtrl.setRoot(LoginPage);
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      me.alertCtrl.create({
        title: "Error",
        message: error.code + error.message + ". Please try again.",
        buttons: ['OK']
      }).present();
    }
  });
  }

}
