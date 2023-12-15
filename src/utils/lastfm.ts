export interface LastFmResponse {
  recenttracks: Recenttracks;
}

interface Recenttracks {
  track: Track[];
  "@attr": RecenttracksAttr;
}

interface RecenttracksAttr {
  user: string;
  totalPages: string;
  page: string;
  total: string;
  perPage: string;
}

interface Track {
  artist: Album;
  streamable: string;
  image: LastFmImage[];
  mbid: string;
  album: Album;
  name: string;
  "@attr"?: TrackAttr;
  url: string;
  date?: DateClass;
}

interface TrackAttr {
  nowplaying: "true";
}

interface Album {
  mbid: string;
  "#text": string;
}

interface DateClass {
  uts: string;
  "#text": string;
}

type LastFmImageSize = "small" | "medium" | "large" | "extralarge";

interface LastFmImage {
  size: LastFmImageSize;
  "#text": string;
}

export function getImage(images: LastFmImage[], size: LastFmImageSize) {
  const imageFiltered = images.filter((image) => image.size === size);

  return imageFiltered[0] ?? images[0];
}
