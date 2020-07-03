import { Component, OnInit } from '@angular/core';

import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
import { Badge } from '@ionic-native/badge/ngx';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private badge: Badge) {}

  ngOnInit() {
    console.log('Initializing HomePage');

    this.badge.isSupported().then((result) => {
      alert('isSupported: ' + result);

      this.badge.requestPermission().then((res) => {
        alert('requestPermission: ' + result);

        this.badge.hasPermission().then((r) => {
          alert('hasPermission: ' + result);
          this.badge.set(10);
        });
      });
    });

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: PushNotificationToken) => {
      alert('Push registration success, token: ' + token.value);
      console.log('Push registration success, token: ' + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
      alert('Push received: ' + JSON.stringify(notification));
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
      alert('Push action performed: ' + JSON.stringify(notification));
    });
  }
}
