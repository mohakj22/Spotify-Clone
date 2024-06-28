var currentSong = new Audio();
var songs;

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  console.log(as);

  // Creating the Song list in the bottom-left div as well as getting all the songs on the client side in the songs array
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
      // Pushed the song in the songs array
      songs.push(element.href);
      // Inserted the song in the left-bottom div
      let songUL = document
        .querySelector(".songList")
        .getElementsByTagName("ul")[0];
      songUL.innerHTML += `<li>
                            <img src="./icons/music.svg" class="songImage" alt="">
                            <div class="info">
                              <div class="songName">
                              ${
                                element.href
                                  .split("/Songs/")[1]
                                  .replaceAll("%20", " ")
                                  .split(".m4a")[0]
                              }
                              </div>
                              <div class="artist">Mohak</div>
                            </div>
                          </li>`;
    }
  }

  return songs;
}
// Helps to fetch the songs using the getSongs function.
async function helper() {
  // let currentSong = new Audio();
  songs = await getSongs();
  let lis = Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  );
  console.log(lis);
  lis.forEach((event) => {
    let track = event.querySelector(".info").firstElementChild.innerText;
    console.log(track);

    event.addEventListener("click", (event) => {
      playMusic(track);
    });
  });
}
helper();

const playMusic = (track) => {
  let song =
    "http://127.0.0.1:5500/Songs/" + track.replaceAll(" ", "%20") + ".m4a";
  currentSong.src = song;
  console.log("track : ", currentSong);
  // let audio = new Audio(currentSong);
  currentSong.play();
  document.getElementById("playIt").src = "./icons/pauseSong.svg";
  document.getElementById("whichSong").innerText = `${
    currentSong.src.split("/Songs/")[1].replaceAll("%20", " ").split(".m4a")[0]
  }`;
};
document.getElementById("range").addEventListener("mouseover", (event) => {
  range.style.opacity = "1";
  range.style.cursor = "pointer";
  // range.style.setProperty("--thumb-opacity", "1");
});
document.getElementById("range").addEventListener("mouseout", (event) => {
  range.style.opacity = "0.7";
  range.style.cursor = "default";
  // range.style.setProperty("--thumb-opacity", "0");
});

document.getElementById("range").addEventListener("click", (event) => {
  let clicked = event.offsetX;
  let position = clicked / range.offsetWidth;
  currentSong.currentTime = position * currentSong.duration;
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
currentSong.ontimeupdate = () => {
  let played = currentSong.currentTime;
  let duration = currentSong.duration;
  let fill = (played / duration) * 100;
  document.getElementById(
    "song-time"
  ).innerHTML = `${formatTime(currentSong.currentTime)} / ${dformatTime(currentSong.duration)}`;

  let color =
    `linear-gradient(90deg, rgb(255,0,0)` +
    fill +
    `%,` +
    `rgb(214,214,214)` +
    fill +
    `%)`;
  let seekbar = document.getElementById("range");
  seekbar.value = fill;
  seekbar.step = played / duration;
  seekbar.style.background = color;
};

document.getElementById("playIt").addEventListener("click", (event) => {
  console.log(currentSong.paused);
  if (currentSong.paused) {
    currentSong.play();
    document.getElementById("playIt").src = "./icons/pauseSong.svg";
    console.log("paused it");
  } else {
    currentSong.pause();
    document.getElementById("playIt").src = "./icons/playSong.svg";
    console.log("Played it");
  }
});
document.getElementsByClassName("hamburger").addEventListener("click", () => {
  console.log(document.getElementsByClassName("left"));
  document.getElementsByClassName("left").style.left = "0" ;
})

// let playing = false;
// function playSong() {
//   // Selecting a random index to play a song.
//   let song = Math.round(Math.random() * 135);
//   // Creating a new audio using the index generated
//   currentSong.src = songs[song];
//   console.log(songs[song]);
//   // Inside of the songTitle ->
//   console.log(document.getElementById("whichSong"));
//   console.log("value : ", document.getElementById("whichSong").innerText);
//   document.getElementById("whichSong").innerText = `${
//     songs[song].split("/Songs/")[1].replaceAll("%20", " ").split(".m4a")[0]
//   }`;
//   console.log(document.getElementById("whichSong").innerText);
//   //   console.log(typeof audio);
//   currentSong.play();
//   audio.addEventListener("lodedata", () => {
//     let duration = audio.duration;
//     console.log(duration, audio.currentSrc, audio.currentTime);
//   });
//   return audio;
// }
// document.getElementById("playIt").addEventListener("click", () => {
//   let song;
//     if (!playing) {
//       console.log(song);
//     song = playSong();
//     document.getElementById("playIt").src =
//       "http://127.0.0.1:5500/icons/pauseSong.svg";
//     song.play();
//     playing = true;
//   } else {
//       document.getElementById("playIt").src =
//         "http://127.0.0.1:5500/icons/playSong.svg";
//       console.log(song);
//       song.pause();
//       playing = false;
//   }
// });

// document.getElementById("playIt").addEventListener("click", playSong);
