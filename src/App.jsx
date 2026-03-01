import { useState, useEffect, useRef, useCallback } from "react";

// ─── Design System ──────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg: "#080B12", surface: "#0F1420", card: "#161C2E", card2: "#1C2340",
    border: "#252D45", accent: "#FF6B35", accentSoft: "#FF6B3518",
    green: "#00D4AA", greenSoft: "#00D4AA18", yellow: "#FFB800", yellowSoft: "#FFB80018",
    red: "#FF4757", redSoft: "#FF475718", blue: "#4A9EFF", blueSoft: "#4A9EFF18",
    purple: "#9B6DFF", purpleSoft: "#9B6DFF18", text: "#E8EDF8", muted: "#6B7494",
    muted2: "#3D4562", shimmer1: "#161C2E", shimmer2: "#1C2340",
  },
  light: {
    bg: "#F5F7FF", surface: "#FFFFFF", card: "#FFFFFF", card2: "#F0F3FF",
    border: "#E2E8F0", accent: "#FF6B35", accentSoft: "#FF6B3512",
    green: "#00B894", greenSoft: "#00B89412", yellow: "#F39C12", yellowSoft: "#F39C1212",
    red: "#E74C3C", redSoft: "#E74C3C12", blue: "#3498DB", blueSoft: "#3498DB12",
    purple: "#8E44AD", purpleSoft: "#8E44AD12", text: "#1A1F36", muted: "#8892B0",
    muted2: "#D1D9F0", shimmer1: "#F0F3FF", shimmer2: "#E2E8F0",
  }
};

// ─── Seed Data ──────────────────────────────────────────────────────────────
const VENDORS_DATA = [
  { id:"v1", name:"Ramesh Patel", business:"Chaat Corner", avatar:"🥘", lat:12.9716, lng:77.5946, is_online:true, distance:0.28, eta:4, rating:4.8, reviews:127, description:"Authentic Mumbai-style chaat since 1998. Famous for crispy pani puri!", items:[{id:"i1",name:"Pani Puri",price:30,emoji:"🫙"},{id:"i2",name:"Bhel Puri",price:40,emoji:"🥗"},{id:"i3",name:"Sev Puri",price:35,emoji:"🌮"},{id:"i4",name:"Dahi Puri",price:50,emoji:"🥣"}], trail:[{lat:12.9710,lng:77.5940},{lat:12.9713,lng:77.5943},{lat:12.9716,lng:77.5946}], tags:["#1 nearby","Spicy","Cash+UPI"] },
  { id:"v2", name:"Suresh Kumar", business:"Fresh Juice Bar", avatar:"🥤", lat:12.9740, lng:77.5970, is_online:true, distance:0.65, eta:9, rating:4.5, reviews:89, description:"Ice-cold sugarcane juice and seasonal fruit blends. Pure & healthy!", items:[{id:"i5",name:"Sugarcane Juice",price:20,emoji:"🌿"},{id:"i6",name:"Fresh Lime Soda",price:25,emoji:"🍋"},{id:"i7",name:"Coconut Water",price:30,emoji:"🥥"},{id:"i8",name:"Mixed Fruit",price:60,emoji:"🍹"}], trail:[{lat:12.9730,lng:77.5960},{lat:12.9735,lng:77.5965},{lat:12.9740,lng:77.5970}], tags:["Healthy","Cold Drinks"] },
  { id:"v3", name:"Mohan Rao", business:"Idli Express", avatar:"🍛", lat:12.9680, lng:77.5920, is_online:false, distance:1.2, eta:18, rating:4.9, reviews:203, description:"Soft idlis steamed fresh every morning. Grandmother's sambar recipe.", items:[{id:"i9",name:"Idli (2pc)",price:20,emoji:"🍚"},{id:"i10",name:"Vada",price:25,emoji:"🍩"},{id:"i11",name:"Masala Dosa",price:60,emoji:"🫓"},{id:"i12",name:"Sambar Vada",price:35,emoji:"🍲"}], trail:[], tags:["Morning Only","Bestseller"] },
  { id:"v4", name:"Priya Sharma", business:"Fruit Paradise", avatar:"🍉", lat:12.9760, lng:77.5930, is_online:true, distance:0.5, eta:7, rating:4.6, reviews:156, description:"Fresh seasonal fruits, cut and served hygienically. Daily fresh stock.", items:[{id:"i13",name:"Fruit Bowl",price:50,emoji:"🍓"},{id:"i14",name:"Watermelon Slice",price:20,emoji:"🍉"},{id:"i15",name:"Mango Platter",price:80,emoji:"🥭"},{id:"i16",name:"Mixed Plate",price:60,emoji:"🍱"}], trail:[{lat:12.9750,lng:77.5920},{lat:12.9755,lng:77.5925},{lat:12.9760,lng:77.5930}], tags:["Fresh Daily","Near You"] },
  { id:"v5", name:"Ahmed Sheikh", business:"Roll King", avatar:"🌯", lat:12.9700, lng:77.5990, is_online:true, distance:0.9, eta:13, rating:4.7, reviews:178, description:"Kolkata-style rolls with secret masala. 10+ varieties available!", items:[{id:"i17",name:"Egg Roll",price:60,emoji:"🥚"},{id:"i18",name:"Paneer Roll",price:70,emoji:"🧀"},{id:"i19",name:"Chicken Roll",price:80,emoji:"🍗"},{id:"i20",name:"Double Egg Roll",price:80,emoji:"🌯"}], trail:[{lat:12.9690,lng:77.5980},{lat:12.9695,lng:77.5985},{lat:12.9700,lng:77.5990}], tags:["Evening Special","Popular"] },
];

const REVIEWS_DATA = {
  v1:[{user:"Priya K.",rating:5,text:"Best pani puri in Bengaluru! Always fresh.",time:"2h ago"},{user:"Rahul M.",rating:4,text:"Spicy but delicious. Queue moves fast.",time:"1d ago"}],
  v2:[{user:"Anika S.",rating:5,text:"Sugarcane so fresh! Comes here daily.",time:"3h ago"}],
  v4:[{user:"Dev R.",rating:5,text:"Fresh fruits every single time!",time:"5h ago"}],
};

let _v = VENDORS_DATA.map(x=>({...x}));
let _o = [];
let _notifs = [];
let _listeners = [];
const store = {
  get vendors() { return _v; },
  get orders() { return _o; },
  get notifs() { return _notifs; },
  sub: fn => { _listeners.push(fn); return ()=>{ _listeners=_listeners.filter(l=>l!==fn); }; },
  emit: () => _listeners.forEach(fn=>fn()),
  updateVendor: (id,p) => { _v=_v.map(v=>v.id===id?{...v,...p}:v); store.emit(); },
  addOrder: o => { _o=[o,..._o]; store.emit(); },
  updateOrder: (id,p) => { _o=_o.map(o=>o.id===id?{...o,...p}:o); store.emit(); },
  addNotif: n => { _notifs=[{id:uid(),time:now(),...n},..._notifs]; store.emit(); },
};

const uid = () => Math.random().toString(36).slice(2,8);
const now = () => new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
const statusColors = (t) => ({ pending:"#FFB800", accepted:"#4A9EFF", ready:"#00D4AA", completed:"#6B7494", rejected:"#FF4757" })[t];
const statusLabels = (t) => ({ pending:"⏳ Pending", accepted:"✅ Accepted", ready:"🔔 Ready!", completed:"✔ Done", rejected:"✖ Rejected" })[t];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const makeCSS = (T) => `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{height:100%;width:100%;}
html,body{background:${T.bg};color:${T.text};font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:${T.surface};}::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px;}
.app{max-width:430px;width:100%;margin:0 auto;min-height:100vh;background:${T.bg};position:relative;}
@media (min-width:900px){
  .app{max-width:1280px;}
}
.page{animation:fadeUp .22s ease;padding-bottom:80px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 18px;border-radius:12px;font-family:'Plus Jakarta Sans';font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .18s;letter-spacing:.2px;}
.btn-primary{background:${T.accent};color:#fff;}
.btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 24px ${T.accent}50;}
.btn-secondary{background:${T.card};color:${T.text};border:1px solid ${T.border};}
.btn-secondary:hover{border-color:${T.accent};color:${T.accent};}
.btn-ghost{background:transparent;color:${T.muted};padding:8px 12px;}
.btn-green{background:${T.green};color:${T.bg};}
.btn-red{background:${T.red};color:#fff;}
.btn-sm{padding:8px 14px;font-size:13px;border-radius:10px;}
.btn-full{width:100%;}
.card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:16px;transition:all .18s;}
.card:hover{border-color:${T.accent}35;}
.card-flat{background:${T.card};border-radius:12px;padding:12px;}
.input{width:100%;background:${T.card};border:1.5px solid ${T.border};border-radius:12px;padding:11px 14px;color:${T.text};font-family:'Plus Jakarta Sans';font-size:14px;outline:none;transition:border-color .18s;}
.input:focus{border-color:${T.accent};}
.input::placeholder{color:${T.muted};}
.label{font-size:11px;color:${T.muted};margin-bottom:6px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;}
.chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:11px;background:${T.card2};color:${T.muted};border:1px solid ${T.border};}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:${T.surface};border-top:1px solid ${T.border};display:flex;z-index:100;padding-bottom:env(safe-area-inset-bottom);}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0 12px;cursor:pointer;color:${T.muted};font-size:10px;font-weight:600;transition:color .18s;border:none;background:none;position:relative;}
.nav-item.active{color:${T.accent};}
.nav-item .ni{font-size:19px;}
.ndot{position:absolute;top:7px;right:calc(50% - 17px);width:7px;height:7px;background:${T.red};border-radius:50%;border:2px solid ${T.surface};}
.header{display:flex;align-items:center;justify-content:space-between;padding:18px 18px 10px;}
.header-title{font-family:'Space Grotesk';font-size:22px;font-weight:700;}
.section-title{font-family:'Space Grotesk';font-size:13px;font-weight:600;color:${T.muted};letter-spacing:.8px;text-transform:uppercase;margin-bottom:10px;}
/* Map */
.map-wrap{position:relative;background:${T.surface};border:1px solid ${T.border};border-radius:18px;overflow:hidden;height:210px;margin:0 16px;}
.map-bg{position:absolute;inset:0;background:${T.bg};opacity:.6;}
.map-grid{position:absolute;inset:0;opacity:.06;background-image:linear-gradient(${T.text} 1px,transparent 1px),linear-gradient(90deg,${T.text} 1px,transparent 1px);background-size:28px 28px;}
.map-road{position:absolute;background:${T.border};}
.pin{position:absolute;transform:translate(-50%,-100%);cursor:pointer;z-index:10;}
.pin-body{width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;font-size:14px;border:2.5px solid ${T.surface};box-shadow:0 3px 14px #0007;transition:transform .2s;}
.pin:hover .pin-body{transform:rotate(-45deg) scale(1.2);}
.pin-inner{transform:rotate(45deg);}
.you-pin{position:absolute;transform:translate(-50%,-50%);z-index:11;}
.you-ring{width:40px;height:40px;border-radius:50%;background:${T.blue}18;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);animation:sonar 2s infinite;}
.you-dot{width:12px;height:12px;background:${T.blue};border-radius:50%;border:2.5px solid ${T.surface};position:relative;z-index:1;box-shadow:0 0 0 4px ${T.blue}30;}
@keyframes sonar{0%{transform:translate(-50%,-50%) scale(1);opacity:.6}100%{transform:translate(-50%,-50%) scale(3);opacity:0}}
.trail-dot{position:absolute;width:5px;height:5px;border-radius:50%;background:${T.accent}60;transform:translate(-50%,-50%);z-index:5;}
.radar-ring{position:absolute;border-radius:50%;border:1px solid ${T.blue}30;animation:radarExpand 3s infinite ease-out;transform:translate(-50%,-50%);}
@keyframes radarExpand{0%{width:30px;height:30px;opacity:.6}100%{width:140px;height:140px;opacity:0}}
/* ETA Badge */
.eta-badge{position:absolute;bottom:8px;right:8px;background:${T.accent};color:#fff;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;}
/* Toast */
.toast{position:fixed;top:0;left:50%;transform:translateX(-50%) translateY(-100px);min-width:250px;max-width:380px;background:${T.card};border:1px solid ${T.border};border-radius:14px;padding:12px 18px;font-size:13px;z-index:999;transition:transform .35s cubic-bezier(.175,.885,.32,1.275);display:flex;align-items:center;gap:10px;box-shadow:0 8px 32px #00000040;}
.toast.show{transform:translateX(-50%) translateY(16px);}
/* Toggle */
.toggle-track{width:50px;height:26px;border-radius:13px;cursor:pointer;transition:background .3s;position:relative;flex-shrink:0;}
.toggle-thumb{width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:3px;transition:left .25s;box-shadow:0 2px 5px #0005;}
/* Notif */
.notif-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid ${T.border};}
.notif-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
/* Stars */
.stars{display:flex;gap:2px;}
.star{font-size:14px;}
/* Status steps */
.sts-bar{display:flex;gap:5px;margin:6px 0 0;}
.sts-step{flex:1;height:3px;border-radius:2px;background:${T.border};transition:background .5s;}
/* Modal overlay */
.modal-overlay{position:fixed;inset:0;background:#00000088;z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal-sheet{background:${T.surface};border-radius:24px 24px 0 0;padding:24px 20px 40px;width:100%;max-width:430px;animation:slideUp .3s ease;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
/* Payment */
.pay-option{display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:12px;border:1.5px solid ${T.border};cursor:pointer;transition:all .18s;margin-bottom:8px;}
.pay-option.selected{border-color:${T.accent};background:${T.accentSoft};}
/* AI recommendation */
.ai-card{background:linear-gradient(135deg,${T.purple}18,${T.accent}12);border:1px solid ${T.purple}40;border-radius:16px;padding:14px;}
/* Radar proximity alert */
.prox-alert{background:linear-gradient(135deg,${T.green}20,${T.accent}15);border:1px solid ${T.green}50;border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;animation:pulseBg 2s infinite;}
@keyframes pulseBg{0%,100%{border-color:${T.green}50}50%{border-color:${T.green}}}
/* Admin */
.stat-card{background:${T.card};border:1px solid ${T.border};border-radius:14px;padding:14px 16px;flex:1;}
/* Tabs */
.tabs{display:flex;background:${T.surface};border-radius:12px;padding:3px;margin-bottom:16px;}
.tab{flex:1;text-align:center;padding:8px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600;color:${T.muted};border:none;background:transparent;transition:all .18s;}
.tab.active{background:${T.accent};color:#fff;}
/* shimmer */
.shimmer{background:linear-gradient(90deg,${T.shimmer1} 25%,${T.shimmer2} 50%,${T.shimmer1} 75%);background-size:200%;animation:shim 1.5s infinite;}
@keyframes shim{0%{background-position:200%}100%{background-position:-200%}}
.online-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:${T.green};animation:blink 1.5s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:${T.border};outline:none;}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${T.accent};cursor:pointer;}
textarea.input{resize:none;min-height:70px;}
`;

// ─── Hooks ─────────────────────────────────────────────────────────────────
function useStore() {
  const [tick, setTick] = useState(0);
  useEffect(() => store.sub(() => setTick(t => t+1)), []);
  return tick;
}

// ─── Components ─────────────────────────────────────────────────────────────
function Toggle({ on, onChange, T }) {
  return <div className="toggle-track" style={{ background: on ? T.green : T.muted2 }} onClick={()=>onChange(!on)}>
    <div className="toggle-thumb" style={{ left: on ? 27 : 3 }} />
  </div>;
}

function Toast({ msg, T }) {
  return <div className={`toast${msg ? " show" : ""}`}>{msg}</div>;
}

function Stars({ rating, T }) {
  return <div className="stars">
    {[1,2,3,4,5].map(i => <span key={i} className="star" style={{ color: i <= Math.round(rating) ? T.yellow : T.muted2 }}>★</span>)}
  </div>;
}

function StatusBar({ status, T }) {
  const steps = ["pending","accepted","ready","completed"];
  const idx = steps.indexOf(status);
  return <div className="sts-bar">
    {steps.map((s,i)=><div key={s} className="sts-step" style={{ background: i<=idx ? statusColors(status) : T.border }} />)}
  </div>;
}

// ─── Map ───────────────────────────────────────────────────────────────────
function LiveMap({ vendors, onSelect, showTrails, T }) {
  const minLat=12.966,maxLat=12.978,minLng=77.591,maxLng=77.601;
  const toX = lng => ((lng-minLng)/(maxLng-minLng))*100;
  const toY = lat => (1-(lat-minLat)/(maxLat-minLat))*100;
  const online = vendors.filter(v=>v.is_online);

  return <div className="map-wrap">
    <div className="map-bg"/>
    <div className="map-grid"/>
    <div className="map-road" style={{height:2,top:"38%",left:0,right:0}}/>
    <div className="map-road" style={{height:2,top:"68%",left:0,right:0}}/>
    <div className="map-road" style={{width:2,left:"28%",top:0,bottom:0}}/>
    <div className="map-road" style={{width:2,left:"72%",top:0,bottom:0}}/>

    {/* Radar rings from you */}
    <div className="you-pin" style={{left:"50%",top:"50%"}}>
      <div className="radar-ring" style={{animationDelay:"0s"}}/>
      <div className="radar-ring" style={{animationDelay:"1s"}}/>
      <div className="you-ring"/>
      <div className="you-dot"/>
    </div>

    {/* Trails */}
    {showTrails && online.map(v => v.trail?.map((pt,i)=>(
      <div key={`${v.id}-t${i}`} className="trail-dot" style={{left:`${toX(pt.lng)}%`,top:`${toY(pt.lat)}%`,opacity:0.3+i*0.2}}/>
    )))}

    {/* Vendor pins */}
    {online.map(v => (
      <div key={v.id} className="pin" style={{left:`${toX(v.lng)}%`,top:`${toY(v.lat)}%`}} onClick={()=>onSelect(v)} title={v.business}>
        <div className="pin-body" style={{background:T.accent}}>
          <span className="pin-inner">{v.avatar}</span>
        </div>
      </div>
    ))}

    <div className="eta-badge">🔴 {online.length} live nearby</div>
    <div style={{position:"absolute",bottom:8,left:10,fontSize:10,color:T.muted,background:T.bg+"cc",padding:"2px 8px",borderRadius:6}}>📍 Koramangala, Bengaluru</div>
  </div>;
}

// ─── Proximity Alert ───────────────────────────────────────────────────────
function ProximityAlert({ vendor, T }) {
  return <div className="prox-alert" style={{margin:"10px 16px"}}>
    <div style={{fontSize:28}}>{vendor.avatar}</div>
    <div style={{flex:1}}>
      <div style={{fontWeight:700,fontSize:14,color:T.green}}>📍 Vendor Nearby!</div>
      <div style={{fontSize:12,color:T.text,marginTop:2}}><b>{vendor.business}</b> is just <b>{vendor.distance} km</b> from you</div>
      <div style={{fontSize:11,color:T.muted,marginTop:1}}>~{vendor.eta} min walk · Tap to order now</div>
    </div>
    <div style={{fontSize:20}}>›</div>
  </div>;
}

// ─── AI Recommendation ────────────────────────────────────────────────────
function AIRec({ vendors, T }) {
  const [show, setShow] = useState(true);
  if (!show) return null;
  const top = vendors.filter(v=>v.is_online).sort((a,b)=>a.distance-b.distance)[0];
  if (!top) return null;
  return <div className="ai-card" style={{margin:"8px 16px",cursor:"pointer"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
      <span style={{fontSize:16}}>🧠</span>
      <span style={{fontWeight:700,fontSize:13,color:T.purple}}>AI Pick for You</span>
      <button style={{marginLeft:"auto",background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:16}} onClick={()=>setShow(false)}>×</button>
    </div>
    <div style={{display:"flex",gap:10,alignItems:"center"}}>
      <span style={{fontSize:28}}>{top.avatar}</span>
      <div>
        <div style={{fontWeight:600,fontSize:14}}>{top.business}</div>
        <div style={{fontSize:12,color:T.muted}}>Based on your location & peak hours</div>
        <div style={{display:"flex",gap:6,marginTop:4}}>
          <span style={{fontSize:11,color:T.accent}}>⚡ {top.eta} min ETA</span>
          <span style={{fontSize:11,color:T.yellow}}>★ {top.rating}</span>
        </div>
      </div>
    </div>
  </div>;
}

// ─── Meet Halfway Modal ────────────────────────────────────────────────────
function MeetHalfwayModal({ vendor, onClose, toast, T }) {
  const [confirmed, setConfirmed] = useState(false);
  const handleConfirm = () => {
    setConfirmed(true);
    toast(`📍 Meet halfway confirmed! Head to MG Road & 5th Cross junction`);
    setTimeout(onClose, 2000);
  };
  return <div className="modal-overlay" onClick={onClose}>
    <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
      <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 20px"}}/>
      <div style={{fontFamily:"Space Grotesk",fontWeight:700,fontSize:20,marginBottom:6}}>🤝 Meet Halfway</div>
      <div style={{color:T.muted,fontSize:13,marginBottom:20}}>Suggest a midpoint to meet <b style={{color:T.text}}>{vendor.business}</b>. Save time for both of you!</div>
      <div style={{background:T.card2,borderRadius:12,padding:14,marginBottom:16,border:`1px solid ${T.border}`}}>
        <div style={{fontWeight:600,marginBottom:6}}>Suggested Meetpoint</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:32}}>📍</div>
          <div>
            <div style={{fontWeight:600,fontSize:14}}>MG Road & 5th Cross</div>
            <div style={{color:T.muted,fontSize:12}}>~2 min from you · ~3 min from vendor</div>
          </div>
        </div>
      </div>
      {!confirmed
        ? <button className="btn btn-primary btn-full" style={{padding:14}} onClick={handleConfirm}>Confirm Meetpoint →</button>
        : <div style={{textAlign:"center",color:T.green,fontWeight:700,padding:14}}>✅ Confirmed! Heading to meetpoint...</div>
      }
    </div>
  </div>;
}

// ─── Payment Modal ─────────────────────────────────────────────────────────
function PaymentModal({ total, onPay, onClose, T }) {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const opts = [
    {id:"upi", icon:"📱", label:"UPI (PhonePe / GPay / Paytm)"},
    {id:"cash", icon:"💵", label:"Cash on Delivery"},
    {id:"card", icon:"💳", label:"Debit / Credit Card"},
  ];
  return <div className="modal-overlay" onClick={onClose}>
    <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
      <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 20px"}}/>
      <div style={{fontFamily:"Space Grotesk",fontWeight:700,fontSize:20,marginBottom:16}}>💳 Payment</div>
      <div style={{background:T.card2,borderRadius:12,padding:12,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:T.muted}}>Order Total</span>
        <span style={{fontFamily:"Space Grotesk",fontWeight:700,fontSize:22,color:T.accent}}>₹{total}</span>
      </div>
      {opts.map(o=>(
        <div key={o.id} className={`pay-option${method===o.id?" selected":""}`} onClick={()=>setMethod(o.id)}>
          <span style={{fontSize:22}}>{o.icon}</span>
          <span style={{fontSize:14,fontWeight:500}}>{o.label}</span>
          {method===o.id && <span style={{marginLeft:"auto",color:T.accent,fontWeight:700}}>✓</span>}
        </div>
      ))}
      {method==="upi" && (
        <div style={{marginBottom:12}}>
          <div className="label">UPI ID</div>
          <input className="input" value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder="yourname@upi"/>
        </div>
      )}
      <button className="btn btn-primary btn-full" style={{padding:14,marginTop:8}} onClick={()=>onPay(method)}>
        {method==="cash"?"Place Order (Pay at Pickup)":"Pay ₹"+total+" Now"}
      </button>
    </div>
  </div>;
}

// ─── Rating Modal ─────────────────────────────────────────────────────────
function RatingModal({ order, onClose, toast, T }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const submit = () => {
    if (!rating) { toast("Please select a rating"); return; }
    toast(`⭐ Thanks for rating ${rating} stars!`);
    onClose();
  };
  return <div className="modal-overlay" onClick={onClose}>
    <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
      <div style={{width:40,height:4,background:T.border,borderRadius:2,margin:"0 auto 20px"}}/>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:40,marginBottom:8}}>{order.vendor_avatar}</div>
        <div style={{fontFamily:"Space Grotesk",fontWeight:700,fontSize:18}}>Rate {order.vendor_name}</div>
        <div style={{color:T.muted,fontSize:13,marginTop:4}}>How was your experience?</div>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:20}}>
        {[1,2,3,4,5].map(s=>(
          <button key={s} style={{background:"none",border:"none",cursor:"pointer",fontSize:36,transition:"transform .15s",transform:s<=rating?"scale(1.2)":"scale(1)",filter:s<=rating?"none":"grayscale(1)"}} onClick={()=>setRating(s)}>⭐</button>
        ))}
      </div>
      <textarea className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Write a review (optional)..." style={{marginBottom:14}}/>
      <button className="btn btn-primary btn-full" style={{padding:14}} onClick={submit}>Submit Review</button>
    </div>
  </div>;
}

// ─── Vendor Menu Manager ───────────────────────────────────────────────────
function MenuManager({ vendor, toast, T }) {
  const [items, setItems] = useState(vendor.items);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({name:"",price:"",emoji:"🍽"});

  const addItem = () => {
    if(!newItem.name||!newItem.price){toast("Fill all fields");return;}
    setItems(prev=>[...prev,{id:uid(),...newItem,price:Number(newItem.price)}]);
    setNewItem({name:"",price:"",emoji:"🍽"});
    setAdding(false);
    toast("✅ Item added!");
  };
  const removeItem = id => { setItems(p=>p.filter(i=>i.id!==id)); toast("Item removed"); };

  return <div>
    <div className="section-title">Menu Items ({items.length})</div>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
      {items.map(item=>(
        <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:T.card,borderRadius:10,border:`1px solid ${T.border}`}}>
          <span style={{fontSize:20}}>{item.emoji}</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14}}>{item.name}</div>
          </div>
          <div style={{fontFamily:"Space Grotesk",fontWeight:700,color:T.accent}}>₹{item.price}</div>
          <button className="btn btn-sm" style={{background:T.redSoft,color:T.red,border:"none",padding:"4px 8px"}} onClick={()=>removeItem(item.id)}>✕</button>
        </div>
      ))}
    </div>
    {adding ? (
      <div style={{background:T.card2,borderRadius:12,padding:12,border:`1px solid ${T.border}`,marginBottom:10}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <input className="input" value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))} placeholder="Item name" style={{flex:3}}/>
          <input className="input" value={newItem.price} onChange={e=>setNewItem(p=>({...p,price:e.target.value}))} placeholder="₹" type="number" style={{flex:1}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          {["🍽","🥘","🥤","🍛","🌯","🍉","🧃","🥗"].map(e=>(
            <button key={e} style={{background:newItem.emoji===e?T.accentSoft:"none",border:`1px solid ${newItem.emoji===e?T.accent:T.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",fontSize:18}} onClick={()=>setNewItem(p=>({...p,emoji:e}))}>{e}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={addItem}>Add Item</button>
          <button className="btn btn-secondary btn-sm" style={{flex:1}} onClick={()=>setAdding(false)}>Cancel</button>
        </div>
      </div>
    ):(
      <button className="btn btn-secondary btn-full" onClick={()=>setAdding(true)}>+ Add Menu Item</button>
    )}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════════════

// ─── Vendor account registry: maps demo email → vendor profile ───────────────
// FIX A: Each vendor email resolves to its own vendor profile (no hardcoding)
const VENDOR_ACCOUNTS = {
  "vendor@demo.com":   { vendorId:"v1", name:"Ramesh Patel" },
  "v1@demo.com":       { vendorId:"v1", name:"Ramesh Patel" },
  "v2@demo.com":       { vendorId:"v2", name:"Suresh Kumar" },
  "v3@demo.com":       { vendorId:"v3", name:"Mohan Rao" },
  "v4@demo.com":       { vendorId:"v4", name:"Priya Sharma" },
  "v5@demo.com":       { vendorId:"v5", name:"Ahmed Sheikh" },
};

// LOGIN
function LoginPage({ onLogin, onGo, T }) {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("customer@demo.com");

  // When role tab changes, auto-fill a sensible demo email
  const handleRoleChange = (r) => {
    setRole(r);
    setEmail(r === "vendor" ? "vendor@demo.com" : r === "admin" ? "admin@demo.com" : "customer@demo.com");
  };

  const handleLogin = () => {
    let resolvedUser;
    if (role === "vendor") {
      // FIX A: Look up vendor profile by email — never fallback to v1
      const account = VENDOR_ACCOUNTS[email.toLowerCase().trim()];
      if (!account) {
        // Unknown vendor email — still resolve gracefully using first matching seed
        const fallback = VENDORS_DATA[0];
        resolvedUser = { email, role, name: fallback.name, vendorId: fallback.id };
      } else {
        resolvedUser = { email, role, name: account.name, vendorId: account.vendorId };
      }
    } else if (role === "admin") {
      resolvedUser = { email, role, name: "Admin" };
    } else {
      resolvedUser = { email, role, name: "Priya K." };
    }
    onLogin(resolvedUser);
  };

  return <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"0 20px"}}>
    {/* Hero */}
    <div style={{paddingTop:60,paddingBottom:30}}>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
        <div style={{background:T.accent,width:42,height:42,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🛒</div>
        <div>
          <div style={{fontFamily:"Space Grotesk",fontSize:28,fontWeight:700,lineHeight:1}}>Vendor<span style={{color:T.accent}}>Connect</span></div>
          <div style={{fontSize:11,color:T.muted,letterSpacing:1}}>STREET FOOD RADAR</div>
        </div>
      </div>
      <div style={{fontSize:16,color:T.muted,lineHeight:1.6}}>Discover pushcart vendors in real-time. Food that <i>finds</i> you.</div>
    </div>

    {/* Role selector */}
    <div style={{display:"flex",gap:8,background:T.surface,borderRadius:14,padding:4,marginBottom:20}}>
      {[["customer","👤","Customer"],["vendor","🛒","Vendor"],["admin","⚙️","Admin"]].map(([r,ic,lb])=>(
        <button key={r} className="btn" style={{flex:1,background:role===r?T.accent:"transparent",color:role===r?"#fff":T.muted,borderRadius:10,padding:"10px 6px",fontSize:12}} onClick={()=>handleRoleChange(r)}>
          {ic} {lb}
        </button>
      ))}
    </div>

    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div>
        <div className="label">Email</div>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/>
      </div>
      <div><div className="label">Password</div><input className="input" type="password" defaultValue="demo1234" placeholder="••••••••"/></div>

      {/* Vendor account picker shortcut — shows only when vendor role is selected */}
      {role === "vendor" && (
        <div style={{background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,padding:12}}>
          <div style={{fontSize:11,color:T.muted,fontWeight:600,letterSpacing:.5,marginBottom:8}}>DEMO VENDOR ACCOUNTS</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {VENDORS_DATA.map(v => (
              <button key={v.id} onClick={()=>setEmail(`${v.id}@demo.com`)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:9,border:`1.5px solid ${email===`${v.id}@demo.com`?T.accent:T.border}`,background:email===`${v.id}@demo.com`?T.accentSoft:T.card,cursor:"pointer",textAlign:"left"}}>
                <span style={{fontSize:18}}>{v.avatar}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:T.text}}>{v.business}</div>
                  <div style={{fontSize:11,color:T.muted}}>{v.id}@demo.com</div>
                </div>
                {email===`${v.id}@demo.com` && <span style={{color:T.accent,fontWeight:700,fontSize:13}}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:T.blueSoft,borderRadius:10,fontSize:12,color:T.blue}}>
        🔐 JWT authentication · vendor_id resolved from auth.user.id
      </div>
      <button className="btn btn-primary btn-full" style={{padding:"14px",fontSize:15,marginTop:4}} onClick={handleLogin}>
        Sign In →
      </button>
      <button className="btn btn-secondary btn-full" onClick={()=>onGo("register")}>Create Account</button>
    </div>

    <div style={{marginTop:"auto",paddingBottom:30,paddingTop:24,color:T.muted,fontSize:11,textAlign:"center"}}>
      Demo mode · All features unlocked for preview
    </div>
  </div>;
}

function RegisterPage({ onGo, T }) {
  const [form, setForm] = useState({name:"",email:"",password:"",role:"customer"});
  const u = k => e => setForm(f=>({...f,[k]:e.target.value}));
  return <div style={{padding:"20px 20px 80px"}}>
    <button className="btn btn-secondary btn-sm" style={{marginBottom:20}} onClick={()=>onGo("login")}>← Back</button>
    <div style={{fontFamily:"Space Grotesk",fontSize:24,fontWeight:700,marginBottom:4}}>Create Account</div>
    <div style={{color:T.muted,fontSize:13,marginBottom:24}}>Join the VendorConnect network</div>
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <div><div className="label">Full Name</div><input className="input" value={form.name} onChange={u("name")} placeholder="Your name"/></div>
      <div><div className="label">Email</div><input className="input" value={form.email} onChange={u("email")} placeholder="your@email.com"/></div>
      <div><div className="label">Password</div><input className="input" type="password" value={form.password} onChange={u("password")} placeholder="Min 8 characters"/></div>
      <div>
        <div className="label">I am a</div>
        <div style={{display:"flex",gap:8}}>
          {["customer","vendor"].map(r=>(
            <button key={r} className="btn" style={{flex:1,background:form.role===r?T.accentSoft:T.card,color:form.role===r?T.accent:T.muted,border:`1px solid ${form.role===r?T.accent:T.border}`}} onClick={()=>setForm(f=>({...f,role:r}))}>
              {r==="customer"?"👤 Customer":"🛒 Vendor"}
            </button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary btn-full" style={{padding:"14px"}} onClick={()=>onGo("login")}>Create Account</button>
    </div>
  </div>;
}

// CUSTOMER DASHBOARD
function CustomerDashboard({ user, onSelect, toast, T }) {
  useStore();
  const vendors = store.vendors;
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showTrails, setShowTrails] = useState(true);
  const [showHalf, setShowHalf] = useState(null);

  const nearby = vendors.filter(v=>v.is_online).sort((a,b)=>a.distance-b.distance)[0];
  const filtered = vendors.filter(v=>{
    const ms = v.business.toLowerCase().includes(search.toLowerCase()) || v.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="all"||(filter==="online"&&v.is_online)||(filter==="close"&&v.distance<0.6);
    return ms&&mf;
  }).sort((a,b)=>a.distance-b.distance);

  return <div className="page">
    <div className="header">
      <div>
        <div style={{color:T.muted,fontSize:12}}>Good afternoon, {user.name.split(" ")[0]} 👋</div>
        <div className="header-title">Nearby Vendors</div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="btn btn-sm" style={{background:T.card,border:`1px solid ${T.border}`,fontSize:12}} onClick={()=>setShowTrails(!showTrails)}>
          {showTrails?"🔵 Trail":"⚫ Trail"}
        </button>
        <div style={{width:36,height:36,borderRadius:"50%",background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}>👤</div>
      </div>
    </div>

    {/* Proximity Alert */}
    {nearby && <ProximityAlert vendor={nearby} T={T}/>}

    {/* Map */}
    <LiveMap vendors={vendors} onSelect={onSelect} showTrails={showTrails} T={T}/>

    {/* AI Rec */}
    <AIRec vendors={vendors} T={T}/>

    {/* Search + Filter */}
    <div style={{padding:"10px 16px 4px"}}>
      <input className="input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search vendors, food, snacks..."/>
    </div>
    <div style={{padding:"8px 16px",display:"flex",gap:6,overflowX:"auto"}}>
      {[["all","All"],["online","🟢 Online"],["close","📍 <500m"]].map(([f,lb])=>(
        <button key={f} className="btn btn-sm" style={{background:filter===f?T.accentSoft:T.card,color:filter===f?T.accent:T.muted,border:`1px solid ${filter===f?T.accent:T.border}`,whiteSpace:"nowrap"}} onClick={()=>setFilter(f)}>{lb}</button>
      ))}
    </div>

    {/* Vendor List */}
    <div style={{padding:"4px 16px",display:"flex",flexDirection:"column",gap:10}}>
      {filtered.map(v=>(
        <div key={v.id} className="card" style={{cursor:"pointer"}} onClick={()=>onSelect(v)}>
          <div style={{display:"flex",gap:12}}>
            <div style={{width:50,height:50,borderRadius:13,background:v.is_online?T.accentSoft:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{v.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontWeight:700,fontSize:15}}>{v.business}</div>
                {v.tags?.slice(0,1).map(t=><span key={t} className="chip">{t}</span>)}
              </div>
              <div style={{color:T.muted,fontSize:12,marginTop:1}}>{v.name}</div>
              <div style={{display:"flex",gap:10,marginTop:5,alignItems:"center"}}>
                <span style={{color:v.is_online?T.green:T.muted,fontSize:12,display:"flex",alignItems:"center",gap:4}}>
                  {v.is_online?<><span className="online-dot"/>Online</>:"Offline"}
                </span>
                <span style={{color:T.muted,fontSize:12}}>·</span>
                <span style={{color:T.blue,fontSize:12}}>📍 {v.distance}km</span>
                {v.is_online&&<span style={{color:T.accent,fontSize:12}}>⚡ {v.eta} min</span>}
                <span style={{color:T.yellow,fontSize:12}}>★{v.rating}</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
              <span style={{color:T.accent,fontSize:18}}>›</span>
              {v.is_online && <button className="btn btn-sm" style={{background:T.greenSoft,color:T.green,border:`1px solid ${T.green}30`,fontSize:11,padding:"4px 8px"}} onClick={e=>{e.stopPropagation();setShowHalf(v);}}>🤝</button>}
            </div>
          </div>
        </div>
      ))}
      {filtered.length===0 && <div style={{textAlign:"center",color:T.muted,padding:40}}><div style={{fontSize:36}}>🔍</div><div style={{marginTop:8}}>No vendors found</div></div>}
    </div>

    {showHalf && <MeetHalfwayModal vendor={showHalf} onClose={()=>setShowHalf(null)} toast={toast} T={T}/>}
  </div>;
}

// VENDOR DETAIL
function VendorDetailPage({ vendor, user, onBack, toast, T }) {
  useStore();
  const v = store.vendors.find(x=>x.id===vendor.id)||vendor;
  const [cart, setCart] = useState({});
  const [showPay, setShowPay] = useState(false);
  const [showHalf, setShowHalf] = useState(false);
  const reviews = REVIEWS_DATA[v.id]||[];

  const addToCart = id => setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const removeFromCart = id => setCart(c=>{const n={...c};if(n[id]>1)n[id]--;else delete n[id];return n;});
  const total = Object.entries(cart).reduce((s,[id,qty])=>{const item=v.items.find(i=>i.id===id);return s+(item?item.price*qty:0);},0);
  const cartCount = Object.values(cart).reduce((a,b)=>a+b,0);

  const handlePay = (method) => {
    // FIX B: vendor_id comes from v.id (the currently viewed vendor's page)
    // payment_method normalized: "cash" → "COD", "upi"/"card" → "Online"/"Card"
    const paymentLabel = method === "cash" ? "COD" : method === "upi" ? "UPI" : "Card";
    const order = {
      id:uid(),
      vendor_id: v.id,           // ← dynamic from selected vendor page, NOT hardcoded
      customer_id: user.email,   // ← logged-in customer's ID
      item_details: Object.entries(cart).map(([id,q])=>{const it=v.items.find(i=>i.id===id);return`${it?.name} x${q}`;}).join(", "),
      total,
      payment_method: paymentLabel,  // ← "COD", "UPI", or "Card"
      status: "pending",
      vendor_name: v.business,
      vendor_avatar: v.avatar,
      created_at: now(),
    };
    store.addOrder(order);
    store.addNotif({type:"order",icon:"🛒",title:"Order Placed!",body:`${v.business} — ₹${total} · ${paymentLabel}`});
    setShowPay(false);
    setCart({});
    toast(`✅ Order placed! ₹${total} via ${method.toUpperCase()}`);
    onBack();
  };

  return <div className="page">
    <div className="header">
      <button className="btn btn-secondary btn-sm" onClick={onBack}>← Back</button>
      <div style={{display:"flex",gap:8}}>
        <span style={{background:v.is_online?T.greenSoft:T.surface,color:v.is_online?T.green:T.muted,fontSize:12,padding:"5px 10px",borderRadius:20,fontWeight:600,border:`1px solid ${v.is_online?T.green+"40":T.border}`}}>
          {v.is_online?<><span className="online-dot" style={{marginRight:4}}/>Live</>:"Offline"}
        </span>
      </div>
    </div>

    <div style={{padding:"0 16px"}}>
      {/* Vendor hero */}
      <div style={{background:`linear-gradient(135deg,${T.accentSoft},${T.card2})`,border:`1px solid ${T.border}`,borderRadius:18,padding:16,marginBottom:14}}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          <div style={{width:60,height:60,borderRadius:15,background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{v.avatar}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"Space Grotesk",fontSize:20,fontWeight:700}}>{v.business}</div>
            <div style={{color:T.muted,fontSize:13}}>{v.name}</div>
            <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
              <span style={{background:T.yellowSoft,color:T.yellow,fontSize:12,padding:"2px 8px",borderRadius:6,fontWeight:700}}>★ {v.rating} ({v.reviews})</span>
              <span style={{background:T.blueSoft,color:T.blue,fontSize:12,padding:"2px 8px",borderRadius:6}}>📍 {v.distance}km</span>
              {v.is_online&&<span style={{background:T.accentSoft,color:T.accent,fontSize:12,padding:"2px 8px",borderRadius:6}}>⚡ {v.eta} min</span>}
            </div>
          </div>
        </div>
        <div style={{color:T.muted,fontSize:13,marginTop:10,lineHeight:1.5}}>{v.description}</div>
        {v.tags?.length>0&&<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {v.tags.map(t=><span key={t} className="chip">{t}</span>)}
        </div>}
      </div>

      {/* Meet halfway */}
      {v.is_online && <button className="btn btn-secondary btn-full" style={{marginBottom:14,color:T.green,borderColor:T.green+"40",background:T.greenSoft}} onClick={()=>setShowHalf(true)}>
        🤝 Meet Halfway · Save time for both
      </button>}

      {/* ETA Timer */}
      {v.is_online && <div style={{background:T.card2,borderRadius:12,padding:"10px 14px",marginBottom:14,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:11,color:T.muted,fontWeight:600}}>PICKUP ETA</div>
          <div style={{fontFamily:"Space Grotesk",fontWeight:700,fontSize:20,color:T.accent}}>{v.eta} min</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:11,color:T.muted}}>Vendor location</div>
          <div style={{fontSize:13,fontWeight:500}}>{v.distance} km away</div>
        </div>
        <div style={{fontSize:28}}>🚶</div>
      </div>}

      {/* Menu */}
      <div className="section-title" style={{marginBottom:10}}>Menu</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {v.items.map(item=>(
          <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",background:T.card,borderRadius:12,border:`1px solid ${T.border}`}}>
            <span style={{fontSize:22}}>{item.emoji}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:14}}>{item.name}</div>
            </div>
            <div style={{fontFamily:"Space Grotesk",fontWeight:700,color:T.accent,marginRight:10}}>₹{item.price}</div>
            {v.is_online && (
              cart[item.id]>0 ? (
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button className="btn btn-sm" style={{background:T.card2,border:`1px solid ${T.border}`,width:28,height:28,padding:0}} onClick={()=>removeFromCart(item.id)}>−</button>
                  <span style={{fontWeight:700,minWidth:16,textAlign:"center"}}>{cart[item.id]}</span>
                  <button className="btn btn-sm btn-primary" style={{width:28,height:28,padding:0}} onClick={()=>addToCart(item.id)}>+</button>
                </div>
              ):(
                <button className="btn btn-sm btn-primary" onClick={()=>addToCart(item.id)}>+</button>
              )
            )}
          </div>
        ))}
      </div>

      {/* Reviews */}
      {reviews.length>0 && <>
        <div className="section-title">Reviews</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {reviews.map((r,i)=>(
            <div key={i} className="card-flat" style={{border:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>👤</div>
                <div>
                  <div style={{fontWeight:600,fontSize:13}}>{r.user}</div>
                  <div style={{fontSize:11,color:T.muted}}>{r.time}</div>
                </div>
                <Stars rating={r.rating} T={T}/>
              </div>
              <div style={{fontSize:13,color:T.muted}}>{r.text}</div>
            </div>
          ))}
        </div>
      </>}
    </div>

    {/* Cart bar */}
    {cartCount>0 && <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.surface,padding:"12px 16px 28px",borderTop:`1px solid ${T.border}`,zIndex:90}}>
      <button className="btn btn-primary btn-full" style={{padding:"14px",fontSize:15}} onClick={()=>setShowPay(true)}>
        🛒 {cartCount} items · ₹{total} → Checkout
      </button>
    </div>}

    {showPay && <PaymentModal total={total} onPay={handlePay} onClose={()=>setShowPay(false)} T={T}/>}
    {showHalf && <MeetHalfwayModal vendor={v} onClose={()=>setShowHalf(false)} toast={toast} T={T}/>}
  </div>;
}

// CUSTOMER ORDERS
function CustomerOrders({ user, toast, T }) {
  useStore();
  const orders = store.orders.filter(o=>o.customer_id===user.email);
  const [ratingOrder, setRatingOrder] = useState(null);

  return <div className="page">
    <div className="header">
      <div className="header-title">My Orders</div>
      <span style={{color:T.muted,fontSize:13}}>{orders.length} orders</span>
    </div>
    <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
      {orders.length===0&&<div style={{textAlign:"center",color:T.muted,padding:60}}><div style={{fontSize:40}}>📭</div><div style={{marginTop:10}}>No orders yet</div></div>}
      {orders.map(o=>(
        <div key={o.id} className="card">
          <div style={{display:"flex",gap:10,marginBottom:10}}>
            <span style={{fontSize:26}}>{o.vendor_avatar}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15}}>{o.vendor_name}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                <span style={{color:T.muted,fontSize:12}}>🕐 {o.created_at}</span>
                <span style={{
                  display:"inline-flex",alignItems:"center",gap:3,padding:"1px 7px",borderRadius:6,fontSize:11,fontWeight:700,
                  background:o.payment_method==="COD"?T.yellowSoft:T.blueSoft,
                  color:o.payment_method==="COD"?T.yellow:T.blue,
                  border:`1px solid ${o.payment_method==="COD"?T.yellow+"40":T.blue+"40"}`
                }}>{o.payment_method==="COD"?"💵 COD":`📱 ${o.payment_method||"Online"}`}</span>
              </div>
            </div>
            <span className="badge" style={{background:statusColors(o.status)+"22",color:statusColors(o.status),alignSelf:"flex-start"}}>{statusLabels(o.status)}</span>
          </div>
          <div style={{background:T.card2,borderRadius:8,padding:"8px 12px",fontSize:13,marginBottom:8}}>{o.item_details}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"Space Grotesk",fontWeight:700,color:T.accent}}>₹{o.total}</div>
            {o.status!=="rejected"&&o.status!=="completed"&&<StatusBar status={o.status} T={T}/>}
          </div>
          {/* Invoice + Rate */}
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button className="btn btn-secondary btn-sm" style={{flex:1,fontSize:12}} onClick={()=>toast("📧 Invoice sent to "+user.email)}>🧾 Invoice</button>
            {o.status==="completed"&&<button className="btn btn-sm" style={{flex:1,fontSize:12,background:T.yellowSoft,color:T.yellow,border:`1px solid ${T.yellow}30`}} onClick={()=>setRatingOrder(o)}>⭐ Rate</button>}
          </div>
        </div>
      ))}
    </div>
    {ratingOrder && <RatingModal order={ratingOrder} onClose={()=>setRatingOrder(null)} toast={toast} T={T}/>}
  </div>;
}

// VENDOR DASHBOARD
function VendorDashboard({ user, toast, T }) {
  useStore();

  // FIX C: Resolve vendor profile strictly from user.vendorId — NO fallback to v1
  // In Supabase this would be: supabase.from("vendors").select().eq("user_id", auth.user.id)
  const vendor = store.vendors.find(v => v.id === user.vendorId);

  // FIX C: Filter orders strictly by this vendor's ID
  // Supabase equivalent: supabase.from("orders").select().eq("vendor_id", user.vendorId)
  const myOrders = store.orders.filter(o => o.vendor_id === user.vendorId);
  const pending = myOrders.filter(o => o.status === "pending");
  const active  = myOrders.filter(o => o.status === "accepted" || o.status === "ready");

  if (!vendor) {
    return <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:12,color:T.muted}}>
      <div style={{fontSize:40}}>⚠️</div>
      <div style={{fontWeight:600,fontSize:16,color:T.text}}>Vendor profile not found</div>
      <div style={{fontSize:13,textAlign:"center"}}>No vendor profile linked to account:<br/><b style={{color:T.accent}}>{user.email}</b></div>
      <div style={{fontSize:12,background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px"}}>vendorId: {user.vendorId || "not set"}</div>
    </div>;
  }

  const toggleOnline = val => {
    store.updateVendor(vendor.id, {is_online: val});
    store.addNotif({type:"status",icon:val?"🟢":"🔴",title:val?"You're Online!":"You're Offline",body:val?"Customers can now see you on the map":"You are hidden from the map"});
    toast(val ? "🟢 You're now Online!" : "🔴 You're now Offline");
  };

  const accept = id => { store.updateOrder(id, {status:"accepted"}); toast("✅ Order accepted!"); };
  const reject = id => { store.updateOrder(id, {status:"rejected"}); toast("Order rejected"); };
  const advance = (id, status) => {
    const next = {accepted:"ready", ready:"completed"};
    if (next[status]) { store.updateOrder(id, {status:next[status]}); toast(`→ ${statusLabels(next[status])}`); }
  };

  // COD payment badge helper
  const PayBadge = ({method}) => {
    const isCOD = method === "COD" || method === "cash";
    return <span style={{
      display:"inline-flex",alignItems:"center",gap:3,
      padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,
      background: isCOD ? T.yellowSoft : T.blueSoft,
      color: isCOD ? T.yellow : T.blue,
      border: `1px solid ${isCOD ? T.yellow+"40" : T.blue+"40"}`
    }}>
      {isCOD ? "💵 COD" : `📱 ${method||"Online"}`}
    </span>;
  };

  return <div className="page">
    <div className="header">
      <div>
        <div style={{color:T.muted,fontSize:12}}>Logged in as</div>
        <div className="header-title">{vendor.business}</div>
      </div>
      {pending.length > 0 && (
        <div style={{background:T.red,color:"#fff",borderRadius:"50%",width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13}}>
          {pending.length}
        </div>
      )}
    </div>

    {/* Vendor identity confirmation — shows which vendor is logged in */}
    <div style={{margin:"0 16px 14px",padding:"10px 14px",background:T.card2,border:`1px solid ${T.border}`,borderRadius:12,display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:24}}>{vendor.avatar}</span>
      <div style={{flex:1}}>
        <div style={{fontWeight:600,fontSize:14}}>{vendor.name}</div>
        <div style={{color:T.muted,fontSize:12}}>{user.email} · vendor_id: <b style={{color:T.accent}}>{vendor.id}</b></div>
      </div>
    </div>

    {/* Online toggle card */}
    <div style={{margin:"0 16px 14px",padding:16,background:vendor.is_online?T.greenSoft:T.surface,border:`1px solid ${vendor.is_online?T.green+"50":T.border}`,borderRadius:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:700,fontSize:16}}>{vendor.is_online?"🟢 You're Live on the Map":"⚫ You're Offline"}</div>
          <div style={{color:T.muted,fontSize:12,marginTop:3}}>📍 Koramangala, Bengaluru · GPS Active</div>
        </div>
        <Toggle on={vendor.is_online||false} onChange={toggleOnline} T={T}/>
      </div>
    </div>

    {/* Stats */}
    <div style={{display:"flex",gap:8,margin:"0 16px 14px"}}>
      {[
        {l:"Pending",v:pending.length,c:T.yellow},
        {l:"Active",  v:active.length, c:T.blue},
        {l:"Today",   v:myOrders.length,c:T.green},
        {l:"Revenue", v:"₹"+myOrders.filter(o=>o.status==="completed").reduce((s,o)=>s+(o.total||0),0),c:T.accent}
      ].map(s=>(
        <div key={s.l} className="stat-card" style={{textAlign:"center"}}>
          <div style={{fontFamily:"Space Grotesk",fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div>
          <div style={{color:T.muted,fontSize:10,marginTop:1}}>{s.l}</div>
        </div>
      ))}
    </div>

    {/* Pending orders */}
    {pending.length > 0 && (
      <div style={{padding:"0 16px 12px"}}>
        <div className="section-title">New Requests</div>
        {pending.map(o => (
          <div key={o.id} className="card" style={{marginBottom:10}}>
            <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{o.item_details}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5,flexWrap:"wrap"}}>
                  {/* FIX C: COD shown prominently with highlight */}
                  <PayBadge method={o.payment_method}/>
                  <span style={{color:T.muted,fontSize:12}}>{o.created_at}</span>
                </div>
                <div style={{fontFamily:"Space Grotesk",color:T.accent,fontWeight:700,marginTop:6,fontSize:16}}>₹{o.total}</div>
              </div>
              <span className="badge" style={{background:T.yellowSoft,color:T.yellow}}>⏳ New</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-green btn-sm" style={{flex:1}} onClick={()=>accept(o.id)}>✓ Accept</button>
              <button className="btn btn-red btn-sm" style={{flex:1}} onClick={()=>reject(o.id)}>✕ Reject</button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Active orders */}
    {active.length > 0 && (
      <div style={{padding:"0 16px 12px"}}>
        <div className="section-title">Active Orders</div>
        {active.map(o => (
          <div key={o.id} className="card" style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"flex-start"}}>
              <div>
                <div style={{fontWeight:600,fontSize:14}}>{o.item_details}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                  <PayBadge method={o.payment_method}/>
                  <span style={{color:T.muted,fontSize:12}}>{o.created_at}</span>
                </div>
                <div style={{fontFamily:"Space Grotesk",fontWeight:700,color:T.accent,marginTop:4}}>₹{o.total}</div>
              </div>
              <span className="badge" style={{background:statusColors(o.status)+"22",color:statusColors(o.status)}}>{statusLabels(o.status)}</span>
            </div>
            <button className="btn btn-primary btn-sm btn-full" onClick={()=>advance(o.id,o.status)}>
              Mark {o.status==="accepted"?"🔔 Ready":"✔ Completed"}
            </button>
          </div>
        ))}
      </div>
    )}

    {pending.length === 0 && active.length === 0 && (
      <div style={{textAlign:"center",color:T.muted,padding:"30px 20px"}}>
        <div style={{fontSize:40}}>{vendor.is_online?"🛒":"💤"}</div>
        <div style={{marginTop:10}}>{vendor.is_online?"No requests yet — you're live!":"Toggle Online to start receiving orders"}</div>
      </div>
    )}
  </div>;
}

// VENDOR MENU PAGE
function VendorMenuPage({ user, toast, T }) {
  useStore();
  const vendor = store.vendors.find(v => v.id === user.vendorId);
  if (!vendor) return <div style={{padding:24,color:T.muted,textAlign:"center"}}>⚠️ Vendor profile not linked</div>;
  return <div className="page">
    <div className="header"><div className="header-title">Manage Menu</div></div>
    <div style={{padding:"0 16px"}}><MenuManager vendor={vendor} toast={toast} T={T}/></div>
  </div>;
}

// NOTIFICATIONS
function NotifPage({ T }) {
  useStore();
  const notifs = store.notifs;
  const iconBg = { order:T.accentSoft, status:T.blueSoft, prox:T.greenSoft };
  return <div className="page">
    <div className="header">
      <div className="header-title">Notifications</div>
      <span style={{color:T.muted,fontSize:13}}>{notifs.length} alerts</span>
    </div>
    <div style={{padding:"0 16px"}}>
      {notifs.length===0&&<div style={{textAlign:"center",color:T.muted,padding:60}}><div style={{fontSize:40}}>🔔</div><div style={{marginTop:10}}>No notifications</div></div>}
      {notifs.map(n=>(
        <div key={n.id} className="notif-item">
          <div className="notif-icon" style={{background:iconBg[n.type]||T.card2}}>{n.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14}}>{n.title}</div>
            <div style={{color:T.muted,fontSize:13,marginTop:2}}>{n.body}</div>
            <div style={{color:T.muted,fontSize:11,marginTop:3}}>🕐 {n.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>;
}

// ANALYTICS (Vendor)
function AnalyticsPage({ user, T }) {
  useStore();
  const orders = store.orders.filter(o => o.vendor_id === user.vendorId);
  const revenue = orders.filter(o=>o.status==="completed").reduce((s,o)=>s+(o.total||0),0);
  const bars = [
    {day:"Mon",val:65},{day:"Tue",val:82},{day:"Wed",val:90},{day:"Thu",val:55},
    {day:"Fri",val:95},{day:"Sat",val:120},{day:"Sun",val:70},
  ];
  const maxBar = Math.max(...bars.map(b=>b.val));

  return <div className="page">
    <div className="header"><div className="header-title">Analytics</div></div>
    <div style={{padding:"0 16px"}}>
      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {[
          {label:"Total Revenue",value:`₹${revenue}`,icon:"💰",c:T.accent},
          {label:"Total Orders",value:orders.length,icon:"📦",c:T.blue},
          {label:"Avg Order",value:orders.length?`₹${Math.round(revenue/Math.max(orders.length,1))}`:"₹0",icon:"📊",c:T.green},
          {label:"Avg Rating",value:"4.8 ★",icon:"⭐",c:T.yellow},
        ].map(s=>(
          <div key={s.label} className="card">
            <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
            <div style={{fontFamily:"Space Grotesk",fontSize:22,fontWeight:700,color:s.c}}>{s.value}</div>
            <div style={{color:T.muted,fontSize:12}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card" style={{marginBottom:14}}>
        <div className="section-title">Weekly Orders (Demo)</div>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100}}>
          {bars.map(b=>(
            <div key={b.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:"100%",background:T.accent,borderRadius:"4px 4px 0 0",height:`${(b.val/maxBar)*80}px`,minHeight:4,transition:"height .5s"}}/>
              <div style={{fontSize:10,color:T.muted}}>{b.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top items */}
      <div className="card">
        <div className="section-title">Top Items</div>
        {[{n:"Pani Puri",pct:42},{n:"Bhel Puri",pct:28},{n:"Sev Puri",pct:18},{n:"Dahi Puri",pct:12}].map(it=>(
          <div key={it.n} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:13}}>{it.n}</span>
              <span style={{fontSize:13,fontWeight:700,color:T.accent}}>{it.pct}%</span>
            </div>
            <div style={{background:T.border,borderRadius:3,height:5}}>
              <div style={{background:T.accent,width:`${it.pct}%`,borderRadius:3,height:5,transition:"width .8s"}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

// ADMIN PANEL
function AdminPanel({ T }) {
  useStore();
  const [tab, setTab] = useState("overview");
  const vendors = store.vendors;
  const orders = store.orders;

  return <div className="page">
    <div className="header"><div className="header-title">⚙️ Admin Panel</div></div>
    <div style={{padding:"0 16px"}}>
      <div className="tabs">
        {[["overview","Overview"],["vendors","Vendors"],["orders","Orders"]].map(([t,l])=>(
          <button key={t} className={`tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{l}</button>
        ))}
      </div>

      {tab==="overview"&&<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[{l:"Total Vendors",v:vendors.length,c:T.blue},{l:"Online Now",v:vendors.filter(v=>v.is_online).length,c:T.green},{l:"Total Orders",v:orders.length,c:T.accent},{l:"Revenue",v:"₹"+orders.reduce((s,o)=>s+(o.total||0),0),c:T.yellow}].map(s=>(
            <div key={s.l} className="stat-card">
              <div style={{fontFamily:"Space Grotesk",fontSize:22,fontWeight:700,color:s.c}}>{s.v}</div>
              <div style={{color:T.muted,fontSize:12}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="section-title">System Status</div>
          {[{l:"API Server",s:"Operational"},{l:"Database",s:"Healthy"},{l:"Realtime WS",s:"Connected"},{l:"JWT Auth",s:"Active"}].map(s=>(
            <div key={s.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:14}}>{s.l}</span>
              <span style={{color:T.green,fontSize:12,fontWeight:600}}>● {s.s}</span>
            </div>
          ))}
        </div>
      </>}

      {tab==="vendors"&&vendors.map(v=>(
        <div key={v.id} className="card" style={{marginBottom:10}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:24}}>{v.avatar}</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{v.business}</div>
              <div style={{color:T.muted,fontSize:12}}>{v.name} · ★{v.rating}</div>
            </div>
            <span style={{background:v.is_online?T.greenSoft:T.surface,color:v.is_online?T.green:T.muted,fontSize:11,padding:"3px 9px",borderRadius:20,border:`1px solid ${v.is_online?T.green+"40":T.border}`,fontWeight:600}}>
              {v.is_online?"Live":"Offline"}
            </span>
          </div>
        </div>
      ))}

      {tab==="orders"&&(orders.length===0
        ?<div style={{textAlign:"center",color:T.muted,padding:40}}>No orders yet</div>
        :orders.map(o=>(
          <div key={o.id} className="card" style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontWeight:600}}>{o.vendor_name}</span>
              <span className="badge" style={{background:statusColors(o.status)+"22",color:statusColors(o.status)}}>{statusLabels(o.status)}</span>
            </div>
            <div style={{fontSize:13,color:T.muted}}>{o.item_details}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:12,color:T.muted}}>{o.customer_id} · {o.created_at}</span>
              <span style={{fontFamily:"Space Grotesk",fontWeight:700,color:T.accent}}>₹{o.total}</span>
            </div>
          </div>
        ))
      )}
    </div>
  </div>;
}

// PROFILE
function ProfilePage({ user, onLogout, isDark, setIsDark, T }) {
  return <div style={{padding:"20px 20px 80px"}}>
    <div style={{fontFamily:"Space Grotesk",fontSize:22,fontWeight:700,marginBottom:20}}>Profile</div>
    <div style={{display:"flex",alignItems:"center",gap:14,background:T.surface,border:`1px solid ${T.border}`,borderRadius:16,padding:16,marginBottom:20}}>
      <div style={{width:54,height:54,borderRadius:"50%",background:T.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
        {user.role==="vendor"?"🛒":user.role==="admin"?"⚙️":"👤"}
      </div>
      <div>
        <div style={{fontWeight:700,fontSize:16}}>{user.name}</div>
        <div style={{color:T.muted,fontSize:13}}>{user.email}</div>
        <span className="badge" style={{background:T.accentSoft,color:T.accent,marginTop:4}}>{user.role}</span>
      </div>
    </div>

    {/* Dark mode toggle */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:18}}>{isDark?"🌙":"☀️"}</span>
        <div>
          <div style={{fontSize:14,fontWeight:500}}>{isDark?"Dark Mode":"Light Mode"}</div>
          <div style={{color:T.muted,fontSize:12}}>Toggle appearance</div>
        </div>
      </div>
      <Toggle on={isDark} onChange={setIsDark} T={T}/>
    </div>

    {[{icon:"📍",label:"Location",value:"Bengaluru, KA"},{icon:"🔔",label:"Notifications",value:"Enabled"},{icon:"🔐",label:"Auth",value:"JWT · Secure"},{icon:"📱",label:"App Version",value:"2.0.0 MVP"}].map(item=>(
      <div key={item.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${T.border}`}}>
        <span style={{fontSize:18}}>{item.icon}</span>
        <div style={{flex:1}}>
          <div style={{color:T.muted,fontSize:12}}>{item.label}</div>
          <div style={{fontSize:14,marginTop:2}}>{item.value}</div>
        </div>
      </div>
    ))}

    <button className="btn btn-secondary btn-full" style={{marginTop:24,color:T.red,borderColor:T.red+"40"}} onClick={onLogout}>Sign Out</button>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const T = isDark ? themes.dark : themes.light;

  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const timerRef = useRef(null);
  useStore();

  // Simulate proximity notification on load
  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) return;
      const nearest = store.vendors.filter(v=>v.is_online).sort((a,b)=>a.distance-b.distance)[0];
      if (nearest) {
        store.addNotif({type:"prox",icon:"📍",title:"Vendor Nearby!",body:`${nearest.business} is ${nearest.distance}km from you — ${nearest.eta} min away`});
      }
    }, 3000);
    return ()=>clearTimeout(t);
  }, [user]);

  const toast = (msg) => {
    setToastMsg(msg);
    if(timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(()=>setToastMsg(""),2800);
  };

  const login = u => { setUser(u); setPage(u.role==="admin"?"admin":u.role==="vendor"?"vendor":"customer"); setTab("home"); };
  const logout = () => { setUser(null); setPage("login"); setSelectedVendor(null); };

  const notifCount = store.notifs.length;
  // FIX D: pendingCount uses strict user.vendorId — no ||"v1" fallback
  const pendingCount = user?.role==="vendor" && user.vendorId
    ? store.orders.filter(o => o.vendor_id === user.vendorId && o.status === "pending").length
    : 0;

  const renderPage = () => {
    if(page==="login") return <LoginPage onLogin={login} onGo={setPage} T={T}/>;
    if(page==="register") return <RegisterPage onGo={setPage} T={T}/>;

    if(user?.role==="customer"){
      if(selectedVendor) return <VendorDetailPage vendor={selectedVendor} user={user} onBack={()=>setSelectedVendor(null)} toast={toast} T={T}/>;
      if(tab==="home") return <CustomerDashboard user={user} onSelect={setSelectedVendor} toast={toast} T={T}/>;
      if(tab==="orders") return <CustomerOrders user={user} toast={toast} T={T}/>;
      if(tab==="notifs") return <NotifPage T={T}/>;
      if(tab==="profile") return <ProfilePage user={user} onLogout={logout} isDark={isDark} setIsDark={setIsDark} T={T}/>;
    }

    if(user?.role==="vendor"){
      if(tab==="home") return <VendorDashboard user={user} toast={toast} T={T}/>;
      if(tab==="menu") return <VendorMenuPage user={user} toast={toast} T={T}/>;
      if(tab==="analytics") return <AnalyticsPage user={user} T={T}/>;
      if(tab==="profile") return <ProfilePage user={user} onLogout={logout} isDark={isDark} setIsDark={setIsDark} T={T}/>;
    }

    if(user?.role==="admin") return <AdminPanel T={T}/>;
  };

  const customerNav = [
    {id:"home",icon:"🏠",label:"Discover"},
    {id:"orders",icon:"📦",label:"Orders"},
    {id:"notifs",icon:"🔔",label:"Alerts",badge:notifCount},
    {id:"profile",icon:"👤",label:"Profile"},
  ];
  const vendorNav = [
    {id:"home",icon:"📊",label:"Dashboard",badge:pendingCount},
    {id:"menu",icon:"🍽",label:"Menu"},
    {id:"analytics",icon:"📈",label:"Analytics"},
    {id:"profile",icon:"👤",label:"Profile"},
  ];

  const navItems = user?.role==="vendor" ? vendorNav : user?.role==="customer" ? customerNav : [];
  const showNav = user && user.role!=="admin" && !selectedVendor;

  return <>
    <style>{makeCSS(T)}</style>
    <div className="app" style={{background:T.bg,color:T.text}}>
      <Toast msg={toastMsg} T={T}/>
      <div style={{background:T.bg,minHeight:"100vh"}}>
        {renderPage()}
      </div>
      {showNav && <nav className="bottom-nav">
        {navItems.map(n=>(
          <button key={n.id} className={`nav-item${tab===n.id?" active":""}`} onClick={()=>setTab(n.id)} style={{color:tab===n.id?T.accent:T.muted}}>
            {n.badge>0&&<div className="ndot"/>}
            <span className="ni">{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>}
    </div>
  </>;
}
