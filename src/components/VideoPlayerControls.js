// src/components/VideoPlayerControls.js
import React from 'react';

const VideoPlayerControls = ({ qualities, currentQuality, setQuality }) => {
  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  return (
    <div className="video-player-controls">
      <select
        className="quality-selector"
        onChange={handleQualityChange}
        value={currentQuality}
      >
        {qualities.map((quality) => (
          <option key={quality} value={quality}>
            {quality}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VideoPlayerControls;