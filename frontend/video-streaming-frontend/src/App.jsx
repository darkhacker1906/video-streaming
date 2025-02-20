import React from 'react';

// This imports the functional component from the previous sample.
import Video from './Video';
import { useRef } from 'react';

const App = () => {
  const playerRef = useRef(null);
   const videoLink = "http://localhost:8000/uploads/courses/75007ed2-9fd4-4c7d-8c55-d6b3fff144e3/index.m3u8";

  const videoPlayerOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{
      src: videoLink,
      type: 'application/x-mpegURL'
    }]
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on('waiting', () => {
      videojs.log('player is waiting');
    });

    player.on('dispose', () => {
      videojs.log('player will dispose');
    });
  };

  return (
    <>
      <h1>Video Player</h1>
      <Video options={videoPlayerOptions} onReady={handlePlayerReady} />
    </>
  );
}
export default App;