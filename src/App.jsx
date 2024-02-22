import React, { useState, useEffect, useRef } from 'react';
import './app.css';

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    if (storedPlaylist) {
      setPlaylist(storedPlaylist);
    }
    const storedTrackIndex = parseInt(localStorage.getItem('currentTrackIndex'));
    if (!isNaN(storedTrackIndex)) {
      setCurrentTrackIndex(storedTrackIndex);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
  }, [currentTrackIndex]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newPlaylist = [...playlist, ...files];
    setPlaylist(newPlaylist);
  };

  const handleTrackClick = (index) => {
    setCurrentTrackIndex(index);
  };

  const handleTrackEnded = () => {
    if (currentTrackIndex === playlist.length - 1) {
      // If it's the last track, stop playback
      audioRef.current.pause();
    } else {
      setCurrentTrackIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  return (
    <div className="app">
      <h1 className="title">Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleFileUpload} multiple />
      <div className="playlist-container">
        <h2 className="playlist-title">Playlist</h2>
        <ul className="playlist">
          {playlist.map((track, index) => (
            <li
              key={index}
              className={`playlist-item ${currentTrackIndex === index ? 'active' : ''}`}
              onClick={() => handleTrackClick(index)}
            >
              {track.name}
            </li>
          ))}
        </ul>
      </div>
      {playlist.length > 0 && (
        <div>
          <h2 className="now-playing-title">Now Playing</h2>
          <audio
            controls
            className="audio-player"
            ref={audioRef}
            src={URL.createObjectURL(playlist[currentTrackIndex])}
            onEnded={handleTrackEnded}
          />
        </div>
      )}
    </div>
  );
};

export default App;
