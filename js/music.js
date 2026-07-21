// Music Player
function initMusicPlayer(audioId, buttonId) {
    const audio = document.getElementById(audioId);
    const btn = document.getElementById(buttonId);
    let isPlaying = false;

    if (audio && btn) {
        btn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                btn.innerHTML = '🔇';
            } else {
                audio.play();
                btn.innerHTML = '🎵';
            }
            isPlaying = !isPlaying;
        });
    }
}
