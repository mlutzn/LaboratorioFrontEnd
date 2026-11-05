import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './producto-list.component.html',
  styleUrl: './producto-list.component.css'
})
export class ProductoListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  auth = inject(AuthService);

  productos: Producto[] = [];
  categorias = new Map<number, string>();
  errorMessage = '';

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    forkJoin({
      productos: this.productoService.getAll(),
      categorias: this.categoriaService.getAll()
    }).subscribe({
      next: ({ productos, categorias }) => {
        this.productos = productos;
        this.categorias = new Map(categorias.map((c) => [c.id!, c.nombre]));
      },
      error: () => (this.errorMessage = 'No se pudieron cargar los productos')
    });
  }

  categoriaNombre(id: number): string {
    return this.categorias.get(id) ?? '—';
  }

  eliminar(producto: Producto): void {
    if (!confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return;

    this.errorMessage = '';
    this.productoService.delete(producto.id!).subscribe({
      next: () => this.cargar(),
      error: () => (this.errorMessage = 'No se pudo eliminar el producto')
    });
  }
}