// Scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(el => {
        observer.observe(el);
    });
});

// Decorative gold particles generator
(function(){
    function makeParticles(){
        const container = document.querySelector('.gold-particles');
        if(!container) return;
        // clear existing
        container.innerHTML = '';
        const count = window.innerWidth < 768 ? 18 : 40;
        for(let i=0;i<count;i++){
            const p = document.createElement('div');
            p.className = 'particle';
            const size = (Math.random()*4 + 2).toFixed(2);
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = (Math.random()*100).toFixed(2) + '%';
            p.style.top = (Math.random()*100).toFixed(2) + 'vh';
            p.style.opacity = (Math.random()*0.6 + 0.2).toFixed(2);
            p.style.animationDelay = (Math.random()*10).toFixed(2) + 's';
            p.style.transform = 'translateY(0)';
            container.appendChild(p);
        }
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeParticles); else makeParticles();
    window.addEventListener('resize', () => { clearTimeout(window.__particleResize); window.__particleResize = setTimeout(makeParticles, 400); });
})();
