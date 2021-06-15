import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/component-store/updater-explicit-return-type'
import { ruleTester } from '../utils'

const setup = stripIndent`
  import { ComponentStore } from "@ngrx/component-store";

  interface Movie {
    readonly genre: string;
    readonly title: string;
  }

  interface MoviesState {
    readonly movies: readonly Movie[];
  }
`
ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    {
      code: stripIndent`
        ${setup}

        export class MoviesStore extends ComponentStore<MoviesState> {
          constructor() {
            super({movies: []});
          }

          readonly addMovie = this.store.updater((state, movie): MoviesState => ({  movies: [...state.movies, movie] }));
        }
      `,
    },
    {
      code: stripIndent`
        ${setup}

        export class MoviesStore extends ComponentStore<MoviesState> {
          constructor() {
            super({movies: []});
          }

          readonly addMovie = this.store.updater<Movie>((state, movie): MoviesState => ({  movies: [...state.movies, movie] }));
        }
      `,
    },
    {
      code: stripIndent`
        ${setup}

        export class MoviesStore extends ComponentStore<MoviesState> {
          constructor() {
            super({movies: []});
          }

          readonly addMovie = this.updater<Movie>((state, movie): MoviesState => ({
            movies: [...state.movies, movie],
          }));
        }
      `,
    },
    {
      code: stripIndent`
        ${setup}

        export class MoviesStore extends ComponentStore<MoviesState> {
          constructor() {
            super({movies: []});
          }

          readonly addMovie = this.updater<Movie>((state, movie): MoviesState => ({
            movies: [...state.movies, movie],
          }));
        }
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        ${setup}

        export class MoviesStore extends ComponentStore<MoviesState> {
          constructor() {
            super({movies: []});
          }

          readonly addMovie = this.updater((state, movie) => ({  movies: [...state.movies, movie] }));
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        ${setup}

        export class MoviesStore extends ComponentStore<MoviesState> {
          constructor() {
            super({movies: []});
          }

          readonly addMovie = this.updater<Movie>((state, movie) => ({  movies: [...state.movies, movie] }));
                                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        ${setup}

        export class MoviesStore {
          constructor(private store: ComponentStore) {}
          readonly addMovie = this.store.updater((state, movie) => ({  movies: [...state.movies, movie] }));
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        ${setup}

        export class MoviesStore {
          constructor(private store: ComponentStore) {}
          readonly addMovie = this.store.updater<Movie>((state, movie) => ({  movies: [...state.movies, movie] }));
                                                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
        }
      `,
    ),
  ],
})
