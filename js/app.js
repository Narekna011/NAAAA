document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.lux-header');
    if (header) {
        function handleScroll() { header.classList.toggle('scrolled', window.scrollY > 50); }
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }
    const themeToggleBtn = document.querySelector('.lux-theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.lux-theme-icon') : null;
    if (themeToggleBtn && themeIcon) {
        const savedTheme = localStorage.getItem('lux-theme');
        if (savedTheme) { document.body.setAttribute('data-theme', savedTheme); themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️'; }
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
            localStorage.setItem('lux-theme', newTheme);
        });
    }
    window.showToast = function(message, type='info', timeout=3500) {
        try {
            let container = document.getElementById('luxToast');
            if (!container) { container = document.createElement('div'); container.id = 'luxToast'; container.className = 'lux-toast'; document.body.appendChild(container); }
            const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = message;
            container.appendChild(t);
            setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); }, timeout);
        } catch(e) {}
    };
});
