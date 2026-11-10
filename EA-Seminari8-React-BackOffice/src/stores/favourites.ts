import { atom } from 'nanostores';

const STORAGE_KEY = 'favourites';

// Los favoritos son ids de libro.
function readFavourites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string'))];
  } catch {
    return []; // Si no hay nada, devolvemos vacio
  }
}

export const favouriteIds = atom<string[]>(readFavourites());

// Guardar estado de favoritos
favouriteIds.listen((ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
  }
});

// Toggle para añadir o quitar de favoritos
export function toggleFavourite(id: string) {
  const ids = favouriteIds.get();
  favouriteIds.set(ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id]);
}

export function isFavourite(id: string): boolean {
  return favouriteIds.get().includes(id);
}
