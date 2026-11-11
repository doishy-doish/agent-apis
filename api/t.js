// vault keys: scratch/vault/keys/ (values never in code; see scratch/STANDARDS.md)
const E=require("../lib/engines.js");const T=require("../lib/tools.js");
module.exports=(req,res)=>{ const name=String((req.query||{}).tool||"").toLowerCase();
 const t=T.find(t=>t.s===name); if(!t){res.setHeader("content-type","application/json");res.status(404).send(JSON.stringify({ok:false,tools:T.length}));return;}
 const p=req.query||{}; let r;
 try{ if(t.e==="gate")r=E.gate(t.x,p); else if(t.e==="convert")r=E.convert(t.x,p); else if(t.e==="calc"){const f=new Function("p","with(p){return ("+t.x.expr+")}"); r={ok:true,value:Math.round(f(p)*1e6)/1e6};}
  else if(t.e==="lookup")r=E.lookup(t.x,p); else if(t.e.startsWith("text:"))r=E.text(t.e.slice(5),p); else if(t.e==="template")r=E.template(t.x,p);
  else if(t.e==="link")r=E.link(t.x,p); else if(t.e==="sim")r=E.sim(t.x,p); else r={ok:false}; }
 catch(e){ r={ok:false,error:String(e).slice(0,120)}; }
 res.setHeader("content-type","application/json"); res.status(200).send(JSON.stringify({tool:t.s,...r})); };