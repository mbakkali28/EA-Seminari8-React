import { useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { Link } from 'react-router-dom';

import { useApiList } from '../hooks/useApiList';
import { useListControls } from '../hooks/useListControls';
import type { Book } from '../models';
import { bookService } from '../services/book.service';
import { favouriteIds } from '../stores/favourites';
import { formatPrice, languageName } from '../utils/format';
import { FavouriteButton } from './FavouriteButton';
import { Pagination } from './Pagination';

// Libros que se ven en cada página de la tabla
const PAGE_SIZE = 4;

// Me quedo con los libros cuyo título, ISBN o descripción contiene lo que se ha escrito.
function matchesBook(book: Book, text: string) {
  return (
    book.title.toLowerCase().includes(text) ||
    book.isbn.toLowerCase().includes(text) ||
    (book.description?.toLowerCase().includes(text) ?? false)
  );
}

// Me quedo con los libros cuyo título, ISBN o descripción contiene lo que se ha escrito
function authorNames(book: Book) {
  return book.authors.length > 0 ? book.authors.map((author) => author.name).join(', ') : null;
}

export function FavouritesList() {
  const ids = useStore(favouriteIds);
  const { items: books, loading, error } = useApiList(bookService.getBooks);

  // Si se desmarca uno, desaparece de la lista
  const favouriteBooks = useMemo(
    () => books.filter((book) => ids.includes(book._id)),
    [books, ids],
  );

  const { search, setSearch, page, setPage, totalPages, pageItems } = useListControls(
    favouriteBooks,
    matchesBook,
    PAGE_SIZE,
  );

  return (
    <>
      <div className="page-header">
        <h1>Favoritos</h1>
      </div>

      {error && <p className="alert">{error}</p>}

      {loading && <p className="muted">Cargando...</p>}

      {!loading && !error && favouriteBooks.length === 0 && (
        <p className="muted">
          Todavía no hay favoritos. Abre <Link to="/books">Libros</Link> y pulsa el botón de
          favorito del libro que quieras guardar aquí.
        </p>
      )}

      {!loading && !error && favouriteBooks.length > 0 && (
        <>
          <div className="toolbar">
            <input
              className="search"
              type="search"
              placeholder="Buscar entre tus favoritos"
              aria-label="Buscar entre tus favoritos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th></th>
                <th>Título</th>
                <th>Autores</th>
                <th>Idioma</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img
                      className="cover"
                      src={`https://picsum.photos/seed/${book._id}/60/80`}
                      alt={`Portada de ${book.title}`}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{authorNames(book) ?? <span className="muted">Sin autores</span>}</td>
                  <td>{languageName(book.language)}</td>
                  <td>{formatPrice(book.price)}</td>
                  <td className="actions">
                    <Link className="button secondary" to={`/books/${book._id}/edit`}>
                      Editar
                    </Link>
                    <FavouriteButton bookId={book._id} />
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td className="empty" colSpan={6}>
                    Ningún favorito coincide con "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </>
  );
}
