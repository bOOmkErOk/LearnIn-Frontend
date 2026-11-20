import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Register } from '../../../store/auth/auth.actions';

@Component({
  imports: [],
  selector: 'app-register',
  styleUrl: './register.scss',
  templateUrl: './register.html',
})
export class RegisterComponent {

  private store = inject(Store);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;


  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  OnSubmit() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.registerForm.getRawValue();

    this.store.dispatch(new Register(credentials)).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
      }
    })

  }

}
