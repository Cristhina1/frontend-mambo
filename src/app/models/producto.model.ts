export interface Producto {
  id: number;
  nombre: string;
  categoria?: string;    // ✅ opcional si quieres que pueda estar vacío
  precio: number;
  stock: number;
  descripcion?: string;
  imagenUrl?: string;    // ✅ opcional si no siempre hay imagen
}
