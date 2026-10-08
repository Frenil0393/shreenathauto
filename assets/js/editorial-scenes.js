/* Three editorial environments. Policies deliberately use symbolic objects.
   All furniture is baked by material; only purposeful activity stays dynamic. */
window.ShreenathEditorialScenes=Object.freeze({
  build({T,group,materials:m,motions,type,trackedTextures=[]}){
    if(!['about','services','contact'].includes(type))return false;
    const world=new T.Group(),fixed=new T.Group();group.add(world);world.add(fixed);world.position.y=-1.27;
    const sourceGeometry=new Set();
    const timber=new T.MeshStandardMaterial({color:'#ae8c6c',roughness:.8});
    const skin=new T.MeshStandardMaterial({color:'#ac8060',roughness:.82});
    const glass=new T.MeshStandardMaterial({color:'#7d9d98',roughness:.27,metalness:.18});
    const mesh=(geometry,material,parent=fixed)=>{sourceGeometry.add(geometry);const o=new T.Mesh(geometry,material);o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
    const place=(o,x,y,z)=>{o.position.set(x,y,z);return o;};
    function node(x=0,y=0,z=0,parent=world){const g=new T.Group();parent.add(g);g.position.set(x,y,z);return g;}
    function roundShape(w,h,r){
      r=Math.min(r,w*.48,h*.48);const s=new T.Shape(),x=-w/2,y=-h/2;
      s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
      s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
      s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
    }
    function block(mat,x,y,z,w,h,d,parent=fixed,r=.025){
      const geometry=new T.ExtrudeGeometry(roundShape(w,h,r),{depth:d,bevelEnabled:false,steps:1,curveSegments:5});
      geometry.translate(0,0,-d/2);return place(mesh(geometry,mat,parent),x,y,z);
    }
    const ball=(mat,x,y,z,r,parent=fixed)=>place(mesh(new T.SphereGeometry(r,14,10),mat,parent),x,y,z);
    const cylinder=(mat,x,y,z,r,h,parent=fixed)=>place(mesh(new T.CylinderGeometry(r,r,h,20),mat,parent),x,y,z);
    function surface(mat,x,y,z,w,d,h=.05,parent=fixed,r=.18){
      const o=block(mat,x,y,z,w,d,h,parent,r);o.rotation.x=-Math.PI/2;return o;
    }
    function rod(mat,a,b,r=.018,parent=fixed){
      const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start),mid=start.clone().add(end).multiplyScalar(.5);
      const o=cylinder(mat,mid.x,mid.y,mid.z,r,v.length(),parent);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;
    }
    function plant(x,z,h=.85){
      cylinder(m.pale,x,.16,z,.17,.3);rod(timber,[x,.2,z],[x,h-.12,z],.018);
      [[-.12,-.07,.8],[.12,.03,.95],[.02,.1,1.12]].forEach(([dx,dz,k])=>{
        const leaf=ball(m.sage,x+dx,h*k,z+dz,.19);leaf.scale.set(.75,1.45,.55);leaf.rotation.z=dx*2;
      });
    }
    function book(x,y,z,colour=m.clay){block(colour,x,y,z,.065,.24,.15);block(m.ivory,x+.006,y,z+.075,.047,.21,.008);}
    function paper(x,y,z,parent=fixed){
      const g=node(x,y,z,parent);surface(m.ivory,0,0,0,.25,.33,.012,g,.012);
      [-.075,-.015,.045].forEach(zz=>surface(m.pale,-.018,.009,zz,.16,.009,.003,g,.002));return g;
    }
    function person(x,z,shirt,angle=0,seated=false){
      const p=node(x,0,z);p.rotation.y=angle;
      const hip=seated?.34:.37,shoulder=hip+.25;
      block(shirt,0,hip+.13,0,.2,.27,.14,p,.055);
      ball(skin,0,shoulder+.16,.008,.078,p);
      const hair=ball(m.ink,0,shoulder+.202,-.009,.078,p);hair.scale.y=.46;
      [-.06,.06].forEach(xx=>{
        if(seated){block(m.ink,xx,.33,.065,.072,.075,.21,p);rod(m.ink,[xx,.33,.145],[xx,.08,.145],.034,p);}
        else rod(m.ink,[xx,.38,0],[xx,.08,.015],.034,p);
        block(m.ink,xx,.047,seated?.18:.05,.084,.048,.14,p);
      });
      const arm=node(-.125,shoulder,0,p);
      rod(shirt,[0,0,0],[0,-.19,.025],.031,arm);ball(skin,0,-.215,.028,.033,arm);
      rod(shirt,[.127,shoulder,0],[.137,shoulder-.19,.04],.031,p);ball(skin,.137,shoulder-.215,.045,.033,p);
      if(seated){
        surface(m.sage,0,.285,-.02,.32,.32,.065,p,.055);block(m.sage,0,.455,-.16,.32,.33,.055,p,.045);
        [-.11,.11].forEach(xx=>[-.12,.1].forEach(zz=>rod(m.ink,[xx,.26,zz],[xx,.015,zz],.013,p)));
      }
      return {group:p,arm};
    }
    function speak(p,phase=0){
      p.arm.rotation.x=-.9;
      motions.push(t=>{p.arm.rotation.x=-.9+Math.sin(t*.7+phase)*.09;});
    }
    function monitor(x,y,z,parent=fixed){
      block(m.ink,x,y,z,.32,.22,.027,parent,.018);block(glass,x,y,z+.017,.282,.18,.008,parent,.012);
      rod(m.ink,[x,y-.1,z],[x,y-.24,z],.018,parent);surface(m.ink,x,y-.25,z,.19,.13,.014,parent,.025);
    }
    function arch(x,z,w=1.25,h=1.6){
      const s=new T.Shape(),outer=w/2,inner=outer-.085,cy=h-outer;
      s.moveTo(-outer,0);s.lineTo(-outer,cy);s.absarc(0,cy,outer,Math.PI,0,true);
      s.lineTo(outer,0);s.lineTo(inner,0);s.lineTo(inner,cy);s.absarc(0,cy,inner,0,Math.PI,false);s.lineTo(-inner,0);s.closePath();
      const g=new T.ExtrudeGeometry(s,{depth:.095,bevelEnabled:false,curveSegments:20});g.translate(0,0,-.0475);place(mesh(g,m.ivory),x,0,z);
    }
    const signs=[];
    function sign(text,x,y,z,w,h=.22){
      const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=192;
      const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;trackedTextures.push(texture);
      const material=new T.MeshBasicMaterial({map:texture,transparent:true,side:T.DoubleSide});
      place(mesh(new T.PlaneGeometry(w,h),material,world),x,y,z);
      signs.push({canvas,texture,text});
    }
    function redrawSigns(){signs.forEach(({canvas,texture,text})=>{
      const ctx=canvas.getContext('2d');ctx.clearRect(0,0,1024,192);ctx.fillStyle='#efe9d9';ctx.fillRect(0,0,1024,192);
      ctx.fillStyle='#344137';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.font=window.ShreenathLanguage?.get()==='gu'?'500 74px "Hind Vadodara",sans-serif':'600 65px sans-serif';
      ctx.fillText(window.ShreenathLanguage?.text(text)||text,512,100,950);texture.needsUpdate=true;
    });}
    addEventListener('shreenath:language',redrawSigns);addEventListener('shreenath:language-fonts',redrawSigns);
    if(type==='about'){
      // Three chapters from the supplied story, without invented dates or
      // pretending that these symbolic pavilions reproduce the real premises.
      surface(m.pale,0,-.075,0,4,2.7,.15,fixed,.6);
      surface(m.ivory,0,.012,0,3.88,2.58,.018,fixed,.54);
      [-1.2,1.2].forEach((x,i)=>{
        block(m.ivory,x,.6,-.48,1.06,1.16,.09);
        block(timber,x-.49,.58,-.16,.065,1.1,.69);
        surface(i?m.sage:m.clay,x,1.2,-.16,1.2,.88,.065,fixed,.08);
        block(timber,x,.31,-.03,.82,.5,.3);surface(m.ivory,x,.58,-.03,.91,.41,.04);
        paper(x-.12,.607,.01);speak(person(x,-.29,i?m.sage:m.ivory),i*2);
      });
      sign('Anupam Auto',-1.2,1.04,.285,1.05,.2);
      sign('Jamkandorana',-1.2,.16,.57,1.04,.16);
      sign('Dhoraji',1.2,1.04,.285,1.04,.2);
      arch(0,-.85,.86,1.63);sign('Shreenath Auto',0,1.37,-.79,1.19,.23);
      const route=new T.CatmullRomCurve3([new T.Vector3(-1.2,.065,.72),new T.Vector3(-.52,.065,.58),new T.Vector3(0,.065,.08),new T.Vector3(.57,.065,.6),new T.Vector3(1.2,.065,.72)]);
      mesh(new T.TubeGeometry(route,44,.022,8,false),m.gold);
      const marker=ball(m.clay,-1.2,.12,.72,.057,world);
      motions.push(t=>{marker.position.copy(route.getPoint((1-Math.cos(t*.24))*.5));marker.position.y=.12;});
      speak(person(-.82,.86,m.clay,Math.PI),1.4);speak(person(1.18,.87,m.ivory,Math.PI),2.4);
      plant(-1.69,-.69,.65);plant(1.67,-.7,.7);
    }else if(type==='services'){
      // A document atelier: organise, review and prepare. It illustrates the
      // consultancy's work without implying that it issues official approvals.
      surface(m.pale,0,-.075,0,3.75,2.7,.15,fixed,.65);
      surface(m.ivory,0,.012,0,3.63,2.58,.018,fixed,.6);
      block(m.ivory,-.86,.69,-.81,1.38,1.35,.1);
      for(let row=0;row<2;row++){
        surface(timber,-.86,.44+row*.46,-.65,1.4,.39,.035);
        for(let i=0;i<8;i++)book(-1.38+i*.14,.58+row*.46,-.63,[m.ivory,m.sage,m.clay][i%3]);
      }
      surface(timber,.04,.53,.05,2.28,.8,.075,fixed,.22);
      [-.76,.84].forEach(x=>block(m.ivory,x,.27,.05,.1,.5,.54));
      monitor(.64,.86,-.05);paper(-.63,.576,.04);paper(.06,.576,.1);
      speak(person(.28,-.4,m.sage,0,true),.4);speak(person(-.5,.69,m.clay,Math.PI,true),2.4);
      [-.94,-.57].forEach((x,i)=>{
        surface(m.pale,x,.61,.02,.29,.36,.034);for(let j=0;j<3;j++)paper(x,.636+j*.012,.02);
      });
      const reviewed=paper(-.14,.595,.04,world);
      motions.push(t=>{reviewed.position.x=-.14+Math.sin(t*.32)*.22;reviewed.rotation.y=Math.sin(t*.32)*.05;});
      sign('Your next step',.85,1.3,-.65,1.11,.23);
      rod(m.gold,[.35,.1,-.7],[.35,1.45,-.7],.02);rod(m.gold,[1.38,.1,-.7],[1.38,1.45,-.7],.02);
      plant(1.5,.45,.87);plant(-1.55,.63,.6);
    }else{
      // A welcoming conversation lounge: curved seating, a host and a visitor.
      surface(m.pale,0,-.075,0,3.6,2.75,.15,fixed,.86);
      surface(m.ivory,0,.012,0,3.48,2.63,.018,fixed,.8);
      arch(-.72,-.87,1.28,1.76);
      // A translucent screen has one face and needs no refraction render pass.
      const screenMaterial=glass.clone();screenMaterial.transparent=true;screenMaterial.opacity=.2;screenMaterial.depthWrite=false;screenMaterial.side=T.DoubleSide;
      place(mesh(new T.PlaneGeometry(.92,1.48),screenMaterial),.78,.78,-.89);
      [.29,1.27].forEach(x=>rod(m.gold,[x,.05,-.89],[x,1.53,-.89],.013));
      rod(m.gold,[.29,1.53,-.89],[1.27,1.53,-.89],.013);
      surface(timber,-.73,.54,-.23,.94,.55,.065,fixed,.14);
      block(m.ivory,-.73,.27,-.23,.75,.5,.36,fixed,.07);monitor(-.8,.82,-.33);
      const host=person(-.75,-.64,m.sage,0,true);speak(host,.5);
      // The guest sits at the small conversation table, with a bag beside them.
      speak(person(.62,.6,m.clay,Math.PI,true),2.1);
      cylinder(m.gold,.55,.22,.1,.043,.42);surface(m.ivory,.55,.46,.1,.71,.6,.055,fixed,.29);
      paper(.51,.495,.1);cylinder(m.ivory,.75,.537,.05,.037,.07);
      block(timber,1.02,.16,.68,.2,.27,.12,fixed,.035);
      const handle=mesh(new T.TorusGeometry(.065,.012,6,18,Math.PI),timber);handle.position.set(1.02,.305,.68);
      plant(1.33,-.32,.96);plant(-1.4,.58,.61);
      const folder=paper(-.48,.582,-.12,world);motions.push(t=>{folder.rotation.y=Math.sin(t*.4)*.04;});
    }
    // Merge static furniture by material, preserving the three scenes' shapes.
    fixed.updateMatrixWorld(true);world.updateMatrixWorld(true);
    const inverse=new T.Matrix4().copy(world.matrixWorld).invert(),batches=new Map();
    fixed.traverse(o=>{
      if(!o.isMesh||o.material.transparent)return;
      const geometry=o.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));
      const list=batches.get(o.material)||[];list.push(geometry);batches.set(o.material,list);
    });
    // Keep the single transparent screen separate so its UVs and sorting survive.
    const transparent=[];fixed.traverse(o=>{if(o.isMesh&&o.material.transparent)transparent.push(o);});
    transparent.forEach(o=>world.attach(o));fixed.clear();
    batches.forEach((parts,material)=>{
      let vertices=0,count=0;parts.forEach(g=>{vertices+=g.attributes.position.count;count+=g.index?g.index.count:g.attributes.position.count;});
      const positions=new Float32Array(vertices*3),normals=new Float32Array(vertices*3),indices=new Uint32Array(count);
      let v=0,k=0;parts.forEach(g=>{
        positions.set(g.attributes.position.array,v*3);normals.set(g.attributes.normal.array,v*3);
        const n=g.index?g.index.count:g.attributes.position.count;
        for(let i=0;i<n;i++)indices[k++]=v+(g.index?g.index.array[i]:i);
        v+=g.attributes.position.count;g.dispose();
      });
      const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(positions,3));g.setAttribute('normal',new T.BufferAttribute(normals,3));g.setIndex(new T.BufferAttribute(indices,1));g.computeBoundingSphere();
      const o=new T.Mesh(g,material);o.castShadow=o.receiveShadow=true;fixed.add(o);
    });
    const retained=new Set();world.traverse(o=>{if(o.geometry)retained.add(o.geometry);});
    sourceGeometry.forEach(g=>{if(!retained.has(g))g.dispose();});
    redrawSigns();
    return {dispose(){removeEventListener('shreenath:language',redrawSigns);removeEventListener('shreenath:language-fonts',redrawSigns);}};
  }
});
