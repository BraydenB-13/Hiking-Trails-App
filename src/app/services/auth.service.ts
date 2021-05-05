import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { catchError, map, mergeAll } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$;
  usersRef;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.usersRef = this.db.collection('users');
    this.user$ = this.firebaseAuth.authState.pipe(
      map((authState) => {
        return this.db
          .doc(`users/${authState.uid}`)
          .valueChanges()
          .pipe(catchError(this.errorHandler));
      })
    );
  }

  getUserObservable(): Observable<any> {
    return this.user$.pipe(mergeAll());
  }

  signOut(): void {
    this.firebaseAuth.signOut().then(() => {
      this.router.navigate(['']);
    });
  }

  private errorHandler(error) {
    console.log(error);
    return throwError(error);
  }

  async login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const user = await this.firebaseAuth.signInWithPopup(provider);
    if (user.additionalUserInfo.isNewUser) {
      const newUser = {
        displayName: user.user.displayName,
        email: user.user.email,
        phoneNumber: user.user.phoneNumber,
        photoURL: user.user.photoURL,
        providerId: user.additionalUserInfo.providerId,
        savedNews: [],
        uid: user.user.uid,
      };
      this.usersRef.doc(newUser.uid).set(newUser);
    }
    if (user) {
      this.router.navigate(['tabs/tab1']);
    }
  }
}
