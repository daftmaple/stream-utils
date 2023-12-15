import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { LastFmResponse, getImage } from "../utils/lastfm";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const LASTFM_API_KEY: string = import.meta.env.VITE_LASTFM_API_KEY ?? "";

const widgetStyle =
  "w-[32rem] absolute top-3 left-3 rounded bg-gray-500/75 p-3";

export function Lastfm() {
  const { username = "daftmaple" } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["lastfm"],
    queryFn: () =>
      fetch(
        `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=2`
      ).then((res) => res.json() as Promise<LastFmResponse>),
    enabled: LASTFM_API_KEY.length > 0,
    refetchInterval: 5 * 1000,
    refetchOnWindowFocus: false,
  });

  if (data) {
    const lastTrack = data.recenttracks.track[0];

    const isNowPlaying = !!lastTrack["@attr"]?.nowplaying;
    const imageUrl = getImage(lastTrack.image, "extralarge");

    return (
      <div className={clsx(widgetStyle, "flex flex-row gap-2")}>
        <img
          src={imageUrl["#text"]}
          alt={lastTrack.name}
          className="h-32 w-32"
        />
        <div className="flex flex-col text-slate-100">
          <p className="text-md mb-2">
            {isNowPlaying ? "Now Playing" : "Last Playing"}
          </p>
          <p className="text-xl font-bold">{lastTrack.name}</p>
          <p className="text-xl font-semibold">{lastTrack.artist["#text"]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(widgetStyle, "text-slate-100")}>
      {error ? (
        <>Failed to fetch from Lastfm</>
      ) : isLoading ? (
        <>Loading...</>
      ) : (
        <>
          Missing <code>LASTFM_API_KEY</code>
        </>
      )}
    </div>
  );
}
