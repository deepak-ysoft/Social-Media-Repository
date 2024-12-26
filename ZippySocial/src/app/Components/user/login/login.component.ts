import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserLocalStorageService } from '../../../Services/userLocalStorage.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  submitted = false;
  localStorageService = inject(UserLocalStorageService);

  onLoginForm: FormGroup = new FormGroup({
    email: new FormControl('Deepak@gmail.com', [
      Validators.required,
      Validators.pattern(
        /^[a-zA-Z]{5,}[a-zA-Z0-9._%+-]*@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/
      ),
    ]),
    password: new FormControl('Deepak@123', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
  });

  constructor(private authService: UserService, private router: Router) {
    localStorage.clear();
    this.submitted = false;
  }

  login() {
    this.submitted = true;
    debugger;
    this.authService.loginService(this.onLoginForm.value).subscribe({
      next: (response: any) => {
        this.authService.storeToken(response.token.token);
        debugger;
        this.localStorageService.setUser(response);
        this.router.navigate(['index']);
      },
      error: (err: any) => {
        // Handle validation errors from the server
        if (err.status === 400) {
          const validationErrors = err.error.errors;
          for (const field in validationErrors) {
            const formControl = this.onLoginForm.get(
              field.charAt(0).toLowerCase() + field.slice(1)
            );
            if (formControl) {
              formControl.setErrors({
                serverError: validationErrors[field].join(' '),
              });
            }
          }
        }
      },
    });
  } // show server side error if client-side not working
  shouldShowError(controlName: string): boolean {
    const control = this.onLoginForm.get(controlName);
    return (
      (control?.invalid &&
        (control.touched || control.dirty || this.submitted)) ??
      false
    );
  }
}
