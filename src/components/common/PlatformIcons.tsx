'use client';

import type { SVGProps } from "react";

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="#FF0000" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

export function SpotifyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="#1DB954" {...props}>
      <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.3-2.1-10.5-1.1a.75.75 0 1 1-.3-1.5c4.5-1 8.4-.6 11.5 1.3.4.2.5.7.3 1zm1.5-3.3a.94.94 0 0 1-1.3.3c-3.2-2-8-2.5-11.8-1.4a.94.94 0 1 1-.5-1.8c4.3-1.3 9.6-.7 13.3 1.6.4.3.5.9.3 1.3zm.1-3.4c-3.8-2.3-10.2-2.5-13.8-1.4a1.13 1.13 0 1 1-.6-2.2c4.2-1.3 11.2-1 15.6 1.6a1.13 1.13 0 0 1-1.2 1.9z" />
    </svg>
  );
}

export function CifraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="#F4A300" {...props}>
      <path d="M12 3a1 1 0 0 0-1 1v9.3a4 4 0 1 0 2 3.4V7h5a1 1 0 1 0 0-2h-6z" />
    </svg>
  );
}

export function LyricsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="#5C6BC0" {...props}>
      <path d="M4 4h16v2H4zM4 9h16v2H4zM4 14h10v2H4zM4 19h16v2H4z" />
    </svg>
  );
}
