import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../user-model';
import { Signup2Page } from '../signup2/signup2'
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map'
import Parse from 'parse'


@Component({
  selector: 'signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  user: User = {
    name: "",
    email: "",
    password: ""
  };

  confirmPassword: string;
  url: string;
  headers: Headers;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  public alertCtrl: AlertController, public http: Http, public events: Events) {
    this.headers = new Headers();
    this.headers.append("X-Parse-Application-Id", "carletonunite1286");
    this.headers.append("X-Parse-REST-API-Key", "restAPIKey");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  goToLogin(){
    this.navCtrl.pop();
  }

  next(){
    if (!this.user.name || !this.user.email || !this.user.password || this.confirmPassword.length==0){
      this.events.publish("toast:event", {message: "Please fill all fields.", timer: 3000, position:'top'});
      return;
    }

    if (this.user.password != this.confirmPassword){
      this.events.publish("toast:event", {message: "Passwords do not match.", timer: 3000, position:'top'});

      return;
    }

    

    this.navCtrl.push(Signup2Page, {
      user: this.user
    });
  

  }

}
