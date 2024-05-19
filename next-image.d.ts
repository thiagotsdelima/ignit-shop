// types/next-image.d.ts
import 'next/image';

declare module 'next/image' {
  interface ImageProps {
    fetchpriority?: string;
  }
}

