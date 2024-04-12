function openGame(event, gameName) {
    var i, tabcontent, tablinks;

    if (gameName === 'hub') {
        document.getElementById('hub').style.display = "block";
    } else {
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        document.getElementById(gameName).style.display = "block";
        event.currentTarget.className += " active";
    }
}

// Get the mute/unmute button
const muteButton = document.getElementById('muteButton');
const spotifyPlayer = document.getElementById('spotifyPlayer').contentWindow;

muteButton.addEventListener('click', function() {
    if (spotifyPlayer.muted) {
        spotifyPlayer.muted = false; // Unmute
        muteButton.textContent = 'Mute';
    } else {
        spotifyPlayer.muted = true; // Mute
        muteButton.textContent = 'Unmute';
    }
});

// Get the Spotify toggle button
const spotifyToggle = document.getElementById('spotifyToggle');

// Variable to track whether Spotify is visible or not
let isSpotifyVisible = true;

// Function to toggle show/hide Spotify player
function toggleSpotify() {
    const spotifyContainer = document.getElementById('spotifyContainer');
    if (isSpotifyVisible) {
        spotifyContainer.style.display = 'none';
        isSpotifyVisible = false;
    } else {
        spotifyContainer.style.display = 'block';
        isSpotifyVisible = true;
    }
}

// Add click event listener to the Spotify toggle button
spotifyToggle.addEventListener('click', toggleSpotify);

// JavaScript code for draggable Spotify player
const spotifyContainer = document.getElementById('spotifyContainer');
let offsetX, offsetY, isDragging = false;

// Function to handle mouse down event
function handleMouseDown(event) {
    isDragging = true;
    offsetX = event.clientX - spotifyContainer.getBoundingClientRect().left;
    offsetY = event.clientY - spotifyContainer.getBoundingClientRect().top;
}

// Function to handle mouse move event
function handleMouseMove(event) {
    if (isDragging) {
        spotifyContainer.style.left = (event.clientX - offsetX) + 'px';
        spotifyContainer.style.top = (event.clientY - offsetY) + 'px';
    }
}

// Function to handle mouse up event
function handleMouseUp() {
    isDragging = false;
}

// Add event listeners for mouse events
spotifyContainer.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
