import React, { useState } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

import IconoYoutube from "/iconoYt.svg"
import './App.css'


function App() {
  const [urlV, setUrlV] = useState('');
  const [videoData, setVideoData] = useState();
  const [videoDataImg, setVideoDataImg] = useState();
  const [messageV, setMessageV] = useState('');
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  
  // const urlDeploy = "http://localhost:3001" && "https://dowload-yt.onrender.com";
  // const urlLocal = 'http://localhost:3001/descargar-video' && "https://dowload-yt.vercel.app/";

  const SearchVideo = async (e) => {
    e.preventDefault();
    setMessageV(<span className='spiner'></span>)
    try {
      const response = await axios.post('http://localhost:3001/search', { urlV }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // console.log("Title:", response.data.titulo.replace(/[^\w]/g, '_'));
      setVideoData(response.data.titulo)
      setVideoDataImg(response.data.titulo.replace(/[^\w]/g, '_'));
      setMessageV("Busqueda completa ✅");

    } catch (error) {
      console.error('Error al enviar la URL de descarga:', error);
    }
  };
  
  const descargarVideo = async () => {
    setMessage(<span className='spiner'></span>)
    try {
      const response = await axios.post('http://localhost:3001/descargar-video', { urlV }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // console.log(response.data);
      await setMessage("Descarga completa");
      
    } catch (error) {
      console.error('Error al enviar la URL de descarga:', error);
    }
  };
  
  const descargarAudio = async () => {
    setMessage(<span className='spiner'></span>)
    try {
      const response = await axios.post('http://localhost:3001/descargar-audio', { urlV }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // console.log("test:", response.data);
      await setMessage("Descarga completa");
      
    } catch (error) {
      console.error('Error al enviar la URL de descarga:', error);
    }
  };

  const handlerOptionChanger = (e) => {
    const selectedOption = e.target.value;
    setSelectedOption(selectedOption);

    if(selectedOption === "video mp4") {
      descargarVideo()
    } else if (selectedOption === "audio mp3") {
      descargarAudio()
    }
  }
  
  return (
    <div className='container'>
      <span className='nav'>Download YT</span>
      <div className='containerForm'>
          <form onSubmit={SearchVideo} className='form'>
            <h2 className='title'> 
              <span className='title2'>Descargar desde</span> <img className='imgYT' src={IconoYoutube} alt='youtube' />
            </h2>
            <div className='containerSearch'>
              <input 
                type='search' 
                placeholder='Entry Link' 
                value={urlV}
                onChange={(e) => setUrlV(e.target.value)} 
                className='input'
              />
              <button type='submit' className='btn'>Buscar</button>
            </div>

            <span className='message'>{messageV}</span>
            { (messageV == "Busqueda completa ✅") ? 
            <div className='contenedorVideo'>
           
            {selectedOption ? ( // Mostrar contenedorImagen2 si se ha seleccionado una opción
                <div className='contenedorImagen2'>
                  <img 
                    src={`/screenshot/${videoDataImg}.png`} 
                    className='imgVideo'
                  /> 
                  <span className='message2'>Descargado correctamente ✅</span>
                </div>
              ) : (
                <div className='contenedorImagen'>
                  <img 
                    src={`/screenshot/${videoDataImg}.png`} 
                    className='imgVideo'
                  /> 
                </div>
              )}

               <div className='containerDataBtn'>
                <span className='titleVideo'>{videoData}</span>
                <select className='btnDescargar' onChange={handlerOptionChanger}>
                  <option>Descargar</option>
                  <option className='option' value="video mp4">Video mp4</option>
                  <option className='option' value="audio mp3">Audio mp3</option>
                </select>
              </div>
            </div> 
            : ""}
          </form>
      </div>
    </div>
  )
}

export default App
