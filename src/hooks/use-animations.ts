import { useCallback } from 'react';
import {
  Fit,
  Layout,
  useRive,
  Alignment,
  type FileAsset,
  type ImageAsset,
  type RiveParameters,
} from '@rive-app/react-webgl2';
import { fetchAndFitImage } from '@/utils/images/client';

interface PhotoAssetOptions {
  url?: string;
  targetWidth?: number;
  targetHeight?: number;
}

interface CustomAssetLoaders {
  photo?: PhotoAssetOptions;
}

interface UseRiveAnimationOptions
  extends Omit<RiveParameters, 'canvas' | 'src'> {
  /**
   * Name of the `.riv` file
   * The file should be placed in `public/animations`
   */
  animation: string;

  /**
   * Optional custom asset loaders.
   * Currently supports 'photo' assets, allowing you to specify
   * a URL and desired dimensions for the replacement image.
   */
  assetLoaders?: CustomAssetLoaders;
}

export const useAnimation = ({
  layout,
  animation,
  assetLoader,
  assetLoaders,
  autoplay = true,
  ...restRiveOptions
}: UseRiveAnimationOptions) => {
  const animationSrc = `/animations/${animation}`;
  const defaultLayout =
    layout ||
    new Layout({
      fit: Fit.Layout,
      alignment: Alignment.Center,
    });

  const customAssetLoader = useCallback(
    (asset: FileAsset, bytes: Uint8Array) => {
      if (
        assetLoaders?.photo &&
        assetLoaders.photo.url &&
        asset.isImage &&
        asset.name === 'photo'
      ) {
        const {
          url,
          targetWidth = 256,
          targetHeight = 256,
        } = assetLoaders.photo;
        fetchAndFitImage(url, targetWidth, targetHeight).then((image) => {
          (asset as ImageAsset).setRenderImage(image);
          if (
            typeof image === 'object' &&
            'unref' in image &&
            typeof image.unref === 'function'
          ) {
            image.unref();
          }
        });
        return true;
      }

      if (assetLoader) {
        return assetLoader(asset, bytes);
      }

      return false;
    },
    [assetLoaders, assetLoader],
  );

  const { RiveComponent } = useRive({
    autoplay,
    src: animationSrc,
    layout: defaultLayout,
    assetLoader: customAssetLoader,
    ...restRiveOptions,
  });

  return RiveComponent;
};
