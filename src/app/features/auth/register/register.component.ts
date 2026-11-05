import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function passwordsIguales(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmar = group.get('confirmPassword')?.value;
  return password === confirmar ? null : { passwordsDistintos: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  public auth = inject(AuthService);

  errorMessage = '';
  exito = false;

  form = this.fb.nonNullable.group(
    {
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    { validators: passwordsIguales }
  );

  onSubmit(): void {
    if (this.form.invalid) return;

    this.errorMessage = '';
    this.exito = false;
    const { confirmPassword, ...request } = this.form.getRawValue();

    this.auth.register(request).subscribe({
      next: () => {
        this.exito = true;
        this.form.reset();
      },
      error: (err) =>
        (this.errorMessage =
          err.status === 409
            ? 'El usuario o el correo ya está registrado'
            : 'No se pudo completar el registro')
    });
  }
}