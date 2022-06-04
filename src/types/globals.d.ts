import { FunctionalComponent } from 'vue';

declare module 'vue' {
  type FC<P = {}> = FunctionalComponent<P>;
}

declare module "@vue/runtime-dom" {
  interface ImgHTMLAttributes extends HTMLAttributes {
      loading?: "lazy" | "eager" | "auto";
  }
}