# Avoid Duplicate Actions In Reducer

> Updater should have an explicit return type

## Rule Details

To enforce that the `updater` method from `@ngrx/component-store` returns the expected state interface, we must explicitly add the return type.

Examples of **incorrect** code for this rule:

```ts
interface MoviesState {
  movies: Movie[]
}

class MoviesStore extends ComponentStore<MoviesState> {
  readonly addMovie = this.updater<Movie>((state, movie) => ({
    movies: [...state.movies, movie],
    // ⚠ this doesn't throw, but is caught by the linter
    extra: 'property',
  }))
}
```

Examples of **correct** code for this rule:

```ts
interface MoviesState {
  movies: Movie[]
}

class MoviesStore extends ComponentStore<MoviesState> {
  readonly addMovie = this.updater<Movie>(
    (state, movie): MoviesState => ({
      movies: [...state.movies, movie],
      // ⚠ this does throw
      extra: 'property',
    }),
  )
}
```
