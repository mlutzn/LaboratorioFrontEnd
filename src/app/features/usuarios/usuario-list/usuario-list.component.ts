import { Component, OnInit, inject } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponent implements OnInit {
  private service = inject(UsuarioService);

  usuarios: Usuario[] = [];
  errorMessage = '';

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data) => (this.usuarios = data),
      error: () => (this.errorMessage = 'No se pudieron cargar los usuarios')
    });
  }
}