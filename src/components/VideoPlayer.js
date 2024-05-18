import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const [videoSrc, setVideoSrc] = useState('https://www.youtube.com/watch?v=61floBUAiTY&list=RDMz7ktiWuY5g&index=12');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef(null);
  const videoSources = [
    'https://www.youtube.com/watch?v=VMEXKJbsUmE&list=RDMz7ktiWuY5g&index=11',
    'https://www.youtube.com/watch?v=KhWj9ZNn6rc&list=RDMz7ktiWuY5g&index=10',
    'https://www.youtube.com/watch?v=GtPvCa3vvxA&list=RDMz7ktiWuY5g&index=21',
    // Add more video sources here
  ];

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, []);

  const handleSeekForward = (seconds = 5) => {
    videoRef.current.currentTime += seconds;
  };

  const handleSeekBackward = (seconds = 5) => {
    videoRef.current.currentTime -= seconds;
  };

  const handleNextVideo = useCallback(() => {
    const nextIndex = (currentVideoIndex + 1) % videoSources.length;
    setCurrentVideoIndex(nextIndex);
    setVideoSrc(videoSources[nextIndex]);
    setIsPlaying(true);
  }, [currentVideoIndex, videoSources]);

  const handleShowComments = useCallback(() => {
    setShowComments(!showComments);
  }, []);

  const handleCloseWebsite = () => {
    window.close();
  };

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate);
  };

  useEffect(() => {
    const handleGesture = (e) => {
      if (e.touches.length === 1) {
        // Single tap
        if (e.touches[0].clientX < window.innerWidth / 3) {
          handleSeekBackward();
        } else if (e.touches[0].clientX > (window.innerWidth * 2) / 3) {
          handleSeekForward();
        } else {
          handlePlayPause();
        }
      } else if (e.touches.length === 2) {
        // Double tap
        if (e.touches[0].clientX < window.innerWidth / 3) {
          handleSeekBackward(10);
        } else if (e.touches[0].clientX > (window.innerWidth * 2) / 3) {
          handleSeekForward(10);
        } 
      } else if (e.touches.length === 3) {
        // Triple tap
        if (e.touches[0].clientX < window.innerWidth / 3) {
          handleShowComments();
        } else if (e.touches[0].clientX > (window.innerWidth * 2) / 3) {
          handleCloseWebsite();
        } else {
          handleNextVideo();
        }
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1 && e.touches[0].clientX > (window.innerWidth * 2) / 3) {
        handlePlaybackRateChange(2);
      } else if (e.touches.length === 1 && e.touches[0].clientX < window.innerWidth / 3) {
        handlePlaybackRateChange(0.5);
      }
    };

    const handleTouchEnd = () => {
      handlePlaybackRateChange(1);
    };

    const handleTopRightCornerTap = () => {
      const successCallback = (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      };

      const errorCallback = (error) => {
        console.error('Error getting location:', error);
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };

    const fetchWeatherData = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric`);
        const data = await response.json();
        const { name, main } = data;
        alert(`You are in ${name}. The current temperature is ${main.temp}°C.`);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener('touchstart', handleTouchStart);
    videoElement.addEventListener('touchend', handleTouchEnd);
    videoElement.addEventListener('touchmove', handleGesture);
    videoElement.addEventListener('click', handleTopRightCornerTap);

    return () => {
      videoElement.removeEventListener('touchstart', handleTouchStart);
      videoElement.removeEventListener('touchend', handleTouchEnd);
      videoElement.removeEventListener('touchmove', handleGesture);
      videoElement.removeEventListener('click', handleTopRightCornerTap);
    };
  }, [handleNextVideo, handlePlayPause, handleShowComments]);

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        autoPlay={isPlaying}
        playbackRate={playbackRate}
        className="video-player"
      />
      {showComments && <div className="comment-section">Comment Section</div>}
    </div>
  );
};

export default VideoPlayer;