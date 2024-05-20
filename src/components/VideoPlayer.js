import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getWeather } from '../weatherService';
import { useGeolocated } from 'react-geolocated';
import '../styles/VideoPlayer.css';

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

  const { coords } = useGeolocated({ positionOptions: { enableHighAccuracy: false } });

  const videos = [
    {
      title: 'Video 1',
      qualities: {
        '320p': '/videos/video1_320p.mp4',
        '480p': '/videos/video1_480p.mp4',
        '720p': '/videos/video1_720p.mp4',
        '1080p': '/videos/video1_1080p.mp4',
      },
    },
    {
      title: 'Video 2',
      qualities: {
        '320p': '/videos/video2_320p.mp4',
        '480p': '/videos/video2_480p.mp4',
        '720p': '/videos/video2_720p.mp4',
        '1080p': '/videos/video2_1080p.mp4',
      },
    },
    {
      title: 'Video 3',
      qualities: {
        '320p': '/videos/video3_320p.mp4',
        '480p': '/videos/video3_480p.mp4',
        '720p': '/videos/video3_720p.mp4',
        '1080p': '/videos/video3_1080p.mp4',
      },
    },
  ];

  const handleDoubleTap = (side) => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + (side === 'right' ? 10 : -10), 'seconds');
  };

  const handleSingleTapMiddle = () => {
    setPlaying(!playing);
  };

  const handleTripleTap = (side) => {
    if (side === 'middle') {
      // Move to next video
      setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    } else if (side === 'right') {
      // Close the website
      window.close();
    } else if (side === 'left') {
      // Show comment section
      setShowComments(true);
    }
  };

  const handleTopRightTap = async () => {
    if (coords) {
      const location = `${coords.latitude},${coords.longitude}`;
      const weatherData = await getWeather(location);
      if (weatherData) {
        toast.info(`Current location: ${weatherData.locations[location].address}, Temp: ${weatherData.locations[location].values[0].temp}°F`);
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

  const changeQuality = (event) => {
    setVideoQuality(event.target.value);
  };

  const changeVideo = (event) => {
    setVideoIndex(parseInt(event.target.value));
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
        />
      </div>
      <div className="controls">
        <button onClick={() => handleDoubleTap('left')}>Backward 10s</button>
        <button onClick={handleSingleTapMiddle}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => handleDoubleTap('right')}>Forward 10s</button>
        <select onChange={changeVideo} value={videoIndex}>
          {videos.map((video, index) => (
            <option key={index} value={index}>{video.title}</option>
          ))}
        </select>
        <select onChange={changeQuality} value={videoQuality}>
          <option value="320p">320p</option>
          <option value="480p">480p</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
        </select>
      </div>
      <div
        className="gesture-area"
        onDoubleClick={(e) => {
          if (e.clientX > window.innerWidth / 2) {
            handleDoubleTap('right');
          } else {
            handleDoubleTap('left');
          }
        }}
        onClick={(e) => {
          if (e.detail === 1) {
            if (e.clientX > window.innerWidth * 0.75 && e.clientY < window.innerHeight * 0.25) {
              handleTopRightTap();
            } else if (e.clientX > window.innerWidth / 4 && e.clientX < (3 * window.innerWidth) / 4) {
              handleSingleTapMiddle();
            }
          } else if (e.detail === 3) {
            if (e.clientX > window.innerWidth / 2) {
              handleTripleTap('right');
            } else if (e.clientX < window.innerWidth / 2) {
              handleTripleTap('left');
            } else {
              handleTripleTap('middle');
            }
          }
        }}
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
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default VideoPlayer;
