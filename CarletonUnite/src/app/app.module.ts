import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { Signup2Page } from '../pages/signup2/signup2';
import { HomePage } from '../pages/home/home';
import { BrowsePage } from '../pages/browse/browse';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { MyCoursesPage } from '../pages/my-courses/my-courses';
import {CoursePage} from '../pages/course/course';
import {ProfilePage} from '../pages/profile/profile';
import {ChatPage} from '../pages/chat/chat';
import {MessagesPage} from '../pages/messages/messages';
import {CloudService} from '../providers/cloud-service';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';


// const cloudSettings : CloudSettings = {
//   'core':{
//     'app_id': '6890dedd'
//   },
//   'push': {
//     'sender_id': '602775050072',
//     'pluginConfig': {
//       'ios': {
//         'badge': true,
//         'sound': true
//       }, 
//       'android': {
//         'iconColor': '#343434'
//       }
//     }
//   }
// };



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage, Signup2Page,
    HomePage,
    BrowsePage, MyProfilePage, MyCoursesPage,
    CoursePage, ProfilePage, ChatPage, MessagesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom'
    })
  //  CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage, Signup2Page,
    HomePage,
    BrowsePage, MyProfilePage, MyCoursesPage,
    CoursePage, ProfilePage, ChatPage, MessagesPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CloudService]
})
export class AppModule {}
