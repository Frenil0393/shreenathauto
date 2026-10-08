/* Hosted navigation uses canonical routes; direct file previews keep working. */
(() => {
  'use strict';
  const base=new URL('../../',document.currentScript.src);
  const local=location.protocol==='file:';
  const names=new Set(['index','about','services','contact','privacy','terms','cancellations','cookies','copyright','accessibility','404','offline']);
  function page(name,suffix=''){
    if(!names.has(name))return base.href;
    return local?new URL(name+'.html'+suffix,base).href:(name==='index'?'/':'/'+name)+suffix;
  }
  window.ShreenathURLs=Object.freeze({page});
  if(local)document.querySelectorAll('a[href]').forEach(link=>{
    const match=link.getAttribute('href').match(/^\/(?:([a-z]+))?([?#].*)?$/);
    if(match&&(!match[1]||names.has(match[1])))link.href=page(match[1]||'index',match[2]||'');
  });
})();
