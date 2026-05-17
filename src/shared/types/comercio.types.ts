export interface Comercio {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  direccion: string;
  zona: string;
  activo: boolean;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  disponible: boolean;
  categoriaId: string;
}

export interface CategoriaProductos {
  id: string;
  nombre: string;
  productos: Producto[];
}

export interface ComercioDetalle extends Comercio {
  categorias: CategoriaProductos[];
}
