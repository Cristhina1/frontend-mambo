export interface Producto {
    id: number;
    nombre: string;
    categoriaNombre: string;
    precio: number;
    stock: number;
    descripcion: string;
    img: string;
    estadoStock?: string;
}
