import { Component } from '@angular/core';

import { Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { SignupPage } from '../signup/signup'
import { HomePage } from '../home/home'
import { Course } from '../../course-model';
import Parse from 'parse';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user: User = {
    email: "",
    password: ""
  };

  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    public events: Events
  ) {
    
  }


  goToSignUp(){
    this.navCtrl.push(SignupPage);
  }

  


  login(){
    let me = this;
    if (!(this.user.email && this.user.password)){
      me.events.publish('toast:event', {message:"Please check username or password and retry.", timer:4000, position: "bottom"});
      // this.alertCtrl.create({
      //   title: "Error",
      //   message: "Please check username or password and retry.",
      //   buttons: ['OK']
      // }).present();
      return;
    }
    Parse.User.logIn(this.user.email, this.user.password, {
      success: function(user) {
        // Do stuff after successful login.
        me.events.publish('toast:event', {message:"Welcome!", timer:2000, position: "top"});
        me.navCtrl.setRoot(HomePage);
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        me.events.publish('toast:event', {message:error.message, timer:5000, position: "bottom"});
        // console.log(error);
        // me.alertCtrl.create({
        //     title: "Error",
        //     message: error.message,
        //     buttons: ['OK']
        // }).present();
      }
    });
  }
}
