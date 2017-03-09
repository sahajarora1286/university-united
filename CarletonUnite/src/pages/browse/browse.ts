import { Component } from '@angular/core';
import { Platform, Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { Course } from '../../course-model';
import {CoursePage} from '../course/course';
import Parse from 'parse';
import ParseObject from 'parse';
import {LoginPage} from '../login/login'
import {ProfilePage} from '../profile/profile'
import {MyProfilePage} from '../my-profile/my-profile'
import { Http, Headers, Request, RequestOptions, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map'
import { HTTP } from 'ionic-native';
import {Firebase} from 'ionic-native';
import {ChatPage} from '../chat/chat';
import { Device } from 'ionic-native';



/*
  Generated class for the Browse page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'browse',
  templateUrl: 'browse.html'
})
export class BrowsePage {
  browse: string = "browseCourses";
  courses: any[];
  currentUser;
  query;
  subscription;
  users;
 

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      public alrtCtrl: AlertController,
       public events: Events,
        public http: Http,
          public platform: Platform) {
    //this.tempInitPushNotification();
    //this.initPushNotification();
    this.initFirebase();
    this.getCourses(null);
    this.liveQueryMessages();
    
  }

  initFirebase(){
    var me = this;

      Firebase.getToken()
        .then(token => {
          me.saveTokenToServer(token, me);
          console.log(`The token is ${token}`);
          //me.events.publish('toast:event', {message: "Token is: " + token, timer: 5000, position: 'bottom'});
          Firebase.onNotificationOpen()
            .subscribe((res) => {
              console.log(res);
               
              // let title = notification.title;

              // me.alrtCtrl.create({
              //   title: "Notification tapped",
              //   message: JSON.stringify(res),
              //   buttons: ['Ok']
              // }).present();
                let fromName = res.fromName;
                let fromId = res.fromId;
                  let text = res.text;
                if (res.tap == null || res.tap == true) {
                  var toUser;
                  var query = new Parse.Query(Parse.User);
                  query.get(fromId, {
                    success: function(result){
                      toUser = result;
                      me.navCtrl.push(ChatPage, {
                        user: toUser
                      });
                      //me.events.publish('toast:event', {message: "Take user to chat page", timer: 4000, position: 'top'});
                    }, error: function(result, error){
                      me.events.publish('toast:event', {message: "Error fetching PN user: " + error.message, timer: 4000, position: 'bottom'});
                    }
                  })
                  
                     
                    // this else if is for foreground mode
                } else if (res.tap == false) {
                  me.events.publish('toast:event', {message: fromName + " says: " + text, timer: 5000, position: 'top'});
                }
            });
        }) // save the token server-side and use it to push notifications to this device
        .catch(error => {
          console.error('Error getting token', error);
         // me.events.publish('toast:event', {message: "Error getting token: " + error, timer: 5000, position: 'bottom'});
        }).then(function(result){
          
        });


        

        // me.platform.resume.subscribe(() => {
        //   Firebase.onNotificationOpen()
        //     .subscribe((res) => {
        //       console.log(res);
               
        //       // let title = notification.title;

        //       // me.alrtCtrl.create({
        //       //   title: "Notification tapped",
        //       //   message: JSON.stringify(res),
        //       //   buttons: ['Ok']
        //       // }).present();
        //         let fromName = res.fromName;
        //           let text = res.text;
        //         if (res.tap) {
                  
        //           me.events.publish('toast:event', {message: "Take user to chat page", timer: 4000, position: 'top'});
                    
        //             // this else if is for foreground mode
        //         } else if (!res.tap) {
        //           me.events.publish('toast:event', {message: fromName + ": " + text, timer: 5000, position: 'top'});
        //         }
        //     });
        // });
        
      
      }

      saveTokenToServer(token, me){
    var query = new Parse.Query("DeviceToken");
    query.equalTo("token", token);
    query.find({
      success: function(results){
        if (results.length == 0) {
          var DeviceTokenParse = Parse.Object.extend("DeviceToken");
          var deviceToken = new DeviceTokenParse(token);

          deviceToken.set("token", token);
          deviceToken.set("user", me.currentUser);
          deviceToken.set("platform", Device.platform);
          deviceToken.save({
            success: function(result){
              console.log("Token saved to server.");
            }, error: function(result, error){
              console.error(error.message);
              //me.events.publish('toast:event', {message: "Couldnt save token to server: " + error.message, timer: 5000, position: 'top'});
            }
          });

        } else {
          //update the token
          var deviceToken = results[0];
          deviceToken.set("token", token);
          deviceToken.set("user", me.currentUser);

          deviceToken.save({
            success: function(result){
              console.log("Token updated");
            }, error: function(result, error){
              console.error(error.message);
              //me.events.publish('toast:event', {message: "Couldnt update token to server: " + error.message, timer: 5000, position: 'top'});
            }
          });
        }
      }
    }).then(function(results){
      Firebase.onTokenRefresh()
        .subscribe((token: string) => {

          me.updateToken(token, me);
          console.log(`Got a new token ${token}`)
          //me.events.publish('toast:event', {message: "New Token received: " + token, timer: 5000, position: 'bottom'});
        });
    });

    

  }

  updateToken(token, me){
    var query = new Parse.Query("DeviceToken");
    query.equalTo("token", token);
    query.find({
      success: function(results){
        if (results.length == 0) {
          var DeviceTokenParse = Parse.Object.extend("DeviceToken");
          var deviceToken = new DeviceTokenParse(token);

          deviceToken.set("token", token);
          deviceToken.set("user", me.currentUser);
          deviceToken.set("platform", Device.platform);
          deviceToken.save({
            success: function(result){
              console.log("Token saved to server.");
            }, error: function(result, error){
              console.error(error.message);
              //me.events.publish('toast:event', {message: "Couldnt save token to server: " + error.message, timer: 5000, position: 'top'});
            }
          });

        } else {
          //update the token
          var deviceToken = results[0];
          deviceToken.set("token", token);
          deviceToken.set("user", me.currentUser);

          deviceToken.save({
            success: function(result){
              console.log("Token updated");
            }, error: function(result, error){
              console.error(error.message);
              //me.events.publish('toast:event', {message: "Couldnt update token to server: " + error.message, timer: 5000, position: 'top'});
            }
          });
        }
      }
    });
  }


  liveQueryMessages(){
    var me = this;

    me.currentUser = Parse.User.current();
    //var Message = Parse.Object.extend("Message");
    this.query = new Parse.Query("Message");
    //this.query.descending("createdAt");
    this.query.include("from");
    this.query.include("to");
    console.log("Searching for " + me.currentUser.get("name"));
    this.query.equalTo('to', me.currentUser);

    return this.query.find({
      success: function(results){
        me.subscription = me.query.subscribe(this.query);
    
    

     me.subscription.on('create', (message) => {
      console.log(message.get('text'));
      console.log(message.get("from").get("name"));
      console.log(message.get("from"));

      me.events.publish("toast:event", {message: message.get("from").get("name") + 
      ": " + message.get("text"), timer: 5000, position: 'top'});
     
     // me.messages.unshift(message);

      //console.log(me.messages);

    });
      }, error: function(results, error){
        console.log(error);
      }
    }).then(function (result){
      
    }, function(error){
      console.log(error);
    });
    
  }

  refresh(refresher){
    var me = this;
    if (me.browse == "browseCourses") me.getCourses(refresher);
    else me.getUsers(refresher);
  }

  goToUser(user){
    var me = this;
    var currentUser = Parse.User.current();
   
    if (user.id == currentUser.id){
      me.navCtrl.push(MyProfilePage);
    } else {
      me.navCtrl.push(ProfilePage, {
        user: user
      });
    }
  }

  getUsers(refresher){
    var me = this;
    var query = new Parse.Query(Parse.User);
    query.find({
      success: function(results){
        me.users = results;

        if (refresher!=null){
          refresher.complete();
        }
      }, error: function(results, error){
        me.events.publish("toast:event", {message: error.message, timer: 4000, position: 'bottom'});
      }
    });
  }

  goToCourse(course){
    this.navCtrl.push(CoursePage, {
      course: course
    });
  }

  logOut(){
    Parse.LiveQuery.close();
    this.events.publish("eventLogout");
  }

  

  sendPush(){
    console.log("Send Push clicked!");
     var me = this;

    var deviceTokens = [];
    var query = new Parse.Query("DeviceToken");
    query.equalTo("user", "FAXrCDeZjI");
    return query.each(function(token){
      if (token)
      deviceTokens.push(token.get("token"));
    },{
      success: function(token){
        
      }, error: function(result, error){
        console.log(error.message);
      }
    }).then(function(result){
      var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZGMzODkzYy0zZjdiLTRjY2QtOTJmNi05ZjAzOTQ0MDllOGIifQ.egmtxFrf_JN8ycvrUMUEZogYC3qm_rXyt_SylIIePww";
    var url= "https://api.ionic.io/push/notifications";
    // var headers = {
    //   'Authorization': 'Bearer ' + token,
    //   'Content-Type': 'application/json'
    // }

    let headers = new Headers({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    });
  
    let options = new RequestOptions({headers: headers});
    this.http.post(url, {profile: 'testprofile', notification: {message: 'Congratulations push worked Sahaj!'},
     tokens: deviceTokens}, options).map(res => res.json()).subscribe(data => {
      console.log(data);
        me.events.publish("toast:event", {message: data.data.success, timer: 5000, position: 'bottom'});
    }, error =>{
      console.log(error);
      me.events.publish("toast:event", {message: error.message, timer: 5000, position: 'bottom'});
    });

    }, function(error){
      console.log(error);
    });

    // var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZGMzODkzYy0zZjdiLTRjY2QtOTJmNi05ZjAzOTQ0MDllOGIifQ.egmtxFrf_JN8ycvrUMUEZogYC3qm_rXyt_SylIIePww";
    // var url= "https://api.ionic.io/push/notifications";
    // // var headers = {
    // //   'Authorization': 'Bearer ' + token,
    // //   'Content-Type': 'application/json'
    // // }

    // let headers = new Headers({
    //   'Authorization': 'Bearer ' + token,
    //   'Content-Type': 'application/json'
    // });
  
    // let options = new RequestOptions({headers: headers});
    // this.http.post(url, {profile: 'testprofile', notification: {message: 'This notification worked brother!'},
    //  send_to_all: true}, options).map(res => res.json()).subscribe(data => {
    //   console.log(data);
    //     me.events.publish("toast:event", {message: data.data.success, timer: 5000, position: 'bottom'});
    // }, error =>{
    //   console.log(error);
    //   me.events.publish("toast:event", {message: error.message, timer: 5000, position: 'bottom'});
    // });

   
    
          
  }

  // initPushNotification(){
  //   if (!this.platform.is('cordova')) {
  //     console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
  //     return;
  //   }

  //   this.push.register().then((t: PushToken) => {
  //     return this.push.saveToken(t);
  //   }).then((t: PushToken) => {
  //     console.log('Token saved:', t.token);
  //   }); 

  //   this.push.rx.notification()
  //     .subscribe((msg) => {
  //       alert(msg.title + ': ' + msg.text);
  //   }, (err) =>{
  //     console.log(err);
  //   });
  // }

  // tempInitPushNotification(){
  //   if (!this.platform.is('cordova')) {
  //     console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
  //     return;
  //   } else {
  //   var me = this;
  //   this.push.register().then((t: PushToken) => {
  //     return this.push.saveToken(t);
  //   }).then((t: PushToken) => {
  //     me.events.publish('toast:event', {message:"Trying to save token to parse: " + t.token, timer:5000, position: "bottom"});
  //     var DeviceTokenParse = new Parse.Object.extend("DeviceToken");
  //     var token = new DeviceTokenParse();
  //     token.set("tokenId", t.id);
  //     token.set("token", t.token);
  //     token.set("type", t.type);
  //     token.set("registered", t.registered);
  //     token.set("saved", t.saved);
  //     token.set("user", me.currentUser);

  //     token.save({
  //       success: function(result){

            
  //         me.alrtCtrl.create({
  //           title: "Token created",
  //           message: "Token saved to Parse",
  //           buttons: ['Ok']
  //         }).present();

  //         console.log('Token saved to Parse:', result);
  //         //me.sendPush();
  //       }, error: function(result, error){
  //         me.alrtCtrl.create({
  //           title: "Token could not be created",
  //           message: error.message,
  //           buttons: ['Ok']
  //         }).present();

        
  //       }
  //     });
      
  //   }); 

  //   me.push.rx.notification()
  //           .subscribe((msg) => {
  //             alert(msg.title + ': ' + msg.text);
  //           }, (error)=>{
  //             console.log(error);
  //           });


  //   }
  // }


  addCourseToMyCourses(courseToAdd: Course) {
    //var course: Course = new Course();
   // course.code = courseToAdd.code;
   console.log("Adding course: " + courseToAdd);
   var me=this;
    var CourseParse = Parse.Object.extend("Course");
    var course = new CourseParse(courseToAdd);

    var user = Parse.User.current();
    console.log("Current user:" + user.toJSON());
    var relation = user.relation("courses");
    relation.add(course);
    user.save({
      success: function(user){

        me.events.publish("toast:event", {message: "Course Added to My Courses ", timer: 2000, position: 'top'});
        /*
        me.alrtCtrl.create({
          title: "Added to My Courses",
          message: "Course added to My Courses.",
          buttons: [{
            text: 'Okay'
          }]
        }).present();
        */
      }, 
      error: function(error){
        me.alrtCtrl.create({
          title: "Could not add",
          message: error.message,
          buttons: ['Okay']
        }).present();
      }
    });

    
  }

  getCourses(refresher){

    var me = this;
    var Course = Parse.Object.extend("Course");
    var query = new Parse.Query(Course);
    
    query.find({
      success: function(results) {
        // Do stuff
        var jsonArray = [];

        for(var i = 0; i < results.length; i++) {
           jsonArray.push(results[i].toJSON());
        } 

        console.log(jsonArray);
        me.courses = jsonArray;

        if (refresher!=null){
          refresher.complete();
        }
      },
      error: function(error){
        console.log(error.message);
      }
    });
  }

}
