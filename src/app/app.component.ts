import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet,CommonModule,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn = false;  // Flag to indicate if the user is logged in
 //isEmployer = false;  // Flag to check if the logged-in user is an employer
 userInfo: any;


  constructor() {
   // this.checkLoginStatus();  // Check login status on initialization
   const userData= localStorage.getItem('jobLoginUser');
   if(userData == null)
   {
    this.isLoggedIn=false;
    this.userInfo = {}; 
   } else{
    this.isLoggedIn=true;
    this.userInfo = JSON.parse(userData);
   }
}
  /**
   * Checks if the user is logged in and if the logged-in user is an employer.
   */
  // checkLoginStatus() {
  //   const authToken = localStorage.getItem('jobLoginUser');
  //   if (authToken) {
  //     this.isLoggedIn = true;
  //     const decodedToken = this.decodeJWT(authToken);
  //     if (decodedToken && decodedToken.role === 'Employer') { // Assuming the role is in the JWT token payload
  //       this.isEmployer = true;
  //     }
  //   }
  // }
   /**
   * Decodes the JWT token and returns the payload.
   */
  //  decodeJWT(token: string) {
  //   const payload = token.split('.')[1]; // JWT has 3 parts: header, payload, and signature
  //   const decoded = atob(payload);  // Decode the base64 encoded payload
  //   return JSON.parse(decoded);  // Parse the decoded payload as JSON
  // }

  /**
   * Logs the user out by clearing the authToken from localStorage.
   */
  logoff() {
    localStorage.removeItem('jobLoginUser');
    localStorage.removeItem('employerId');
    localStorage.removeItem('jobSeekerId');

    this.isLoggedIn = false;
   // this.isEmployer = false;
  }
}