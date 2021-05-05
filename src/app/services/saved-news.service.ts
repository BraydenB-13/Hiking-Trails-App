import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { throwError, from, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SavedNewsService {
  usersRef;
  user$;
  savedNews;
  userId;

  constructor(private db: AngularFirestore, private authService: AuthService) {
    this.usersRef = this.db.collection('users');
    this.user$ = this.authService.getUserObservable();
    this.user$.subscribe((user) => {
      if (user && user.uid) {
        console.log(user);
        this.userId = user.uid;
      }
      if (user && user.savedNews) {
        this.savedNews = user.savedNews;
      }
    });
  }

  addSavedNews(save) {
    var match = false;
    if (!this.savedNews) {
      this.savedNews = [];
    }
    for (let i = 0; i < this.savedNews.length; i++) {
      if (save.url == this.savedNews[i].url) {
        match = true;
        this.savedNews.splice(i, 1);
        console.log('match');
      }
    }
    if (!match) {
      this.savedNews.push(save);
    }
    this.usersRef
      .doc(this.userId)
      .update({
        savedNews: this.savedNews,
      })
      .then(() => {
        console.log('Success on save');
      })
      .catch(this.errorHandler);
  }

  removeSave(url) {
    if (!this.savedNews) {
      this.savedNews = [];
    }
    for (let i = 0; i < this.savedNews.length; i++) {
      if (url == this.savedNews[i].url) {
        this.savedNews.splice(i, 1);
        this.usersRef
          .doc(this.userId)
          .update({
            savedNews: this.savedNews,
          })
          .then(() => {
            console.log('Success on save');
          })
          .catch(this.errorHandler);
      }
    }
  }

  getSavedNews() {
    return this.user$;
  }

  isArticleSaved(article) {
    if (this.savedNews.findIndex((a) => a.url === article.url) !== -1) {
      return true;
    }
    return false;
  }

  private errorHandler(error) {
    console.log(error);
    return throwError(error);
  }
}
