export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoriaId: number;
}