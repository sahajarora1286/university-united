import { Component } from '@angular/core';
import { Events , NavController, NavParams, AlertController } from 'ionic-angular';
import { Course } from '../../course-model';
import { CoursePage } from '../course/course'
import Parse from 'parse';
import ParseObject from 'parse';

import {LoginPage} from '../login/login'

import {CloudService} from '../../providers/cloud-service';

/*
  Generated class for the Browse page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'my-courses',
  templateUrl: 'my-courses.html'
})
export class MyCoursesPage {

  courses: any[];

 

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
      public alertCtrl: AlertController,
      public cloudService: CloudService,
      public events: Events
  ) {
    this.getCourses(null);
  }

  ionViewWillEnter() {
    this.getCourses(null);
  }

  goToCourse(course){
    this.navCtrl.push(CoursePage, {
      course: course
    });
  }

  getCourses(refresher){

    var me = this;
    //var Course = Parse.Object.extend("Course");
    var user = Parse.User.current();
    console.log("Current user:" + user.toJSON());
    var relation = user.relation("courses");
    relation.query().find({
      success: function(results) {
      // list contains the posts that the current user likes.
      var jsonArray = [];

        for(var i = 0; i < results.length; i++) {
           jsonArray.push(results[i].toJSON());
        } 

        console.log(jsonArray);
        me.courses = jsonArray;

        if (refresher!=null){
          refresher.complete();
        }
      }
    });
    
  }

  logOut(){
    this.events.publish("eventLogout");
  }


  deleteCourse(courseToDelete){
    var CourseParse = Parse.Object.extend("Course");
    var course = new CourseParse(courseToDelete);
    var me = this;
    var user = Parse.User.current();
    console.log("Current user:" + user.toJSON());
    var relation = user.relation("courses");
    relation.remove(course);
    user.save({
      success: function(result){
        me.getCourses(null);
      }
    });
    
    
  }

}
