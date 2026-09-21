(function(){
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a[data-page]').forEach(a=>{if(a.getAttribute('href').toLowerCase()===path)a.classList.add('active')});
  const menu=document.querySelector('.menu-toggle'), links=document.querySelector('.nav-links');
  if(menu&&links) menu.addEventListener('click',()=>links.classList.toggle('open'));

  document.querySelectorAll('[data-demo-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return}
      const box=form.querySelector('.success-box'); if(box) box.classList.add('show');
      form.reset();
      try{localStorage.setItem('obo_demo_last_form',new Date().toISOString())}catch(e){}
    })
  });

  const filters=document.querySelectorAll('.filter-btn');
  if(filters.length){
    filters.forEach(btn=>btn.addEventListener('click',()=>{
      filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const f=btn.dataset.filter;
      document.querySelectorAll('[data-category]').forEach(card=>{card.style.display=(f==='all'||card.dataset.category===f)?'flex':'none'});
    }));
  }

  const q=document.querySelector('[data-quiz]');
  if(q){
    let step=1; const answers={};
    const steps=[...q.querySelectorAll('.quiz-step')];
    const progress=[...document.querySelectorAll('.progress-item')];
    const back=q.querySelector('[data-back]'); const next=q.querySelector('[data-next]'); const actions=q.querySelector('.quiz-actions'); const result=q.querySelector('.quiz-result');
    function paint(){
      steps.forEach(s=>s.classList.toggle('active',Number(s.dataset.step)===step));
      progress.forEach((p,i)=>{p.classList.toggle('active',i===step-1);p.classList.toggle('done',i<step-1)});
      back.style.visibility=step===1?'hidden':'visible'; next.textContent=step===3?'Show my recommendation':'Continue';
    }
    q.querySelectorAll('.option').forEach(btn=>btn.addEventListener('click',()=>{
      const s=btn.closest('.quiz-step'); s.querySelectorAll('.option').forEach(b=>b.classList.remove('selected')); btn.classList.add('selected'); answers['s'+s.dataset.step]=btn.dataset.value;
    }));
    back.addEventListener('click',()=>{if(step>1){step--;paint()}});
    next.addEventListener('click',()=>{
      if(!answers['s'+step]){const active=steps.find(s=>Number(s.dataset.step)===step);active.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:260});return}
      if(step<3){step++;paint();return}
      showResult();
    });
    function showResult(){
      steps.forEach(s=>s.classList.remove('active')); actions.style.display='none'; progress.forEach(p=>p.classList.add('done')); result.classList.add('active');
      const goal=answers.s1, stage=answers.s2, style=answers.s3;
      const map={
        ai:{title:'AI & Automation Growth Path',desc:'Start with practical AI tools, then move into automation only where it removes repetitive work.',primary:'15 Free Google AI Tools',url:'https://onlinebizoffers.com/free-google-ai-tools',second:'AI Tools & Automation Hub',secondUrl:'https://onlinebizoffers.com/ai-tools-and-automation',store:'Complete AI Business System',storeUrl:'https://store.onlinebizoffers.com/'},
        traffic:{title:'SEO & Traffic Growth Path',desc:'Build a reliable traffic engine with search-led content, then layer in the right optimization tools.',primary:'YouTube vs. Medium: Which Drives More Traffic?',url:'https://onlinebizoffers.com/youtube-vs-medium-which-drives-more-traffic-to-your-business',second:'SEO & Optimization Tools',secondUrl:'https://onlinebizoffers.com/resources',store:'Growth-focused resources',storeUrl:'https://store.onlinebizoffers.com/'},
        leads:{title:'Lead Generation & Conversion Path',desc:'Focus first on capturing qualified interest, then improve follow-up and conversion with automation.',primary:'Marketing & Lead Generation Tools',url:'https://onlinebizoffers.com/marketing-and-lead-generation-tools',second:'Email Automation Guide',secondUrl:'https://onlinebizoffers.com/how-to-turn-launch-day-signups-into-paying-customers-with-email-automation',store:'Offer Creation Kit',storeUrl:'https://store.onlinebizoffers.com/product/offer-creation-kit/'},
        launch:{title:'Launch & Offer Clarity Path',desc:'Clarify the offer, validate demand, then build the simplest launch path around one clear next action.',primary:'How to Start an Online Business',url:'https://onlinebizoffers.com/how-to-start-an-online-business',second:'Start with Zero Budget',secondUrl:'https://onlinebizoffers.com/how-to-build-an-online-business-with-zero-startup-budget',store:'Offer Creation Kit Premium',storeUrl:'https://store.onlinebizoffers.com/product/offer-creation-kit/'}
      };
      const r=map[goal]||map.ai;
      const pace=stage==='starting'?'Beginner-friendly sequence':stage==='growing'?'Growth-stage sequence':'Optimization sequence';
      const mode=style==='quick'?'Quick wins first':style==='deep'?'Deep-dive guidance':'Tools + implementation';
      q.querySelector('[data-result-title]').textContent=r.title;
      q.querySelector('[data-result-desc]').textContent=r.desc;
      q.querySelector('[data-result-meta]').textContent=`${pace} · ${mode}`;
      q.querySelector('[data-primary-title]').textContent=r.primary;q.querySelector('[data-primary-link]').href=r.url;
      q.querySelector('[data-second-title]').textContent=r.second;q.querySelector('[data-second-link]').href=r.secondUrl;
      q.querySelector('[data-store-title]').textContent=r.store;q.querySelector('[data-store-link]').href=r.storeUrl;
      try{localStorage.setItem('obo_demo_recommendation',JSON.stringify({...answers,goalTitle:r.title,createdAt:new Date().toISOString()}))}catch(e){}
    }
    const restart=q.querySelector('[data-restart]'); if(restart)restart.addEventListener('click',()=>{Object.keys(answers).forEach(k=>delete answers[k]);q.querySelectorAll('.option').forEach(b=>b.classList.remove('selected'));result.classList.remove('active');actions.style.display='flex';step=1;paint()});
    paint();
  }
})();
