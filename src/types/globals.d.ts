import { FunctionalComponent } from 'vue';

declare module 'vue' {
  type FC<P = {}> = FunctionalComponent<P>;
}
