import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.css'
})
export class CategoriaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  get esEdicion(): boolean {
    return this.id !== null;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.getById(this.id).subscribe({
        next: (categoria) => this.form.patchValue(categoria),
        error: () => (this.errorMessage = 'No se pudo cargar la categoría')
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();
    const request = this.esEdicion
      ? this.service.update(this.id!, data)
      : this.service.create(data);

    request.subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: () => (this.errorMessage = 'No se pudo guardar la categoría')
    });
  }
}