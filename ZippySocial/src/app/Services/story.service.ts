import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Story } from '../Models/story.model';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  http = inject(HttpClient);
  constructor() {}

  AddStory(story: FormData) {
    return this.http.post(`https://localhost:7071/api/User/CreateStory`, story);
  }

  getStories() {
    return this.http.get(`https://localhost:7071/api/User/GetStoryes`);
  }
}
