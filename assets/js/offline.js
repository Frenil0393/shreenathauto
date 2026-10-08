/* Self-contained: no analytics, network libraries or deferred form submissions. */
(() => {
  'use strict';
  try{const mode=JSON.parse(localStorage.getItem('shreenath_appearance_v1'))?.mode;if(['light','dark'].includes(mode))document.documentElement.dataset.theme=mode;}catch{}
  try{const language=localStorage.getItem('shreenath_language_v1')||sessionStorage.getItem('shreenath_language_v1');if(language==='gu')document.documentElement.lang='gu';}catch{}
  document.querySelector('[data-retry]').addEventListener('click',event=>{
    if(['/offline','/offline.html'].includes(location.pathname))return;
    event.preventDefault();location.reload();
  });
})();
