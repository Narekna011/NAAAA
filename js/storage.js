// Simple IndexedDB wrapper for leads and invitations
(function(){
    const DB_NAME = 'luxe-invite-db';
    const STORE_INV = 'invitations';
    const STORE_LEADS = 'leads';
    let dbPromise = null;

    function openDB(){
        if(dbPromise) return dbPromise;
        dbPromise = new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if(!db.objectStoreNames.contains(STORE_INV)) db.createObjectStore(STORE_INV, { keyPath: 'id', autoIncrement: true });
                if(!db.objectStoreNames.contains(STORE_LEADS)) db.createObjectStore(STORE_LEADS, { keyPath: 'id', autoIncrement: true });
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
        return dbPromise;
    }

    function withStore(storeName, mode, callback){
        return openDB().then(db => new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, mode);
            const store = tx.objectStore(storeName);
            let result;
            try{ result = callback(store); } catch(err){ reject(err); }
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error || new Error('Transaction error'));
        }));
    }

    // Leads
    function saveLead(lead){
        const payload = Object.assign({}, lead, { createdAt: new Date().toISOString() });
        return withStore(STORE_LEADS, 'readwrite', store => store.add(payload));
    }
    function listLeads(){ return openDB().then(db => new Promise((resolve,reject)=>{ const tx=db.transaction(STORE_LEADS,'readonly'); const store=tx.objectStore(STORE_LEADS); const req=store.getAll(); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); })); }

    // Invitations
    function saveInvitation(inv){ const payload = Object.assign({}, inv, { createdAt: new Date().toISOString() }); return withStore(STORE_INV, 'readwrite', store => store.add(payload)); }
    function listInvitations(){ return openDB().then(db => new Promise((resolve,reject)=>{ const tx=db.transaction(STORE_INV,'readonly'); const store=tx.objectStore(STORE_INV); const req=store.getAll(); req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); })); }

    window.luxStorage = { saveLead, listLeads, saveInvitation, listInvitations };
})();
