/* =============================================
   LUXE INVITE - Main Application JS
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Header Scroll Effect
    const header = document.querySelector('.lux-header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // Theme Toggle
    const themeToggleBtn = document.querySelector('.lux-theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.lux-theme-icon') : null;

    if (themeToggleBtn && themeIcon) {
        // Load saved theme
        const savedTheme = localStorage.getItem('lux-theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
            themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
        }

        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.body.setAttribute('data-theme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
            
            localStorage.setItem('lux-theme', newTheme);
        });
    }

    // Language switcher fallback (ensures header buttons persist language)
    const langButtons = document.querySelectorAll('.lang-btn');
    if(langButtons && langButtons.length){
        const savedLang = localStorage.getItem('lux_lang') || 'hy';
        langButtons.forEach(btn => {
            const l = btn.dataset.lang || btn.textContent.trim().toLowerCase();
            if(l === savedLang) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed','true');
            } else {
                btn.setAttribute('aria-pressed','false');
            }
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lang-btn').forEach(b=>{b.classList.remove('active'); b.setAttribute('aria-pressed','false');});
                btn.classList.add('active');
                btn.setAttribute('aria-pressed','true');
                localStorage.setItem('lux_lang', l);
                document.documentElement.lang = l;
                // broadcast event for other scripts
                window.dispatchEvent(new CustomEvent('lux:langchange', { detail: { lang: l } }));
            });
        });
        document.documentElement.lang = savedLang;
    }

    // Mobile menu placeholder
    const mobileMenuBtn = document.querySelector('.lux-mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            showToast('Mobile menu coming soon!', 'info');
        });
    }

    // Toast helper
    window.showToast = function(message, type='info', timeout=3500){
        try{
            let container = document.getElementById('luxToast');
            if(!container){
                container = document.createElement('div');
                container.id = 'luxToast';
                container.className = 'lux-toast';
                document.body.appendChild(container);
            }
            const t = document.createElement('div');
            t.className = `toast ${type}`;
            t.textContent = message;
            container.appendChild(t);
            setTimeout(()=>{ t.classList.add('hide'); setTimeout(()=>t.remove(), 300); }, timeout);
        }catch(e){ console.warn('Toast failed', e); }
    };
});
