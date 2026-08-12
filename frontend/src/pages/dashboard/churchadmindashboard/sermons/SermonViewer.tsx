import { useState, useRef, useEffect } from "react";
import { FiX, FiVideo, FiMusic, FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";
import { type Sermon } from "../../../../Features/sermons/sermonsAPI";
import "./SermonViewer.css";

interface SermonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  sermon: Sermon | null;
}

export default function SermonViewer({ isOpen, onClose, sermon }: SermonViewerProps) {
  const [activeMedia, setActiveMedia] = useState<'video' | 'audio'>('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setAudioError(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (sermon && audioRef.current) {
      audioRef.current.load();
    }
  }, [sermon]);

  if (!isOpen || !sermon) return null;

  const getVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/,
      /(?:vimeo\.com\/)(\d+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const isYouTube = sermon.videoUrl?.includes('youtube.com') || sermon.videoUrl?.includes('youtu.be');
  const isVimeo = sermon.videoUrl?.includes('vimeo.com');
  const videoId = sermon.videoUrl ? getVideoId(sermon.videoUrl) : null;

  const hasVideo = !!sermon.videoUrl;
  const hasAudio = !!sermon.audioUrl;
  const hasBoth = hasVideo && hasAudio;
  const showAudioOnly = hasAudio && !hasVideo;

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const togglePlay = () => {
    if (activeMedia === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error('Audio play failed:', err);
          setAudioError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioError = (e: any) => {
    console.error('Audio error:', e);
    setAudioError(true);
  };

  const handleAudioLoaded = () => {
    setAudioError(false);
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const getAudioSrc = () => {
    if (sermon.audioUrl) return sermon.audioUrl;
    if (sermon.videoUrl && !isYouTube && !isVimeo) return sermon.videoUrl;
    return null;
  };

  const audioSrc = getAudioSrc();

  return (
    <div className="sermon-viewer-overlay" onClick={onClose}>
      <div className="sermon-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="sermon-viewer-header">
          <div>
            <h3 className="sermon-viewer-title">{sermon.title}</h3>
            <p className="sermon-viewer-speaker">{sermon.speaker}</p>
          </div>
          <button onClick={onClose} className="sermon-viewer-close">
            <FiX size={24} />
          </button>
        </div>

        {hasBoth && (
          <div className="sermon-viewer-tabs">
            <button 
              className={`sermon-viewer-tab ${activeMedia === 'video' ? 'active' : ''}`}
              onClick={() => {
                setActiveMedia('video');
                if (audioRef.current) {
                  audioRef.current.pause();
                  setIsPlaying(false);
                }
              }}
            >
              <FiVideo size={16} />
              Video
            </button>
            <button 
              className={`sermon-viewer-tab ${activeMedia === 'audio' ? 'active' : ''}`}
              onClick={() => {
                setActiveMedia('audio');
                if (videoRef.current) {
                  videoRef.current.pause();
                }
              }}
            >
              <FiMusic size={16} />
              Audio
            </button>
          </div>
        )}

        <div className="sermon-viewer-body">
          {hasVideo && activeMedia === 'video' && (
            <div className="sermon-viewer-video-container">
              {isYouTube && videoId && (
                <div className="sermon-viewer-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={sermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="sermon-viewer-iframe"
                  />
                </div>
              )}

              {isVimeo && videoId && (
                <div className="sermon-viewer-video">
                  <iframe
                    src={`https://player.vimeo.com/video/${videoId}`}
                    title={sermon.title}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="sermon-viewer-iframe"
                  />
                </div>
              )}

              {!isYouTube && !isVimeo && (
                <div className="sermon-viewer-video">
                  <video
                    ref={videoRef}
                    controls
                    className="sermon-viewer-video-element"
                    src={sermon.videoUrl}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>
              )}
            </div>
          )}

          {(showAudioOnly || (hasBoth && activeMedia === 'audio')) && audioSrc && (
            <div className="sermon-viewer-audio-container">
              <div className="sermon-viewer-audio">
                <div className="sermon-viewer-audio-icon">
                  <span className="sermon-viewer-audio-icon-text">🎵</span>
                </div>
                <div className="sermon-viewer-audio-info">
                  <h4 className="sermon-viewer-audio-title">{sermon.title}</h4>
                  <p className="sermon-viewer-audio-speaker">{sermon.speaker}</p>
                </div>

                <audio
                  ref={audioRef}
                  src={audioSrc}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleAudioEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={handleAudioError}
                  onLoadedMetadata={handleAudioLoaded}
                  preload="metadata"
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                />

                {audioError && (
                  <div className="sermon-viewer-audio-error">
                    <p>Unable to load audio. Please check the URL or try again.</p>
                  </div>
                )}

                <div className="sermon-viewer-audio-controls">
                  <button 
                    className="sermon-viewer-audio-play-btn"
                    onClick={togglePlay}
                    disabled={audioError}
                  >
                    {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
                  </button>
                  
                  <div className="sermon-viewer-audio-progress">
                    <span className="sermon-viewer-audio-time">{formatTime(currentTime)}</span>
                    <div className="sermon-viewer-audio-progress-bar">
                      <div 
                        className="sermon-viewer-audio-progress-fill"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                    <span className="sermon-viewer-audio-time">{formatTime(duration)}</span>
                  </div>

                  <button 
                    className="sermon-viewer-audio-mute-btn"
                    onClick={toggleMute}
                    disabled={audioError}
                  >
                    {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!hasVideo && !hasAudio && (
            <div className="sermon-viewer-no-media">
              <p>No media available for this sermon.</p>
            </div>
          )}

          <div className="sermon-viewer-details">
            {sermon.topic && (
              <div className="sermon-viewer-detail">
                <strong>Topic:</strong> {sermon.topic}
              </div>
            )}
            {sermon.scripture && (
              <div className="sermon-viewer-detail">
                <strong>Scripture:</strong> {sermon.scripture}
              </div>
            )}
            {sermon.description && (
              <div className="sermon-viewer-detail">
                <strong>Description:</strong> {sermon.description}
              </div>
            )}
            {sermon.notes && (
              <div className="sermon-viewer-detail">
                <strong>Notes:</strong> {sermon.notes}
              </div>
            )}
            <div className="sermon-viewer-detail">
              <strong>Preached:</strong> {new Date(sermon.preachedAt).toLocaleDateString()}
            </div>
            <div className="sermon-viewer-detail">
              <strong>Media:</strong>
              {hasVideo && <span className="sermon-viewer-media-badge video">Video</span>}
              {hasAudio && <span className="sermon-viewer-media-badge audio">Audio</span>}
              {!hasVideo && !hasAudio && <span className="sermon-viewer-media-badge none">None</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}