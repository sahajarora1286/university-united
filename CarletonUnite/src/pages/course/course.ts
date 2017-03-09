import { Component } from '@angular/core';
import { Events, NavController, NavParams, AlertController } from 'ionic-angular';
import { Course } from '../../course-model';
import { Topic } from '../../topic-model';
import {LoginPage} from '../login/login'
import {ProfilePage} from '../profile/profile'
import {MyProfilePage} from '../my-profile/my-profile'
import Parse from 'parse';
import ParseObject from 'parse';


@Component({
  selector: 'course',
  templateUrl: 'course.html'
})

export class CoursePage {

   course: Course;
   topics: any;
   posters: any[];
   flag = 0;
   counter = 0;
   

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public alrtCtrl: AlertController, public events: Events) {
    this.course = navParams.get("course");
    this.getTopics(null);
    this.counter = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
  }

  viewProfile(topic){
    var me = this;
    var user = topic.get("poster");
    var currentUser = Parse.User.current();
   
    if (user.id == currentUser.id){
      me.navCtrl.push(MyProfilePage);
    } else {
      me.navCtrl.push(ProfilePage, {
        user: user
      });
    }
    
  }

  logOut(){
    this.events.publish("eventLogout");
  }

  showAddDialog(){
    this.alrtCtrl.create({
      title: "Post Topic",
      message: "Post a Topic in this Course Room to start a discussion for.",
      inputs: [{
        name: 'name',
        placeholder: 'Enter topic name'
      }, {
        name: 'description',
        placeholder: "Enter brief description"
      }],
      buttons: [{
        text: "Cancel"
      }, {
        text: "Post",
        handler: data => {
            var me=this;
            var user = Parse.User.current();     
            console.log("Current user: " + user.get("username"));

            var TopicParse = Parse.Object.extend("Topic");
           // var topicToAdd:Topic = new Topic(data.name, data.description);
           
            let topicToAdd : Topic = {
              name: data.name,
              description: data.description
            };

            var topic = new TopicParse(topicToAdd);
            var CourseParse = Parse.Object.extend("Course");
            var course = new CourseParse(me.course);
            topic.set("course", course);
            topic.set("poster", user);
            topic.save({
              success: function(result){
                console.log("Topic saved");
                
                console.log("Course to update is " + course.toJSON());
                
                course.fetch({
                  success: function(result){
                  var relation = course.relation("topics");  
                  console.log("Course relation is: " + relation);         
                  relation.add(topic);
                
                    course.save({
            success: function(user){
              console.log("Course updated.");
              
              me.events.publish("toast:event", {message: "Topic posted!", timer: 2000, position:'top'});
              me.getTopics(null);

            }, 
            error: function(result, error){
              console.log("Could not update course");
              console.log(error);
              me.alrtCtrl.create({
              title: "Alert",
              message: "Could not post topic. Please try again later. "+error.message,
              buttons: ['Okay']
            }).present();
            }
          });
                  }, error: function(result, error){
                    console.log("Could not fetch course");
              console.log(error);
              me.alrtCtrl.create({
              title: "Alert",
              message: "Could not post topic. Please try again later. "+error.message,
              buttons: ['Okay']
            }).present();
                  }
                });
                

              }, error: function(error){
                me.alrtCtrl.create({
              title: "Alert",
              message: "Could not post topic. Please try again later. "+error.message,
              buttons: ['Okay']
            }).present();
              }
            });

            
      }
      }]
    }).present();
  }

  getTopics(refresher) {
    var me = this;
    //var Course = Parse.Object.extend("Course");
    var CourseParse = Parse.Object.extend("Course");
    var course = new CourseParse(me.course);
    course.fetch({
        success: function(result) {
            var relation = course.relation("topics");
			      var query = relation.query();
            query.descending("createdAt");
          	query.include("poster");
            query.find({
                success: function(topics) {
                    // list contains the topics of this room
                    me.topics = topics;

                    if (refresher!=null){
                      refresher.complete();
                    }
                },
                error: function(result, error) {
                    me.alrtCtrl.create({
                        title: "Alert",
                        message: "Could not post topic. Please try again later. " + error.message,
                        buttons: ['Okay']
                    }).present();
                }
            });
        }
    });

}


  

  goBack(){
    this.navCtrl.pop();
  }

  addCourseToMyCourses(courseToAdd: Course) {
    //var course: Course = new Course();
   // course.code = courseToAdd.code;
   var me=this;
    var CourseParse = Parse.Object.extend("Course");
    var course = new CourseParse(courseToAdd);

    var user = Parse.User.current();
    console.log("Current user:" + user.toJSON());
    var relation = user.relation("courses");
    relation.add(course);
    user.save({
      success: function(user){
        me.alrtCtrl.create({
          title: "Add to My Courses",
          message: "Course added to My Courses.",
          buttons: [{
            text: 'Okay'
          }]
        }).present();
      }, 
      error: function(error){
        me.alrtCtrl.create({
          title: "Already exists",
          message: "This course already exists in your Courses list.",
          buttons: ['Okay']
        }).present();
      }
    });

    
  }

}
