'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  cover: string;
  url: string;
  color: string;
}

const songs: Song[] = [
  {
    id: 1,
    title: 'Avaz Nemishi',
    artist: 'Shadmehr Aghili',
    duration: 180,
    cover: '/img/shadmehr2.jpg',
    url: '/music/Shadmehr Aghili - Avaz Nemishi [320].mp3',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    title: 'Nagoo-Na',
    artist: 'Amir Tataloo',
    duration: 210,
    cover: '/img/tataloo.jpg',
    url: '/music/Nagoo-Na-Amir-Tataloo.mp3',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: 'Vasleh',
    artist: 'Talk Down - Sami Beigi ',
    duration: 195,
    cover: '/img/sami.jpg',
    url: '/music/Talk20Down202620Sami20Beigi20-20Vasleh202832029.mp3',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    title: 'Hesse Khoobieh',
    artist: 'Shadmehr Aghili',
    duration: 300,
    cover: '/img/shadmehr.jpg',
    url: '/music/Shadmehr Aghili - Hesse Khoobieh [320].mp3',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 5,
    title: 'Negaranetam',
    artist: 'Asef Aria',
    duration: 310,
    cover: '/img/Asef.jpg',
    url: '/music/Asef Aria - Negaranetam.mp3',
    color: 'from-indigo-500 to-purple-500',
  },
];

// Audio Visualizer Component
function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className='flex justify-center items-end gap-1 mb-6 h-16'>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-300 ${
            isPlaying ? 'animate-pulse' : ''
          }`}
          style={{
            width: '4px',
            height: isPlaying ? `${Math.random() * 40 + 10}px` : '4px',
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || currentSong < songs.length - 1) {
        nextSong();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, repeatMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(randomIndex);
    } else {
      setCurrentSong((prev) => (prev + 1) % songs.length);
    }
    setCurrentTime(0);
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const currentSongData = songs[currentSong];

  return (
    <div className='relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 min-h-screen overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 opacity-20'>
        <div
          className={`absolute top-20 left-20 w-72 h-72 bg-gradient-to-r ${currentSongData.color} rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r ${currentSongData.color} rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className='z-10 relative mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-8 text-center animate-fade-in'>
          <h1 className='bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2 font-bold text-transparent text-5xl'>
            Music Player
          </h1>
          <p className='text-gray-400'>Discover your favorite tunes</p>
        </div>

        <div className='gap-8 grid grid-cols-1 xl:grid-cols-3'>
          {/* Main Player */}
          <div className='xl:col-span-2'>
            <Card className='bg-black/30 shadow-2xl hover:shadow-purple-500/20 backdrop-blur-xl border-white/10 transition-all duration-500'>
              <CardContent className='p-8'>
                {/* Album Art Section */}
                <div className='mb-8 text-center'>
                  <div className='inline-block relative mb-6'>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${currentSongData.color} rounded-full blur-xl opacity-50 animate-pulse`}
                    />
                    <img
                      src={currentSongData.cover || '/placeholder.svg'}
                      alt={currentSongData.title}
                      className={`relative w-80 h-80 mx-auto rounded-full shadow-2xl transition-all duration-700 ${
                        isPlaying ? 'animate-spin-slow' : ''
                      }`}
                      style={{ animationDuration: '10s' }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full' />
                  </div>

                  {/* Song Info */}
                  <div className='space-y-2 mb-6'>
                    <h2 className='font-bold text-white hover:text-purple-300 text-3xl transition-all duration-300'>
                      {currentSongData.title}
                    </h2>
                    <p className='text-gray-300 text-xl'>
                      {currentSongData.artist}
                    </p>
                    <p className='text-gray-400 text-sm'>
                      {currentSongData.album}
                    </p>
                  </div>

                  {/* Audio Visualizer */}
                  <AudioVisualizer isPlaying={isPlaying} />

                  {/* Progress Section */}
                  <div className='mb-8'>
                    <Slider
                      value={[currentTime]}
                      max={currentSongData.duration}
                      step={1}
                      onValueChange={handleProgressChange}
                      className='mb-3 w-full'
                    />
                    <div className='flex justify-between text-gray-400 text-sm'>
                      <span className='font-mono'>
                        {formatTime(currentTime)}
                      </span>
                      <span className='font-mono'>
                        {formatTime(currentSongData.duration)}
                      </span>
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className='flex justify-center items-center gap-6 mb-8'>
                    <Button
                      variant='ghost'
                      size='lg'
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={`text-white hover:text-purple-300 transition-all duration-300 hover:scale-110 ${
                        isShuffled ? 'text-purple-400 scale-110' : ''
                      }`}
                    >
                      <Shuffle className='w-5 h-5' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='lg'
                      onClick={prevSong}
                      className='text-white hover:text-purple-300 hover:scale-110 transition-all duration-300'
                    >
                      <SkipBack className='w-6 h-6' />
                    </Button>

                    <Button
                      size='lg'
                      onClick={togglePlay}
                      className={`bg-gradient-to-r ${currentSongData.color} hover:shadow-lg hover:shadow-purple-500/50 text-white rounded-full w-20 h-20 transition-all duration-300 hover:scale-105 active:scale-95`}
                    >
                      {isPlaying ? (
                        <Pause className='w-8 h-8' />
                      ) : (
                        <Play className='ml-1 w-8 h-8' />
                      )}
                    </Button>

                    <Button
                      variant='ghost'
                      size='lg'
                      onClick={nextSong}
                      className='text-white hover:text-purple-300 hover:scale-110 transition-all duration-300'
                    >
                      <SkipForward className='w-6 h-6' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='lg'
                      onClick={toggleRepeat}
                      className={`text-white hover:text-purple-300 transition-all duration-300 hover:scale-110 ${
                        repeatMode !== 'none' ? 'text-purple-400 scale-110' : ''
                      }`}
                    >
                      <Repeat className='w-5 h-5' />
                      {repeatMode === 'one' && (
                        <span className='-top-1 -right-1 absolute flex justify-center items-center bg-purple-500 rounded-full w-4 h-4 text-xs'>
                          1
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Secondary Controls */}
                  <div className='flex justify-between items-center'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setIsLiked(!isLiked)}
                      className={`transition-all duration-300 hover:scale-110 ${
                        isLiked
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                      />
                    </Button>

                    <div className='flex flex-1 items-center gap-3 mx-4 max-w-xs'>
                      <Volume2 className='w-4 h-4 text-gray-400' />
                      <Slider
                        value={volume}
                        max={100}
                        step={1}
                        onValueChange={setVolume}
                        className='flex-1'
                      />
                      <span className='w-8 font-mono text-gray-400 text-sm'>
                        {volume[0]}
                      </span>
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-gray-400 hover:text-white hover:scale-110 transition-all duration-300'
                    >
                      <MoreHorizontal className='w-5 h-5' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlist */}
          <div className='xl:col-span-1'>
            <Card className='bg-black/30 shadow-2xl backdrop-blur-xl border-white/10 h-fit'>
              <CardContent className='p-6'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='font-bold text-white text-2xl'>Now Playing</h3>
                  <Badge
                    variant='secondary'
                    className='bg-purple-600/20 text-purple-300 animate-pulse'
                  >
                    {songs.length} tracks
                  </Badge>
                </div>

                <div className='space-y-3 max-h-96 overflow-y-auto custom-scrollbar'>
                  {songs.map((song, index) => (
                    <div
                      key={song.id}
                      onClick={() => {
                        setCurrentSong(index);
                        setCurrentTime(0);
                      }}
                      className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                        index === currentSong
                          ? `bg-gradient-to-r ${song.color} bg-opacity-20 border border-purple-500/50 shadow-lg`
                          : 'bg-white/5 hover:bg-white/10 hover:shadow-md'
                      }`}
                    >
                      <div className='flex items-center gap-4'>
                        <div className='relative'>
                          <div className='flex-shrink-0 rounded-lg w-14 h-14 overflow-hidden'>
                            <img
                              src={song.cover || '/placeholder.svg'}
                              alt={song.title}
                              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                            />
                          </div>
                          {index === currentSong && isPlaying && (
                            <div className='absolute inset-0 flex justify-center items-center bg-black/50 rounded-lg'>
                              <div className='bg-white rounded-full w-2 h-2 animate-ping' />
                            </div>
                          )}
                        </div>

                        <div className='flex-1 min-w-0'>
                          <h4
                            className={`font-semibold truncate transition-colors duration-300 ${
                              index === currentSong
                                ? 'text-white'
                                : 'text-gray-200 group-hover:text-white'
                            }`}
                          >
                            {song.title}
                          </h4>
                          <p className='text-gray-400 group-hover:text-gray-300 text-sm truncate transition-colors duration-300'>
                            {song.artist}
                          </p>
                        </div>

                        <div className='font-mono text-gray-400 text-sm'>
                          {formatTime(song.duration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentSongData.url}
          onLoadedData={() => {
            if (isPlaying && audioRef.current) {
              audioRef.current.play();
            }
          }}
        />
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
}
