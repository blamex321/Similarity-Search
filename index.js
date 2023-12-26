const fs = require("fs");
const ytdl = require("ytdl-core");
const getWhisper = require("./whisper.js");
const path = require("path");
const prompt = require("prompt-sync")({ sigint: true });
const querySearch = require("./query.js");

const videoStream = ytdl("https://www.youtube.com/watch?v=ayrYA_FtMfI");
const videoFile = fs.createWriteStream("video.mp3");

videoStream.pipe(videoFile);

videoFile.on("finish",  () => {
    videoFile.close(async () => {
      const vidPath = path.join(__dirname, "video.mp3");
      const result = await getWhisper(vidPath);
      
      let query = "what are the limitations of flirting?";
      querySearch(query);

    //   while (true) {
    //     query = prompt("What do you want to search about? ");
    //     if (query !== "exit") {
    //         querySearch(query);
    //     } else {
    //         break;
    //     }
    //   }
    });
  });

videoFile.on("error", (err) => {
  console.error("Error downloading video:", err);
});

videoStream.on("error", (err) => {
  console.error("Error streaming video:", err);
});
