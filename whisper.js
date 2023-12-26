require("dotenv").config(); 
const fs = require("fs");
const OpenAI = require("openai");
const openai = new OpenAI(
    api_key = process.env.OPENAI_API_KEY
);
const path = require("path");


const {storeEmbeddings} = require("./pinecone.js");

const getWhisper = (p) => {
  let curr = p;
  const fileExtension = path.extname(curr).toLowerCase();

  if (
    [
      ".flac",
      ".m4a",
      ".mp3",
      ".mp4",
      ".mpeg",
      ".mpga",
      ".oga",
      ".ogg",
      ".wav",
      ".webm",
    ].includes(fileExtension)
  ) {
    console.log(`File format: ${fileExtension}`);
    // Rest of your code
  } else {
    console.error(`Unsupported file format: ${fileExtension}`);
    return;
  }

  async function getWhisper() {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(curr),
      model: "whisper-1",
    });

    console.log("Transcription:", transcription.text);
    storeEmbeddings(transcription.text);

  }
  getWhisper();
};

module.exports = getWhisper;
