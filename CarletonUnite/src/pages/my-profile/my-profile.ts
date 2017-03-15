import { Component } from '@angular/core';
import { Platform, Events,NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login'
import { HomePage } from '../home/home'
import Parse from 'parse';
import { Camera, ImagePicker, File, Transfer, FilePath } from 'ionic-native';


@Component({
  templateUrl: 'my-profile.html'
})
export class MyProfilePage {
   user;
   base64Image;
   lastImage: string = null;
   imgSrc: String;
  constructor(
    public navCtrl: NavController,
    public alrtCtrl: AlertController,
    public events: Events,
    public platform: Platform
            ){
          this.user = Parse.User.current();

          if (this.user){
            //found current user
            this.imgSrc = this.user.get("profilePic");
            if (this.imgSrc == null) this.imgSrc="assets/images/person.png";
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

  openImagePicker(){
    

    // var me = this;

    // ImagePicker.getPictures({maximumImagesCount: 1}).then((result) => {
    //   console.log("Image URI: " + result);
    //   this.user.set("profilePic", result);
    //   this.user.save({
    //     success: function(result){
    //       me.events.publish('toast:event', {message:"Profile Picture updated!", timer:3000, position: "top"});
    //     }, error: function(result, error){
    //       me.events.publish('toast:event', {message:"Couldn't update profile picture: " + error.message, timer:5000, position: "bottom"});
    //     }
    //   });
    // }, (err) => {
    //   me.events.publish('toast:event', {message:"Couldn't update profile picture: " + err.message, timer:5000, position: "bottom"});
    //   console.log(err.message);
    //   console.log(err);
    //  });
    
    
    var me = this;
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType     : Camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: Camera.MediaType.PICTURE,
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      allowEdit: true
  }).then((imageData) => {
    // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.user.set("profilePic", this.base64Image);
      this.user.save({
        success: function(result){
          me.imgSrc = me.base64Image;
          me.events.publish('toast:event', {message:"Profile Picture updated!", timer:3000, position: "top"});
        }, error: function(result, error){
          me.events.publish('toast:event', {message:"Couldn't update profile picture: " + error.message, timer:5000, position: "bottom"});
        }
      });
  }, (err) => {
      console.log(err);
  }); 
    
  }



  
}
