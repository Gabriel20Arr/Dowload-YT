import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import './App.css'
// import audioTest from "/audios/1 minute countdown (NEON Glow Edition) & voice over ⏰.mp3"

import audioTest from "../../api/audios/Happy Moments.mp3"
import videoTest from "../../api/videos/Happy Moments.webm"

function App() {
  const [urlV, setUrlV] = useState('');
  const [url, setUrl] = useState('');
  const [audioUrl ,setAudioUrl] = useState('');
  const [audioFiles, setAudioFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [messageV, setMessageV] = useState('');
  const [message, setMessage] = useState('');


  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    setMessageV(<span className='spiner'></span>)
    try {
      const response = await axios.post('http://localhost:3001/descargar-video', { urlV }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // setAudioUrl(response.data);
      // console.log(response.data);
      const fetchVideoFiles = async () => {
        try {
          const response = await axios.get('http://localhost:3001/video-descargado');

          console.log("GET video", response.data.videosFiles);
          setVideoFiles(response.data.videosFiles);
        } catch (error) {
          console.error('Error al otener los nombres de los archivos de video:', error);
        }
      };
      fetchVideoFiles();

      setMessageV("Descarga completa");
      
    } catch (error) {
      console.error('Error al enviar la URL de descarga:', error);
    }
  };
  
  const handleSubmitA = async (e) => {
    e.preventDefault();
    setMessage(<span className='spiner'></span>)
    try {
      const response = await axios.post('http://localhost:3001/descargar-audio', { url }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // setAudioUrl(response.data);
      await setMessage("Descarga completa");
      // console.log(response.data);
      const fetchAudioFiles = async () => {
        try {
          const response = await axios.get('http://localhost:3001/audio-descargado');
          
          console.log("GET Audio", response.data.audioFiles);
          setAudioFiles(response.data.audioFiles);
        } catch (error) {
          console.error('Error al obtener los nombres de los archivos de audio:', error);
        }
      };
      fetchAudioFiles();

    } catch (error) {
      console.error('Error al enviar la URL de descarga:', error);
    }
  };

  return (
    <div className='container'>
      <div className='containerForm'>
          <form onSubmit={handleSubmitVideo} className='form'>
            <h2 className='title'>Descargar video Youtube</h2>
            <div className='containerSearch'>
              <input 
                type='search' 
                placeholder='Entry Link' 
                value={urlV}
                onChange={(e) => setUrlV(e.target.value)} 
                className='input'
              />
              <button type='submit' className='btn'>descargar</button>
            </div>
            <span>{videoFiles}</span>
            <span className='message'>{messageV}</span>
          </form>
      </div>

      <div className='containerForm'>
        <form onSubmit={handleSubmitA} className='form'>
          <h2 className='title'>Descargar Audio Youtube</h2>
          <div className='containerSearch'>
            <input 
              type='search' 
              placeholder='Entry Link' 
              value={url}
              onChange={(e) => setUrl(e.target.value)} 
              className='input'
            />
            <button type='submit' className='btn'>descargar</button>
          </div>
          <span className='nameMessage'>{audioFiles}</span>
          <span className='message'>{message}</span>
        </form>
      </div>

    </div>
  )
}

export default App
