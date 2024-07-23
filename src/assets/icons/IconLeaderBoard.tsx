import * as React from 'react';
import { SVGProps } from 'react';
const IconLeaderBoard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={25}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props?.fill || '#8CA3E1'}
      d='M7.42 14H4.75c-1.1 0-2 .9-2 2v5c0 .55.45 1 1 1h3.67c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1ZM14.08 10h-2.67c-1.1 0-2 .9-2 2v9c0 .55.45 1 1 1h4.67c.55 0 1-.45 1-1v-9a2 2 0 0 0-2-2ZM20.75 17h-2.67c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3.67c.55 0 1-.45 1-1v-2c0-1.1-.9-2-2-2ZM15.76 4.85c.31-.31.43-.68.33-1-.1-.32-.41-.55-.85-.62l-.96-.16c-.04 0-.13-.07-.15-.11L13.6 1.9c-.4-.81-1.31-.81-1.71 0l-.53 1.06c-.01.04-.1.11-.14.11l-.96.16c-.44.07-.74.3-.85.62-.1.32.02.69.33 1l.74.75c.04.03.07.15.06.19l-.21.92c-.16.69.1 1 .27 1.12.17.12.54.28 1.15-.08l.9-.53c.04-.03.17-.03.21 0l.89.53c.28.17.51.22.69.22.21 0 .36-.08.45-.14.17-.12.43-.43.27-1.12l-.21-.92c-.01-.05.02-.16.06-.19l.75-.75Z'
    />
  </svg>
);
export default IconLeaderBoard;
