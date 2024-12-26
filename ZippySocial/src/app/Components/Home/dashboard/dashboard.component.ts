import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersListComponent } from '../../user/users-list/users-list.component';
import { CommonModule } from '@angular/common';
import { post } from '../../../Models/Post.model';
import { Story } from '../../../Models/story.model';
import { UserLocalStorageService } from '../../../Services/userLocalStorage.service';
import { UserService } from '../../../Services/user.service';
import { StoryService } from '../../../Services/story.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  clicked = false;
  isLike = false;
  stories: { [key: number]: any[] } = {};
  story!: Story;
  userLocalstorageService = inject(UserLocalStorageService);
  storyservice = inject(StoryService);
  loggedUser: any;

  constructor() {
    this.userLocalstorageService.user$.subscribe((user) => {
      this.loggedUser = user;
    });
    this.getStories();
  }
  users() {
    this.clicked = !this.clicked;
  }

  handleFileInput(event: any) {
    debugger;
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();

      formData.append('storyImg', file);
      formData.append(
        'fileType',
        file.type.startsWith('image') ? 'image' : 'video'
      );
      formData.append('userId', this.loggedUser.user.id || '');
      formData.append('userImage', this.loggedUser.user.imagePath || '');
      formData.append('userName', this.loggedUser.user.name || '');
      this.storyservice.AddStory(formData).subscribe((res: any) => {
        if (res.success) {
          this.getStories();
        }
      });
    }
  }

  getStories() {
    this.storyservice.getStories().subscribe((res: any) => {
      if (res.success) {
        this.stories = res.stories;
        debugger;
      }
    });
  }

  currentUserStories: any = null; // Current user's story collection
  currentStoryIndex: number = 0; // Track which story is being displayed

  openStory(userId: any) {
    debugger;
    const userStories = Object.values(this.stories)
      .flat() // Flatten the array of arrays
      .filter((story) => story.userId === userId);

    if (userStories) {
      this.currentUserStories = [userStories]; // Set current story as an array
      this.currentStoryIndex = 0; // Start with the first story
      console.log(
        'ssssssssssssssssssssssssssssssssssssssssssssssssssssss',
        this.currentUserStories[0][this.currentStoryIndex].fileType
      );
      this.autoAdvanceStory();
    } else {
      console.log('No stories found for this user.');
    }
  }
  autoAdvanceStory() {
    debugger;
    if (
      this.currentUserStories &&
      this.currentStoryIndex <= this.currentUserStories[0].length
    ) {
      debugger;
      const currentStory = this.currentUserStories[0][this.currentStoryIndex];

      if (currentStory.fileType === 'video') {
        // Wait for the video duration before advancing
        const video = document.createElement('video');
        video.src = currentStory.path;
        video.onloadedmetadata = () => {
          const videoTime =
            video.duration * 1000 < 30000 ? video.duration * 1000 : 30000;
          debugger;
          setTimeout(() => {
            this.currentStoryIndex++;
            this.autoAdvanceStory(); // Recursively advance to the next story
          }, videoTime); // Convert seconds to milliseconds
        };
      } else {
        // For images, wait a fixed time before advancing
        setTimeout(() => {
          this.currentStoryIndex++;
          this.autoAdvanceStory(); // Recursively advance to the next story
        }, 10000); // Wait for 5 seconds
      }
    } else {
      // Automatically close the story viewer when all stories are done
      this.closeStory();
    }
  }
  
  closeStory() {
    this.currentUserStories = null;
  }
  prevStory() {
    if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--; // Move to the previous story
    }
  }

  nextStory() {
    debugger;
    if (
      this.currentUserStories &&
      this.currentStoryIndex < this.currentUserStories.stories.length - 1
    ) {
      this.currentStoryIndex++; // Move to the next story
    } else {
      this.closeStory(); // Close the viewer when no more stories
    }
  }

  // isImage(type: string): boolean {
  //   debugger;
  //   var y = type.toLowerCase() === 'image';
  //   return y;
  // }

  // For posts==============

  posts: post[] = [
    {
      id: 1,
      username: 'User1',
      content: 'This is a post!',
      createdAt: new Date().toISOString(),
      imageUrl: 'assets/img/story-1.JPEG',
    },
    {
      id: 2,
      username: 'User2',
      content: 'Another post!',
      createdAt: new Date().toISOString(),
      imageUrl: 'assets/img/story-2.jfif',
    },
  ];

  Like() {
    this.isLike = !this.isLike;
  }

  comment() {}
  share() {}
}
