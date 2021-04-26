import { Component } from '@angular/core';
import { SavedNewsService } from '../services/saved-news.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  savedNews;
  user$;

  constructor(private savedNewsService: SavedNewsService) {
    this.user$ = this.savedNewsService.getSavedNews();
    this.user$.subscribe((user$) => {
      user$.subscribe((user) => {
        this.savedNews = user.savedNews;
      });
    });
  }

  ngOnInit() {}

  unsaveArticle(article) {
    this.savedNewsService.addSavedNews(
      {
        title: article.title,
        url: article.url,
        urlToImage: article.urlToImage
      }
    )
    this.user$.subscribe((user$) => {
      user$.subscribe((user) => {
        this.savedNews = user.savedNews;
      });
    });
  }
}
