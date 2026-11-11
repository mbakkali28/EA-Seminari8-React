### Uso de IA generativa

**Herramienta y modelo utilizado**: DeepSeek V4.1 Flash

---

### Prompts

#### Prompt 1:
- **Model**: DeepSeek V4.1 Flash
- **Prompt literal**:
  > *"Créame el estilo CSS del botón de favorito: que se vea distinto cuando el libro es favorito y cuando no, y que quede bien con los demás botones de la app."*
- **Respuesta de la IA**:
  Propuso una clase propia, `favourite-button`, con tres reglas: una base neutra y compacta, un `:hover` en el azul de la marca y una clase `active` en ámbar para el estado de favorito. El primer selector lleva delante el elemento (`button.favourite-button`) para ganar en especificidad a la regla genérica `button` del fichero y poder sobrescribir su fondo.
- **Incoherencias detectadas**:
  - Usa el nombre `active` para el estado, cuando en ese mismo `index.css` ya significa otra cosa (el botón del modo de vista que está elegido). No rompe nada porque el selector va prefijado (`button.favourite-button.active`), pero al leer el CSS el nombre confunde.
  - Los colores del estado activo van escritos a mano (`#b26a00`, `#fff8e1`) en vez de salir de variables de `:root`, como hace el resto del fichero: si se cambia la paleta, el ámbar se queda fuera del tema.
- **Solución / Adaptación manual**:
  Se pegó en `src/index.css`.

```css
button.favourite-button {
  padding: 0.25rem 0.5rem;
  border-color: var(--border);
  background: var(--surface);
  color: var(--muted);
  line-height: 1;
}

button.favourite-button:hover:not(:disabled) {
  border-color: var(--primary);
  background: #eef0fb;
  color: var(--primary);
}

/* El libro está en favoritos */
button.favourite-button.active {
  border-color: #b26a00;
  background: #fff8e1;
  color: #b26a00;
}
```

---

#### Prompt 2:
- **Model**: DeepSeek V4.1 Flash
- **Prompt literal**:
  > *"¿Cómo hago los átomos de Nanostores y cómo los conecto con los componentes?"*
- **Respuesta de la IA**:
  Se conectan con el hook `useStore`: el componente le pasa el átomo y recibe su valor, ya suscrito. La escritura no se hace desde el componente, sino con las funciones del store.

```tsx
const ids = useStore(favouriteIds);
```

---

#### Prompt 3:
- **Model**: DeepSeek V4.1 Flash
- **Prompt literal**:
  > *"Tengo que filtrar la lista de libros para quedarme solo con los favoritos y no quiero que ese filtro se recalcule en cada render. ¿Me sirve el `useMemo`?"*
- **Respuesta de la IA**:
  Guarda el resultado de un cálculo entre renders y solo lo repite cuando cambian las dependencias que se le pasan; es una caché por render, no un estado. El filtro se mete dentro del `useMemo` y se le pasan como dependencias la lista de libros y los ids guardados, así solo se repite cuando llegan datos nuevos o cambia el almacén.
- **Incoherencias detectadas**:
  El memo deja de servir si una dependencia cambia de identidad en cada render: con la función de comparación declarada dentro del componente se crearía una nueva cada vez y el filtro se recalcularía siempre. En `matchesBook` está declarada fuera del componente a propósito, y el memo depende de `[books, ids]`, que solo cambian cuando llegan datos o cambia el almacén.
- **Solución / Adaptación manual**:

```tsx
const favouriteBooks = useMemo(
  () => books.filter((book) => ids.includes(book._id)),
  [books, ids],
);
```
