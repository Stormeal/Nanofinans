import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';


import * as firebase from 'firebase';
import * as faker from 'faker';


import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter, shareReplay } from 'rxjs/operators';
import { User } from './user';
import { MatSnackBar } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { Person } from './customer';
import { Time } from '@angular/common';



@Injectable({ providedIn: 'root' })

export class AuthService {

  user$: Observable<User>;
  employeeUser: Observable<any>;
  customerUser: Observable<any>;
  userId: string = null;
  error: string = null;
  dateAdded: string;
  customer$: Observable<any>;
  fileStings$: Observable<any>;

  customerCollection: AngularFirestoreCollection<any>;
  prenom: any;
  preserveSnapshot: true;

  genderUser: number;
  females: any;
  males: any;

  factorial = null;
  countries;




  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService,
    public snackBar: MatSnackBar,
    private toastr: ToastrService) {


    //// Get auth data, then get firestore user document || null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.userId = user.uid;
          return this.afs.doc<User>(`employees/${user.uid}`).valueChanges()
            .pipe(shareReplay(1));
        } else {
          return of(null);
        }
      })
    );
  }



  //// Email/Password Auth ////
  emailLogin(email, pass) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pass)
      .then(credential => {
        this.showSuccess();
        // this.updateUserData(credential.user);
        console.log(credential.user);
        this.userId = credential.user.uid;
        this.router.navigate(['/home']);
        // return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));

  }


  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.notify.update('Welcome new user!', 'success');
        this.router.navigate(['/employees']);
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => this.handleError(error));
  }

  newEmailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        this.updateUserData(credential.user);
        this.signOut();
      }).catch(error => this.handleError(error));
  }

  // Get Data
  getEmployee() {
    this.employeeUser = this.afs.doc(`employees/${this.userId}`).valueChanges()
      .pipe(shareReplay(1));
    console.log('GET CALL ON USER ', this.userId, this.employeeUser);
    return this.employeeUser;
  }

  getCustomer(id: string) {

    return this.afs.doc<any>(`customers/${id}`);
    // this.customerUser = this.afs.doc(`customers/${this.userId}`).valueChanges();
    // console.log('GET CALL ON CUSTOMER ', this.userId, this.customerUser);
    // return this.customerUser;
  }

  getData() {
    this.customer$ = this.afs.collection('customers', ref => ref.orderBy('followers', 'desc'))
      .valueChanges();
    return this.customer$;
  }



  getFileStings() {
    this.fileStings$ = this.afs.collection('stings', ref => ref.where('status', '==', ''))
    .valueChanges();
    return this.fileStings$;
  }

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////// QUERIES /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  getMaleCustomers() {
    this.afs.collection('customers', ref => ref.where('gender', '==', 'male'))

      .valueChanges()
      .pipe(shareReplay(1))
      .subscribe(males => console.log('Male Users: ' + males.length));
  }

  getFemaleCustomers() {
    this.afs.collection('customers', ref => ref.where('gender', '==', 'female'))

      .valueChanges()
      .pipe(shareReplay(1))
      .subscribe(females => console.log('Female Users: ' + females.length));
  }

  getTotalCustomers() {
    this.afs.doc('aggregation/users').valueChanges()
      .pipe(shareReplay(1))
      .subscribe(cus => console.log('Customer Infos: ', cus));

  }

  getTotalStings() {
    this.afs.doc('aggregation/stings').valueChanges()
      .pipe(shareReplay(1))
      .subscribe(sting => console.log('Sting Info: ', sting));
  }

  getCountries() {
    this.afs.collection('aggregation/users/countries')
      .valueChanges();
  }


  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////// QUERIES /////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////


  // Returns true if user is logged in
  isLoggedIn() {
    if (this.userId == null) {
      return false;
    } else {
      return true;
    }

  }
  // Test

  // Reset user password

  public resetPassword(email: string) {
    const auth = this.afAuth.auth;
    return auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }


  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/'])
        .catch(function () {
          console.log('Got an error: ' + Error);
        });
      console.log('Logged out');

    });
  }

  newSignOut() {
    this.afAuth.auth.signOut();
  }

  // If error, console log and notify user

  private handleError(error: Error) {
    this.toastr.error('Username or password was incorrect', 'Login Failed');
    // console.error(error);


  }

  // Sets user data to firestore after succesful login
  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`employees/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'nameless user',
      photoURL: user.photoURL || 'https://bit.ly/2G9BZS6', // Use new Shorter - When done delete this..
      roles: {
        analyst: true,
        approver: false,
        admin: false
      },
      dateCreated: user.dateCreated || firebase.firestore.Timestamp.now()
    };

    return userRef.set(data, { merge: true });
  }



  updateEmployee(user: User, data: any) {
    return this.afs.doc(`employees/${user.uid}`).update(data);
  }

  public deleteCustomer(uid: string) {
    return this.getCustomer(uid).delete();
  }

  newNotification(data: any) {
    const notty = {
      uid: faker.random.alphaNumeric(16)
    };


    return this.afs.collection(`notifications`).doc(notty.uid).set(data);
  }



  ///// Role-based Authorization //////

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      for (const role of allowedRoles) {
        if (user.roles[role]) {
          return true;
        }
      }
      return false;
    }


  }

  formatDate(date: Date): string {
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${year} -${month}-${day}`;
  }

  // Toastr Notification
  showSuccess() {
    this.toastr.success('Welcome to Stinger', 'Login Successfull', {
      closeButton: true
    });
  }
  showUpdate() {
    this.toastr.success('Update Successful', 'Changes have been saved.', {
      closeButton: true
    });
  }
  showError() {
    this.toastr.error('Username or password is incorrect', 'Login Failed', {
      closeButton: true
    });
  }

  // Dummy User Data Generator
  fakeNews() {
    const genders = ['female', 'male'];
    const cities = [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
      'Antigua and Barbuda', 'Argentina', 'Australia', 'Austria', 'Azerbaijan',
      'Bahamas, The', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
      'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
      'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
      'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
      'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
      'Cote d\'lvoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
      'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor Ecuador', 'Egypt',
      'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji',
      'Finland', 'France', 'Gabon', 'Cambia, The', 'Georgia', 'Greece', 'Grenada',
      'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
      'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
      'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
      'Korea, N', 'Korea, S', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
      'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
      'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
      'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
      'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
      'Mozambique', 'Myanmar', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
      'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norway', 'Oman', 'Pakistan',
      'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
      'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
      'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
      'Samoa', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
      'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
      'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden',
      'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
      'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
      'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
      'Uruguay', 'Uzbekistan', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
      'Zambia', 'Zimbabwe'
    ];
    const platform = ['Android', 'iOS'];

    const hacker = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.random.number({ min: 18, max: 60 }),
      email: faker.internet.email(),
      phrase: faker.hacker.phrase(),
      uid: faker.random.alphaNumeric(16),
      latitude: faker.address.latitude(-90, 90),
      longtitude: faker.address.longitude(-180, 180),
      avatar: faker.image.avatar(),
      dateCreatedFS: firebase.firestore.Timestamp.now(),
      dateCreated: Date.now(),
      country: faker.random.arrayElement(cities),
      countryCode: faker.address.countryCode(),
      city: faker.address.state(),
      followers: faker.random.number({ min: 1, max: 1548324 }),
      gender: faker.random.arrayElement(genders),
      platform: faker.random.arrayElement(platform)
    };

    this.afs.collection('customers').doc(hacker.uid).set(hacker);

  }

  fakeSting() {
    const type = ['3d', 'text'];

    const sting = {
      uid: faker.random.alphaNumeric(16),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatar: faker.image.avatar(),
      type: faker.random.arrayElement(type),
      dateFS: firebase.firestore.Timestamp.now(),
      dateCreated: Date.now(),
      status: 'approved',
      image: faker.image.image(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
    };

    this.afs.collection('stings').doc(sting.uid).set(sting);
  }

  fakeFileSting() {
    const type = ['file'];

    const sting = {
      uid: faker.random.alphaNumeric(16),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatar: faker.image.avatar(),
      type: faker.random.arrayElement(type),
      dateFS: firebase.firestore.Timestamp.now(),
      dateCreated: Date.now(),
      image: faker.image.abstract(),
      userName: faker.internet.userName(),
      email: faker.internet.email(),
      status: ''
    };
    this.afs.collection('stings').doc(sting.uid).set(sting);
  }

  fakeReport() {
    const genders = ['female', 'male'];
    const cities = [
      'Spain', 'Italy', 'Sweden', 'Norway', 'Denmark',
      'United States', 'United Kingdom', 'Russia',
      'Kuwait', 'France', 'Germany'
    ];
    const citiesTest = [
      'Denmark'
    ];

    const platform = ['Android', 'iOS'];

    const hacker = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      age: faker.random.number({ min: 18, max: 60 }),
      email: faker.internet.email(),
      phrase: faker.hacker.phrase(),
      uid: faker.random.alphaNumeric(16),
      latitude: faker.address.latitude(-90, 90),
      longtitude: faker.address.longitude(-180, 180),
      avatar: faker.image.avatar(),
      dateCreatedFS: firebase.firestore.Timestamp.now(),
      dateCreated: Date.now(),
      country: faker.random.arrayElement(cities),
      countryCode: faker.address.countryCode(),
      city: faker.address.state(),
      followers: faker.random.number({ min: 1, max: 1548324 }),
      gender: faker.random.arrayElement(genders),
      platform: faker.random.arrayElement(platform)
    };

    this.afs.collection('customers').doc(hacker.uid).set(hacker);
  }

  aggregateDatabase() {
    const countries = [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
      'Antigua and Barbuda', 'Argentina', 'Australia', 'Austria', 'Azerbaijan',
      'Bahamas, The', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
      'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina',
      'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
      'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
      'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
      'Cote d\'lvoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
      'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor Ecuador', 'Egypt',
      'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji',
      'Finland', 'France', 'Gabon', 'Cambia, The', 'Georgia', 'Germany', 'Greece', 'Grenada',
      'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
      'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
      'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
      'Korea, N', 'Korea, S', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
      'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
      'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
      'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
      'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
      'Mozambique', 'Myanmar', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
      'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norway', 'Oman', 'Pakistan',
      'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
      'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
      'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
      'Samoa', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone',
      'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
      'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden',
      'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo',
      'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
      'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
      'Uruguay', 'Uzbekistan', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
      'Zambia', 'Zimbabwe'
    ];
    const countriesTest = [
      'Denmark'
    ];


    countries.forEach(element => {
      const country = {
        males: 0,
        females: 0,
        totalUsers: 0,
        flag: `../../assets/images/country/${element}.png`,
        uid: element,
        stings: 0,
        malePercentage: 0,
        femalePercentage: 0,
        platform: ''
      };

      this.afs.collection('aggregation/users/countries').doc(element).set(country);

    });
  }


  worldRegions() {
    const worldRegions = [
      'Africa', 'Asia', 'Central America', 'Eastern Europe', 'European Union',
      'Middle East', 'North America', 'Oceania', 'South America', 'The Caribbean',
    ];
  }


}
