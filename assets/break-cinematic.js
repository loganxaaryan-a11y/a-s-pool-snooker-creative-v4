/* A.S. Pool & Snooker — cinematic break scene.
   Self-contained WebGL2 ray-rendered 3D spheres and felt, with 2D rigid-ball
   collisions. No external JS dependency, no autoplay, no audio, optional.
   The opening photograph is real supplied artwork; the moving scene is
   a 3D illustration (not a video recording of a specific branch). */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=(a,b,t)=>{const x=clamp((t-a)/(b-a),0,1);return x*x*(3-2*x);};
  const VERT=`precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main(){vUv=aPosition;gl_Position=vec4(aPosition,0.,1.);}`;
  const FRAG=`precision highp float;
  varying vec2 vUv;
  uniform vec2 uRes;
  uniform vec3 uEye,uLook;
  uniform float uFov,uTime,uAccent;
  uniform vec4 uBalls[16];
  uniform vec4 uQ[16];
  uniform sampler2D uNum;
  const float PI=3.14159265359;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float sphereIntersect(vec3 ro,vec3 rd,vec3 center,float r){
    vec3 q=ro-center;float b=dot(q,rd);float h=b*b-dot(q,q)+r*r;
    if(h<0.)return 1e5;
    float t=-b-sqrt(h);return t>.003?t:1e5;
  }
  vec3 ballBase(float id){
    if(id<.5)return vec3(.93,.91,.82);
    if(abs(id-8.)<.5)return vec3(.014,.021,.024);
    if(id==1.||id==9.)return vec3(.96,.65,.11);
    if(id==2.||id==10.)return vec3(.11,.32,.80);
    if(id==3.||id==11.)return vec3(.81,.14,.11);
    if(id==4.||id==12.)return vec3(.38,.16,.63);
    if(id==5.||id==13.)return vec3(.97,.32,.055);
    if(id==6.||id==14.)return vec3(.05,.39,.25);
    return vec3(.55,.09,.17);
  }
  vec3 qrot(vec4 q,vec3 v){return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);}
  // Number decal: picks the nearest of four equatorial spots on the ball, reads the digit from the atlas.
  vec2 decal(vec3 nl,float id){
    float best=nl.z;vec2 p=vec2(nl.x,nl.y);
    if(-nl.z>best){best=-nl.z;p=vec2(-nl.x,nl.y);}
    if(nl.x>best){best=nl.x;p=vec2(-nl.z,nl.y);}
    if(-nl.x>best){best=-nl.x;p=vec2(nl.z,nl.y);}
    float rad=.46;
    float d=length(p);
    float disc=(1.-smoothstep(rad-.014,rad+.014,d))*step(.0,best);
    vec2 uv=clamp(vec2(p.x,-p.y)/(rad*2.)+.5,.002,.998);
    vec2 cuv=(vec2(mod(id,4.),floor(id/4.))+uv)/4.;
    float g=texture2D(uNum,cuv).r;
    return vec2(disc,g*disc);
  }
  vec3 shadeBall(vec3 pos,vec3 n,vec3 rd,float id,vec4 q){
    vec3 nl=qrot(vec4(-q.xyz,q.w),n);
    vec3 base=ballBase(id);
    if(id>8.5){float cap=smoothstep(.56,.66,abs(nl.y));base=mix(base,vec3(.94,.92,.85),cap);}
    if(id>.5){
      vec2 dc=decal(nl,id);
      base=mix(base,vec3(.96,.94,.86),dc.x);
      base=mix(base,vec3(.025,.03,.035),dc.y);
    }
    vec3 L=normalize(vec3(-.18,1.,-.25));
    float diff=clamp(dot(n,L)*.78+.22,0.,1.);
    vec3 ambient=vec3(.06,.08,.07)+vec3(.015,.09,.06)*max(-n.y,0.)*1.3;
    vec3 c=base*(ambient+diff*vec3(1.,.96,.86)*.95);
    c*=mix(.5,1.,smoothstep(-.95,.15,n.y));
    vec3 r=reflect(rd,n);
    float fres=.05+.95*pow(1.-max(dot(n,-rd),0.),4.);
    vec3 env=vec3(.02,.03,.03);
    if(r.y>.02){
      float t=(3.4-pos.y)/r.y;vec3 h=pos+r*t;
      float lx=1.-smoothstep(.5,.78,abs(h.x));
      float lz=smoothstep(-3.6,-3.1,h.z)*(1.-smoothstep(6.1,6.6,h.z));
      env+=vec3(1.,.93,.78)*lx*lz*2.5;
      env+=vec3(.10,.13,.11)*smoothstep(.2,1.,r.y)*.4;
    }else{
      env+=vec3(.012,.10,.065)*clamp(-r.y,0.,1.)*1.2;
    }
    c+=env*(fres*.92+.05);
    c+=vec3(1.,.95,.82)*pow(max(dot(r,L),0.),200.)*1.2;
    return c;
  }
  vec3 felt(vec3 p){
    vec2 z=p.xz;vec2 a=abs(z);
    float pd=min(length(vec2(a.x-3.2,a.y-7.5))-.58,length(vec2(a.x-3.27,z.y))-.5);
    if(pd<0.)return vec3(.004,.006,.005)+vec3(.06,.04,.025)*smoothstep(-.07,0.,pd);
    float pool=.34+1.0*exp(-(z.x*z.x*.15+(z.y-1.2)*(z.y-1.2)*.026));
    float grain=hash(floor(z*190.));float fine=hash(floor(z*610.));
    if(a.x<3.20&&a.y<7.5){
      float weave=.5+.5*sin(z.y*240.)*sin(z.x*240.);
      float v=.9+.05*sin(z.y*.72)+grain*.05+fine*.03+weave*.03;
      vec3 green=mix(vec3(.02,.2,.135),vec3(.06,.4,.27),clamp((7.5-z.y)/18.,0.,1.));
      float edge=max(smoothstep(3.0,3.19,a.x),smoothstep(7.3,7.49,a.y));
      green=mix(green,vec3(.012,.1,.065),edge*.8);
      float shadow=1.;
      for(int i=0;i<16;i++){
        vec2 d=z-uBalls[i].xz;
        shadow*=1.-.55*exp(-dot(d,d)*8.)*smoothstep(-.3,.2,uBalls[i].y);
      }
      return green*v*pool*shadow;
    }
    float cx=a.x-3.2,cy=a.y-7.5;
    float dEdge=max(cx,cy);
    if(dEdge<.14){
      float line=smoothstep(.0,.03,dEdge);
      return mix(vec3(.05,.3,.2),vec3(.012,.1,.07),line)*pool*(.9+grain*.1);
    }
    if(a.x<3.66&&a.y<7.96){
      float along=(cx>cy)?z.y:z.x;
      float w=.5+.5*sin(along*7.+sin(along*31.+(cx>cy?z.x:z.y)*3.)*.5+(cx>cy?z.x:z.y)*55.);
      vec3 wood=mix(vec3(.075,.04,.022),vec3(.34,.19,.095),w*.75+.15);
      float rise=smoothstep(.14,.30,dEdge)*(1.-smoothstep(.40,.52,dEdge));
      wood*=.8+rise*.6;
      float dd=1e5;
      if(cx>cy){dd=min(min(abs(a.y-1.875),abs(a.y-3.75)),abs(a.y-5.625));dd=length(vec2(a.x-3.43,dd));}
      else{dd=min(abs(z.x),abs(a.x-1.6));dd=length(vec2(dd,a.y-7.77));}
      wood=mix(wood,vec3(.92,.88,.78),1.-smoothstep(.05,.075,dd));
      return wood*(pool*.8+.25);
    }
    return vec3(.014,.022,.02);
  }
  vec3 wall(vec3 p){
    float vertical=sin(p.x*.8+1.0)*.075;
    float stripe=smoothstep(.26,.29,abs(sin((p.x+5.)*.72)));
    float trim=smoothstep(2.9,3.1,p.y);
    vec3 wood=mix(vec3(.028,.027,.025),vec3(.17,.073,.041),stripe*.52);
    return wood*(.85+vertical+hash(p.xz)*.055)+trim*.014;
  }
  void main(){
    vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
    vec3 forward=normalize(uLook-uEye);
    vec3 right=normalize(cross(forward,vec3(0.,1.,0.)));
    vec3 up=normalize(cross(right,forward));
    vec3 rd=normalize(forward + (right*uv.x+up*uv.y)*tan(radians(uFov)*.5)*2.);
    vec3 ro=uEye;
    float depth=1e5; float pickedID=-1.; float pickIdx=-1.; vec3 pickedPos=vec3(0.);
    for(int i=0;i<16;i++){
      float t=sphereIntersect(ro,rd,uBalls[i].xyz,.295);
      if(t<depth){depth=t;pickedID=uBalls[i].w;pickedPos=uBalls[i].xyz;pickIdx=float(i);}
    }
    float ft=rd.y<-.00001?(-ro.y/rd.y):1e5;
    float wt=rd.z>.00001?(8.8-ro.z)/rd.z:1e5;
    vec3 col;
    if(pickedID>=0. && depth<ft && depth<wt){
      vec3 pos=ro+rd*depth;
      vec3 n=normalize(pos-pickedPos);
      vec4 qq=vec4(0.,0.,0.,1.);
      for(int i=0;i<16;i++){if(float(i)==pickIdx)qq=uQ[i];}
      col=shadeBall(pos,n,rd,pickedID,qq);
    } else if(ft<wt && ft<1e5){
      vec3 p=ro+rd*ft;
      col=felt(p);
      float dist=length(p-ro);
      float fog=1.-exp(-dist*.022);
      col=mix(col,vec3(.028,.054,.039),fog*.55);
    } else if(wt<1e5){
      col=wall(ro+rd*wt);
    } else {
      float glow=exp(-pow(uv.x*.75,2.)*2.-pow(uv.y-.4,2.)*8.);
      col=vec3(.011,.016,.017)+glow*vec3(.04,.027,.022);
    }
    // Cinematic highlights and subtle corner falloff. No cartoon HUD.
    vec2 p=gl_FragCoord.xy/uRes;
    float vig=1.-.22*pow(length((p-.5)*vec2(1.24,1.0)),1.6);
    col*=vig;
    col=col/(1.+col*.32);
    col=pow(max(col,vec3(0.)),vec3(.84));
    float dither=(hash(gl_FragCoord.xy+uTime*31.)-.5)*.005;
    gl_FragColor=vec4(clamp(col+vec3(dither),0.,1.),1.);
  }`;
  function createGL(canvas){
    const gl=canvas.getContext('webgl',{alpha:false,antialias:true,depth:false,powerPreference:'high-performance',preserveDrawingBuffer:true}) || canvas.getContext('experimental-webgl');
    if(!gl)throw Error('WebGL unavailable');
    const sh=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
    const program=gl.createProgram();gl.attachShader(program,sh(gl.VERTEX_SHADER,VERT));gl.attachShader(program,sh(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    // Number atlas: 4x4 cells, white digits on black. Cell index = ball number.
    const atlas=document.createElement('canvas');atlas.width=atlas.height=1024;
    const actx=atlas.getContext('2d');actx.fillStyle='#000';actx.fillRect(0,0,1024,1024);
    actx.fillStyle='#fff';actx.textAlign='center';actx.textBaseline='middle';actx.font='bold 168px Arial, Helvetica, sans-serif';
    for(let n=1;n<=15;n++){
      const cx=(n%4)*256+128,cy=Math.floor(n/4)*256+132;
      actx.fillText(String(n),cx,cy);
      if(n===6||n===9)actx.fillRect(cx-46,cy+70,92,11);
    }
    const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(program,'uNum'),0);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    const posAttr=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(posAttr);gl.vertexAttribPointer(posAttr,2,gl.FLOAT,false,0,0);
    return {gl,program,u:{res:gl.getUniformLocation(program,'uRes'),eye:gl.getUniformLocation(program,'uEye'),look:gl.getUniformLocation(program,'uLook'),fov:gl.getUniformLocation(program,'uFov'),time:gl.getUniformLocation(program,'uTime'),balls:gl.getUniformLocation(program,'uBalls[0]'),q:gl.getUniformLocation(program,'uQ[0]')}};
  }
  function init(){
    const canvas=$('break-canvas'),stage=$('break-stage'),play=$('break-play'),poster=$('break-photo-trigger'),trigger=$('break-trigger'),skip=$('break-skip'),reset=$('break-reset'),result=$('break-results'),grid=$('break-results-grid'),note=$('break-stage-note'),status=$('break-live-status');
    const locations=Array.isArray(window.CLUB_LOCATIONS)?window.CLUB_LOCATIONS:[];
    if(!canvas||!stage||!poster||!trigger||!skip||!reset||!grid||!locations.length)return;
    let render=null;
    try{render=createGL(canvas);}catch(e){console.warn('3D break unavailable; location browsing remains accessible:',e);}
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
    let mode='ready',frame=0,last=0,startAt=0,elapsed=0,physicsElapsed=0,impact=false,breakImpact=false,balls=[],postTimer=0;
    let portrait=false,renderQuality=1,resizeTimer;
    const colors=['#eec554','#4877c0','#d7554a','#a178ca','#e7a253','#5cac84','#c9776a','#262a2d','#82b3d4','#dbc26a','#7b9fdb','#bb7b73','#9b91cb'];
    grid.innerHTML=locations.map((l,i)=>`<button type="button" class="break-location" data-club-id="${Number(l.id)}" aria-label="Explore ${escapeHTML(l.name)}"><span class="break-location-ball" style="--ball-tone:${colors[i%colors.length]}">${String(i+1).padStart(2,'0')}</span><span class="break-location-name">${escapeHTML(l.name)}</span><span class="break-location-arrow" aria-hidden="true">↗</span></button>`).join('');
    grid.addEventListener('click',e=>{const b=e.target.closest('[data-club-id]');if(b)document.dispatchEvent(new CustomEvent('as:open-club',{detail:{id:Number(b.dataset.clubId)}}));});
    const ids=[0,8,1,2,3,4,5,6,7,9,10,11,12,13,14,15];
    const R=.295;
    const POCKETS=[[3.2,7.5,.58],[-3.2,7.5,.58],[3.2,-7.5,.58],[-3.2,-7.5,.58],[3.27,0,.5],[-3.27,0,.5]];
    const qmul=(a,b)=>[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
    // Start pose: a number spot faces up (so numbers read from the overhead shot), random spin about the vertical.
    function pose(id){
      if(id===8)return [0,1,0,0];                       // the 8 faces the opening camera
      const f=id*2.399963,up=[0,Math.sin(f/2),0,Math.cos(f/2)],tip=[-Math.SQRT1_2,0,0,Math.SQRT1_2];
      return qmul(up,tip);
    }
    function spin(b,dt){
      const wx=b.vz/R,wz=-b.vx/R;if(wx===0&&wz===0)return;
      const q=b.q,k=.5*dt;
      q[0]+=k*(wx*q[3]-wz*q[1]);q[1]+=k*(-wx*q[2]+wz*q[0]);q[2]+=k*(wx*q[1]+wz*q[3]);q[3]+=k*(-wx*q[0]-wz*q[2]);
      const l=Math.hypot(q[0],q[1],q[2],q[3])||1;q[0]/=l;q[1]/=l;q[2]/=l;q[3]/=l;
    }
    function rack(){
      balls=[];
      balls.push({id:0,x:0,z:-5.65,vx:0,vz:0});
      balls.push({id:8,x:0,z:-1.8,vx:0,vz:0});
      let ix=2;
      const rackIds=[1,2,3,4,5,6,7,9,10,11,12,13,14,15];
      let k=0;
      for(let row=0;row<5;row++)for(let j=0;j<=row;j++){
        // Reserve one ball: black 8-ball started in the foreground instead.
        if(ix>=16)break;
        const x=(j-row/2)*(R*2+.015);
        const z=2.65+row*(Math.sqrt(3)*R+.012);
        balls.push({id:rackIds[k++],x,z,vx:0,vz:0});ix++;
      }
      // Fifteen physical balls in all: one white, one black, 14 in rack.
      balls.forEach(b=>{b.q=pose(b.id);b.h=R;b.potted=false;b.sink=0;});
    }
    function size(){
      const b=stage.getBoundingClientRect();if(b.width<5)return;
      portrait=b.width<565;
      if(render){
        // 3D reflection shading is expensive on older phones; cap pixels.
        const q=window.BREAK_QUALITY||{};
        const dpr=Math.min(window.devicePixelRatio||1,portrait?(q.dprPortrait||1):(q.dpr||1.12));
        const maxw=portrait?(q.maxwPortrait||430):(q.maxw||1050);
        const w=Math.max(1,Math.min(maxw,Math.round(b.width*dpr))),h=Math.max(1,Math.round(w*b.height/b.width));
        canvas.width=w;canvas.height=h;render.gl.viewport(0,0,w,h);
      }
      if(mode==='ready')draw(0);
    }
    function physics(dt){
      const count=balls.length;
      if(physicsElapsed<.46 && physicsElapsed+dt>=.46)balls[0].vz=6.15;
      const damp=Math.exp(-dt*(breakImpact?1.15:.18));
      for(let i=0;i<count;i++){
        let b=balls[i];
        if(b.potted){
          // dropping into the pocket: slide to the mouth and sink below the cloth
          b.sink+=dt;b.h=R-b.sink*2.6;
          b.x+=(b.px-b.x)*Math.min(1,dt*9);b.z+=(b.pz-b.z)*Math.min(1,dt*9);
          if(b.h<-.75)b.h=-5;
          continue;
        }
        b.x+=b.vx*dt;b.z+=b.vz*dt;spin(b,dt);
        b.vx*=damp;b.vz*=damp;
        if(b.x<-3.20+R){b.x=-3.20+R;b.vx=Math.abs(b.vx)*.79;}
        if(b.x>3.20-R){b.x=3.20-R;b.vx=-Math.abs(b.vx)*.79;}
        if(b.z<-7.5+R){b.z=-7.5+R;b.vz=Math.abs(b.vz)*.79;}
        if(b.z>7.5-R){b.z=7.5-R;b.vz=-Math.abs(b.vz)*.79;}
        if(b.id!==0)for(let k=0;k<6;k++){
          const P=POCKETS[k],dx=b.x-P[0],dz=b.z-P[1];
          if(dx*dx+dz*dz<P[2]*P[2]){b.potted=true;b.sink=0;b.px=P[0]*.94;b.pz=P[1]*.94;b.vx=b.vz=0;break;}
        }
      }
      for(let a=0;a<count;a++)for(let j=a+1;j<count;j++){
        const A=balls[a],B=balls[j];const dx=B.x-A.x,dz=B.z-A.z;if(A.potted||B.potted)continue;
        const dsq=dx*dx+dz*dz;if(dsq>(2*R+.01)**2)continue;
        const dist=Math.max(.00001,Math.sqrt(dsq)),nx=dx/dist,nz=dz/dist;
        const overlap=2*R-dist;
        A.x-=nx*overlap*.5;B.x+=nx*overlap*.5;
        A.z-=nz*overlap*.5;B.z+=nz*overlap*.5;
        const rv=(B.vx-A.vx)*nx+(B.vz-A.vz)*nz;
        if(rv>=0)continue;
        const impulse=-(1+.93)*rv*.5;
        A.vx-=impulse*nx;A.vz-=impulse*nz;
        B.vx+=impulse*nx;B.vz+=impulse*nz;
        if(!impact&&(a===0||j===0)){impact=true;status.textContent='The white ball strikes the black 8-ball.';}
        if(!breakImpact && (a===1||j===1) && a>=1 && j>=2){
          breakImpact=true;status.textContent='The black ball hits the rack; balls scatter across the table.';
          // Slight real-world off-center transfer produces a fuller visual break.
          for(let k=2;k<count;k++){
            const a=(k-2)*2.39996; // phyllotaxis: visually pleasing, nonuniform scatter
            const strength=2.4+(k%4)*.42;
            balls[k].vx+=Math.sin(a)*strength;
            balls[k].vz+=Math.cos(a)*strength + .25;
          }
        }
      }
    }
    const e=(a,b,t)=>smooth(a,b,t);
    function camera(t){
      // A moving physical camera: macro 8-ball -> tracking shot -> overhead reveal.
      const s=e(.65,2.3,t),q=e(1.55,3.1,t);
      const eye=[lerp(0,1.2,s),lerp(1.08,5.5,s),lerp(-4.4,-2.8,s)];
      const look=[lerp(0,0,s),lerp(.34,0.0,s),lerp(-1.76,2.6,s)];
      // Landing shot: a low three-quarter view down the table (balls stay large enough to read their numbers).
      eye[0]=lerp(eye[0],1.9,q);eye[1]=lerp(eye[1],4.3,q);eye[2]=lerp(eye[2],-6.4,q);
      look[0]=lerp(look[0],-.25,q);look[2]=lerp(look[2],1.3,q);
      if(portrait){eye[1]*=1.23;eye[2]-=.65;}
      return {eye,look,fov:lerp(portrait?44:47,portrait?58:56,e(1.0,2.65,t))};
    }
    function draw(t){
      if(!render)return;
      const {gl,u}=render;
      const {eye,look,fov}=camera(t);
      gl.uniform2f(u.res,canvas.width,canvas.height);
      gl.uniform3fv(u.eye,eye);gl.uniform3fv(u.look,look);
      gl.uniform1f(u.fov,fov);gl.uniform1f(u.time,t);
      let packed=new Float32Array(16*4),quats=new Float32Array(16*4);
      for(let i=0;i<Math.min(16,balls.length);i++){
        const b=balls[i];packed[4*i]=b.x;packed[4*i+1]=b.h;packed[4*i+2]=b.z;packed[4*i+3]=b.id;
        quats[4*i]=b.q[0];quats[4*i+1]=b.q[1];quats[4*i+2]=b.q[2];quats[4*i+3]=b.q[3];
      }
      gl.uniform4fv(u.balls,packed);gl.uniform4fv(u.q,quats);gl.drawArrays(gl.TRIANGLES,0,3);
    }
    function reveal(){
      result.hidden=false;reset.hidden=false;trigger.hidden=true;skip.hidden=true;
      play.classList.add('is-revealed');status.textContent='All 13 clubs are ready to explore.';
    }
    function finish(){
      if(mode==='finished')return;
      window.cancelAnimationFrame(frame);frame=0;mode='finished';
      poster.hidden=true;play.classList.remove('is-playing');note.textContent='THE NEXT SHOT IS YOURS';
      reveal();draw(3.3);
      // No automatic jump unless the location choices are offscreen.
      postTimer=window.setTimeout(()=>{
        if(document.hidden||result.hidden)return;
        const r=result.getBoundingClientRect();if(r.bottom>innerHeight-20&&r.top>innerHeight-40)result.scrollIntoView({behavior:reduce.matches?'auto':'smooth',block:'nearest'});
      },220);
    }
    function loop(now){
      if(mode!=='playing')return;
      if(!startAt)startAt=now;
      const T=window.BREAK_TIMING||{},dur=T.duration||4.5;
      elapsed=Math.min(dur,(now-startAt)/1000*(T.speed||1));
      // Simulation follows wall time, not render frame count. Slow devices do not
      // turn a four-second animation into a fifteen-second wait.
      while(physicsElapsed+1e-6<elapsed){
        const sub=Math.min(1/165,elapsed-physicsElapsed);
        physics(sub);physicsElapsed+=sub;
      }
      draw(elapsed);
      if(elapsed>=dur){finish();return;}
      frame=requestAnimationFrame(loop);
    }
    function start(instant=false){
      if(mode==='playing')return;
      if(mode==='finished')rerack();
      if(instant||reduce.matches||!render){finish();return;}
      mode='playing';trigger.disabled=true;poster.disabled=true;
      play.classList.add('is-playing');note.textContent='THE SHOT · IN MOTION';
      elapsed=0;physicsElapsed=0;last=0;startAt=0;impact=false;breakImpact=false;
      status.textContent='3D pool break: cue ball rolling toward the 8-ball.';
      frame=requestAnimationFrame(loop);
    }
    function rerack(){
      if(frame)cancelAnimationFrame(frame);window.clearTimeout(postTimer);
      frame=0;mode='ready';last=0;startAt=0;elapsed=0;physicsElapsed=0;impact=false;breakImpact=false;
      rack();draw(0);play.classList.remove('is-playing','is-revealed');
      poster.hidden=false;poster.disabled=false;
      result.hidden=true;trigger.hidden=false;trigger.disabled=false;skip.hidden=false;reset.hidden=true;
      note.textContent='THE SHOT · IN MOTION';status.textContent='Ready to take another shot.';
    }
    trigger.addEventListener('click',()=>start());poster.addEventListener('click',()=>start());skip.addEventListener('click',()=>start(true));reset.addEventListener('click',rerack);
    rack();new ResizeObserver(size).observe(stage);size();
    if(!render){
      // Honest fallback: no false claim of animated 3D if graphics unavailable.
      trigger.textContent='Explore 13 locations';poster.setAttribute('aria-label','Show all 13 club locations');
      note.textContent='YOUR NEXT CLUB';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
