// Countdown Timer
function initCountdown(targetDateStr, elementIds) {
    const targetDate = new Date(targetDateStr).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elementIds.days) document.getElementById(elementIds.days).textContent = String(days).padStart(2, '0');
        if (elementIds.hours) document.getElementById(elementIds.hours).textContent = String(hours).padStart(2, '0');
        if (elementIds.minutes) document.getElementById(elementIds.minutes).textContent = String(minutes).padStart(2, '0');
        if (elementIds.seconds) document.getElementById(elementIds.seconds).textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}
