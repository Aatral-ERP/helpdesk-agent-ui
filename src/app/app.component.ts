import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = environment.title;
  favIcon: HTMLLinkElement = document.querySelector('#favIconId');
  constructor(private titleService: Title) {
    this.titleService.setTitle(environment.title);
    this.favIcon.href = environment.logourl;
  }



}

