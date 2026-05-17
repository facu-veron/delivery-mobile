import { create } from 'zustand';

import { Producto } from '@/shared/types/comercio.types';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoState {
  comercioId: string | null;
  items: ItemCarrito[];
  agregar: (comercioId: string, producto: Producto) => void;
  quitar: (productoId: string) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  limpiar: () => void;
  total: () => number;
}

export const useCarritoStore = create<CarritoState>()((set, get) => ({
  comercioId: null,
  items: [],

  agregar: (comercioId, producto) => {
    const { items, comercioId: currentComercioId } = get();
    // Clear cart if switching comercio
    if (currentComercioId && currentComercioId !== comercioId) {
      set({ comercioId, items: [{ producto, cantidad: 1 }] });
      return;
    }
    const existing = items.find((i) => i.producto.id === producto.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.producto.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        ),
      });
    } else {
      set({ comercioId, items: [...items, { producto, cantidad: 1 }] });
    }
  },

  quitar: (productoId) => {
    const items = get().items.filter((i) => i.producto.id !== productoId);
    set({ items, comercioId: items.length === 0 ? null : get().comercioId });
  },

  cambiarCantidad: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().quitar(productoId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      ),
    });
  },

  limpiar: () => set({ comercioId: null, items: [] }),

  total: () => get().items.reduce((sum, i) => sum + i.producto.precio * i.cantidad, 0),
}));
