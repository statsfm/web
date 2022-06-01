import { FC, LiHTMLAttributes } from 'vue';

interface Props extends LiHTMLAttributes {}

const Chip: FC<Props> = (props, { slots }) => (
  <li class="h-max w-max rounded-full bg-bodySecundary px-4 py-2 font-medium text-white" {...props}>
    {slots.default && slots.default()}
  </li>
);

export default Chip;
