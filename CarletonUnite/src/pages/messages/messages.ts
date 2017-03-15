import { Component } from '@angular/core';
import { LoadingController, Events, NavController, NavParams } from 'ionic-angular';
import Parse from 'parse';
import {ChatPage} from '../chat/chat';

/*
  Generated class for the Messages page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {

  messages;
  noMessages;
  client;
  query; currentUser;
  subscription;
  loading;
  chats;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  public events: Events, public loadingCtrl: LoadingController) {
   
 
    var me = this;
    me.loading = this.loadingCtrl.create({  
      spinner: 'hide',
      content: '<div class="circle"></div><div class="circle1"></div>',
      cssClass: 'customLoader'
    }); 

    me.loading.present();
    me.chats = [];
    me.currentUser = Parse.User.current();

    me.noMessages = "";
    this.getChats(null);

  }

  checkChats(from){
    for (var i = 0; i<this.chats.length; i++){
      if (this.chats[i].from.id == from.id){
        var tempChat = this.chats[i];
        this.chats.splice(i, 1);
        return tempChat;
      }
    }

    return null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

 
  logOut(){
    this.events.publish("eventLogout");
  }

  getChats(refresher){
    var messages = [];
    var me = this;
    var query = new Parse.Query("Chat");
    //query.descending("createdAt");
   
    query.equalTo("users", me.currentUser);

    return query.each(function(chat){
      var relation = chat.relation("messages");
      var relQuery = relation.query();
      relQuery.include("to");
      relQuery.include("from");
      relQuery.descending("createdAt");
      return relQuery.first({
        success: function(result){
          //console.log("last message is");
          //console.log(result)

          if (result){
            var from;
            var lastText;
            if (result.get("from").id == me.currentUser.id) {
              from = result.get("to"); 
              lastText = "You: " + result.get("text");
            }
            else {
              from = result.get("from");
              lastText = result.get("text");
            } 
          var newChat = {
            chat: chat,
            from: from,
            lastText: lastText
          }
          messages.push(newChat);
          }

        }, error: function(error){
          console.log(error);
        }
      });
    }, {
      success: function(result){
        
      }, error: function(result, error){
        console.log(error);
      }
    }).then(function(result){
      if (me.chats.length == 0) me.noMessages = "You have no messages.";
      else me.noMessages = "";
      me.chats = messages;
      //console.log(me.chats);
      if (refresher!=null){
            refresher.complete();
        }

        me.loading.dismiss().catch(() => {});
    }, function(error){
      console.log(error);
    });
  } 

  getMessages(refresher){
    var me = this;
    this.query = new Parse.Query('Message');
    this.query.descending("createdAt");
    this.query.include("from");
    this.query.include("to");
    //console.log("Searching for " + me.currentUser.get("name"));
    this.query.equalTo('to', me.currentUser);
    this.query.find({
      success: function(results){
        if (results.length>0) me.noMessages = "";
        else me.noMessages = "You have no messages.";
        me.messages = results;

        if (refresher!=null){
            refresher.complete();
        }
      }, error: function(error){
        console.log(error.get("error"));
        me.events.publish("toast:event", {message: error.get("error"),
      timer: 4000, position: 'top'});
        //if (refresher!=null) refresher.complete;
      }
    });
  }

  ionViewWillEnter() {

    var me = this;
    this.query = new Parse.Query('Message');
    this.query.descending("createdAt");
    this.query.include("from");
    this.query.include("to");
    this.query.include("chat");
    //console.log("Searching for " + me.currentUser.get("name"));
    this.query.equalTo('to', me.currentUser);
   // this.query.first();
    


    this.getChats(null);

    me.subscription = this.query.subscribe(this.query);
    
    

    me.subscription.on('create', (message) => {
      me.noMessages = "";
      //console.log(message.get('text'));
     // me.events.publish("toast:event", {message: "Message received: " + message.get("text"), timer: 5000, position: 'top'});
     // 
     var from;
     var toUser;
      if (message.get("from").id == me.currentUser.id){
        from = message.get("to");
      }else {
        from = message.get("from");
      }
      var chat = this.checkChats(from);
      if (chat == null){
        var newChat = {
          chat: message.get("chat"),
          from: from,
          lastText: message.get("text"),
          
        }
       
        me.chats.unshift(newChat);
      } else {
        chat.lastText = message.get("text");
        me.chats.unshift(chat);
      }

    });

    me.subscription.on('delete', (object) => {
      var me = this;
      console.log('object deleted');
      
    });
  
  }

  goToChat(toUser){
    this.navCtrl.push(ChatPage, {
      user: toUser
    });
  }

}
