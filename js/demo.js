// Demo mode manager: 5-minute demo sessions, cleanup and end modal
(function(){
    const DEMO_MS = 5 * 60 * 1000; // 5 minutes
    let demoTimer = null;

    function startDemoSession(plan='economy') {
        // mark active and plan
        localStorage.setItem('lux_demo_active', Date.now());
        localStorage.setItem('lux_demo_plan', plan);
        // show small badge
        ensureBadge();
        // start countdown
        const start = Date.now();
        demoTimer = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, DEMO_MS - elapsed);
            updateBadge(remaining);
            if (remaining <= 0) {
                endDemoSession();
            }
        }, 1000);
    }

    function updateBadge(ms) {
        const badge = document.getElementById('demoBadge');
        if(!badge) return;
        const s = Math.floor(ms/1000);
        const mm = String(Math.floor(s/60)).padStart(2,'0');
        const ss = String(s%60).padStart(2,'0');
        badge.textContent = `Demo ${mm}:${ss}`;
    }

    function ensureBadge(){
        if(document.getElementById('demoBadge')) return;
        const b = document.createElement('div');
        b.id = 'demoBadge';
        b.className = 'demo-badge';
        b.title = 'Demo session remaining';
        document.body.appendChild(b);
    }

    function endDemoSession(){
        clearInterval(demoTimer);
        // remove demo markers
        try { localStorage.removeItem('lux_demo_active'); localStorage.removeItem('lux_demo_plan'); } catch(e){}
        // conservative sweep: remove keys that start with lux_ except language preference
        try{
            const keep = ['lux_lang'];
            Object.keys(localStorage).forEach(k => {
                if(k.startsWith('lux_') && !keep.includes(k)) localStorage.removeItem(k);
            });
        }catch(e){/* ignore */}
        // hide badge
        const badge = document.getElementById('demoBadge'); if(badge) badge.remove();
        // show modal
        const modal = document.getElementById('demoModal');
        if(modal){
            modal.setAttribute('aria-hidden','false');
        } else {
            if(window.showToast) window.showToast('Demo ended. Data removed.', 'info');
        }
    }

    function maybeAutoStart(){
        const url = new URL(window.location.href);
        if(url.searchParams.get('demo') === '1') {
            const plan = url.searchParams.get('plan') || 'economy';
            startDemoSession(plan);
        }
    }

    // expose for manual start
    window.luxStartDemo = startDemoSession;

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeAutoStart); else maybeAutoStart();
})();
