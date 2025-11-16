'use client';

import { useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { FaSpotify, FaTrophy, FaMusic } from 'react-icons/fa';
import { IoMusicalNotes } from 'react-icons/io5';
import { BsMusicNote, BsMusicNoteBeamed } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { CurrentlyPlaying, SpotifyAlbum, SpotifyData, SpotifyTrack } from '@/types/spotify';

const fetchCurrentTrack = async (): Promise<CurrentlyPlaying | null> => {
  try {
    const currentRes = await axios.get('/api/spotify/currently-playing');
    return currentRes.data as CurrentlyPlaying | null;
  } catch (err) {
    if (isAxiosError(err) && (err.response?.status === 403 || err.response?.status === 400)) {
      return null; // Non-Premium users or invalid requests
    }
    throw err; // Other errors
  }
};

const fetchTopAlbumData = async (): Promise<{ topAlbum: SpotifyAlbum | null; artistTrackCount: number }> => {
  let topAlbum: SpotifyAlbum | null = null;
  let artistTrackCount = 0;

  try {
    const topTrackRes = await axios.get('/api/spotify/top-track');
    const topTrack = topTrackRes.data[0] as SpotifyTrack | null;

    const topTracksRes = await axios.get('/api/spotify/top-tracks');
    const topTracks = topTracksRes.data as SpotifyTrack[];

    if (topTrack) {
      try {
        const albumRes = await axios.get(`/api/spotify/album/${topTrack.album.id}`);
        topAlbum = {
          name: albumRes.data.name,
          artists: albumRes.data.artists,
          images: albumRes.data.images,
          external_urls: albumRes.data.external_urls,
        };
      } catch (err) {
        console.warn('Failed to fetch album, using track album data:', err);
        topAlbum = {
          name: topTrack.album.name,
          artists: topTrack.artists,
          images: topTrack.album.images,
          external_urls: { spotify: topTrack.external_urls.spotify },
        };
      }

      const topArtistName = topTrack.artists[0]?.name;
      artistTrackCount = topTracks.filter((track) =>
        track.artists.some((artist) => artist.name === topArtistName)
      ).length;
    }
  } catch (err) {
    console.error('Error fetching top album data:', err);
  }

  return { topAlbum, artistTrackCount };
};

function formatTime(ms: number | null | undefined): string {
  if (!ms) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function SongCard() {
  const { data: currentTrack, isLoading: isCurrentLoading, error: currentError } = useQuery({
    queryKey: ['spotifyCurrentTrack'],
    queryFn: fetchCurrentTrack,
    refetchInterval: 1000,
    staleTime: 1000,
    retry: 2,
    retryDelay: 500,
  });

  const { data: topAlbumData, isLoading: isTopAlbumLoading, error: topAlbumError } = useQuery({
    queryKey: ['spotifyTopAlbum'],
    queryFn: fetchTopAlbumData,
    refetchInterval: 60000,
    staleTime: 60000,
    retry: 2,
    retryDelay: 500,
  });

  const [progressMs, setProgressMs] = useState<number | undefined>(undefined);
  const [bgColor, setBgColor] = useState('rgb(5, 46, 22)');
  const [showFallback, setShowFallback] = useState(false);

  const data: SpotifyData = {
    currentTrack: currentTrack ?? null,
    topAlbum: topAlbumData?.topAlbum || null,
    artistTrackCount: topAlbumData?.artistTrackCount || 0,
  };

  // useEffect(() => {
  //   console.log('Current Track Data:', {
  //     currentTrack: data.currentTrack,
  //     isPlaying: data.currentTrack?.is_playing,
  //     itemType: data.currentTrack?.item?.type,
  //     currentlyPlayingType: data.currentTrack?.currently_playing_type,
  //     itemDetails: data.currentTrack?.item
  //       ? {
  //           name: data.currentTrack.item.name,
  //           artist: data.currentTrack.item.artists[0]?.name,
  //           images: data.currentTrack.item.album?.images,
  //           external_urls: data.currentTrack.item.external_urls,
  //           duration_ms: data.currentTrack.item.duration_ms,
  //           progress_ms: data.currentTrack.progress_ms,
  //         }
  //       : { progress_ms: data.currentTrack?.progress_ms },
  //     trackDefined: !!data.currentTrack?.is_playing && 
  //       data.currentTrack?.item?.type === 'track' && 
  //       data.currentTrack?.currently_playing_type === 'track',
  //   });
  // }, [data.currentTrack]);

  useEffect(() => {
    if ((isCurrentLoading || isTopAlbumLoading) && !data.currentTrack && !data.topAlbum) {
      const timeout = setTimeout(() => {
        setShowFallback(true);
      }, 5000);
      return () => clearTimeout(timeout);
    } else {
      setShowFallback(false);
    }
  }, [isCurrentLoading, isTopAlbumLoading, data.currentTrack, data.topAlbum]);

  useEffect(() => {
    let albumImage: string | undefined;
    if (data.currentTrack?.is_playing && data.currentTrack?.item?.type === 'track') {
      albumImage = data.currentTrack.item.album.images[0]?.url;
    } else {
      albumImage = data.topAlbum?.images[0]?.url;
    }

    if (!albumImage) {
      setBgColor('rgb(5, 46, 22)');
      return;
    }

    const extractColor = async () => {
      try {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = albumImage;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          let r = 0, g = 0, b = 0;
          let pixelCount = 0;

          for (let i = 0; i < data.length; i += 20) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            pixelCount++;
          }

          r = Math.floor(r / pixelCount);
          g = Math.floor(g / pixelCount);
          b = Math.floor(b / pixelCount);

          r = Math.floor(r * 0.5);
          g = Math.floor(g * 0.5);
          b = Math.floor(b * 0.5);

          setBgColor(`rgb(${r}, ${g}, ${b})`);
        };
      } catch (error) {
        console.error('Error extracting color from cover art:', error);
        setBgColor('rgb(5, 46, 22)');
      }
    };

    extractColor();
  }, [data.currentTrack?.is_playing, data.currentTrack?.item, data.topAlbum?.images]);

  const track = data.currentTrack?.is_playing &&
    data.currentTrack?.item?.type === 'track' &&
    data.currentTrack?.currently_playing_type === 'track'
    ? {
      name: data.currentTrack.item.name,
      artist: data.currentTrack.item.artists[0].name,
      albumImage: data.currentTrack.item.album.images[0]?.url || '/musicCover.png',
      externalUrl: data.currentTrack.item.external_urls.spotify,
      progressMs: progressMs ?? data.currentTrack.progress_ms ?? 0,
      durationMs: data.currentTrack.item.duration_ms,
    }
    : null;

  const topAlbum = data.topAlbum
    ? {
      name: data.topAlbum.name,
      artist: data.topAlbum.artists[0].name,
      albumImage: data.topAlbum.images[0]?.url || '/musicCover.png',
      externalUrl: data.topAlbum.external_urls.spotify,
    }
    : null;
  const topArtistTrackCount = data.artistTrackCount;

  useEffect(() => {
    if (data.currentTrack?.is_playing && data.currentTrack?.item?.type === 'track' && data.currentTrack?.currently_playing_type === 'track') {
      setProgressMs(data.currentTrack.progress_ms ?? undefined);
      const interval = setInterval(() => {
        setProgressMs((prev) => {
          if (prev === undefined || !data.currentTrack || !data.currentTrack.item) return prev;
          const newProgress = prev + 1000;
          return newProgress <= data.currentTrack.item.duration_ms ? newProgress : prev;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setProgressMs(undefined);
    }
  }, [data.currentTrack?.is_playing, data.currentTrack?.item, data.currentTrack?.currently_playing_type]);

  return (
    <Card
      className="relative flex flex-col w-full h-full max-h-[9.3rem] rounded-lg m-0 p-2 gap-2 shadow-[inset_0px_60px_100px_-50px_#ffffff10]"
      style={{
        backgroundColor: bgColor,
        transition: 'background-color 1s ease',
      }}
    >
      <div className="text-sm flex justify-between font-medium">
        {(isCurrentLoading || isTopAlbumLoading) && !showFallback && !data.currentTrack && !data.topAlbum ? (
          // Header Skeleton
          <>
            <div className="h-3 bg-gray-600 rounded animate-pulse w-20" />
            <div className="h-4 w-4 bg-gray-600 rounded animate-pulse" />
          </>
        ) : (
          <>
            <span>
              {track
                ? 'Listening Now'
                : topAlbum && !showFallback && !currentError && !topAlbumError
                  ? 'Top Album'
                  : 'Music Rec'}
            </span>
            <span className="relative inline-block">
              {track && (
                <>
                  {/* Music notes */}
                  <FaMusic className="absolute h-1.5 w-1.5 text-green-400 opacity-0 animate-[float1_5s_ease-in-out_infinite] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <BsMusicNote className="absolute h-1.5 w-1.5 text-green-400 opacity-0 animate-[float2_5s_ease-in-out_infinite_1.25s] top-1/2 right-0 translate-x-1/2 -translate-y-1/2" />
                  <IoMusicalNotes className="absolute h-1.5 w-1.5 text-green-400 opacity-0 animate-[float3_5s_ease-in-out_infinite_2.5s] bottom-1 left-1/2 -translate-x-1/2 translate-y-1/2" />
                  <BsMusicNoteBeamed className="absolute h-1.5 w-1.5 text-green-400 opacity-0 animate-[float4_5s_ease-in-out_infinite_3.75s] top-1/2 left-0 -translate-x-1/2 -translate-y-1/2" />
                </>
              )}
              <div className="relative ">
                {track && (
                  <div className="absolute inset-0 z-0 rounded-full bg-green-500 animate-[ripple1_4s_ease-out_infinite_2s]"/>
                )}
                <FaSpotify className="relative z-10" />
              </div>
            </span>
          </>
        )}
      </div>
      <div className="flex gap-2 flex-1 min-h-0">
        <div className="relative flex items-center min-w-8 h-full aspect-square w-auto max-w-24 max-h-24">
          {(isCurrentLoading || isTopAlbumLoading) && !showFallback && !data.currentTrack && !data.topAlbum ? (
            // Loading Skeleton - only show skeleton during loading
            <div className="absolute inset-0 bg-gray-600 rounded-md animate-pulse" />
          ) : (
            // Show image when we have data or when not loading
            <Image
              src={track?.albumImage || topAlbum?.albumImage || '/musicCover.png'}
              alt="Album cover"
              fill
              className="object-cover rounded-md border transition-opacity duration-2000"
            />
          )}
        </div>
        <div className="flex flex-col justify-center min-w-0 flex-1">
          {(isCurrentLoading || isTopAlbumLoading) && !showFallback && !data.currentTrack && !data.topAlbum ? (
            // Loading Skeleton
            <>
              <div className="h-4 bg-gray-600 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-600 rounded animate-pulse w-2/3 mb-2" />
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 bg-gray-600 rounded animate-pulse w-8" />
                <div className="h-1 bg-gray-600 rounded-full animate-pulse flex-1" />
                <div className="h-2 bg-gray-600 rounded animate-pulse w-8" />
              </div>
            </>
          ) : track ? (
            <>
              <a
                href={track.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-nHassDisplay font-medium truncate hover:underline"
              >
                {track.name}
              </a>
              <div className="text-xs text-gray-400 font-SpaceGrotesk truncate">{track.artist}</div>
              <div className="flex items-center gap-2 font-SpaceGrotesk mt-1">
                <div className="text-xs text-left text-gray-400 w-8">{formatTime(track.progressMs)}</div>
                <div className="relative h-1 flex-1 bg-gray-600 rounded-full">
                  <div
                    className="absolute h-1 bg-white rounded-full"
                    style={{ width: `${(track.progressMs / track.durationMs) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-right text-gray-400 w-8">{formatTime(track.durationMs)}</div>
              </div>
            </>
          ) : topAlbum && !showFallback && !currentError && !topAlbumError ? (
            <>
              <a
                href={topAlbum.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-nHassDisplay font-medium truncate hover:underline"
              >
                {topAlbum.name}
              </a>
              <div className="text-xs text-gray-400 font-SpaceGrotesk truncate">{topAlbum.artist}</div>
              <div className="flex items-center gap-2 font-SpaceGrotesk mt-1">
                <div className="text-xs text-gray-400">
                  <FaTrophy className="inline mr-1 my-0.5" />
                  Top artist - {topArtistTrackCount} tracks this week
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-base font-nHassDisplay font-medium truncate">
                <Link href="https://open.spotify.com/track/2t0wwvR15fc3K1ey8OiOaN" target="_blank" className="hover:underline">
                  Selfless
                </Link>
              </div>
              <div className="text-xs text-gray-400 font-SpaceGrotesk truncate">By Strokes (2020)</div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}