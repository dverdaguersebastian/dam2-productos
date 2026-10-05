import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton, RouterLink],
})
export class AboutPage {
  readonly githubUrl = 'https://github.com/dverdaguersebastian';
}
