const cors = require("cors")
const morgan = require("morgan")
const express = require("express")
// const puppeteer = require("puppeteer");
const youtubedl = require('youtube-dl-exec')
const path = require('path');
const fs = require("fs")

const app = express();
const port = 3001;

app.use(cors())
app.use(morgan('dev'))
app.use(express.json());

// (async () => {
//     const navegador = await puppeteer.launch({
//         headless: false, // visualisar el navegador
//         defaultViewport: {
//             width: 1920,
//             height: 1080
//         },
//         // args: ["--window-size=1920,1080"],
//     });

//     const page = await navegador.newPage();
//     await page.goto("https://www.youtube.com/");

//     await page.type("input#search", "sounds from five minutes");

//     await new Promise(time => setTimeout(time, 1000));
//     await page.click("#search-icon-legacy");
    
//     await new Promise(time => setTimeout(time, 1000));
//     const enlaces = await page.evaluate(() => {
//         const elementos = document.querySelectorAll(".ytd-video-renderer #video-title");
//         const enlaces = [];
//         for (let element of elementos) {
//             enlaces.push(element.href);
//         }
//         return enlaces;
//     });
    
//     console.log(enlaces);

// })();

// 'https://www.youtube.com/watch?v=AnyMJJ2Ma54&pp=ygUYc291bmRzIGZyb20gZml2ZSBtaW51dGVz'

app.post('/descargar-video', async (req, res) => {
  const { urlV } = req.body;

try {
    const outputFolderV = path.join(__dirname, 'videos');
    const outputPathV = path.join(outputFolderV, '%(title)s.%(ext)s');

    // Verificar si la carpeta de salida existe, si no, crearla
    if (!fs.existsSync(outputFolderV)) {
      fs.mkdirSync(outputFolderV);
    }
  
    await youtubedl.exec(urlV, {
      output: outputPathV,
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificate: true,
      preferFreeFormats: true
    });
    
    // console.log(outputPathV);
    res.status(200).json({ outputPathV })
      
} catch (error){ 
  console.error('Error durante la descarga:', error);
  res.status(500).send('Error durante la descarga del video')
  };
})

app.post('/descargar-audio', async (req, res) => {
  const { url } = req.body;

  try {
    const outputFolder = path.join(__dirname, 'audios');
    const outputPath = path.join(outputFolder, '%(title)s.%(ext)s');

    // Verificar si la carpeta de salida existe, si no, crearla
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    // Descargar el audio desde la URL proporcionada
    await youtubedl.exec(url, {
      extractAudio: true, // Extraer solo el audio del video
      audioFormat: 'mp3', // Formato de audio deseado
      output: outputPath, // Especificar la ubicación y el nombre de archivo del audio
      noCheckCertificate: true, // Opcional: Ignorar la verificación del certificado SSL
      retries: 3, // Número de intentos de descarga en caso de falla
      'audio-quality': 0, // Calidad máxima de audio
    });

    // console.log("Nombre Audio", outputPath);
    // console.log("Ubicación del audio descargado:", outputPath);

    res.status(200).json({ outputPath });

  } catch (error) {
    console.error('Error durante la descarga:', error);
    res.status(500).send('Error durante la descarga del audio');
  }
});

const videosFolder = path.join(__dirname, '../api/videos');

app.get('/video-descargado', (req, res) => {
  fs.readdir(videosFolder, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de videos:', err);
      res.status(500).json({ error: 'Error al leer la carpeta de videos' });
      return;
    }
    const videosFiles = files.filter(file => fs.statSync(path.join(videosFolder, file)).isFile());

    console.log("Name Videos", videosFiles);
    res.status(200).json({ videosFiles });
  });
});

const audiosFolder = path.join(__dirname, '../api/audios');

app.get('/audio-descargado', (req, res) => {
  fs.readdir(audiosFolder, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de audios:', err);
      res.status(500).json({ error: 'Error al leer la carpeta de audios' });
      return;
    }
    const audioFiles = files.filter(file => fs.statSync(path.join(audiosFolder, file)).isFile());

    console.log("Name Audios", audioFiles);
    res.status(200).json({ audioFiles });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
