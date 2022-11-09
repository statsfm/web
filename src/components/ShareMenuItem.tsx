import { useToaster } from '@/hooks';
import { MdIosShare } from 'react-icons/md';
import { Menu } from './Menu';

interface Props {
  path: string;
}

export const ShareMenuItem = ({ path }: Props) => {
  const toaster = useToaster();

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(`${window.location.protocol}//${window.location.host}${path}`)
      .then(() => toaster.message('Link copied to clipboard'))
      .catch((e) => toaster.error(`Error occurred: ${e}`));
  };

  return (
    <Menu.Item onClick={handleShareClick} icon={<MdIosShare />}>
      Share
    </Menu.Item>
  );
};
