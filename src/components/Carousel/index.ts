import { CarouselRoot } from './CarouselRoot';
import { Items } from './Items';
import { Item } from './Item';

export * from './CarouselRoot';
export * from './hooks';

export const Carousel = Object.assign(CarouselRoot, { Items, Item });
