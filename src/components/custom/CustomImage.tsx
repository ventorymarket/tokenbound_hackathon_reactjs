import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';
import logo from '../../../public/images/default.webp';

export interface ICustomImageProps extends ImageProps {
  defaultImage?: string;
}

const CustomImage = ({
  src,
  defaultImage,
  alt = 'error',
  ...props
}: ICustomImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc || logo}
      onError={() => {
        setImgSrc(defaultImage || logo);
      }}
      alt={alt}
      quality={100}
      sizes='(max-width: 1024px) 70vw, (max-width: 640px) 50vw, 100vw'
      {...props}
    />
  );
};

export default CustomImage;
