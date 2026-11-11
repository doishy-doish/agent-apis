// vault keys: scratch/vault/keys/ (values never in code; see scratch/STANDARDS.md)

function num(v,d=0){ v=parseFloat(v); return Number.isFinite(v)?v:d; }
const E = {
 gate(items,p){ let s=0,t=0; const got=[]; for(const c of items){ t+=c.w; if(String(p[c.k]).toLowerCase()[0]==="y"||p[c.k]==="1"){s+=c.w;got.push(c.k);} }
   const sc=Math.round(100*s/Math.max(1,t)); return {ok:true,score:sc,verdict:sc>=75?"FIT":sc>=45?"MAYBE":"SKIP",matched:got}; },
 convert(o,p){ const r=o.rates[p.to||o.def]; if(r===undefined) return {ok:false,error:"unknown target"}; return {ok:true,value:num(p.amount)*r,rate:r}; },
 calc(o,p){ const f=new Function("p","with(p){return ("+o.expr+")}"); const v=f(p); return {ok:true,value:Math.round(v*1e6)/1e6}; },
 lookup(o,p){ const q=String(p.q||"").toLowerCase().trim(); const k=Object.keys(o.table).find(k=>k.toLowerCase()===q)||Object.keys(o.table).find(k=>k.toLowerCase().includes(q)&&q);
   return k?{ok:true,hit:o.table[k],key:k}:{ok:true,hit:null,suggest:Object.keys(o.table).slice(0,8)}; },
 text(fn,p){ const t=String(p.text||""); const w=t.trim().split(/\s+/).filter(Boolean);
   const M={ density:()=>{const f={}; w.forEach(x=>{x=x.toLowerCase().replace(/[^a-z0-9]/g,""); if(x.length>3)f[x]=(f[x]||0)+1;});
     return {top:Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>({k,v:v/w.length}))}; },
    stats:()=>({words:w.length,chars:t.length,readMin:Math.round(w.length/200*10)/10}),
    slug:()=>({slug:t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,80)}),
    flesch:()=>{const s=t.split(/[.!?]+/).filter(Boolean).length||1; const sy=w.reduce((n,x)=>n+Math.max(1,(x.match(/[aeiouy]+/gi)||[]).length),0);
     return {flesch:Math.round((206.835-1.015*w.length/s-84.6*sy/Math.max(1,w.length))*10)/10}}};
   return {ok:true,...(M[fn]?M[fn]():{error:"unknown fn"})}; },
 template(o,p){ let s=o.text; for(const k of Object.keys(p)) s=s.split("{"+k+"}").join(String(p[k])); return {ok:true,text:s}; },
 link(o,p){ return {ok:true,url:o.base+encodeURIComponent(p.addr||"")}; },
 sim(o,p){ let s=num(p.seed,1); const rnd=()=>{s=(s*1103515245+12345)%2147483648; return s/2147483648;};
   const n=Math.min(5000,Math.max(1,parseInt(p.n||1000,10))); let run=0,tot=0;
   for(let i=0;i<n;i++){ let e=0; for(let j=0;j<num(p.entries,20);j++) if(rnd()<num(p.rate,0.05)) e++; const fees=num(p.entries,20)*num(p.fee,0.5);
     if(fees>=num(p.prize,10)+num(p.ops,1)+2){run++; tot+=fees;} }
   return {ok:true,simRuns:n,runRate:Math.round(run/n*1000)/10,avgGross:Math.round(tot/Math.max(1,run)*100)/100}; },
};
module.exports=E;