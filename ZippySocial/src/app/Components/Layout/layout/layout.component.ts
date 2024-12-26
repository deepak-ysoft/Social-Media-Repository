import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppComponent } from '../../../app.component';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UserLocalStorageService } from '../../../Services/userLocalStorage.service';

declare var bootstrap: any;
@Component({
  selector: 'app-layout',
  imports: [AppComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  @ViewChild('addpost', { static: false }) addpost!: ElementRef;
  isLargeScreen = true; // Determines if the screen is large enough
  showSidebar = true; // Controls sidebar visibility
  loggedUser = inject(UserLocalStorageService);
  userData: any;
  userage: number = 0;
  myDialog: any;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.closeModal();
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result) => {
        this.isLargeScreen = result.matches;
        if (!this.isLargeScreen) {
          this.showSidebar = false; // Hide sidebar on smaller screens
        } else {
          this.showSidebar = true; // Show sidebar by default on larger screens
        }
      });
    this.userData = this.loggedUser.getCurrentUser();
    this.ageCalculate();
    this.myDialog = document.getElementById('addpost') as HTMLDialogElement;
  }

  addPost() {
    const modal = bootstrap.Modal.getInstance(this.addpost.nativeElement);
    modal.show();
  }
  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.addpost.nativeElement);
    modal.hide();
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
  ageCalculate() {
    debugger;
    // Ensure dOB is a Date object
    const dateOfBirth = new Date(this.userData.user.dob);

    // Check if dOB is valid
    if (isNaN(dateOfBirth.getTime())) {
      console.error('Invalid date of birth:', this.userData.user.dob);
      this.userage = 0;
      return;
    }

    // Calculate the time difference
    const timeDiff = Math.abs(Date.now() - dateOfBirth.getTime());

    // Calculate the age in years
    this.userage = Math.floor(timeDiff / (1000 * 3600 * 24 * 365.25));

    console.log(`User age: ${this.userage}`);
  }
}
