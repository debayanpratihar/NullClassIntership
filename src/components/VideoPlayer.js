import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getWeather } from '../weatherService';
import { useGeolocated } from 'react-geolocated';
import VideoPlayerControls from './VideoPlayerControls';
import '../styles/VideoPlayer.css';

// Import videos
import video1_320p from '../videos/video1_320p.mp4';
import video1_480p from '../videos/video1_480p.mp4';
import video1_720p from '../videos/video1_720p.mp4';
import video1_1080p from '../videos/video1_1080p.mp4';

import video2_320p from '../videos/video2_320p.mp4';
import video2_480p from '../videos/video2_480p.mp4';
import video2_720p from '../videos/video2_720p.mp4';
import video2_1080p from '../videos/video2_1080p.mp4';

import video3_320p from '../videos/video3_320p.mp4';
import video3_480p from '../videos/video3_480p.mp4';
import video3_720p from '../videos/video3_720p.mp4';
import video3_1080p from '../videos/video3_1080p.mp4';

const VideoPlayer = () => {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videoQuality, setVideoQuality] = useState('720p');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, text: 'Great video!' },
    { id: 2, text: 'Very informative.' },
    { id: 3, text: 'I loved it!' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const { coords } = useGeolocated({
    positionOptions: { enableHighAccuracy: false },
    userDecisionTimeout: 5000,
  });

  const qualities = ['320p', '480p', '720p', '1080p'];
  const videos = [
    {
      title: 'Video 1',
      qualities: {
        '320p': video1_320p,
        '480p': video1_480p,
        '720p': video1_720p,
        '1080p': video1_1080p,
      },
    },
    {
      title: 'Video 2',
      qualities: {
        '320p': video2_320p,
        '480p': video2_480p,
        '720p': video2_720p,
        '1080p': video2_1080p,
      },
    },
    {
      title: 'Video 3',
      qualities: {
        '320p': video3_320p,
        '480p': video3_480p,
        '720p': video3_720p,
        '1080p': video3_1080p,
      },
    },
  ];

  useEffect(() => {
    playerRef.current.seekTo(0);
  }, [videoIndex, videoQuality]);

  const handleDoubleTap = (side) => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + (side === 'right' ? 10 : -10), 'seconds');
  };

  const handleSingleTapMiddle = () => {
    setPlaying(!playing);
  };

  const handleTripleTap = (side, clickX) => {
    const screenWidth = window.innerWidth;
    const rightThreshold = screenWidth * 0.75; // Two right sections
    const leftThreshold = screenWidth * 0.25; // Two left sections

    if (side === 'middle') {
      if (clickX > leftThreshold && clickX < rightThreshold) {
        setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }
    } else if (side === 'right' && clickX > rightThreshold) {
      window.close();
    } else if (side === 'left' && clickX < leftThreshold) {
      setShowComments(true);
    }
  };

  const handleTopRightTap = async () => {
    if (coords) {
      const { latitude, longitude } = coords;
      const weatherData = await getWeather(latitude, longitude);
      if (weatherData) {
        const location = `${latitude},${longitude}`;
        toast.info(`Current location: ${weatherData.locations[location].address}, Temp: ${weatherData.locations[location].values[0].temp}°C`);
      } else {
        toast.error('Unable to fetch weather data');
      }
    } else {
      toast.error('Location not available');
    }
  };

  const handleHold = (side) => {
    setPlaybackRate(side === 'right' ? 2 : 0.5);
  };

  const handleRelease = () => {
    setPlaybackRate(1);
  };

  const handleQualityChange = (quality) => {
    const currentVideo = videos[videoIndex];
    if (currentVideo.qualities[quality]) {
      setVideoQuality(quality);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    const newCommentObject = { id: comments.length + 1, text: newComment };
    setComments([...comments, newCommentObject]);
    setNewComment('');
  };

  const handleGesture = (e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (e.detail === 2) {
      if (clickX > screenWidth / 2) {
        handleDoubleTap('right');
      } else {
        handleDoubleTap('left');
      }
    } else if (e.detail === 1) {
      if (clickX > screenWidth * 0.75 && clickY < screenHeight * 0.25) {
        handleTopRightTap();
      } else if (clickX > screenWidth / 4 && clickX < (3 * screenWidth) / 4) {
        handleSingleTapMiddle();
      }
    } else if (e.detail === 3) {
      handleTripleTap('left', clickX);
      handleTripleTap('middle', clickX);
      handleTripleTap('right', clickX);
    }
  };

  const handleProgress = (state) => {
    setProgress(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const formatTime = (seconds) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  return (
    <div className="video-player-container">
      <div className="video-player">
        <ReactPlayer
          ref={playerRef}
          url={videos[videoIndex].qualities[videoQuality]}
          playing={playing}
          playbackRate={playbackRate}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
        />
      </div>
      <div className="controls">
        <span className="video-title">{videos[videoIndex].title}</span>
        <VideoPlayerControls
          qualities={qualities}
          currentQuality={videoQuality}
          setQuality={handleQualityChange}
        />
      </div>
      <div className="progress-bar-container">
        <span>{formatTime(progress)}</span>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      <div
        className="gesture-area"
        onClick={handleGesture}
        onMouseDown={(e) => {
          if (e.clientX > window.innerWidth / 2) {
            handleHold('right');
          } else {
            handleHold('left');
          }
        }}
        onMouseUp={handleRelease}
      />
      {showComments && (
        <div className="comments-section">
          <h3>Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.text}</li>
            ))}
          </ul>
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={handleCommentChange}
              placeholder="Add a comment"
            />
            <button type="submit">Submit</button>
          </form>
          <button onClick={() => setShowComments(false)}>Close Comments</button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default VideoPlayer;
