import{c as v,E as b,d as B,h as a,g as _,G as M}from"./index.e43dad10.js";const j={xs:18,sm:24,md:32,lg:38,xl:46},k={size:String};function F(t,e=j){return v(()=>t.size!==void 0?{fontSize:t.size in e?`${e[t.size]}px`:t.size}:null)}const q=t=>b(B(t)),V=t=>b(t);function C(t,e){return t!==void 0&&t()||e}function A(t,e){if(t!==void 0){const o=t();if(o!=null)return o.slice()}return e}function c(t,e){return t!==void 0?e.concat(t()):e}function J(t,e){return t===void 0?e:e!==void 0?e.concat(t()):t()}const m="0 0 24 24",h=t=>t,d=t=>`ionicons ${t}`,x={"mdi-":t=>`mdi ${t}`,"icon-":h,"bt-":t=>`bt ${t}`,"eva-":t=>`eva ${t}`,"ion-md":d,"ion-ios":d,"ion-logo":d,"iconfont ":h,"ti-":t=>`themify-icon ${t}`,"bi-":t=>`bootstrap-icons ${t}`},S={o_:"-outlined",r_:"-round",s_:"-sharp"},E={sym_o_:"-outlined",sym_r_:"-rounded",sym_s_:"-sharp"},I=new RegExp("^("+Object.keys(x).join("|")+")"),O=new RegExp("^("+Object.keys(S).join("|")+")"),y=new RegExp("^("+Object.keys(E).join("|")+")"),Q=/^[Mm]\s?[-+]?\.?\d/,D=/^img:/,U=/^svguse:/,G=/^ion-/,H=/^(fa-(sharp|solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /;var K=q({name:"QIcon",props:{...k,tag:{type:String,default:"i"},name:String,color:String,left:Boolean,right:Boolean},setup(t,{slots:e}){const{proxy:{$q:o}}=_(),u=F(t),R=v(()=>"q-icon"+(t.left===!0?" on-left":"")+(t.right===!0?" on-right":"")+(t.color!==void 0?` text-${t.color}`:"")),r=v(()=>{let s,n=t.name;if(n==="none"||!n)return{none:!0};if(o.iconMapFn!==null){const i=o.iconMapFn(n);if(i!==void 0)if(i.icon!==void 0){if(n=i.icon,n==="none"||!n)return{none:!0}}else return{cls:i.cls,content:i.content!==void 0?i.content:" "}}if(Q.test(n)===!0){const[i,f=m]=n.split("|");return{svg:!0,viewBox:f,nodes:i.split("&&").map($=>{const[p,w,z]=$.split("@@");return a("path",{style:w,d:p,transform:z})})}}if(D.test(n)===!0)return{img:!0,src:n.substring(4)};if(U.test(n)===!0){const[i,f=m]=n.split("|");return{svguse:!0,src:i.substring(7),viewBox:f}}let l=" ";const g=n.match(I);if(g!==null)s=x[g[1]](n);else if(H.test(n)===!0)s=n;else if(G.test(n)===!0)s=`ionicons ion-${o.platform.is.ios===!0?"ios":"md"}${n.substring(3)}`;else if(y.test(n)===!0){s="notranslate material-symbols";const i=n.match(y);i!==null&&(n=n.substring(6),s+=E[i[1]]),l=n}else{s="notranslate material-icons";const i=n.match(O);i!==null&&(n=n.substring(2),s+=S[i[1]]),l=n}return{cls:s,content:l}});return()=>{const s={class:R.value,style:u.value,"aria-hidden":"true",role:"presentation"};return r.value.none===!0?a(t.tag,s,C(e.default)):r.value.img===!0?a(t.tag,s,c(e.default,[a("img",{src:r.value.src})])):r.value.svg===!0?a(t.tag,s,c(e.default,[a("svg",{viewBox:r.value.viewBox||"0 0 24 24"},r.value.nodes)])):r.value.svguse===!0?a(t.tag,s,c(e.default,[a("svg",{viewBox:r.value.viewBox},[a("use",{"xlink:href":r.value.src})])])):(r.value.cls!==void 0&&(s.class+=" "+r.value.cls),a(t.tag,s,c(e.default,[r.value.content])))}}});function L(t,e){const o=t.style;for(const u in e)o[u]=e[u]}function N(t){if(t==null)return;if(typeof t=="string")try{return document.querySelector(t)||void 0}catch{return}const e=M(t);if(e)return e.$el||e}function T(t,e){if(t==null||t.contains(e)===!0)return!0;for(let o=t.nextElementSibling;o!==null;o=o.nextElementSibling)if(o.contains(e))return!0;return!1}export{K as Q,A as a,c as b,q as c,F as d,J as e,L as f,N as g,C as h,T as i,V as j,j as k,k as u};
