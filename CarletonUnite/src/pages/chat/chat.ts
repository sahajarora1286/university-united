import { Component, ViewChild } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import Parse from 'parse';
import { Http, Headers, Request, RequestOptions, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map'

/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
 
})
export class ChatPage {
  messages: any;
  
  text: string;
  currentUser; toUser; query;
  chat;
  content;
  chatQuery;
  subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public events: Events, public http: Http) {
               
    var me = this;
    
    me.currentUser = Parse.User.current();
    me.toUser = navParams.get("user");

    //me.messages = [];

    

    
  }

  checkForChat(){
    var chatFound = false;
    var me = this;
    var chatQuery = new Parse.Query("Chat");
    chatQuery.equalTo("userCount", 2);
    chatQuery.include("users");
    chatQuery.include("messages");
    chatQuery.equalTo("users", me.currentUser);


    return chatQuery.each(function (chat){
      var users = chat.get("users");
      console.log("Users are: ");
      console.log(users);

       var relation = chat.relation("users");
       var relQuery = relation.query();
       //relQuery.containedIn("users", [me.toUser]);

       return relQuery.find({
        success: function(results){
          // console.log("Users relation query returned: ");
          // console.log(results);
          // console.log("Iterating through loop");

          if (results[0].id == me.toUser.id || results[1].id == me.toUser.id){
            chatFound = true;
            me.chat = chat;
          }

        }, error: function(results, error){
          console.log(error.message);
        }
      });
      
    }, {success: function(results){
      
    }, error: function(results, error){
      console.log(error.message);
    }}).then(
      function(result){
        if (chatFound == false){
          console.log("No chats found");
          me.createNewChat(me);
        } else {
          me.getMessages();
          console.log("chat found!")
          console.log(me.chat);
          
        }
      }, function(error){
        console.log(error.message);
      }
    );
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  // ionViewDidEnter(){
  //   this.autoScroll();
  // }

  ionViewDidEnter(){
    var me = this;
    me.messages = [];
    this.chatQuery = new Parse.Query("Message");
    this.chatQuery.include("from");
    this.chatQuery.include("to");
    this.chatQuery.equalTo('to', me.currentUser);
   // console.log("To user is");
   // console.log(me.toUser); 
    this.subscription = this.chatQuery.subscribe(this.chatQuery);
    this.subscription.on('create', (message) => {
      console.log("Message received.");
      console.log(message.get("from"));
      console.log("Message to: ");
      console.log(message.get("to"));
     if (message.get("from").id == me.toUser.id){
      //  console.log("Message received.");
      // console.log(message.get("from"));
      // console.log(me.currentUser);
      console.log("About to save message to messages list.");
      me.messages.push(message);
      me.scrollList(me);
      //console.log(message.get("from"));
     // me.events.publish("toast:event", {message: "Message received: " + message.get("text"), timer: 5000, position: 'top'});
      console.log(me.messages);
     }

    });

    me.checkForChat();
  }

  scrollList(me){
    me.autoScroll();
  }

  autoScroll(){
    setTimeout(function () {
        var itemList;
        itemList = document.getElementById("chat-autoscroll");
      
        itemList.scrollTop = itemList.scrollHeight;
        
    }, 15);

    // var itemList;
    //     itemList = document.getElementById("chat-autoscroll");
    //     while (!itemList){
    //       itemList = document.getElementById("chat-autoscroll");
    //     }
    //     itemList.scrollTop = itemList.scrollHeight;
  }

  getMessages(){
    var me = this;
    

    me.chat.fetch({
      success: function(result){
        //me.messages = me.chat.get("messages");
        me.chat = result;
        var relation = me.chat.relation("messages");
        var relQuery = relation.query();
        relQuery.include("from");
        relQuery.include("to");
        relQuery.include("text");
        relQuery.include("chat");
        relQuery.ascending("createdAt");
        relQuery.find({
      success: function(results){
            me.messages = results;
            me.scrollList(me);
            console.log(results);
      }, error: function(results, error){
            console.log(error.message);
      }
    });
      }, error: function(result, error){
        console.log(error.message);
      }
    });
    
    me.scrollList(me);
    

  }

  sendMessage(){
    var me = this;
    console.log("Send button clicked");
    if (!me.text) return;
    
    var MessageParse = Parse.Object.extend("Message");
          var message = new MessageParse();
          message.set("from", me.currentUser);
          message.set("to", me.toUser);
          message.set("text", me.text);
          message.set("chat", me.chat);
          // me.text = "";
          // me.messages.push(message);
          message.save({
            success: function(result){
              me.text = "";
              me.messages.push(message);
              me.scrollList(me);
              me.chat.fetch({
                success: function(result){
                  console.log("chat is ");
                  console.log(me.chat);
                  console.log("about to make relation");
                  var relation = me.chat.relation("messages");
                   console.log("about toadd message to relation");
                   console.log("message is");
                   console.log(message);
                  relation.add(message);
                  console.log(relation);
                  console.log("message added. check relation");
                  me.chat.save({
                  success: function(result){
                    me.sendPush(message, me);
                    me.scrollList(me);
                     console.log("Message added to chat");
                      console.log(result);
                    }, error: function(result, error){
                      console.log(error);
                      console.log(error.message);
        
                    }
                  });            
                }, error: function(result, error){
                  console.log(error.message);
                }
              });
              
              
            }, error: function(result, error){
                console.log("Couldn't send message");
                console.log(error);
                console.log(error.message);
        
            }
          });

  }

  sendPush(message, me){
    //me.events.publish("toast:event", {message: "About to query for tokens ", timer: 2000, position: 'top'});
    var query = new Parse.Query("DeviceToken");
    query.equalTo("user", me.toUser);
    query.include("user");
    query.first({
      success: function(result){
        //me.events.publish("toast:event", {message: "Sending to token of " + result.get("user").get("name"), timer: 5000, position: 'top'});
        var apiKey = "AAAARH22jPU:APA91bECgqTWd41P0Em0lbAXHr3G_MhJ7HliBp_AO3OAcpbbsSd9yIiYksVfsDbABEyKExz3QsJy6zfkIJ8wj3SHUm-KP0ZqdXoEhxmXn0WbQ_wLn3gnrSfjlZRSTQj_QG0uMchKOZo-";
    var url= "https://fcm.googleapis.com/fcm/send";
    // var headers = {
    //   'Authorization': 'Bearer ' + token,
    //   'Content-Type': 'application/json'
    // }

    let headers = new Headers({
      'Authorization': 'key=' + apiKey,
      'Content-Type': 'application/json'
    });
  
    let options = new RequestOptions({headers: headers});
    //me.events.publish("toast:event", {message: "About to make http post req ", timer: 3000, position: 'top'});
    me.http.post(url, {to: result.get("token"), notification: {title: me.currentUser.get("name"), body: message.get("text"), sound: "default"
                }, data: {fromName: me.currentUser.get("name"), fromId: me.currentUser.id + "", text: message.get("text")}}, options).map(res => res.json()).subscribe(data => {
      console.log(data);
        //me.events.publish("toast:event", {message: "Notification sent: " + data.data.success, timer: 5000, position: 'bottom'});
    }, error =>{
      console.log(error);
      //me.events.publish("toast:event", {message: error.message, timer: 5000, position: 'bottom'});
    });
      }, error: function(error){

      }
    });

    
  }

  createNewChat(me){
   
    var ChatParse = new Parse.Object.extend("Chat");
    var chat = new ChatParse();
    chat.set("userCount", 2);
    //message.set("chat", chat);
    //var msgRelation = chat.relation("messages");
    //msgRelation.add(message);

    var usersRelation = chat.relation("users");
    usersRelation.add(me.currentUser);
    usersRelation.add(me.toUser);

    chat.save({
      success: function(result){
        me.chat = chat;
        me.getMessages();
        console.log("New Chat Created.");
        console.log(result);
      }, error: function(error){
        console.log(error);
        
      }
    });
  }

}
