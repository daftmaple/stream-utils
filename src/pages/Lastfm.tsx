import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useParams, useSearchParams } from "react-router-dom";
import { LastFmResponse, getImage } from "../utils/lastfm";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const LASTFM_API_KEY: string = import.meta.env.VITE_LASTFM_API_KEY ?? "";
const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0";

const baseWidgetStyle = "w-[32rem] absolute top-3 rounded bg-gray-500/75 p-3";

export function Lastfm() {
  const { username = "daftmaple" } = useParams();
  const [searchParams] = useSearchParams();

  // API call refetch interval. Minimum 1 second
  const refetchInterval = Math.max(
    Number(searchParams.get("refetchInterval")) || 5,
    1
  );

  const { isLoading, error, data } = useQuery({
    queryKey: ["lastfm"],
    queryFn: () =>
      fetch(
        `${LASTFM_API_URL}/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=2`
      ).then((res) => res.json() as Promise<LastFmResponse>),
    enabled: LASTFM_API_KEY.length > 0,
    refetchInterval: refetchInterval * 1000,
    refetchOnWindowFocus: false,
  });

  const widgetStyle = clsx(baseWidgetStyle, {
    ...{ "left-3": true },
    ...(searchParams.get("align") && {
      "left-3": searchParams.get("align") === "left",
      "right-3": searchParams.get("align") === "right",
    }),
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
