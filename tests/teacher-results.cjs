const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
(async()=>{
const dom=new JSDOM(fs.readFileSync('teacher.html','utf8'),{url:'https://ce2-games.netlify.app/teacher.html',runScripts:'outside-only'});
const w=dom.window,d=w.document;
w.eval(fs.readFileSync('completion-catalog.js','utf8'));
const rows=[];
const sections=['CP C','CP F','CE2 A','CE2 D','CM1 A','CM1 D'];
for(const section of sections){
 const catalog=w.CompletionCatalog[section.split(' ')[0]];
 for(const name of ['<Finisher>','Missing one','Repeater']) {
  const exercises=name==='Missing one'?catalog.slice(0,-1):name==='Repeater'?Array(catalog.length).fill(catalog[0]):catalog;
  rows.push(...exercises.map(row=>({...row,student_name:name,class_section:section,score:0,total:10,completed_at:'2026-10-13T16:00:00Z'})));
 }
}
w.ResultsAPI={teacherId:'teacher',signIn:async()=>({user:{id:'teacher'},access_token:'token',expires_in:3600}),results:async()=>rows,teacherGifts:async()=>[],signOut:async()=>{}};
for(const file of ['gift-config.js','unit-progress.js','teacher-gifts.js'])w.eval(fs.readFileSync(file,'utf8'));
w.eval(fs.readFileSync('teacher.js','utf8'));
assert.equal(d.querySelectorAll('summary').length,0);
d.querySelector('#teacher-login').dispatchEvent(new w.Event('submit',{cancelable:true}));
await new Promise(resolve=>setTimeout(resolve,0));
assert.deepEqual([...d.querySelectorAll('#section-results h2')].map(x=>x.textContent),sections);
assert.equal(d.querySelectorAll('.all-games-completed').length,6);
for(const badge of d.querySelectorAll('.all-games-completed')) {
 assert.equal(badge.tagName,'EM');assert.equal(badge.textContent,'Completed all games');
 assert.equal(badge.parentElement.textContent,'<Finisher> Completed all games Send gift 🎁');
}
assert.equal(d.querySelector('finisher'),null);
assert.equal(d.querySelector('#teacher-status').textContent,'');
assert(!d.body.textContent.includes('Click a student’s name'));
assert(!d.body.textContent.includes('scores count'));
assert.equal(d.querySelector('#notification-toggle'),null);
const missing=rows.find(row=>row.student_name==='<Finisher>'&&row.class_section==='CE2 A');
rows.splice(rows.indexOf(missing),1);
d.querySelector('#refresh-results').click();await new Promise(resolve=>setTimeout(resolve,0));
assert.equal(d.querySelectorAll('.all-games-completed').length,5);
d.querySelector('#sign-out').click();assert.equal(d.querySelectorAll('summary').length,0);
dom.window.close();
console.log('Passed: completion for all six sections; missing exercise; repeated exercise; zero score; safe names; refresh; sign-out; removed text and icon.');
})().catch(error=>{console.error(error);process.exitCode=1});
