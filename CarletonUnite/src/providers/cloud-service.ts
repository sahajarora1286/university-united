import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import Parse from 'parse';

/*
  Generated class for the CloudService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CloudService {

  constructor(public http: Http) {
    console.log('Hello CloudService Provider');
  }

  login(user,pass){
    let me = this;
    return new Promise((resolve, reject) => {
      Parse.User.logIn(user, pass, {
        success: function(user) {
          resolve(user);
        },
        error: function(user, error) {
          reject(error);
        }
      });
    });
  }

  logOut(){
     return new Promise((resolve, reject) => {
        Parse.User.logOut().then(() => {
          // this will now be null
          resolve();
        }).catch((error)=>{
          reject(error);
        });
     });
  }

  getUser(){
    return Parse.User.current();
  }

}
