export class user {
  id?: number;
  name: string;
  email: string;
  password: string;
  conPassword: string;
  phone: string;
  dOB: Date;
  gender: string;
  imagePath?: string;
  AboutYou: string;
  photo?: File;

  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.conPassword = '';
    this.phone = '';
    this.dOB = new Date();
    this.gender = '';
    this.AboutYou = '';
  }
}
