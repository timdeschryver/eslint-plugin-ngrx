import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/component-store/updater-explicit-return-type'
import { ruleTester } from '../utils'

const setup = `
  import type { SelectConfig } from '@ngrx/component-store'
  import { Projector } from '@ngrx/component-store'
  import { ComponentStore } from '@ngrx/component-store'

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
    `${setup}

    export class MoviesStore extends ComponentStore<MoviesState> {
      constructor() {
        super({movies: []});
      }

      readonly addMovie = this.updater((state, movie): MoviesState => ({ movies: [...state.movies, movie] }));
    }`,
    `${setup}

    export class MoviesStore extends ComponentStore<MoviesState> {
      constructor() {
        super({movies: []});
      }

      readonly addMovie = this.updater<Movie>((state, movie): MoviesState => ({ movies: [...state.movies, movie] }));
    }`,
    `${setup}

    export class MoviesStore {
      constructor(private readonly store: ComponentStore<MoviesState>) {}

      readonly addMovie = this.store.updater<Movie>((state, movie): MoviesState => ({
        movies: [...state.movies, movie],
      }));
    }`,
    `${setup}

    export class MoviesStore {
      readonly addMovie: Observable<unknown>

      constructor(customStore: ComponentStore<MoviesState>) {
        this.addMovie = customStore.updater<Movie>((state, movie): MoviesState => ({
          movies: [...state.movies, movie],
        }));
      }
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        ${setup}

        export class MoviesStore extends ComponentStore<MoviesState> {
          constructor() {
            super({movies: []});
          }

          readonly addMovie = this.updater((state, movie) => ({ movies: [...state.movies, movie] }));
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
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

          readonly addMovie = this.updater<Movie | null>((state, movie) => movie ? ({ movies: [...state.movies, movie] }) : ({ movies }));
                                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        ${setup}

        export class MoviesStore {
          constructor(private readonly store: ComponentStore<MoviesState>) {}

          readonly addMovie = this.store.updater((state, movie) => ({ movies: [...state.movies, movie] }));
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        ${setup}

        export class MoviesStore {
          readonly addMovie: Observable<unknown>

          constructor(customStore: ComponentStore<MoviesState>) {
            this.addMovie = customStore.updater<Movie>((state, movie) => ({ movies: [...state.movies, movie] }));
                                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   [${messageId}]
          }
        }
      `,
    ),
  ],
})
