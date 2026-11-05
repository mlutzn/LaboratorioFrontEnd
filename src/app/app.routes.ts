import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CategoriaListComponent } from './features/categorias/categoria-list/categoria-list.component';
import { CategoriaFormComponent } from './features/categorias/categoria-form/categoria-form.component';
import { ProductoListComponent } from './features/productos/producto-list/producto-list.component';
import { ProductoFormComponent } from './features/productos/producto-form/producto-form.component';
import { UsuarioListComponent } from './features/usuarios/usuario-list/usuario-list.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'categorias', component: CategoriaListComponent, canActivate: [authGuard] },
  { path: 'categorias/nueva', component: CategoriaFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'categorias/editar/:id', component: CategoriaFormComponent, canActivate: [authGuard, adminGuard] },

  { path: 'productos', component: ProductoListComponent, canActivate: [authGuard] },
  { path: 'productos/nuevo', component: ProductoFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'productos/editar/:id', component: ProductoFormComponent, canActivate: [authGuard, adminGuard] },

  { path: 'usuarios', component: UsuarioListComponent, canActivate: [authGuard, adminGuard] },

  { path: '', redirectTo: 'categorias', pathMatch: 'full' },
  { path: '**', redirectTo: 'categorias' }
];