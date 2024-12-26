export class Story {
  id: number;
  storyImg?: File;
  fileType: string;
  path?: string;
  dateTime?: Date;
  userId: number;
  AboutStory: string;
  userImage: string;
  userName: string;
  constructor() {
    this.id = 0;
    this.userId = 0;
    this.fileType = '';
    this.AboutStory = '';
    this.userImage = '';
    this.userName = '';
  }
}
