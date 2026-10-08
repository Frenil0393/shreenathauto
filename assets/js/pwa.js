/* Installation is always a visitor choice. Browsers decide prompt availability. */
(() => {
  'use strict';
  const standalone=matchMedia('(display-mode: standalone)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let installed=standalone.matches||navigator.standalone===true;
  let installPrompt=null,busy=false,closing=false,animation,returnFocus;
  const triggers=[...document.querySelectorAll('[data-install-app]')];
  const dialog=document.createElement('dialog');
  dialog.className='install-dialog';dialog.id='install-website';
  dialog.setAttribute('aria-labelledby','install-title');
  dialog.setAttribute('data-lenis-prevent','');
  dialog.innerHTML=`<div class="install-heading"><span class="micro">Always within reach</span><button class="dialog-close" type="button" aria-label="Close installation guide">×</button></div>
    <h2 id="install-title">A place on<br><em>your home screen.</em></h2>
    <p>Keep Shreenath close. Add our website to your device for quick access to services and contact details.</p>
    <button class="button install-native" type="button" hidden>Install Shreenath <span aria-hidden="true">↗</span></button>
    <p class="install-status" role="status" aria-live="polite" data-no-translate></p>
    <div class="install-guide">
      <section><h3>iPhone &amp; iPad</h3><p>In Safari, open Share, choose Add to Home Screen, then Add. Keep Open as Web App enabled if it is offered.</p></section>
      <section><h3>Mac</h3><p>In a recent Safari, choose File → Add to Dock. In Chrome or Edge, use the install option in the address bar or browser menu.</p></section>
      <section><h3>Android</h3><p>In Chrome, open the browser menu and choose Install app or Add to Home screen. The wording depends on your browser.</p></section>
      <section><h3>Windows &amp; other computers</h3><p>In Chrome or Edge, look for Install in the address bar or browser menu. If installation is unavailable, bookmark this page or use your browser’s shortcut option.</p></section>
    </div><p class="install-note">Installation options depend on your browser and device. The full website and 3D scenes need an internet connection.</p>
    <div class="install-footer"><button class="button outline install-done" type="button">Done</button></div>`;
  document.body.append(dialog);
  const nativeButton=dialog.querySelector('.install-native');
  const status=dialog.querySelector('.install-status');
  const say=(en,gu)=>{status.textContent=window.ShreenathLanguage?.get()==='gu'?gu:en;};
  function sync(){
    installed=installed||standalone.matches||navigator.standalone===true;
    triggers.forEach(button=>{button.hidden=installed;});
    nativeButton.hidden=!installPrompt||installed;
    nativeButton.disabled=busy;
    if(installed)say('Shreenath is open as an app.','શ્રીનાથ ઍપ તરીકે ખુલ્લું છે.');
    else if(location.protocol==='file:'||!isSecureContext)say('Open the live HTTPS website to install or add it to your device.','ઇન્સ્ટોલ કરવા અથવા ઉપકરણ પર ઉમેરવા માટે લાઇવ HTTPS વેબસાઇટ ખોલો.');
    else if(installPrompt)say('Your browser supports installation. Choose Install Shreenath to continue.','તમારું બ્રાઉઝર ઇન્સ્ટોલ કરવાની સુવિધા આપે છે. આગળ વધવા માટે શ્રીનાથ ઇન્સ્ટોલ કરો પસંદ કરો.');
    else say('Use the instructions below if your browser does not show an install button.','જો તમારું બ્રાઉઝર ઇન્સ્ટોલ બટન ન બતાવે તો નીચેની સૂચનાઓ અનુસરો.');
  }
  function open(){
    if(dialog.open||installed)return;
    returnFocus=document.activeElement;sync();
    if(typeof dialog.showModal!=='function'){
      // Unsupported dialog browsers still receive readable in-page guidance.
      dialog.setAttribute('open','');dialog.scrollIntoView({behavior:'smooth'});return;
    }
    dialog.showModal();
    if(!reduced.matches)animation=dialog.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(.2,.75,.25,1)'});
  }
  async function close(){
    if(!dialog.open||closing)return;closing=true;animation?.cancel();
    if(!reduced.matches){animation=dialog.animate([{opacity:1},{opacity:0}],{duration:150,fill:'forwards'});try{await animation.finished;}catch{}}
    if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');
    animation?.cancel();closing=false;
    if(returnFocus?.isConnected&&!returnFocus.hidden)returnFocus.focus({preventScroll:true});
  }
  triggers.forEach(button=>button.addEventListener('click',open));
  dialog.querySelector('.dialog-close').addEventListener('click',close);
  dialog.querySelector('.install-done').addEventListener('click',close);
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  const outside=event=>{const r=dialog.getBoundingClientRect();return event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom);};
  let backdrop=false;
  dialog.addEventListener('pointerdown',event=>{backdrop=outside(event);});
  dialog.addEventListener('pointercancel',()=>{backdrop=false;});
  dialog.addEventListener('click',event=>{if(backdrop&&outside(event))close();backdrop=false;});
  addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;sync();});
  nativeButton.addEventListener('click',async()=>{
    if(!installPrompt||busy)return;
    const prompt=installPrompt;installPrompt=null;busy=true;nativeButton.disabled=true;
    try{
      await prompt.prompt();const choice=await prompt.userChoice;
      if(choice.outcome==='accepted')await close();
    }catch{ /* Keep platform instructions available after a dismissed/failed prompt. */ }
    finally{busy=false;sync();}
  });
  addEventListener('appinstalled',()=>{installed=true;installPrompt=null;sync();close();});
  standalone.addEventListener('change',sync);
  addEventListener('shreenath:language',sync);
  reduced.addEventListener('change',()=>{if(reduced.matches)animation?.cancel();});
  sync();
  async function register(){
    if(!isSecureContext||!/^https?:$/.test(location.protocol)||!('serviceWorker' in navigator))return;
    try{
      const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});
      await registration.update();
    }catch{ /* Hosting restrictions must never prevent normal site use. */ }
  }
  if(document.readyState==='complete')register();else addEventListener('load',register,{once:true});
})();
