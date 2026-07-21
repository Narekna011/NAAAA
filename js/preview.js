// Preview enhancements: animations, language switching, GSAP-powered transitions
(function(){
    function initAOS(){ if(window.AOS) AOS.init({duration:700, once:true}); }

    function initLenis(){
        if(!window.Lenis) return;
        const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    function animatePreview() {
        if(!window.gsap) return;
        const el = document.getElementById('inviteContent');
        if(!el) return;
        gsap.set(el, {autoAlpha:1, y:0});

        // gentle float (reduced on small screens)
        const floatY = window.innerWidth < 768 ? 3 : 6;
        gsap.to('.iphone-frame', {duration:6, y:floatY, repeat:-1, yoyo:true, ease:'sine.inOut'});

        // reactive update animation
        const inputs = ['namesInput','dateInput','venueInput','messageInput'];
        inputs.forEach(id => {
            const node = document.getElementById(id);
            if(!node) return;
            node.addEventListener('input', () => {
                gsap.fromTo('#invNames', {y:6, autoAlpha:0, filter:'blur(6px)'}, {duration:0.7, y:0, autoAlpha:1, filter:'blur(0px)', ease:'power3.out'});
                gsap.fromTo('#inviteContent .invite-overlay', {autoAlpha:0},{duration:0.8, autoAlpha:1});
            });
        });
    }

    // Simple language dictionary (can be extended or moved to server)
    const DICT = {
        'hy': {
            'Demo session ended': 'Փորձնական նստաշրջանը ավարտվեց',
            'Your demo data was removed. Want to keep working and unlock full features?': 'Ձեր փորձնական տվյալները ջնջվել են։ Ցանկանու՞մ եք շարունակել և բացել լրացուցիչ ֆունկցիաներ։',
            'Start New Demo': 'Սկսել նոր փորձ' }
        , 'ru': {
            'Demo session ended': 'Демо сессия окончена',
            'Your demo data was removed. Want to keep working and unlock full features?': 'Данные демо-сессии удалены. Хотите продолжить и открыть полный функционал?',
            'Start New Demo': 'Запустить демо заново' }
        , 'en': {
            'Demo session ended': 'Demo session ended',
            'Your demo data was removed. Want to keep working and unlock full features?': 'Your demo data was removed. Want to keep working and unlock full features?',
            'Start New Demo': 'Start New Demo' }
    };

    function applyLanguage(lang){
        // update modal text if present
        const modal = document.getElementById('demoModal');
        if(modal){
            modal.querySelector('h2').textContent = DICT[lang]['Demo session ended'] || DICT['en']['Demo session ended'];
            modal.querySelector('p').textContent = DICT[lang]['Your demo data was removed. Want to keep working and unlock full features?'] || DICT['en']['Your demo data was removed. Want to keep working and unlock full features?'];
            const tryBtn = document.getElementById('demoTryAgain');
            if(tryBtn) tryBtn.textContent = DICT[lang]['Start New Demo'] || DICT['en']['Start New Demo'];
        }

        // update static text in preview
        const pre = document.getElementById('invPre');
        if(pre){
            if(lang==='hy') pre.textContent = 'Մենք ամուսնանում ենք';
            else if(lang==='ru') pre.textContent = 'Мы женимся';
            else pre.textContent = 'We are getting married';
        }
    }

    function initLangSwitcher(){
        const saved = localStorage.getItem('lux_lang') || 'hy';
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.dataset.lang || btn.textContent.trim().toLowerCase();
            if(btnLang === saved) { btn.classList.add('active'); btn.setAttribute('aria-pressed','true'); } else { btn.setAttribute('aria-pressed','false'); }
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lang-btn').forEach(b=>{b.classList.remove('active'); b.setAttribute('aria-pressed','false');});
                btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
                applyLanguage(btnLang);
                localStorage.setItem('lux_lang', btnLang);
                document.documentElement.lang = btnLang;
            });
        });
        applyLanguage(saved);
        document.documentElement.lang = saved;
    }

    // Public init
    function init(){
        initAOS(); initLenis(); animatePreview(); initLangSwitcher();

        // modal close wiring
        const close = document.getElementById('demoModalClose');
        if(close) close.addEventListener('click', ()=>{ document.getElementById('demoModal').setAttribute('aria-hidden','true'); });
        const tryAgain = document.getElementById('demoTryAgain');
        if(tryAgain) tryAgain.addEventListener('click', ()=>{
            const plan = localStorage.getItem('lux_demo_plan') || 'economy';
            if(window.luxStartDemo) window.luxStartDemo(plan);
            const modal = document.getElementById('demoModal'); if(modal) modal.setAttribute('aria-hidden','true');
        });

        // small perf: lazy load images used in preview
        const img = document.getElementById('bgImg');
        if(img) img.loading = 'lazy';
        // Apply demo plan limitations (if demo started)
        const demoPlan = localStorage.getItem('lux_demo_plan');
        if(demoPlan && demoPlan !== 'ultra' && demoPlan !== 'premium'){
            // Economy demo: add limited class
            document.documentElement.classList.add('demo-economy');
        }
    }

    // auto-init on DOM ready
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
