// Initialize a global Audio object for the current song
var currentSong = new Audio();
var songs = [];

// Function to fetch songs from the server
async function getSongs() {
  // Fetch the directory listing from the server
  let response = await fetch("http://127.0.0.1:5500/Songs/");
  let text = await response.text();

  // Create a temporary div element to parse the response HTML
  let div = document.createElement("div");
  div.innerHTML = text;

  // Get all <a> elements (links) from the parsed HTML
  let links = div.getElementsByTagName("a");

  // Loop through each link to find audio files
  for (let link of links) {
    if (link.href.endsWith(".mp3") || link.href.endsWith(".m4a")) {
      // Add the song URL to the songs array
      songs.push(link.href);

      // Add the song to the song list in the UI
      let songList = document.querySelector(".songList ul");
      songList.innerHTML += `
        <li>
          <img src="./icons/music.svg" class="songImage" alt="">
          <div class="info">
            <div class="songName">${
              decodeURIComponent(link.href.split("/Songs/")[1]).split(".")[0]
            }</div>
            <div class="artist">Mohak</div>
          </div>
        </li>`;
    }
  }

  // Return the list of song URLs
  return songs;
}

// Function to set up event listeners on the song list items
async function helper() {
  // Fetch the songs and populate the UI
  songs = await getSongs();

  // Get all the <li> elements in the song list
  let songItems = Array.from(
    document.querySelector(".songList ul").getElementsByTagName("li")
  );

  // Add click event listeners to each song item
  songItems.forEach((item) => {
    let trackName = item.querySelector(".info .songName").innerText;

    item.addEventListener("click", () => {
      playMusic(trackName);
    });
  });
}

// Call the helper function to initialize the song list and event listeners
helper();

// Function to play the selected song
const playMusic = (track) => {
  // Construct the URL for the selected song
  let songUrl = `http://127.0.0.1:5500/Songs/${track.replaceAll(
    " ",
    "%20"
  )}.m4a`;
  currentSong.src = songUrl;

  // Play the song and update the UI
  currentSong.play();
  document.getElementById("playIt").src = "./icons/pauseSong.svg";
  document.getElementById("whichSong").innerText = track;
};

// Event listener to handle mouse over on the range slider
document.getElementById("range").addEventListener("mouseover", () => {
  document.getElementById("range").style.opacity = "1";
  document.getElementById("range").style.cursor = "pointer";
});

// Event listener to handle mouse out on the range slider
document.getElementById("range").addEventListener("mouseout", () => {
  document.getElementById("range").style.opacity = "0.7";
  document.getElementById("range").style.cursor = "default";
});

// Event listener to handle clicks on the range slider for seeking
document.getElementById("range").addEventListener("click", (event) => {
  let clicked = event.offsetX;
  let position = clicked / event.target.offsetWidth;
  currentSong.currentTime = position * currentSong.duration;
});

// Function to format time in minutes:seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Event listener to update the UI as the song plays
currentSong.ontimeupdate = () => {
  let played = currentSong.currentTime;
  let duration = currentSong.duration;
  let fill = (played / duration) * 100;

  document.getElementById("song-time").innerHTML = `${formatTime(
    played
  )} / ${formatTime(duration)}`;

  let color = `linear-gradient(90deg, rgb(255,0,0) ${fill}%, rgb(214,214,214) ${fill}%)`;
  let seekbar = document.getElementById("range");
  seekbar.style.background = color;
  seekbar.step = played / duration;
  seekbar.value = fill;
};

// Event listener to handle play/pause button clicks
document.getElementById("playIt").addEventListener("click", () => {
  if (currentSong.paused) {
    currentSong.play();
    document.getElementById("playIt").src = "./icons/pauseSong.svg";
  } else {
    currentSong.pause();
    document.getElementById("playIt").src = "./icons/playSong.svg";
  }
});

// document.getElementsByClassName("hamburger").addEventListener("click", () => {
//   console.log(document.getElementsByClassName("left"));
//   document.getElementsByClassName("left").style.left = "0";
// });
document.querySelector(".hamburger").addEventListener("click", () => {
  // console.log(document.querySelector(".left"));
  document.querySelector(".left").style.left = "0";
})
document.querySelector(".cross").addEventListener("click", () => {
  // console.log(document.querySelector(".left"));
  document.querySelector(".left").style.left = "-100%";
});