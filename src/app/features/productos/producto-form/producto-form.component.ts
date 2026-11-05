import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProductoService } from '../../../core/services/producto.service';
import { Categoria } from '../../../core/models/categoria.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id: number | null = null;
  categorias: Categoria[] = [];
  errorMessage = '';

  form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    cantidad: [0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    categoriaId: [0, [Validators.required, Validators.min(1)]]
  });

  get esEdicion(): boolean {
    return this.id !== null;
  }

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => (this.categorias = data),
      error: () => (this.errorMessage = 'No se pudieron cargar las categorías')
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.productoService.getById(this.id).subscribe({
        next: (producto) => this.form.patchValue(producto),
        error: () => (this.errorMessage = 'No se pudo cargar el producto')
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.getRawValue();
    const request = this.esEdicion
      ? this.productoService.update(this.id!, data)
      : this.productoService.create(data);

    request.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: () => (this.errorMessage = 'No se pudo guardar el producto')
    });
  }
}