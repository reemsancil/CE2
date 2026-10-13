window.GameProgress=(()=>{
 const config=window.GameProgressConfig;
 function history(){try{const data=JSON.parse(localStorage.getItem(config.storageKey)||'{}');return data&&typeof data==='object'&&!Array.isArray(data)?data:{};}catch{return {};}}
 function completed(id,data=history()){const result=data[id];return !!result&&Number.isFinite(result.score)&&Number.isFinite(result.total)&&result.total>0&&result.score>=0&&result.score<=result.total;}
 function render(){const data=history();document.querySelectorAll('[data-progress],[data-progress-group],[data-progress-unit]').forEach(el=>{const entries=el.hasAttribute('data-progress-unit')?config.entries:el.dataset.progressGroup?config.entries.filter(e=>e.group===el.dataset.progressGroup):config.entries.filter(e=>e.id===el.dataset.progress);const done=entries.length>0&&entries.every(e=>completed(e.id,data));el.classList.toggle('is-complete',done);const host=el.matches('details')?el.querySelector('summary'):(el.querySelector('.game-card__content')||el);host.querySelector(':scope > .completion-check')?.remove();if(done){const badge=document.createElement('span');badge.className='completion-check';badge.textContent=el.hasAttribute('data-progress-unit')?'✓ All games completed':'✓ Completed';host.append(badge);}});}
 function save(game,exercise,score,total){const entry=config.entries.find(e=>e.game===game&&e.exercise===exercise);if(!entry||!Number.isFinite(score)||!Number.isFinite(total)||total<=0||score<0||score>total)return;try{const data=history();data[entry.id]={score,total};localStorage.setItem(config.storageKey,JSON.stringify(data));}catch{}render();}
 window.addEventListener('storage',event=>{if(event.key===config.storageKey||event.key===null)render();});window.addEventListener('pageshow',render);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
 return {save,completed,render};
})();
