const cors = require("cors")
const morgan = require("morgan")
const express = require("express")
const puppeteer = require("puppeteer");
const youtubedl = require('youtube-dl-exec')
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const cron = require('node-cron');

const app = express();
const port = 3001;

app.use(cors())
app.use(morgan('dev'))
app.use(express.json());


app.post('/search', async (req, res) => {
  const { urlV } = req.body;
  try {
    const navegador = await puppeteer.launch({
      headless: true,
      defaultViewport: {
          width: 920,
          height: 520
      },
      timeout: 60000,
      // args: ["--window-size=1920,1080"],
    });

    // abrimos Navegador
    const page = await navegador.newPage();
    await page.goto(urlV);

    await new Promise(time => setTimeout(time, 2500));
    
    // Obtener titulo del video 
    const titulo = await page.evaluate(() => {
      const tituloElement = document.querySelector('#title h1');
      return tituloElement ? tituloElement.innerText : "Dowload-YT";
    });

    if (titulo) {
      // Reemplazar caracteres no permitidos en nombres de archivo
      const nombreArchivo = titulo.replace(/[^\w]/gi, '_');

      var rutaCaptura = `../client/public/screenshot/${nombreArchivo}.png`;
      await page.screenshot({ path: rutaCaptura });
    } else {
      console.error('No se pudo obtener el título del video.');
    }
    
    // console.log("title:", titulo);
    res.status(200).json({ titulo })
    
} catch (error){ 
  console.error('Error durante la descarga:', error);
  res.status(500).send('Error durante la descarga del video')
  };
})

app.post('/descargar-video', async (req, res) => {
  const { urlV } = req.body;
  try {
    // const rutaVideo = path.resolve(__dirname, '../client/public/videos/%(title)s.%(ext)s');
    const rutaVideo = path.resolve(os.homedir(), 'Downloads', `%(title)s.%(ext)s`);

    await youtubedl.exec(urlV, {
        output: rutaVideo,
        noCheckCertificate: true,
        preferFreeFormats: true
      });

    
    res.status(200).json({ rutaVideo })
} catch (error){ 
  console.error('Error durante la descarga:', error);
  res.status(500).send('Error durante la descarga del video')
  };
})

app.post('/descargar-audio', async (req, res) => {
  const { urlV } = req.body;

  try {
    // var rutaAudio = `../client/public/audios/%(title)s.%(ext)s`;
    var rutaAudio = path.resolve(os.homedir(), 'Downloads', `audio_%(title)s.mp3`);

    // Descargar el audio desde la URL proporcionada
    await youtubedl.exec(urlV, {
      extractAudio: true, // Extraer solo el audio del video
      audioFormat: 'mp3', // Formato de audio deseado
      output: rutaAudio, // Especificar la ubicación y el nombre de archivo del audio
      noCheckCertificate: true, // Opcional: Ignorar la verificación del certificado SSL
      'audio-quality': 0, // Calidad máxima de audio
    });

    res.status(200).json({ rutaAudio });
  } catch (error) {
    console.error('Error durante la descarga:', error);
    res.status(500).send('Error durante la descarga del audio');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});