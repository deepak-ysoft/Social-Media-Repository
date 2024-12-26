import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from '../../../Services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedPhoto: File | null = null;
  userService = inject(UserService);
  router = inject(Router);
  isSelectImage = false;
  submitted = false;

  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        name: [
          'Deepak saini',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-z\s]+(?: [A-Za-z0-9\s]+)*$/),
          ],
        ],
        email: [
          'Deepak123@gmail.com',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z]{5,}[a-zA-Z0-9._%+-]*@[a-zA-Z.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        password: [
          'Deepak@123',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        conPassword: ['Deepak@123', Validators.required],
        phone: [
          '6958745263',
          [
            Validators.required,
            phoneValueRangeValidator(1000000000, 999999999999),
          ],
        ],
        dOB: ['', Validators.required],
        gender: ['Male', Validators.required],
        aboutYou: ['', Validators.required],
        photo: [null], // Add this line
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get formControls() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('conPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onFileSelected(event: Event): void {
    debugger;
    this.isSelectImage = true;
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedPhoto = fileInput.files[0]; // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedPhoto);

      this.registerForm.patchValue({ photo: this.selectedPhoto.name });
    }
  }

  // Convert to a Date object
  convertToDate() {
    const inputValue = this.registerForm.get('dOB')?.value;
    if (inputValue && /^\d{2}-\d{2}-\d{4}$/.test(inputValue)) {
      const [day, month, year] = inputValue.split('-');
      const dateObject = new Date(+year, +month - 1, +day); // Create a Date object
      this.registerForm.get('dOB')?.setValue(dateObject, { emitEvent: false });
    }
  }

  onSubmit() {
    debugger;
    this.submitted = true;
    if (this.registerForm.get('photo')?.value == null) {
      this.registerForm.get('photo')?.setValue(
        new File([''], 'Default.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })
      );
    }
    if (this.registerForm.valid) {
      const formData = new FormData();
      formData.append('name', this.registerForm.value.name);
      formData.append('email', this.registerForm.value.email);
      formData.append('password', this.registerForm.value.password);
      formData.append('conPassword', this.registerForm.value.conPassword);
      formData.append('phone', this.registerForm.value.phone);
      formData.append('dOB', this.registerForm.value.dOB);
      formData.append('gender', this.registerForm.value.gender);
      if (this.selectedPhoto) {
        formData.append('photo', this.selectedPhoto);
      } else {
        // Create a File object for "Default.jpg"
        const defaultFile = new File([''], 'Default.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        formData.append('photo', defaultFile);
      }
      console.log('Form Data:', formData);

      this.userService.registerUser(formData).subscribe({
        next: (res: any) => {
          if (res.success) {
            Swal.fire({
              title: 'Done!',
              text: 'Register user successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
            this.registerForm = new FormGroup({});
            this.router.navigateByUrl('/login');
          } else if (!res.success && res.exists == 'EmailExists') {
            Swal.fire({
              title: 'Error!',
              text: 'Email already exist.',
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Somthing is wrong.',
              icon: 'error',
              timer: 2000,
              showConfirmButton: false,
            });
          }
        },
        error: (err: any) => {
          // Handle validation errors from the server
          if (err.status === 400) {
            const validationErrors = err.error.errors;
            for (const field in validationErrors) {
              const formControl = this.registerForm.get(
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
    } else {
      console.log('Form is invalid.');
    }
  }
  // show server side error if client-side not working
  shouldShowError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return (
      (control?.invalid &&
        (control.touched || control.dirty || this.submitted)) ??
      false
    );
  }
}
// Phone number validation
export function phoneValueRangeValidator(
  minValue: number,
  maxValue: number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneValue = +control.value; // Convert to a number

    if (!control.value || isNaN(phoneValue)) {
      return null; // If the field is empty or not a number, return no error
    }

    if (phoneValue < minValue) {
      return { minPhoneValue: true };
    }

    if (phoneValue > maxValue) {
      return { maxPhoneValue: true };
    }

    return null; // If within range, no error
  };
}
