export class post {
  id: number;
  username: string;
  content: string;
  imageUrl?: string; // Optional for image posts
  createdAt: string;
  constructor() {
    (this.id = 0), (this.username = '0');
    this.content = '';
    this.createdAt = '';
  }
}
