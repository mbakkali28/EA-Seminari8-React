import { useStore } from '@nanostores/react';
import { favouriteIds, toggleFavourite } from '../stores/favourites';

interface FavouriteButtonProps {
  bookId: string;
}

// Botón de favorito,
export function FavouriteButton({ bookId }: FavouriteButtonProps) {
  const ids = useStore(favouriteIds);
  const isFavourite = ids.includes(bookId);

  const label = isFavourite ? 'Quitar de favoritos' : 'Añadir a favoritos';

  return (
    <button
      type="button"
      className={isFavourite ? 'favourite-button active' : 'favourite-button'}
      aria-pressed={isFavourite}
      aria-label={label}
      onClick={() => toggleFavourite(bookId)}
    >
      <span aria-hidden="true">{isFavourite ? 'F' : 'f'}</span>
    </button>
  );
}
