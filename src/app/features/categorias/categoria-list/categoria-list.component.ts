import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categoria-list.component.html',
  styleUrl: './categoria-list.component.css'
})
export class CategoriaListComponent implements OnInit {
  private service = inject(CategoriaService);
  auth = inject(AuthService);

  categorias: Categoria[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.getAll().subscribe({
      next: (data) => (this.categorias = data),
      error: () => (this.errorMessage = 'No se pudieron cargar las categorías')
    });
  }

  eliminar(categoria: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return;

    this.errorMessage = '';
    this.service.delete(categoria.id!).subscribe({
      next: () => this.cargar(),
      error: (err) =>
        (this.errorMessage =
          err.status === 409
            ? 'No se puede eliminar: la categoría tiene productos asociados'
            : 'No se pudo eliminar la categoría')
    });
  }
}