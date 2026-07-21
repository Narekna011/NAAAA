// Language Switcher
document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    function switchLanguage(lang) {
        // Update active button
        langButtons.forEach(b => b.classList.remove('active'));
        document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
        
        // Update all elements
        const elements = document.querySelectorAll('[data-hy]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                el.textContent = text;
            }
        });

        // Update html lang attribute
        document.documentElement.lang = lang;

        // Save to localStorage
        localStorage.setItem('preferred-lang', lang);
    }

    // Load saved language
    const savedLang = localStorage.getItem('preferred-lang');
    if (savedLang) {
        switchLanguage(savedLang);
    }
});
