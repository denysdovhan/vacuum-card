/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=window,e$4=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$4=new WeakMap;class o$3{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$4.set(s,t));}return t}toString(){return this.cssText}}const r$3=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$2=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$4?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$3.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$3=window,r$2=e$3.trustedTypes,h$1=r$2?r$2.emptyScript:"",o$2=e$3.reactiveElementPolyfillSupport,n$3={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$3,reflect:!1,hasChanged:a$1};class d$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$3).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$3;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}d$1.finalized=!0,d$1.elementProperties=new Map,d$1.elementStyles=[],d$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:d$1}),(null!==(s$2=e$3.reactiveElementVersions)&&void 0!==s$2?s$2:e$3.reactiveElementVersions=[]).push("1.6.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$2;const i$1=window,s$1=i$1.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$2=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$2,h=`<${l$1}>`,r$1=document,u=()=>r$1.createComment(""),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E$1=new WeakMap,C=r$1.createTreeWalker(r$1,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$2?e$2.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,e=[];let l,r=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let d,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(l=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=l?l:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,d=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,l=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";r+=u===f?s+h:v>=0?(e.push(d),s.slice(0,v)+o$1+s.slice(v)+n$2+w):s+n$2+(-2===v?(e.push(void 0),i):w);}return [P(t,r+(t[s]||"<?>")+(2===i?"</svg>":"")),e]};class N{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,d=0;const c=t.length-1,v=this.parts,[a,f]=V(t,i);if(this.el=N.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$2)){const s=f[d++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$1).split(n$2),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?H:"?"===i[1]?L:"@"===i[1]?z:k});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$2),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],u()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],u());}}}else if(8===h.nodeType)if(h.data===l$1)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$2,t+1));)v.push({type:7,index:r}),t+=n$2.length-1;}r++;}}static createElement(t,i){const s=r$1.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=S(t,r._$AS(t,i.values),r,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r$1).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,u=e[0];for(;void 0!==u;){if(l===u.index){let i;2===u.type?i=new R(n,n.nextSibling,this,t):1===u.type?i=new u.ctor(n,u.name,u.strings,this,t):6===u.type&&(i=new Z(n,this,t)),this._$AV.push(i),u=e[++h];}l!==(null==u?void 0:u.index)&&(n=C.nextNode(),l++);}return C.currentNode=r$1,o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=t:this.$(r$1.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=N.createElement(P(e.h,e.h[0]),this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new M(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E$1.get(t.strings);return void 0===i&&E$1.set(t.strings,i=new N(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new R(this.k(u()),this.k(u()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class k{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=S(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=S(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name);}}class z extends k{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const B=i$1.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t$2=i$1.litHtmlVersions)&&void 0!==t$2?t$2:i$1.litHtmlVersions=[]).push("2.8.0");const D=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new R(i.insertBefore(u(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends d$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$1=globalThis.litElementPolyfillSupport;null==n$1||n$1({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i(e,n)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function t$1(t){return e({...t,state:!0})}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

var t,r;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none";}(t||(t={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24";}(r||(r={}));function E(e){return e.substr(0,e.indexOf("."))}var ne=function(e,t,r,n){n=n||{},r=null==r?{}:r;var i=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return i.detail=r,e.dispatchEvent(i),i},ce={alert:"mdi:alert",automation:"mdi:playlist-play",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",configurator:"mdi:settings",conversation:"mdi:text-to-speech",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",history_graph:"mdi:chart-line",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_boolean:"mdi:drawing",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",person:"mdi:account",plant:"mdi:flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:google-pages",script:"mdi:file-document",sensor:"mdi:eye",simple_alarm:"mdi:bell",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",water_heater:"mdi:thermometer",weblink:"mdi:open-in-new"};function me(e,t){if(e in ce)return ce[e];switch(e){case"alarm_control_panel":switch(t){case"armed_home":return "mdi:bell-plus";case"armed_night":return "mdi:bell-sleep";case"disarmed":return "mdi:bell-outline";case"triggered":return "mdi:bell-ring";default:return "mdi:bell"}case"binary_sensor":return t&&"off"===t?"mdi:radiobox-blank":"mdi:checkbox-marked-circle";case"cover":return "closed"===t?"mdi:window-closed":"mdi:window-open";case"lock":return t&&"unlocked"===t?"mdi:lock-open":"mdi:lock";case"media_player":return t&&"off"!==t&&"idle"!==t?"mdi:cast-connected":"mdi:cast";case"zwave":switch(t){case"dead":return "mdi:emoticon-dead";case"sleeping":return "mdi:sleep";case"initializing":return "mdi:timer-sand";default:return "mdi:z-wave"}default:return console.warn("Unable to find icon for domain "+e+" ("+t+")"),"mdi:bookmark"}}function _e(e,t,r){if(t.has("config")||r)return !0;if(e.config.entity){var n=t.get("hass");return !n||n.states[e.config.entity]!==e.hass.states[e.config.entity]}return !1}var xe={humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",temperature:"mdi:thermometer",pressure:"mdi:gauge",power:"mdi:flash",signal_strength:"mdi:wifi"},De={binary_sensor:function(e,t){var r="off"===e;switch(null==t?void 0:t.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"cold":return r?"mdi:thermometer":"mdi:snowflake";case"connectivity":return r?"mdi:server-network-off":"mdi:server-network";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:check-circle":"mdi:smoke";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:walk":"mdi:run";case"occupancy":return r?"mdi:home-outline":"mdi:home";case"opening":return r?"mdi:square":"mdi:square-outline";case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}},cover:function(e){var t="closed"!==e.state;switch(e.attributes.device_class){case"garage":return t?"mdi:garage-open":"mdi:garage";case"door":return t?"mdi:door-open":"mdi:door-closed";case"shutter":return t?"mdi:window-shutter-open":"mdi:window-shutter";case"blind":return t?"mdi:blinds-open":"mdi:blinds";case"window":return t?"mdi:window-open":"mdi:window-closed";default:return me("cover",e.state)}},sensor:function(e){var t=e.attributes.device_class;if(t&&t in xe)return xe[t];if("battery"===t){var r=Number(e.state);if(isNaN(r))return "mdi:battery-unknown";var n=10*Math.round(r/10);return n>=100?"mdi:battery":n<=0?"mdi:battery-alert":"hass:battery-"+n}var i=e.attributes.unit_of_measurement;return "°C"===i||"°F"===i?"mdi:thermometer":me("sensor")},input_datetime:function(e){return e.attributes.has_date?e.attributes.has_time?me("input_datetime"):"mdi:calendar":"mdi:clock"}},Se=function(e){if(!e)return "mdi:bookmark";if(e.attributes.icon)return e.attributes.icon;var t=E(e.entity_id);return t in De?De[t](e):me(t,e.state)};

class HATemplate extends s {
    constructor() {
        super(...arguments);
        this.template = '';
        this.variables = {};
        this.value = null;
        this.valueResult = null;
        this.unsubscribePromise = null;
    }
    connectedCallback() {
        super.connectedCallback();
        this.updateTemplateValue();
    }
    updateTemplateValue() {
        if (!this.hass) {
            console.warn('hass object is not provided');
            return;
        }
        if (this.unsubscribePromise) {
            // Being here means that we have an update requested, but
            // a promise already exists. This can happen if the async
            // fetch hasn't completed, but more likely, it's because
            // the fetch completed, the promise is fulfilled, and we
            // want to update. So we unsubscribe and re-fetch.
            this.unsubscribeFrom(this.unsubscribePromise);
            this.unsubscribePromise = null;
        }
        if (!this.template) {
            return;
        }
        this.unsubscribePromise = this.hass.connection.subscribeMessage((msg) => {
            // Save to two places because the 'value' can be updated externally.
            // This way, we know when the value has indeed changed and can
            // re-fetch the template.
            this.value = msg.result;
            this.valueResult = msg.result;
        }, {
            type: 'render_template',
            template: this.template,
            variables: this.variables,
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.unsubscribePromise) {
            this.unsubscribeFrom(this.unsubscribePromise);
            this.unsubscribePromise = null;
        }
    }
    async unsubscribeFrom(unsubscribePromise) {
        try {
            const unsubscribe = await unsubscribePromise;
            return unsubscribe();
        }
        catch (err) {
            // We don't care when connection is closed.
            if (err.code !== 'not_found') {
                throw err;
            }
        }
    }
    render() {
        var _a, _b;
        // If the valueResult is null, that means the initial fetch hasn't completed or there's no template. Skip.
        // If the value isn't null and doesn't equal the result, it means we need to re-fetch.
        if (this.value && this.valueResult && this.value !== this.valueResult)
            this.updateTemplateValue();
        // Return now, and it will update with the new value later.
        return (_b = (_a = this.valueResult) !== null && _a !== void 0 ? _a : this.value) !== null && _b !== void 0 ? _b : A;
    }
}
__decorate([
    e()
], HATemplate.prototype, "hass", void 0);
__decorate([
    e()
], HATemplate.prototype, "template", void 0);
__decorate([
    e()
], HATemplate.prototype, "variables", void 0);
__decorate([
    e()
], HATemplate.prototype, "value", void 0);
__decorate([
    e()
], HATemplate.prototype, "valueResult", void 0);
__decorate([
    t$1()
], HATemplate.prototype, "unsubscribePromise", void 0);
function register(componentName = 'ha-template') {
    if (!customElements.get(componentName)) {
        customElements.define(componentName, HATemplate);
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */

var isArray_1;
var hasRequiredIsArray;

function requireIsArray () {
	if (hasRequiredIsArray) return isArray_1;
	hasRequiredIsArray = 1;
	var isArray = Array.isArray;

	isArray_1 = isArray;
	return isArray_1;
}

/** Detect free variable `global` from Node.js. */

var _freeGlobal;
var hasRequired_freeGlobal;

function require_freeGlobal () {
	if (hasRequired_freeGlobal) return _freeGlobal;
	hasRequired_freeGlobal = 1;
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	_freeGlobal = freeGlobal;
	return _freeGlobal;
}

var _root;
var hasRequired_root;

function require_root () {
	if (hasRequired_root) return _root;
	hasRequired_root = 1;
	var freeGlobal = require_freeGlobal();

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	_root = root;
	return _root;
}

var _Symbol;
var hasRequired_Symbol;

function require_Symbol () {
	if (hasRequired_Symbol) return _Symbol;
	hasRequired_Symbol = 1;
	var root = require_root();

	/** Built-in value references. */
	var Symbol = root.Symbol;

	_Symbol = Symbol;
	return _Symbol;
}

var _getRawTag;
var hasRequired_getRawTag;

function require_getRawTag () {
	if (hasRequired_getRawTag) return _getRawTag;
	hasRequired_getRawTag = 1;
	var Symbol = require_Symbol();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	_getRawTag = getRawTag;
	return _getRawTag;
}

/** Used for built-in method references. */

var _objectToString;
var hasRequired_objectToString;

function require_objectToString () {
	if (hasRequired_objectToString) return _objectToString;
	hasRequired_objectToString = 1;
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	_objectToString = objectToString;
	return _objectToString;
}

var _baseGetTag;
var hasRequired_baseGetTag;

function require_baseGetTag () {
	if (hasRequired_baseGetTag) return _baseGetTag;
	hasRequired_baseGetTag = 1;
	var Symbol = require_Symbol(),
	    getRawTag = require_getRawTag(),
	    objectToString = require_objectToString();

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	_baseGetTag = baseGetTag;
	return _baseGetTag;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

var isObjectLike_1;
var hasRequiredIsObjectLike;

function requireIsObjectLike () {
	if (hasRequiredIsObjectLike) return isObjectLike_1;
	hasRequiredIsObjectLike = 1;
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	isObjectLike_1 = isObjectLike;
	return isObjectLike_1;
}

var isSymbol_1;
var hasRequiredIsSymbol;

function requireIsSymbol () {
	if (hasRequiredIsSymbol) return isSymbol_1;
	hasRequiredIsSymbol = 1;
	var baseGetTag = require_baseGetTag(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	isSymbol_1 = isSymbol;
	return isSymbol_1;
}

var _isKey;
var hasRequired_isKey;

function require_isKey () {
	if (hasRequired_isKey) return _isKey;
	hasRequired_isKey = 1;
	var isArray = requireIsArray(),
	    isSymbol = requireIsSymbol();

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	_isKey = isKey;
	return _isKey;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

var isObject_1;
var hasRequiredIsObject;

function requireIsObject () {
	if (hasRequiredIsObject) return isObject_1;
	hasRequiredIsObject = 1;
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	isObject_1 = isObject;
	return isObject_1;
}

var isFunction_1;
var hasRequiredIsFunction;

function requireIsFunction () {
	if (hasRequiredIsFunction) return isFunction_1;
	hasRequiredIsFunction = 1;
	var baseGetTag = require_baseGetTag(),
	    isObject = requireIsObject();

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	isFunction_1 = isFunction;
	return isFunction_1;
}

var _coreJsData;
var hasRequired_coreJsData;

function require_coreJsData () {
	if (hasRequired_coreJsData) return _coreJsData;
	hasRequired_coreJsData = 1;
	var root = require_root();

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	_coreJsData = coreJsData;
	return _coreJsData;
}

var _isMasked;
var hasRequired_isMasked;

function require_isMasked () {
	if (hasRequired_isMasked) return _isMasked;
	hasRequired_isMasked = 1;
	var coreJsData = require_coreJsData();

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	_isMasked = isMasked;
	return _isMasked;
}

/** Used for built-in method references. */

var _toSource;
var hasRequired_toSource;

function require_toSource () {
	if (hasRequired_toSource) return _toSource;
	hasRequired_toSource = 1;
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	_toSource = toSource;
	return _toSource;
}

var _baseIsNative;
var hasRequired_baseIsNative;

function require_baseIsNative () {
	if (hasRequired_baseIsNative) return _baseIsNative;
	hasRequired_baseIsNative = 1;
	var isFunction = requireIsFunction(),
	    isMasked = require_isMasked(),
	    isObject = requireIsObject(),
	    toSource = require_toSource();

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	_baseIsNative = baseIsNative;
	return _baseIsNative;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

var _getValue;
var hasRequired_getValue;

function require_getValue () {
	if (hasRequired_getValue) return _getValue;
	hasRequired_getValue = 1;
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	_getValue = getValue;
	return _getValue;
}

var _getNative;
var hasRequired_getNative;

function require_getNative () {
	if (hasRequired_getNative) return _getNative;
	hasRequired_getNative = 1;
	var baseIsNative = require_baseIsNative(),
	    getValue = require_getValue();

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	_getNative = getNative;
	return _getNative;
}

var _nativeCreate;
var hasRequired_nativeCreate;

function require_nativeCreate () {
	if (hasRequired_nativeCreate) return _nativeCreate;
	hasRequired_nativeCreate = 1;
	var getNative = require_getNative();

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	_nativeCreate = nativeCreate;
	return _nativeCreate;
}

var _hashClear;
var hasRequired_hashClear;

function require_hashClear () {
	if (hasRequired_hashClear) return _hashClear;
	hasRequired_hashClear = 1;
	var nativeCreate = require_nativeCreate();

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	  this.size = 0;
	}

	_hashClear = hashClear;
	return _hashClear;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

var _hashDelete;
var hasRequired_hashDelete;

function require_hashDelete () {
	if (hasRequired_hashDelete) return _hashDelete;
	hasRequired_hashDelete = 1;
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	_hashDelete = hashDelete;
	return _hashDelete;
}

var _hashGet;
var hasRequired_hashGet;

function require_hashGet () {
	if (hasRequired_hashGet) return _hashGet;
	hasRequired_hashGet = 1;
	var nativeCreate = require_nativeCreate();

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	_hashGet = hashGet;
	return _hashGet;
}

var _hashHas;
var hasRequired_hashHas;

function require_hashHas () {
	if (hasRequired_hashHas) return _hashHas;
	hasRequired_hashHas = 1;
	var nativeCreate = require_nativeCreate();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	_hashHas = hashHas;
	return _hashHas;
}

var _hashSet;
var hasRequired_hashSet;

function require_hashSet () {
	if (hasRequired_hashSet) return _hashSet;
	hasRequired_hashSet = 1;
	var nativeCreate = require_nativeCreate();

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	_hashSet = hashSet;
	return _hashSet;
}

var _Hash;
var hasRequired_Hash;

function require_Hash () {
	if (hasRequired_Hash) return _Hash;
	hasRequired_Hash = 1;
	var hashClear = require_hashClear(),
	    hashDelete = require_hashDelete(),
	    hashGet = require_hashGet(),
	    hashHas = require_hashHas(),
	    hashSet = require_hashSet();

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	_Hash = Hash;
	return _Hash;
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

var _listCacheClear;
var hasRequired_listCacheClear;

function require_listCacheClear () {
	if (hasRequired_listCacheClear) return _listCacheClear;
	hasRequired_listCacheClear = 1;
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	_listCacheClear = listCacheClear;
	return _listCacheClear;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */

var eq_1;
var hasRequiredEq;

function requireEq () {
	if (hasRequiredEq) return eq_1;
	hasRequiredEq = 1;
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	eq_1 = eq;
	return eq_1;
}

var _assocIndexOf;
var hasRequired_assocIndexOf;

function require_assocIndexOf () {
	if (hasRequired_assocIndexOf) return _assocIndexOf;
	hasRequired_assocIndexOf = 1;
	var eq = requireEq();

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	_assocIndexOf = assocIndexOf;
	return _assocIndexOf;
}

var _listCacheDelete;
var hasRequired_listCacheDelete;

function require_listCacheDelete () {
	if (hasRequired_listCacheDelete) return _listCacheDelete;
	hasRequired_listCacheDelete = 1;
	var assocIndexOf = require_assocIndexOf();

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	_listCacheDelete = listCacheDelete;
	return _listCacheDelete;
}

var _listCacheGet;
var hasRequired_listCacheGet;

function require_listCacheGet () {
	if (hasRequired_listCacheGet) return _listCacheGet;
	hasRequired_listCacheGet = 1;
	var assocIndexOf = require_assocIndexOf();

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	_listCacheGet = listCacheGet;
	return _listCacheGet;
}

var _listCacheHas;
var hasRequired_listCacheHas;

function require_listCacheHas () {
	if (hasRequired_listCacheHas) return _listCacheHas;
	hasRequired_listCacheHas = 1;
	var assocIndexOf = require_assocIndexOf();

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	_listCacheHas = listCacheHas;
	return _listCacheHas;
}

var _listCacheSet;
var hasRequired_listCacheSet;

function require_listCacheSet () {
	if (hasRequired_listCacheSet) return _listCacheSet;
	hasRequired_listCacheSet = 1;
	var assocIndexOf = require_assocIndexOf();

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	_listCacheSet = listCacheSet;
	return _listCacheSet;
}

var _ListCache;
var hasRequired_ListCache;

function require_ListCache () {
	if (hasRequired_ListCache) return _ListCache;
	hasRequired_ListCache = 1;
	var listCacheClear = require_listCacheClear(),
	    listCacheDelete = require_listCacheDelete(),
	    listCacheGet = require_listCacheGet(),
	    listCacheHas = require_listCacheHas(),
	    listCacheSet = require_listCacheSet();

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	_ListCache = ListCache;
	return _ListCache;
}

var _Map;
var hasRequired_Map;

function require_Map () {
	if (hasRequired_Map) return _Map;
	hasRequired_Map = 1;
	var getNative = require_getNative(),
	    root = require_root();

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	_Map = Map;
	return _Map;
}

var _mapCacheClear;
var hasRequired_mapCacheClear;

function require_mapCacheClear () {
	if (hasRequired_mapCacheClear) return _mapCacheClear;
	hasRequired_mapCacheClear = 1;
	var Hash = require_Hash(),
	    ListCache = require_ListCache(),
	    Map = require_Map();

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	_mapCacheClear = mapCacheClear;
	return _mapCacheClear;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */

var _isKeyable;
var hasRequired_isKeyable;

function require_isKeyable () {
	if (hasRequired_isKeyable) return _isKeyable;
	hasRequired_isKeyable = 1;
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	_isKeyable = isKeyable;
	return _isKeyable;
}

var _getMapData;
var hasRequired_getMapData;

function require_getMapData () {
	if (hasRequired_getMapData) return _getMapData;
	hasRequired_getMapData = 1;
	var isKeyable = require_isKeyable();

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	_getMapData = getMapData;
	return _getMapData;
}

var _mapCacheDelete;
var hasRequired_mapCacheDelete;

function require_mapCacheDelete () {
	if (hasRequired_mapCacheDelete) return _mapCacheDelete;
	hasRequired_mapCacheDelete = 1;
	var getMapData = require_getMapData();

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	_mapCacheDelete = mapCacheDelete;
	return _mapCacheDelete;
}

var _mapCacheGet;
var hasRequired_mapCacheGet;

function require_mapCacheGet () {
	if (hasRequired_mapCacheGet) return _mapCacheGet;
	hasRequired_mapCacheGet = 1;
	var getMapData = require_getMapData();

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	_mapCacheGet = mapCacheGet;
	return _mapCacheGet;
}

var _mapCacheHas;
var hasRequired_mapCacheHas;

function require_mapCacheHas () {
	if (hasRequired_mapCacheHas) return _mapCacheHas;
	hasRequired_mapCacheHas = 1;
	var getMapData = require_getMapData();

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	_mapCacheHas = mapCacheHas;
	return _mapCacheHas;
}

var _mapCacheSet;
var hasRequired_mapCacheSet;

function require_mapCacheSet () {
	if (hasRequired_mapCacheSet) return _mapCacheSet;
	hasRequired_mapCacheSet = 1;
	var getMapData = require_getMapData();

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	_mapCacheSet = mapCacheSet;
	return _mapCacheSet;
}

var _MapCache;
var hasRequired_MapCache;

function require_MapCache () {
	if (hasRequired_MapCache) return _MapCache;
	hasRequired_MapCache = 1;
	var mapCacheClear = require_mapCacheClear(),
	    mapCacheDelete = require_mapCacheDelete(),
	    mapCacheGet = require_mapCacheGet(),
	    mapCacheHas = require_mapCacheHas(),
	    mapCacheSet = require_mapCacheSet();

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	_MapCache = MapCache;
	return _MapCache;
}

var memoize_1;
var hasRequiredMemoize;

function requireMemoize () {
	if (hasRequiredMemoize) return memoize_1;
	hasRequiredMemoize = 1;
	var MapCache = require_MapCache();

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize.Cache = MapCache;

	memoize_1 = memoize;
	return memoize_1;
}

var _memoizeCapped;
var hasRequired_memoizeCapped;

function require_memoizeCapped () {
	if (hasRequired_memoizeCapped) return _memoizeCapped;
	hasRequired_memoizeCapped = 1;
	var memoize = requireMemoize();

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	_memoizeCapped = memoizeCapped;
	return _memoizeCapped;
}

var _stringToPath;
var hasRequired_stringToPath;

function require_stringToPath () {
	if (hasRequired_stringToPath) return _stringToPath;
	hasRequired_stringToPath = 1;
	var memoizeCapped = require_memoizeCapped();

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	_stringToPath = stringToPath;
	return _stringToPath;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

var _arrayMap;
var hasRequired_arrayMap;

function require_arrayMap () {
	if (hasRequired_arrayMap) return _arrayMap;
	hasRequired_arrayMap = 1;
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	_arrayMap = arrayMap;
	return _arrayMap;
}

var _baseToString;
var hasRequired_baseToString;

function require_baseToString () {
	if (hasRequired_baseToString) return _baseToString;
	hasRequired_baseToString = 1;
	var Symbol = require_Symbol(),
	    arrayMap = require_arrayMap(),
	    isArray = requireIsArray(),
	    isSymbol = requireIsSymbol();

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	_baseToString = baseToString;
	return _baseToString;
}

var toString_1;
var hasRequiredToString;

function requireToString () {
	if (hasRequiredToString) return toString_1;
	hasRequiredToString = 1;
	var baseToString = require_baseToString();

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	toString_1 = toString;
	return toString_1;
}

var _castPath;
var hasRequired_castPath;

function require_castPath () {
	if (hasRequired_castPath) return _castPath;
	hasRequired_castPath = 1;
	var isArray = requireIsArray(),
	    isKey = require_isKey(),
	    stringToPath = require_stringToPath(),
	    toString = requireToString();

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (isArray(value)) {
	    return value;
	  }
	  return isKey(value, object) ? [value] : stringToPath(toString(value));
	}

	_castPath = castPath;
	return _castPath;
}

var _toKey;
var hasRequired_toKey;

function require_toKey () {
	if (hasRequired_toKey) return _toKey;
	hasRequired_toKey = 1;
	var isSymbol = requireIsSymbol();

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	_toKey = toKey;
	return _toKey;
}

var _baseGet;
var hasRequired_baseGet;

function require_baseGet () {
	if (hasRequired_baseGet) return _baseGet;
	hasRequired_baseGet = 1;
	var castPath = require_castPath(),
	    toKey = require_toKey();

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	_baseGet = baseGet;
	return _baseGet;
}

var get_1;
var hasRequiredGet;

function requireGet () {
	if (hasRequiredGet) return get_1;
	hasRequiredGet = 1;
	var baseGet = require_baseGet();

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	get_1 = get;
	return get_1;
}

var getExports = requireGet();
var get = /*@__PURE__*/getDefaultExportFromCjs(getExports);

var status$q = {
	cleaning: "Netejant",
	paused: "En pausa",
	idle: "Inactiu",
	charging: "Carregant",
	"returning home": "Tornant a la base",
	docked: "A la base"
};
var source$p = {
	gentle: "Delicat",
	silent: "Silenciós",
	standard: "Estàndard",
	medium: "Mitjà",
	turbo: "Turbo"
};
var common$q = {
	name: "Vacuum Card",
	description: "Vacuum card us permet controlar el robot aspirador.",
	start: "Neteja",
	"continue": "Continua",
	pause: "Pausa",
	stop: "Atura",
	return_to_base: "Torna a la base",
	locate: "Localitza",
	not_available: "No disponible"
};
var error$q = {
	missing_entity: "Cal especificar una entitat."
};
var editor$r = {
	entity: "Entitat (Requerit)",
	map: "Càmera de mapa (Opcional)",
	image: "Imatge (Opcional)",
	compact_view: "Visualització compacta",
	compact_view_aria_label_on: "Activar visualització compacta",
	compact_view_aria_label_off: "Desactivar visualització compacta",
	show_name: "Mostrar nom",
	show_name_aria_label_on: "Mostra nom",
	show_name_aria_label_off: "Amaga nom",
	show_status: "Mostrar estat",
	show_status_aria_label_on: "Mostra estat",
	show_status_aria_label_off: "Amaga estat",
	show_toolbar: "Mostrar barra d'eines",
	show_toolbar_aria_label_on: "Mostra barra d'eines",
	show_toolbar_aria_label_off: "Amaga barra d'eines",
	code_only_note: "Nota: Configuració de les accions i estadístiques només disponible des de l'Editor de Codi."
};
var ca = {
	status: status$q,
	source: source$p,
	common: common$q,
	error: error$q,
	editor: editor$r
};

var ca$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$q,
    source: source$p,
    common: common$q,
    error: error$q,
    editor: editor$r,
    'default': ca
});

var status$p = {
	cleaning: "清扫中",
	auto: "自动清扫",
	spot: "区域清扫",
	edge: "边缘清扫",
	single_room: "单房间清扫",
	paused: "暂停中",
	idle: "闲置中",
	stop: "已停止",
	charging: "充电中",
	"returning home": "回充",
	returning: "回充",
	docked: "充电中",
	unknown: "未知",
	offline: "离线",
	error: "错误"
};
var source$o = {
	gentle: "轻柔",
	silent: "安静",
	standard: "标准",
	medium: "中等",
	turbo: "强力",
	normal: "正常",
	high: "高",
	strong: "强力",
	quiet: "安静",
	max: "Max",
	"max+": "Max+"
};
var common$p = {
	name: "Vacuum Card",
	description: "Vacuum Card 允许您控制您的扫地机器人。",
	start: "清扫",
	"continue": "继续",
	pause: "暂停",
	stop: "停止",
	return_to_base: "回充",
	locate: "定位扫地机器人",
	not_available: "扫地机器人不可用"
};
var error$p = {
	missing_entity: "必须指定一个实体!"
};
var warning$k = {
	actions_array: "警告: \"动作\" 是为了覆盖现有按钮的默认动作而保留的。如果你的目的是增加额外的动作，请使用\"快捷键\"选项来代替。"
};
var editor$q = {
	entity: "实体 (必填)",
	map: "地图 (选填)",
	image: "图片 (选填)",
	compact_view: "紧凑视图",
	compact_view_aria_label_on: "开启紧凑视图",
	compact_view_aria_label_off: "关闭紧凑视图",
	show_name: "显示名称",
	show_name_aria_label_on: "开启名称显示",
	show_name_aria_label_off: "关闭名称显示",
	show_status: "显示状态",
	show_status_aria_label_on: "开启状态显示",
	show_status_aria_label_off: "关闭状态显示",
	show_toolbar: "显示工具栏",
	show_toolbar_aria_label_on: "开启工具栏显示",
	show_toolbar_aria_label_off: "关闭工具栏显示",
	code_only_note: "注意: 设置动作和统计选项只能使用代码编辑器。"
};
var cn = {
	status: status$p,
	source: source$o,
	common: common$p,
	error: error$p,
	warning: warning$k,
	editor: editor$q
};

var cn$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$p,
    source: source$o,
    common: common$p,
    error: error$p,
    warning: warning$k,
    editor: editor$q,
    'default': cn
});

var status$o = {
	cleaning: "Vysává se",
	auto: "Automatické vysávání",
	spot: "Vysávání na místě",
	edge: "Vysávání při okraji",
	single_room: "Vysávání jedné místnosti",
	paused: "Pozastaveno",
	idle: "Nečinný",
	stop: "Zastavený",
	charging: "Nabíjí se",
	"returning home": "Vrací se do stanice",
	returning: "Vrací se",
	docked: "Ve stanici",
	unknown: "Neznámý",
	offline: "Vypnuto",
	error: "Chyba"
};
var source$n = {
	gentle: "Mírný",
	silent: "Tichý",
	standard: "Standardní",
	medium: "Střední",
	turbo: "Turbo",
	normal: "Normální",
	high: "Vysoký",
	strong: "Silný",
	quiet: "Tichý",
	max: "Max",
	"max+": "Max+"
};
var common$o = {
	name: "Karta vysavače",
	description: "Karta vysavače vám dovolí ovládat svůj vysavač.",
	start: "Začni vysávat",
	"continue": "Pokračuj",
	pause: "Pozastav",
	stop: "Zastav",
	return_to_base: "Vrať se domů",
	locate: "Lokalizuj",
	not_available: "Vysavač není dostupný"
};
var error$o = {
	missing_entity: "Je vyžadováno specifikování entity!"
};
var warning$j = {
	actions_array: "VAROVÁNÍ: 'actions' jsou rezervovány pro přepsání původních akcí u existujících tlačítek. Pokud jste chtěli měli v plánu přidat další akce, použijte namísto toho možnost 'shortcuts'."
};
var editor$p = {
	entity: "Entita (Povinný)",
	map: "Mapa (Nepovinný)",
	image: "Fotka (Nepovinný)",
	compact_view: "Kompaktní zobrazení",
	compact_view_aria_label_on: "Zapni kompaktní zobrazení",
	compact_view_aria_label_off: "Vypni kompaktní zobrazení",
	show_name: "Zobraz název",
	show_name_aria_label_on: "Zapni zobrazení názvu",
	show_name_aria_label_off: "Vypni zobrazení názvu",
	show_status: "Zobraz status",
	show_status_aria_label_on: "Zapni zobrazení statusu",
	show_status_aria_label_off: "Vypni zobrazení statusu",
	show_toolbar: "Zobraz lištu",
	show_toolbar_aria_label_on: "Zapni zobrazení lišty",
	show_toolbar_aria_label_off: "Vypni zobrazení lišty",
	code_only_note: "Poznámka: Nastavení akcí a infa je dostupné pouze v editoru kódu."
};
var cs = {
	status: status$o,
	source: source$n,
	common: common$o,
	error: error$o,
	warning: warning$j,
	editor: editor$p
};

var cs$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$o,
    source: source$n,
    common: common$o,
    error: error$o,
    warning: warning$j,
    editor: editor$p,
    'default': cs
});

var status$n = {
	cleaning: "Støvsuger",
	auto: "Automatisk rengøring",
	spot: "Spot rengøring",
	edge: "Kant rengøring cleaning",
	single_room: "Rengører udvalgt rum",
	paused: "Pauset",
	idle: "Inaktiv",
	stop: "Stoppet",
	charging: "Lader",
	returning: "Returnerer til dock",
	returning_home: "Returnerer til dock",
	docked: "I dock",
	unknown: "Ukendt",
	offline: "Offline",
	error: "Fejl",
	charger_disconnected: "Oplader er frakoblet",
	remote_control_active: "Fjernstyring er aktiveret",
	manual_mode: "Manuel tilstand",
	shutting_down: "Lukker ned",
	updating: "Opdaterer",
	going_to_target: "Kører til punkt",
	zoned_cleaning: "Zone rengøring",
	segment_cleaning: "Rum rengøring"
};
var source$m = {
	gentle: "Mild",
	silent: "Stille",
	standard: "Standard",
	medium: "Medium",
	turbo: "Turbo",
	normal: "Normal",
	max: "Max",
	max_plus: "Max+",
	high: "Høj",
	strong: "Kraftig",
	quiet: "Stille",
	auto: "Auto",
	balanced: "Balanceret",
	custom: "Brugerdefineret",
	off: "Fra"
};
var common$n = {
	name: "Vacuum Card",
	description: "Vacuum card lader dig kontrollere din robotstøvsuger.",
	start: "Start",
	"continue": "Fortsæt",
	pause: "Pause",
	stop: "Stop",
	return_to_base: "Gå til dock",
	locate: "Find støvsuger",
	not_available: "Støvsuger er ikke tilgængelig"
};
var error$n = {
	invalid_config: "Ugyldig konfiguration",
	missing_entity: "En enhed skal specificeres!"
};
var warning$i = {
	actions_array: "ADVARSEL: 'actions' bruges til at overskrive handlinger for eksisterende knapper. Hvis du vil tilføje yderligere handlinger skal du i stedet bruge 'shortcuts'."
};
var editor$o = {
	entity: "Enhed (Påkrævet)",
	map: "Entitet med kamera til kortvisning (Valgfrit)",
	image: "Billede (Valgfrit)",
	compact_view: "Kompakt visning",
	compact_view_aria_label_on: "Slå kompakt visning til",
	compact_view_aria_label_off: "Slå kompakt visning fra",
	show_name: "Vis navn",
	show_name_aria_label_on: "Slå visning af navn til",
	show_name_aria_label_off: "Slå visning af navn fra",
	show_status: "Vis Status",
	show_status_aria_label_on: "Slå visning af status til",
	show_status_aria_label_off: "Slå visning af status fra",
	show_toolbar: "Vis værktøjslinje",
	show_toolbar_aria_label_on: "Slå visning af værktøjslinje til",
	show_toolbar_aria_label_off: "Slå visning af værktøjslinje fra",
	code_only_note: "Bemærk: Indstilling af actions og statistik er udelukkende muligt via Code Editor."
};
var da = {
	status: status$n,
	source: source$m,
	common: common$n,
	error: error$n,
	warning: warning$i,
	editor: editor$o
};

var da$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$n,
    source: source$m,
    common: common$n,
    error: error$n,
    warning: warning$i,
    editor: editor$o,
    'default': da
});

var status$m = {
	cleaning: "Reinigen",
	auto: "Automatisches Reinigen",
	spot: "Punktreinigung",
	edge: "Kantenreinigung",
	single_room: "Zimmerreinigung",
	paused: "Pausiert",
	idle: "Untätig",
	stop: "Angehalten",
	charging: "Aufladen",
	returning: "Rückkehr zu Dockingstation",
	returning_home: "Rückkehr zu Dockingstation",
	docked: "Angedockt",
	unknown: "Unbekannt",
	offline: "Offline",
	error: "Fehler",
	charger_disconnected: "Ladestation nicht angeschlossen",
	remote_control_active: "Fernsteuerung aktiv",
	manual_mode: "Manueller Modus",
	shutting_down: "Herunterfahren",
	updating: "Aktualisierung",
	going_to_target: "Fahrt zum Zielpunkt",
	zoned_cleaning: "Zonenreinigung",
	segment_cleaning: "Zimmerreinigung"
};
var source$l = {
	gentle: "Schonend",
	silent: "Leise",
	standard: "Standard",
	low: "Niedrig",
	medium: "Mittel",
	high: "Hoch",
	ultrahigh: "Sehr hoch",
	turbo: "Max",
	normal: "Normal",
	max: "Maximal",
	max_plus: "Maximal+",
	strong: "Stark",
	quiet: "Leise",
	auto: "Auto",
	balanced: "Ausgeglichen",
	custom: "Benutzerdefiniert",
	off: "Aus"
};
var common$m = {
	name: "Vacuum Card",
	description: "Vacuum card ermöglicht es Ihnen, Ihr Staubsaugerroboter zu steuern.",
	start: "Reinigen",
	"continue": "Weiter",
	pause: "Pause",
	stop: "Stop",
	return_to_base: "Dock",
	locate: "Staubsauger lokalisieren",
	not_available: "Staubsaugerroboter ist nicht verfügbar"
};
var error$m = {
	invalid_config: "Ungeültige Konfiguration",
	missing_entity: "Angabe der Entität ist erforderlich!",
	domain_not_supported: "Domain nicht unterstützt!  Erfoderlich ist {0}, aber Sie haben {1} angegeben!"
};
var warning$h = {
	actions_array: "WARNUNG: 'actions' ist dafür vorgesehen, die Standardaktionen für vorhandene Schaltflächen zu überschreiben. Wenn Sie zusätzliche Aktionen hinzufügen möchten, verwenden Sie stattdessen die Option 'shortcuts'."
};
var editor$n = {
	entity: "Entität (Erforderlich)",
	map: "Map Camera (Optional)",
	water_level: "Wasser Level Select (Optional)",
	image: "Bild (Optional)",
	compact_view: "kompakte Ansicht",
	compact_view_aria_label_on: "Schalte kompakte Ansicht ein",
	compact_view_aria_label_off: "Schalte kompakte Ansicht aus",
	show_name: "Zeige Namen",
	show_name_aria_label_on: "Schalte 'Zeige Namen' ein",
	show_name_aria_label_off: "Schalte 'Zeige Namen' aus",
	show_status: "Zeige Status",
	show_status_aria_label_on: "Schalte 'Zeige Status' ein",
	show_status_aria_label_off: "Schalte 'Zeige Status' aus",
	show_toolbar: "Zeige Toolbar",
	show_toolbar_aria_label_on: "Schalte 'Zeige Toolbar' ein",
	show_toolbar_aria_label_off: "Schalte 'Zeige Toolbar' aus",
	code_only_note: "Hinweis: Das Festlegen von Aktionen und Statistikoptionen ist ausschließlich mit dem Code-Editor möglich."
};
var de = {
	status: status$m,
	source: source$l,
	common: common$m,
	error: error$m,
	warning: warning$h,
	editor: editor$n
};

var de$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$m,
    source: source$l,
    common: common$m,
    error: error$m,
    warning: warning$h,
    editor: editor$n,
    'default': de
});

var status$l = {
	cleaning: "Cleaning",
	auto: "Automatic cleaning",
	spot: "Spot cleaning",
	edge: "Edge cleaning",
	single_room: "Single room cleaning",
	paused: "Paused",
	idle: "Idle",
	stop: "Stopped",
	charging: "Charging",
	returning: "Returning home",
	returning_home: "Returning home",
	docked: "Docked",
	unknown: "Unknown",
	offline: "Offline",
	error: "Error",
	charger_disconnected: "Charger disconnected",
	remote_control_active: "Remote control active",
	manual_mode: "Manual mode",
	shutting_down: "Shutting down",
	updating: "Updating",
	going_to_target: "Going to target",
	zoned_cleaning: "Zoned cleaning",
	segment_cleaning: "Segment cleaning"
};
var source$k = {
	gentle: "Gentle",
	silent: "Silent",
	standard: "Standard",
	low: "Low",
	medium: "Medium",
	turbo: "Turbo",
	normal: "Normal",
	max: "Max",
	max_plus: "Max+",
	high: "High",
	ultrahigh: "Ultrahigh",
	strong: "Strong",
	quiet: "Quiet",
	auto: "Auto",
	balanced: "Balanced",
	custom: "Custom",
	off: "Off"
};
var common$l = {
	name: "Vacuum Card",
	description: "Vacuum card allows you to control your robot vacuum.",
	start: "Clean",
	"continue": "Continue",
	pause: "Pause",
	stop: "Stop",
	return_to_base: "Dock",
	locate: "Locate Vacuum",
	not_available: "Vacuum is not available"
};
var error$l = {
	invalid_config: "Invalid configuration",
	missing_entity: "Specifying entity is required!",
	domain_not_supported: "Domain not supported! Required is {0}, but you specified {1}!"
};
var warning$g = {
	actions_array: "WARNING: 'actions' is reserved to override default actions for existing buttons. If your intention was to add additional actions, use the 'shortcuts' option instead."
};
var editor$m = {
	entity: "Entity (Required)",
	battery: "Battery Sensor (Optional)",
	map: "Map Camera (Optional)",
	water_level: "Water Level Select (Optional)",
	image: "Image (Optional)",
	compact_view: "Compact View",
	compact_view_aria_label_on: "Toggle compact view on",
	compact_view_aria_label_off: "Toggle compact view off",
	show_name: "Show Name",
	show_name_aria_label_on: "Toggle display name on",
	show_name_aria_label_off: "Toggle display name off",
	show_status: "Show Status",
	show_status_aria_label_on: "Toggle display status on",
	show_status_aria_label_off: "Toggle display status off",
	show_toolbar: "Show Toolbar",
	show_toolbar_aria_label_on: "Toggle display toolbar on",
	show_toolbar_aria_label_off: "Toggle display toolbar off",
	animated: "Animated",
	animated_aria_label_on: "Toggle animated on",
	animated_aria_label_off: "Toggle animated off",
	status_template: "Status Template (Optional)",
	code_only_note: "Note: Setting actions and stats options are available exclusively using Code Editor."
};
var en = {
	status: status$l,
	source: source$k,
	common: common$l,
	error: error$l,
	warning: warning$g,
	editor: editor$m
};

var en$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$l,
    source: source$k,
    common: common$l,
    error: error$l,
    warning: warning$g,
    editor: editor$m,
    'default': en
});

var status$k = {
	cleaning: "Limpiando",
	paused: "En pausa",
	idle: "Inactivo",
	charging: "Cargando",
	"returning home": "Volviendo a la base",
	docked: "En la base",
	"segment cleaning": "Limpiando zona",
	returning: "Volviendo a la base"
};
var source$j = {
	gentle: "Delicado",
	silent: "Silencioso",
	standard: "Estándar",
	medium: "Medio",
	turbo: "Turbo",
	strong: "Fuerte"
};
var common$k = {
	name: "Vacuum Card",
	description: "Vacuum card te permite controlar tu robot aspirador.",
	start: "Comenzar",
	"continue": "Continuar",
	pause: "Pausar",
	stop: "Detener",
	return_to_base: "Volver a la base",
	locate: "Localizar",
	not_available: "Vacuum no está disponible"
};
var error$k = {
	missing_entity: "¡Se requiere especificar una entidad!"
};
var warning$f = {
	actions_array: "ATENCIÓN: La opcion 'actions' está reservada para sobreescribir el comportamiento por defecto de los botones existentes. Si su intención es añadir acciones adicionales, debe utilizar la opcion 'shortcuts' en su lugar."
};
var editor$l = {
	entity: "Entidad (Requerido)",
	map: "Map Camera (Opcional)",
	image: "Imagen (Opcional)",
	compact_view: "Vista compacta",
	compact_view_aria_label_on: "Activar vista compacta",
	compact_view_aria_label_off: "Desactivar vista compacta",
	show_name: "Nombre a mostrar",
	show_name_aria_label_on: "Mostrar nombre",
	show_name_aria_label_off: "Ocultar nombre",
	show_status: "Mostrar estado",
	show_status_aria_label_on: "Activar estado de la pantalla",
	show_status_aria_label_off: "Desactivar estado de la pantalla",
	show_toolbar: "Mostrar barra de herramientas",
	show_toolbar_aria_label_on: "Activar la barra de herramientas",
	show_toolbar_aria_label_off: "Desactivar la barra de herramientas",
	code_only_note: "Nota: La configuración de las acciones y estadísticas está únicamente disponible a través del Editor de Código."
};
var es = {
	status: status$k,
	source: source$j,
	common: common$k,
	error: error$k,
	warning: warning$f,
	editor: editor$l
};

var es$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$k,
    source: source$j,
    common: common$k,
    error: error$k,
    warning: warning$f,
    editor: editor$l,
    'default': es
});

var status$j = {
	cleaning: "Siivoaa",
	auto: "Automaattisiivous",
	spot: "Kohdesiivous",
	edge: "Reunasiivous",
	single_room: "Huonesiivous",
	paused: "Tauotettu",
	idle: "Toimeton",
	stop: "Pysäytetty",
	charging: "Lataa",
	returning: "Palaamassa",
	returning_home: "Palaamassa latausasemaan",
	docked: "Telakoitu",
	unknown: "Tuntematon",
	offline: "Poissa linjalta",
	error: "Virhe",
	charger_disconnected: "Laturi ei ole kytketty",
	remote_control_active: "Etäohjaus päällä",
	manual_mode: "Manuaalinen tila",
	shutting_down: "Sammutetaan",
	updating: "Päivitetään",
	going_to_target: "Menossa kohteeseen",
	zoned_cleaning: "Aluesiivous",
	segment_cleaning: "Lohkosiivous"
};
var source$i = {
	gentle: "Hellävarainen",
	silent: "Hiljainen",
	standard: "Perustaso",
	medium: "Keskitaso",
	turbo: "Turbo",
	normal: "Normaali",
	max: "Max",
	max_plus: "Max+",
	high: "High",
	strong: "Voimakas",
	quiet: "Quiet",
	auto: "Automaattinen",
	balanced: "Tasapainoinen",
	custom: "Mukautettu",
	off: "Pois päältä"
};
var common$j = {
	name: "Imurikortti",
	description: "Imurikortti mahdollistaa robotti-imurin ohjauksen.",
	start: "Käynnistä",
	"continue": "Jatka",
	pause: "Tauko",
	stop: "Pysähdy",
	return_to_base: "Latausasemaan",
	locate: "Paikanna imuri",
	not_available: "Ei saatavilla"
};
var error$j = {
	invalid_config: "Virheellinen konfiguraatio",
	missing_entity: "Entiteetti puuttuu!"
};
var warning$e = {
	actions_array: "VAROITUS: 'actions' on varattu oletustoimintojen ylikirjoittamiseen olemassaolevissa painikkeissa. Jos tarkoituksesi on lisätä toimintoja, käytä 'shortcuts' -toimintoa."
};
var editor$k = {
	entity: "Entiteetti (vaaditaan)",
	map: "Karttakamera (valinnainen)",
	image: "Kuva (valinnainen)",
	compact_view: "Kompakti näkymä",
	compact_view_aria_label_on: "Kompakti näkymä päälle",
	compact_view_aria_label_off: "Kompakti näkymä pois",
	show_name: "Näytä nimi",
	show_name_aria_label_on: "Näyttönimi päälle",
	show_name_aria_label_off: "Näyttönimi pois",
	show_status: "Näytä tila",
	show_status_aria_label_on: "Näyttönimi päällä",
	show_status_aria_label_off: "Näyttönimi pois",
	show_toolbar: "Näytä työkalurivi",
	show_toolbar_aria_label_on: "Työkalurivi päälle",
	show_toolbar_aria_label_off: "Työkalurivi pois",
	code_only_note: "Huomaa: toimintojen ja tilastojen asetukset saatavilla ainoastaan koodieditorissa."
};
var fi = {
	status: status$j,
	source: source$i,
	common: common$j,
	error: error$j,
	warning: warning$e,
	editor: editor$k
};

var fi$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$j,
    source: source$i,
    common: common$j,
    error: error$j,
    warning: warning$e,
    editor: editor$k,
    'default': fi
});

var status$i = {
	cleaning: "Nettoyage",
	auto: "Nettoyage Automatique",
	spot: "Nettoyage Localisé",
	edge: "Nettoyage Contours",
	single_room: "Nettoyage Pièce Unique",
	paused: "En pause",
	idle: "Inactif",
	stop: "Arrêté",
	charging: "En charge",
	"returning home": "Retour à la base",
	returning: "Retour à la base",
	docked: "A la base",
	unknown: "Inconnu",
	offline: "Déconnecté",
	error: "Erreur",
	charger_disconnected: "Chargement Déconnecté",
	remote_control_active: "Contrôle à distance activé",
	manual_mode: "Mode Manuelle",
	shutting_down: "Arrêt du système",
	updating: "Mise à jour",
	going_to_target: "aller_vers_la_cible",
	zoned_cleaning: "Nettoyage de zone",
	segment_cleaning: "Nettoyage du périmètre"
};
var source$h = {
	gentle: "Doux",
	silent: "Silencieux",
	standard: "Standard",
	low: "Bas",
	medium: "Moyen",
	high: "Intense",
	ultrahigh: "Très Intense",
	turbo: "Turbo",
	normal: "Normal",
	max: "Maximale",
	max_plus: "Maximale+",
	strong: "Fort",
	quiet: "Silencieux",
	auto: "Auto",
	balanced: "Équilibré",
	custom: "Personnalisé",
	off: "Arrêter"
};
var common$i = {
	name: "Vacuum Carte",
	description: "Vacuum carte vous permet de contrôler votre robot aspirateur.",
	start: "Nettoyer",
	"continue": "Continuer",
	pause: "Pause",
	stop: "Stop",
	return_to_base: "Retour base",
	locate: "Localiser l'aspirateur",
	not_available: "L'aspirateur n'est pas disponible"
};
var error$i = {
	invalid_config: "Configuration invalide",
	missing_entity: "Champs requis!",
	domain_not_supported: "Domaine non supporté ! Requise est {0}, mais utiliser {1}!"
};
var warning$d = {
	actions_array: "ATTENTION: les 'actions' sont reservées pour écraser l'action par défaut des boutons existants. If besoin d'ajouter des actions, utiliser l'option 'shortcuts' à la place."
};
var editor$j = {
	entity: "Entité (obligatoire)",
	map: "Caméra de carte (facultatif)",
	image: "Image (facultatif)",
	compact_view: "Vue compacte",
	compact_view_aria_label_on: "Activer la vue compacte",
	compact_view_aria_label_off: "Désactiver la vue compacte",
	show_name: "Afficher le nom",
	show_name_aria_label_on: "Activer affichage du nom",
	show_name_aria_label_off: "Désactiver affichage du nom",
	show_status: "Afficher l'état",
	show_status_aria_label_on: "Activer l'affichage de l'état",
	show_status_aria_label_off: "Désactiver l'affichage de l'état",
	show_toolbar: "Afficher la barre d'outils",
	show_toolbar_aria_label_on: "Activer l'affichage de la barre d'outils",
	show_toolbar_aria_label_off: "Désactiver l'affichage de la barre d'outils",
	code_only_note: "Remarque: Les options de réglage des actions et statistiques sont disponibles exclusivement en utilisant l'éditeur de code."
};
var fr = {
	status: status$i,
	source: source$h,
	common: common$i,
	error: error$i,
	warning: warning$d,
	editor: editor$j
};

var fr$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$i,
    source: source$h,
    common: common$i,
    error: error$i,
    warning: warning$d,
    editor: editor$j,
    'default': fr
});

var status$h = {
	cleaning: "מנקה",
	"segment cleaning": "ניקוי מקטע",
	auto: "ניקוי אוטומטי",
	spot: "ניקוי אזור",
	edge: "ניקוי פינה",
	single_room: "ניקוי חדר יחיד",
	paused: "מושהה",
	idle: "ממתין",
	stop: "נעצר",
	charging: "בטעינה",
	"returning home": "בחזרה הביתה",
	returning: "חוזר",
	docked: "בתחנה",
	unknown: "לא ידוע",
	offline: "מנותק",
	error: "שגיאה"
};
var source$g = {
	gentle: "עדין",
	silent: "שקט",
	standard: "רגיל",
	medium: "בינוני",
	turbo: "טורבו",
	normal: "נורמלי",
	high: "גבוה",
	auto: "אוטומטי"
};
var common$h = {
	name: "כרטיס שואב",
	description: "כרטיס שואב מאפשר לך שליטה על שואב האבק שלך.",
	start: "נקה",
	"continue": "המשך",
	pause: "השהה",
	stop: "עצור",
	return_to_base: "עגינה",
	locate: "אתר שואב",
	not_available: "השואב אינו זמין"
};
var error$h = {
	missing_entity: "יש צורך לציין ישות!"
};
var warning$c = {
	actions_array: ""
};
var editor$i = {
	entity: "ישות (נדרש)",
	map: "מצלמת מפה (אפשרי)",
	image: "תמונה (אפשרי)",
	compact_view: "תצוגה קומפקטית",
	compact_view_aria_label_on: "החלף תצוגה קומפקטית",
	compact_view_aria_label_off: "כבה את התצוגה הקומפקטית",
	show_name: "שם תצוגה",
	show_name_aria_label_on: "הפעל את שם התצוגה למצב מופעל",
	show_name_aria_label_off: "כבה את שם התצוגה",
	show_status: "הצג סטטוס",
	show_status_aria_label_on: "הפעל את מצב התצוגה למצב פעיל",
	show_status_aria_label_off: "כבה את מצב התצוגה",
	show_toolbar: "הצג סרגל כלים",
	show_toolbar_aria_label_on: "הפעל את סרגל הכלים לתצוגה",
	show_toolbar_aria_label_off: "כבה את סרגל הכלים לתצוגה",
	code_only_note: "הערה: הגדרת פעולות ואפשרויות סטטיסטיקה זמינות אך ורק באמצעות עורך הקוד."
};
var he = {
	status: status$h,
	source: source$g,
	common: common$h,
	error: error$h,
	warning: warning$c,
	editor: editor$i
};

var he$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$h,
    source: source$g,
    common: common$h,
    error: error$h,
    warning: warning$c,
    editor: editor$i,
    'default': he
});

var status$g = {
	cleaning: "Takarítás",
	auto: "Automatikus takarítás",
	spot: "Célzott takarítás",
	edge: "Széltakarítás",
	single_room: "Egyetlen szoba takarítás",
	paused: "Szüneteltetve",
	idle: "Tétlen",
	stop: "Megállítva",
	charging: "Töltés",
	returning: "Hazatérés",
	returning_home: "Hazatérés",
	docked: "Dokkolva",
	unknown: "Ismeretlen",
	offline: "Offline",
	error: "Hiba",
	charger_disconnected: "Töltő leválasztva",
	remote_control_active: "Távirányítás aktív",
	manual_mode: "Kézi üzemmód",
	shutting_down: "Kikapcsolás",
	updating: "Frissítés",
	going_to_target: "Cél felé halad",
	zoned_cleaning: "Zóna takarítás",
	segment_cleaning: "Szegmens takarítás"
};
var source$f = {
	gentle: "Gyengéd",
	silent: "Csendes",
	standard: "Alap",
	medium: "Közepes",
	turbo: "Turbó",
	normal: "Normál",
	max: "Maximum",
	max_plus: "Maximum+",
	high: "Magas",
	strong: "Erős",
	quiet: "Csendes",
	auto: "Automatikus",
	balanced: "Kiegyensúlyozott",
	custom: "Egyedi",
	off: "Kikapcsolva"
};
var common$g = {
	name: "Porszívó kártya",
	description: "A porszívó kártya lehetővé teszi a robotporszívó vezérlését.",
	start: "Indítás",
	"continue": "Folytatás",
	pause: "Szünet",
	stop: "Megállás",
	return_to_base: "Dokkolás",
	locate: "Porszívó keresése",
	not_available: "A porszívó nem elérhető"
};
var error$g = {
	invalid_config: "Érvénytelen konfiguráció",
	missing_entity: "Entitás megadása kötelező!"
};
var warning$b = {
	actions_array: "FIGYELEM: A 'actions' a meglévő gombok alapértelmezett műveleteinek felülbírálására szolgál. Ha további műveleteket szeretne hozzáadni, használja inkább a 'shortcuts' lehetőséget."
};
var editor$h = {
	entity: "Entitás (kötelező)",
	map: "Térkép kamera (opcionális)",
	image: "Kép (opcionális)",
	compact_view: "Kompakt nézet",
	compact_view_aria_label_on: "Kompakt nézet bekapcsolása",
	compact_view_aria_label_off: "Kompakt nézet kikapcsolása",
	show_name: "Név megjelenítése",
	show_name_aria_label_on: "Név megjelenítésének bekapcsolása",
	show_name_aria_label_off: "Név megjelenítésének kikapcsolása",
	show_status: "Állapot megjelenítése",
	show_status_aria_label_on: "Állapot megjelenítésének bekapcsolása",
	show_status_aria_label_off: "Állapot megjelenítésének kikapcsolása",
	show_toolbar: "Eszköztár megjelenítése",
	show_toolbar_aria_label_on: "Eszköztár megjelenítésének bekapcsolása",
	show_toolbar_aria_label_off: "Eszköztár megjelenítésének kikapcsolása",
	code_only_note: "Megjegyzés: A műveletek és statisztika beállítások kizárólag a kód szerkesztő használatával érhetők el."
};
var hu = {
	status: status$g,
	source: source$f,
	common: common$g,
	error: error$g,
	warning: warning$b,
	editor: editor$h
};

var hu$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$g,
    source: source$f,
    common: common$g,
    error: error$g,
    warning: warning$b,
    editor: editor$h,
    'default': hu
});

var status$f = {
	cleaning: "In pulizia",
	paused: "In pausa",
	idle: "Inattivo",
	charging: "In carica",
	returning_home: "In rientro alla base",
	docked: "Alla Base"
};
var source$e = {
	gentle: "Gentile",
	silent: "Silenzioso",
	standard: "Normale",
	medium: "Medio",
	turbo: "Turbo"
};
var common$f = {
	name: "Vacuum Card",
	description: "Vacuum card consente di controllare il tuo aspirapolvere.",
	start: "Pulisci",
	"continue": "Continua",
	pause: "Pausa",
	stop: "Stop",
	return_to_base: "Base",
	locate: "Trova aspirapolvere",
	not_available: "Aspirapolvere non disponibile"
};
var error$f = {
	missing_entity: "È necessario specificare l'entità!"
};
var warning$a = {
	actions_array: ""
};
var editor$g = {
	entity: "Entità (Richiesto)",
	map: "Mappa (Opzionale)",
	image: "Immagine (Opzionale)",
	compact_view: "Vista compatta",
	compact_view_aria_label_on: "Attiva vista compatta",
	compact_view_aria_label_off: "Disattiva vista compatta",
	show_name: "Mostra Nome",
	show_name_aria_label_on: "Attiva nome",
	show_name_aria_label_off: "Disattiva nome",
	show_status: "Mostra Stato",
	show_status_aria_label_on: "Attiva stato",
	show_status_aria_label_off: "Disattiva stato",
	show_toolbar: "Mostra barra degli strumenti",
	show_toolbar_aria_label_on: "Attiva barra degli strumenti",
	show_toolbar_aria_label_off: "Disattiva barra degli strumenti",
	code_only_note: "NB: La configurazione di azioni e statistiche sono disponibili soltanto nell'editor di codice."
};
var it = {
	status: status$f,
	source: source$e,
	common: common$f,
	error: error$f,
	warning: warning$a,
	editor: editor$g
};

var it$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$f,
    source: source$e,
    common: common$f,
    error: error$f,
    warning: warning$a,
    editor: editor$g,
    'default': it
});

var status$e = {
	cleaning: "掃除中",
	auto: "自動",
	spot: "スポット",
	edge: "エッジ清掃",
	single_room: "シングルルームモード",
	paused: "一時停止",
	idle: "アイドル",
	stop: "停止",
	charging: "充電中",
	returning: "ホームに戻っています",
	returning_home: "ホームに戻る",
	docked: "ドックに接続中",
	unknown: "不明",
	offline: "オフライン",
	error: "エラー",
	charger_disconnected: "充電器が接続されていません",
	remote_control_active: "リモート操作有効",
	manual_mode: "マニュアルモード",
	shutting_down: "シャットダウン",
	updating: "更新中",
	going_to_target: "目的地へ移動中",
	zoned_cleaning: "ゾーン清掃",
	segment_cleaning: "セグメント清掃"
};
var source$d = {
	gentle: "やさしく",
	silent: "無音",
	standard: "標準",
	medium: "中",
	turbo: "ターボ",
	normal: "通常",
	max: "最大",
	max_plus: "最大+",
	high: "高",
	strong: "最強",
	quiet: "静音",
	auto: "自動",
	balanced: "バランス",
	custom: "カスタム",
	off: "オフ"
};
var common$e = {
	name: "掃除機カード",
	description: "掃除機かーどはロボット掃除機の操作に使用します。",
	start: "開始",
	"continue": "続ける",
	pause: "一時停止",
	stop: "中止",
	return_to_base: "ドック",
	locate: "掃除機の場所",
	not_available: "掃除機は利用できません"
};
var error$e = {
	invalid_config: "設定が無効です",
	missing_entity: "エンティティを選択してください。"
};
var warning$9 = {
	actions_array: "警告：'actions'は既存のボタンのデフォルトアクションを上書きするために使用されています。アクションを追加したい場合は、'shortcuts' オプションを使用してください。"
};
var editor$f = {
	entity: "エンティティ（必須）",
	map: "マップカメラ（オプション）",
	image: "イメージ（オプション）",
	compact_view: "コンパクトビュー",
	compact_view_aria_label_on: "コンパクトビューをオンにする",
	compact_view_aria_label_off: "コンパクトビューをオフにする",
	show_name: "名前を表示",
	show_name_aria_label_on: "名前の表示をオンにする",
	show_name_aria_label_off: "名前の表示をオフにする",
	show_status: "ステータスを表示",
	show_status_aria_label_on: "ステータスの表示をオンにする",
	show_status_aria_label_off: "ステータスの表示をオフにする",
	show_toolbar: "ツールバーを表示",
	show_toolbar_aria_label_on: "ツールバーの表示をオンにする",
	show_toolbar_aria_label_off: "ツールバーの表示をオフにする",
	code_only_note: "注：actionとstatsのオプション設定は、コードエディターで行ってください。"
};
var ja = {
	status: status$e,
	source: source$d,
	common: common$e,
	error: error$e,
	warning: warning$9,
	editor: editor$f
};

var ja$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$e,
    source: source$d,
    common: common$e,
    error: error$e,
    warning: warning$9,
    editor: editor$f,
    'default': ja
});

var status$d = {
	cleaning: "청소 중",
	auto: "자동 청소",
	spot: "부분 청소",
	edge: "가장자리 청소",
	single_room: "방 청소",
	paused: "일시 정지",
	idle: "유휴 중",
	stop: "중지됨",
	charging: "충전 중",
	"returning home": "충전대로 복귀 중",
	returning: "충전대로 복귀 중",
	docked: "도킹됨",
	unknown: "알수 없음",
	offline: "오프라인",
	error: "오류"
};
var source$c = {
	gentle: "저속",
	silent: "저소음",
	standard: "표준",
	medium: "중간",
	turbo: "터보",
	normal: "보통",
	high: "높음",
	strong: "강함",
	quiet: "조용함",
	max: "맥스",
	"max+": "맥스+"
};
var common$d = {
	name: "청소기 카드",
	description: "청소기 카드를 사용하면 로봇 청소기를 제어할 수 있습니다.",
	start: "청소 시작",
	"continue": "청소 재개",
	pause: "일시 정지",
	stop: "중지",
	return_to_base: "충전대로 복귀",
	locate: "청소기 위치",
	not_available: "청소기 사용 불가"
};
var error$d = {
	missing_entity: "구성요소 지정이 필요합니다!"
};
var warning$8 = {
	actions_array: "경고: '동작'은 기존 버튼에 대한 기본 동작을 재정의하도록 예약되어 있습니다. 다른 동작을 추가하려는 경우 '바로가기' 옵션을 대신 사용하십시오."
};
var editor$e = {
	entity: "구성요소 (필수)",
	map: "도면 (선택)",
	image: "이미지 (선택)",
	compact_view: "간단히 보기",
	compact_view_aria_label_on: "간단히 보기 켜기",
	compact_view_aria_label_off: "간단히 보기 끄기",
	show_name: "Show Name",
	show_name_aria_label_on: "이름 표시 켜기",
	show_name_aria_label_off: "이름 표시 끄기",
	show_status: "상태 표시",
	show_status_aria_label_on: "상태 표시 켜기",
	show_status_aria_label_off: "상태 표시 끄기",
	show_toolbar: "툴바 표시",
	show_toolbar_aria_label_on: "툴바 표시 켜기",
	show_toolbar_aria_label_off: "툴바 표시 끄기",
	code_only_note: "참고: 동작 및 상태 옵션 설정은 코드 편집기에서만 사용할 수 있습니다."
};
var ko = {
	status: status$d,
	source: source$c,
	common: common$d,
	error: error$d,
	warning: warning$8,
	editor: editor$e
};

var ko$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$d,
    source: source$c,
    common: common$d,
    error: error$d,
    warning: warning$8,
    editor: editor$e,
    'default': ko
});

var status$c = {
	cleaning: "Valo",
	paused: "Pristabdytas",
	idle: "Neturi darbo",
	charging: "Kraunasi",
	"returning home": "Grįžtą namo",
	docked: "Doke"
};
var source$b = {
	gentle: "Švelnus",
	silent: "Tylus",
	standard: "Standartinis",
	medium: "Vidutinis",
	turbo: "Turbo"
};
var common$c = {
	name: "Siurblio kortelė",
	description: "Siurblio kortelė leidžia valdyti jūsų robotą siurblį",
	start: "Valyti",
	"continue": "Tęsti",
	pause: "Pristabdyti",
	stop: "Sustabdyti",
	return_to_base: "Statyti į doką",
	locate: "Ieškoti siurblio",
	not_available: "Siurblys yra nepasiekiamas"
};
var error$c = {
	missing_entity: "Būtina nurodyti entity!"
};
var editor$d = {
	entity: "Entity (Būtina)",
	map: "Žemėlapio kamera (Neprivaloma)",
	image: "Paveikslėlis (Neprivaloma)",
	compact_view: "Glaustas vaizdas",
	compact_view_aria_label_on: "Įjungti glaustą vaizdą",
	compact_view_aria_label_off: "Išjungti glaustą vaizdą",
	show_name: "Rodyti pavadinimą",
	show_name_aria_label_on: "Įjungti pavadinimo rodymą",
	show_name_aria_label_off: "Išjungti pavadinimo rodymą",
	show_status: "Rodyti būseną",
	show_status_aria_label_on: "Įjungti būsenos rodymą",
	show_status_aria_label_off: "Išjungti būsenos rodymą",
	show_toolbar: "Rodyti įrankių juostą",
	show_toolbar_aria_label_on: "Įjungti įrankių juostos rodymą",
	show_toolbar_aria_label_off: "Išjungti įrankių juostos rodymą",
	code_only_note: "Pastaba: Veiksmų ir statistikos nustatymai gali būti redaguojami tik naudojantis kodo redaguotoju."
};
var lt = {
	status: status$c,
	source: source$b,
	common: common$c,
	error: error$c,
	editor: editor$d
};

var lt$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$c,
    source: source$b,
    common: common$c,
    error: error$c,
    editor: editor$d,
    'default': lt
});

var status$b = {
	cleaning: "Rengjøring",
	paused: "Pauset",
	idle: "Tomgang",
	charging: "Lader",
	"returning home": "Returnerer hjem"
};
var source$a = {
	gentle: "Skånsom",
	silent: "Stille",
	standard: "Standard",
	medium: "Medium",
	turbo: "Turbo"
};
var common$b = {
	name: "Støvsuger kort",
	description: "Støvsugerkortet lar deg kontrollere robotstøvsugeren din",
	start: "Rengjør",
	"continue": "fortsett",
	pause: "Pause",
	stop: "Stop",
	return_to_base: "Dock",
	locate: "Lokaliser støvsuger",
	not_available: "Støvsugeren er ikke tilgjengelig"
};
var error$b = {
	missing_entity: "Spesifiserende enhet kreves!"
};
var warning$7 = {
	actions_array: ""
};
var editor$c = {
	entity: "Enhet (påkrevd)",
	map: "Kartkamera (valgfritt)",
	image: "Bilde (Valgfritt)",
	compact_view: "Kompakt visning",
	compact_view_aria_label_on: "Slå på kompakt visning",
	compact_view_aria_label_off: "Slå av kompakt visningf",
	show_name: "Vis navn",
	show_name_aria_label_on: "Slå visningsnavnet på",
	show_name_aria_label_off: "Slå visningsnavnet av",
	show_status: "Vis Status",
	show_status_aria_label_on: "Slå skjermstatus på",
	show_status_aria_label_off: "Slå skjermstatus av",
	show_toolbar: "Vis verktøylinjen",
	show_toolbar_aria_label_on: "Slå skjermverktøylinjen på",
	show_toolbar_aria_label_off: "Slå skjermverktøylinjen av",
	code_only_note: "Merk: Innstillingshandlinger og statistikkalternativer er eksklusivt tilgjengelige ved hjelp av Code Editor."
};
var nb = {
	status: status$b,
	source: source$a,
	common: common$b,
	error: error$b,
	warning: warning$7,
	editor: editor$c
};

var nb$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$b,
    source: source$a,
    common: common$b,
    error: error$b,
    warning: warning$7,
    editor: editor$c,
    'default': nb
});

var status$a = {
	cleaning: "Aan het schoonmaken",
	paused: "Gepauzeerd",
	idle: "Inactief",
	charging: "Aan het opladen",
	"returning home": "Keert terug naar dock"
};
var common$a = {
	name: "Stofzuiger kaart",
	description: "Stofzuiger kaart maakt het makkelijk om je robotstofzuiger te bedienen.",
	start: "Start",
	"continue": "Doorgaan",
	pause: "Pauze",
	stop: "Stop",
	return_to_base: "Terugkeren",
	locate: "Zoek stofzuiger"
};
var error$a = {
	missing_entity: "Het specificeren van een entiteit is verplicht!"
};
var warning$6 = {
	actions_array: ""
};
var editor$b = {
	entity: "Entiteit (Verplicht)",
	map: "Kaart Camera (Optioneel)",
	image: "Afbeelding (Optioneel)",
	compact_view: "Compacte weergave",
	compact_view_aria_label_on: "Zet compacte weergave aan",
	compact_view_aria_label_off: "Zet compacte weergave uit",
	show_name: "Naam laten zien?",
	show_name_aria_label_on: "Zet weergavenaam aan",
	show_name_aria_label_off: "Zet weergavenaam uit",
	show_toolbar: "Werkbalk laten zien?",
	show_toolbar_aria_label_on: "Zet werkbalk aan",
	show_toolbar_aria_label_off: "Zet werkbalk uit",
	code_only_note: "Notitie: Instel acties en status opties zijn alleen beschikbaar in de Code Editor"
};
var nl = {
	status: status$a,
	common: common$a,
	error: error$a,
	warning: warning$6,
	editor: editor$b
};

var nl$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$a,
    common: common$a,
    error: error$a,
    warning: warning$6,
    editor: editor$b,
    'default': nl
});

var status$9 = {
	cleaning: "Rengjer",
	paused: "Pausa",
	idle: "Tomgang",
	charging: "Ladar",
	"returning home": "Returnerer heim"
};
var source$9 = {
	gentle: "Skånsam",
	silent: "Stille",
	standard: "Standard",
	medium: "Medium",
	turbo: "Turbo"
};
var common$9 = {
	name: "Støvsugarkort",
	description: "Støvsugarkortet let deg kontrollere robotstøvsugaren din",
	start: "Reingjer",
	"continue": "Fortsett",
	pause: "Sett på pause",
	stop: "Stopp",
	return_to_base: "Dokk",
	locate: "Lokaliser støvsugar",
	not_available: "Støvsugaren er ikkje tilgjengeleg"
};
var error$9 = {
	missing_entity: "Spesifiserande oppføring kravd!"
};
var editor$a = {
	entity: "Oppføring (påkravd)",
	map: "Kartkamera (valfritt)",
	image: "Bilde (valfritt)",
	compact_view: "Kompakt vising",
	compact_view_aria_label_on: "Slå på kompakt vising",
	compact_view_aria_label_off: "Slå av kompakt vising",
	show_name: "Vis namn",
	show_name_aria_label_on: "Slå visingsnanet på",
	show_name_aria_label_off: "Slå visingsnamnet av",
	show_status: "Vis status",
	show_status_aria_label_on: "Slå skjermstatus på",
	show_status_aria_label_off: "Slå skjermstatus av",
	show_toolbar: "Vis verktøylinja",
	show_toolbar_aria_label_on: "Slå skjermverktøylinja på",
	show_toolbar_aria_label_off: "Slå skjermverktøylinja av",
	code_only_note: "Merk: Innstillingshandlingar og statistikkalternativ er berre tilgjengeleg ved hjelp av Code Editor."
};
var nn = {
	status: status$9,
	source: source$9,
	common: common$9,
	error: error$9,
	editor: editor$a
};

var nn$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$9,
    source: source$9,
    common: common$9,
    error: error$9,
    editor: editor$a,
    'default': nn
});

var status$8 = {
	cleaning: "Sprzątanie",
	auto: "Automatyczne sprzątanie",
	spot: "Sprzątanie miejscowe",
	edge: "Sprzątanie krawędziowe",
	single_room: "Sprzątanie pojedyńczego pokoju",
	paused: "Wstrzymany",
	idle: "Bezczynny",
	stop: "Zatrzymany",
	charging: "Ładowanie",
	returning: "Powracanie",
	returning_home: "Powrót do bazy",
	docked: "Zadokowany",
	unknown: "Nieznany",
	offline: "Offline",
	error: "Błąd",
	charger_disconnected: "Ładowarka odłączona",
	remote_control_active: "Zdalne sterowanie",
	manual_mode: "Tryb manualny",
	shutting_down: "Wyłączanie",
	updating: "Aktualizowanie",
	going_to_target: "Podróż do celu",
	zoned_cleaning: "Sprzątanie obszaru",
	segment_cleaning: "Sprzątanie segmentu",
	"returning home": "Powrót do bazy"
};
var source$8 = {
	gentle: "Delikatne",
	silent: "Ciche",
	standard: "Standardowe",
	medium: "Średnie",
	turbo: "Turbo",
	normal: "Normalne",
	max: "Maksymalne",
	max_plus: "Max+",
	high: "Wysokie",
	strong: "Mocne",
	quiet: "Ciche",
	auto: "Auto",
	balanced: "Zbalansowane",
	custom: "Własne",
	off: "Wyłączone",
	low: "Niskie"
};
var common$8 = {
	name: "Vacuum Card",
	description: "Vacuum Card pozwala zdalnie kontrolować odkurzacz.",
	start: "Sprzątaj",
	"continue": "Kontynuuj",
	pause: "Wstrzymaj",
	stop: "Zatrzymaj",
	return_to_base: "Powrót do bazy",
	locate: "Zlokalizuj odkurzacz",
	not_available: "Odkurzacz jest niedostępny"
};
var error$8 = {
	invalid_config: "Nieprawidłowa konfiguracja",
	missing_entity: "Ustawienie encji jest wymagane!"
};
var warning$5 = {
	actions_array: "OSTRZEŻENIE: 'actions' jest zarezerwowane dla zmiany zachowania domyślnych akcji przycisków. Jeśli chcesz dodać dodatkowe akcje, użyj w zamian opcji 'shortcuts'."
};
var editor$9 = {
	entity: "Encja (wymagane)",
	map: "Kamera z mapą (opcjonalna)",
	image: "Obraz (opcjonalny)",
	compact_view: "Widok kompaktowy",
	compact_view_aria_label_on: "Włącz widok kompaktowy",
	compact_view_aria_label_off: "Wyłącz widok kompaktowy",
	show_name: "Pokaż nazwę",
	show_name_aria_label_on: "Włącz widok nazwy",
	show_name_aria_label_off: "Wyłącz widok nazwy",
	show_status: "Pokaż pasek statusu",
	show_status_aria_label_on: "Włącz widok paska statusu",
	show_status_aria_label_off: "Wyłącz widok paska statusu",
	show_toolbar: "Pasek narzędzi",
	show_toolbar_aria_label_on: "Włącz pasek narzędzi",
	show_toolbar_aria_label_off: "Wyłącz pasek narzędzi",
	code_only_note: "Uwaga: Ustawianie opcji i informacji statystyk jest dostępne tylko poprzez edytor kodu YAML."
};
var pl = {
	status: status$8,
	source: source$8,
	common: common$8,
	error: error$8,
	warning: warning$5,
	editor: editor$9
};

var pl$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$8,
    source: source$8,
    common: common$8,
    error: error$8,
    warning: warning$5,
    editor: editor$9,
    'default': pl
});

var status$7 = {
	cleaning: "A Limpar",
	auto: "Limpeza automática",
	spot: "Limpeza localizada",
	edge: "Limpeza de bordas",
	single_room: "Limpeza de um único quarto",
	paused: "Pausado",
	idle: "Inativo",
	stop: "Parado",
	charging: "A Carregar",
	returning: "A regressar",
	"returning home": "A regressar à base",
	docked: "Na base",
	unknown: "Desconhecido",
	offline: "Offline",
	error: "Erro",
	charger_disconnected: "Carregador desconectado",
	remote_control_active: "Controlo remoto ativo",
	manual_mode: "Modo manual",
	shutting_down: "A desligar",
	updating: "A atualizar",
	going_to_target: "A caminho do destino",
	zoned_cleaning: "Limpeza por zonas",
	segment_cleaning: "Limpeza por segmentos"
};
var source$7 = {
	gentle: "Delicado",
	silent: "Silencioso",
	standard: "Padrão",
	medium: "Médio",
	turbo: "Turbo",
	normal: "Normal",
	max: "Máximo",
	max_plus: "Máximo+",
	high: "Alto",
	strong: "Forte",
	quiet: "Silencioso",
	auto: "Automático",
	balanced: "Equilibrado",
	custom: "Personalizado",
	off: "Desligado"
};
var common$7 = {
	name: "Vacuum Card",
	description: "Vacuum card permite controlar o seu robô aspirador.",
	start: "Limpar",
	"continue": "Continuar",
	pause: "Pausar",
	stop: "Parar",
	return_to_base: "Base",
	locate: "Localizar Aspirador",
	not_available: "Aspirador indisponível"
};
var error$7 = {
	invalid_config: "Configuração inválida",
	missing_entity: "Entidade especificada obrigatória!"
};
var warning$4 = {
	actions_array: "AVISO: 'actions' está reservado para substituir ações padrão de botões existentes. Se a sua intenção era adicionar ações adicionais, utilize a opção 'shortcuts'."
};
var editor$8 = {
	entity: "Entidade (Obrigatório)",
	map: "Mapa (Opcional)",
	image: "Imagem (Opcional)",
	compact_view: "Vista Compacta",
	compact_view_aria_label_on: "Ativar visualização compacta",
	compact_view_aria_label_off: "Desativar a visualização compacta",
	show_name: "Mostrar nome",
	show_name_aria_label_on: "Mostrar nome",
	show_name_aria_label_off: "Ocultar nome",
	show_status: "Mostrar estado",
	show_status_aria_label_on: "Mostrar estado",
	show_status_aria_label_off: "Ocultar estado",
	show_toolbar: "Mostrar barra de ferramentas",
	show_toolbar_aria_label_on: "Mostrar barra de ferramentas",
	show_toolbar_aria_label_off: "Ocultar barra de ferramentas",
	code_only_note: "Nota: Ações e estatísticas estão disponiveis exclusivamente usando o Editor de Código."
};
var pt = {
	status: status$7,
	source: source$7,
	common: common$7,
	error: error$7,
	warning: warning$4,
	editor: editor$8
};

var pt$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$7,
    source: source$7,
    common: common$7,
    error: error$7,
    warning: warning$4,
    editor: editor$8,
    'default': pt
});

var status$6 = {
	cleaning: "Limpando",
	auto: "Limpeza automatica",
	spot: "Limpando local",
	edge: "Limpando borda",
	single_room: "Limpando um quarto",
	paused: "Em pausa",
	idle: "Ocioso",
	stop: "Parado",
	charging: "Carregando",
	"returning home": "Voltando à base",
	returning: "Voltando",
	docked: "Na base",
	unknown: "Desconhecido",
	offline: "Offline",
	error: "Erro"
};
var source$6 = {
	gentle: "Delicado",
	silent: "Silencioso",
	standard: "Padrão",
	medium: "Médio",
	turbo: "Turbo",
	normal: "Normal",
	high: "Alto",
	strong: "Forte"
};
var common$6 = {
	name: "Vacuum Card",
	description: "Vacuum card para controlar seu robô aspirador.",
	start: "Limpar",
	"continue": "Continuar",
	pause: "Pausa",
	stop: "Parar",
	return_to_base: "Retornar à base",
	locate: "Localizar aspirador",
	not_available: "Aspirador indisponível"
};
var error$6 = {
	missing_entity: "Entidade obrigatória"
};
var warning$3 = {
	actions_array: "AVISO: 'actions' são reservadas para substituir as ações padrões para botões existentes. Se sua intenção era adicionar ações adicionais, use a opção 'shortcuts'."
};
var editor$7 = {
	entity: "Entidade (Obrigatória)",
	map: "Mapa (Opcional)",
	image: "Imagem (Opcional)",
	compact_view: "Vista Compacta",
	compact_view_aria_label_on: "Ativar visualização compacta",
	compact_view_aria_label_off: "Desativar visualização compacta",
	show_name: "Mostrar nome",
	show_name_aria_label_on: "Mostrar nome",
	show_name_aria_label_off: "Ocultar nome",
	show_status: "Mostrar estado",
	show_status_aria_label_on: "Mostrar estado",
	show_status_aria_label_off: "Ocultar estado",
	show_toolbar: "Mostrar barra de ferramentas",
	show_toolbar_aria_label_on: "Mostrar barra de ferramentas",
	show_toolbar_aria_label_off: "Ocultar barra de ferramentas",
	code_only_note: "Nota: Ações e estatísticas estão disponiveis exclusivamente usando o editor de código."
};
var ptBR = {
	status: status$6,
	source: source$6,
	common: common$6,
	error: error$6,
	warning: warning$3,
	editor: editor$7
};

var pt_br = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$6,
    source: source$6,
    common: common$6,
    error: error$6,
    warning: warning$3,
    editor: editor$7,
    'default': ptBR
});

var status$5 = {
	cleaning: "Curățare",
	auto: "Curățare Automată",
	spot: "Curățare Punct",
	edge: "Curățare Margini",
	single_room: "Curățare o singură cameră",
	paused: "Repauz",
	idle: "Inactiv",
	stop: "Oprit",
	charging: "Încărcare",
	"returning home": "Revenire Acasă",
	returning: "Revenire Acasă",
	docked: "Parcat",
	unknown: "Necunoscut",
	offline: "Deconectat",
	error: "Eroare"
};
var source$5 = {
	gentle: "Blând",
	silent: "Silențios",
	standard: "Standard",
	medium: "Mediu",
	turbo: "Turbo",
	normal: "Normal",
	high: "Ridicat"
};
var common$5 = {
	name: "Card de vid.",
	description: "Un card de vid vă permite să controlați vidul robotului.",
	start: "Curat",
	"continue": "Continuă",
	pause: "Repauz",
	stop: "Stop",
	return_to_base: "Parchează",
	locate: "Găsește Aspirator",
	not_available: "Aspiratorul nu este disponibil"
};
var error$5 = {
	missing_entity: "Este necesară specificarea entității!"
};
var editor$6 = {
	entity: "Entitate (Necesar)",
	map: "Camera Harta (Optional)",
	image: "Imagine (Optional)",
	compact_view: "Vizualizare compactă",
	compact_view_aria_label_on: "Pornește vizualizare compactă",
	compact_view_aria_label_off: "Oprește vizualizare compactă compact view off",
	show_name: "Arată Nume",
	show_name_aria_label_on: "Pornește arată nume",
	show_name_aria_label_off: "Oprește arată nume",
	show_status: "Arată Status",
	show_status_aria_label_on: "Pornește arată status",
	show_status_aria_label_off: "Oprește arată status",
	show_toolbar: "Arată bara de instrumente",
	show_toolbar_aria_label_on: "Pornește arată bara de instrumente",
	show_toolbar_aria_label_off: "Oprește arată bara de instrumente",
	code_only_note: "Notă: Acțiunile de setare și opțiunile de statistici sunt disponibile exclusiv folosind Editorul de cod."
};
var ro = {
	status: status$5,
	source: source$5,
	common: common$5,
	error: error$5,
	editor: editor$6
};

var ro$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$5,
    source: source$5,
    common: common$5,
    error: error$5,
    editor: editor$6,
    'default': ro
});

var status$4 = {
	cleaning: "Убирает",
	paused: "Пауза",
	idle: "Ожидает",
	charging: "Заряжается",
	"returning home": "Возвращается",
	returning: "Возвращается",
	docked: "На базе",
	"segment cleaning": "Уборка зоны/комнаты",
	mopping: "Мытье полов",
	auto: "Автоматическая уборка",
	spot: "Уборка пятна",
	edge: "Уборка вдоль стен",
	single_room: "Уборка 1й комнаты",
	stop: "Остановлен",
	unknown: "Неизвестен",
	offline: "Офлайн",
	error: "Ошибка",
	charger_disconnected: "Зарядное устройство не подключено",
	remote_control_active: "Активировано удалённое управление",
	manual_mode: "Ручной режим",
	shutting_down: "Выключается",
	updating: "Обновляется",
	going_to_target: "Едет к точке назначения",
	zoned_cleaning: "Очищает зону"
};
var source$4 = {
	gentle: "Деликатный",
	silent: "Тихий",
	standard: "Стандартный",
	medium: "Средний",
	turbo: "Турбо",
	strong: "Сильный",
	normal: "Нормальный",
	max: "Максимальный",
	max_plus: "Максимальный+",
	high: "Высокий",
	quiet: "Тихий",
	auto: "Автоматический",
	balanced: "Сбалансированный",
	custom: "Пользовательский",
	off: "Выключен"
};
var common$4 = {
	name: "Пылесос",
	description: "Карта \"пылесос\" позволяет управлять роботом-пылесосом.",
	start: "Запуск",
	"continue": "Продолжить",
	pause: "Пауза",
	stop: "Остановить",
	return_to_base: "На базу",
	locate: "Найти",
	not_available: "Пылесос недоступен"
};
var error$4 = {
	invalid_config: "Неверная конфигурация",
	missing_entity: "Объект является обязательным полем!"
};
var warning$2 = {
	actions_array: "WARNING: 'actions' зарезервированы для переопределения действий встроенных кнопок. Если вы хотите добавить дополнительные действия, используйте опцию 'shortcuts'."
};
var editor$5 = {
	entity: "Объект (Обязательное)",
	map: "Камера для карты (Опциональное)",
	image: "Изображение (Опциональное)",
	compact_view: "Компактный просмотр",
	compact_view_aria_label_on: "Включить компактный просмотр",
	compact_view_aria_label_off: "Выключить компактный просмотр",
	show_name: "Показать название?",
	show_name_aria_label_on: "Показать название",
	show_name_aria_label_off: "Скрыть название",
	show_status: "Показать статус?",
	show_status_aria_label_on: "Показать статус",
	show_status_aria_label_off: "Скрыть статус",
	show_toolbar: "Показать панель действий?",
	show_toolbar_aria_label_on: "Показать панель действий",
	show_toolbar_aria_label_off: "Скрыть панель действий",
	code_only_note: "Внимание: Опции actions и stats доступны исключительно через редактор кода."
};
var ru = {
	status: status$4,
	source: source$4,
	common: common$4,
	error: error$4,
	warning: warning$2,
	editor: editor$5
};

var ru$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$4,
    source: source$4,
    common: common$4,
    error: error$4,
    warning: warning$2,
    editor: editor$5,
    'default': ru
});

var status$3 = {
	cleaning: "Städar",
	paused: "Pausad",
	idle: "Inaktiv",
	charging: "Laddar",
	"returning home": "Återvänder hem"
};
var source$3 = {
	gentle: "Extra försiktig",
	silent: "Eco - tyst",
	standard: "Standard",
	medium: "Medium",
	turbo: "Turbo"
};
var common$3 = {
	name: "Dammsugarkort",
	description: "Dammsugarkort låter dig att kontrollera din robotdammsugare.",
	start: "Städa",
	"continue": "Fortsätt",
	pause: "Paus",
	stop: "Stopp",
	return_to_base: "Docka",
	locate: "Lokalisera dammsugare",
	not_available: "Dammsugare är inte tillgänglig"
};
var error$3 = {
	missing_entity: "Specificera entitet är obligatoriskt!"
};
var warning$1 = {
	actions_array: ""
};
var editor$4 = {
	entity: "Entitet (Obligatoriskt)",
	map: "Kartkamera (Valfritt)",
	image: "Bild (Valfritt)",
	compact_view: "Kompakt vy",
	compact_view_aria_label_on: "Aktivera kompakt vy",
	compact_view_aria_label_off: "Inaktivera kompakt vy",
	show_name: "Visa namn",
	show_name_aria_label_on: "Aktivera namn",
	show_name_aria_label_off: "Inaktivera namn",
	show_status: "Visa status",
	show_status_aria_label_on: "Aktivera status",
	show_status_aria_label_off: "Inaktivera status",
	show_toolbar: "Visa verktygsvält",
	show_toolbar_aria_label_on: "Aktivera verktygsfält",
	show_toolbar_aria_label_off: "Inaktivera verktygsfält",
	code_only_note: "Obs! Inställningar för händelser och statistikalternativ är enbart tillgängliga med kodredigeraren."
};
var sv = {
	status: status$3,
	source: source$3,
	common: common$3,
	error: error$3,
	warning: warning$1,
	editor: editor$4
};

var sv$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$3,
    source: source$3,
    common: common$3,
    error: error$3,
    warning: warning$1,
    editor: editor$4,
    'default': sv
});

var status$2 = {
	Cleaning: "清掃中",
	Paused: "暫停中",
	Idle: "閒置中",
	Charging: "充電中",
	"Returning home": "正在返回充電座",
	docked: "返回充電座",
	"segment cleaning": "區域清掃"
};
var source$2 = {
	Gentle: "拖地",
	Silent: "安靜",
	Standard: "標準",
	Medium: "強力",
	Turbo: "MAX"
};
var common$2 = {
	name: "Vacuum Card",
	description: "Vacuum Card 可以讓您控制掃地機器人",
	start: "開始清掃",
	"continue": "繼續清掃",
	pause: "暫停清掃",
	stop: "停止清掃",
	return_to_base: "返回充電座",
	locate: "定位掃地機器人",
	not_available: "掃地機器人並不支援"
};
var error$2 = {
	missing_entity: "必須指定一個實體!"
};
var editor$3 = {
	entity: "實體 (必填)",
	map: "地圖 (選填)",
	image: "圖片 (選填)",
	compact_view: "精簡檢視",
	compact_view_aria_label_on: "開啟精簡檢視",
	compact_view_aria_label_off: "關閉精簡檢視",
	show_name: "顯示名字",
	show_name_aria_label_on: "開啟名字顯示",
	show_name_aria_label_off: "關閉名字顯示",
	show_status: "顯示狀態",
	show_status_aria_label_on: "開啟狀態顯示",
	show_status_aria_label_off: "關閉狀態顯示",
	show_toolbar: "顯示工具欄",
	show_toolbar_aria_label_on: "開啟工具欄顯示",
	show_toolbar_aria_label_off: "關閉工具欄顯示",
	code_only_note: "提醒: 如果要使用 actions 和 stats 選項，請使用編碼編輯器編輯"
};
var tw = {
	status: status$2,
	source: source$2,
	common: common$2,
	error: error$2,
	editor: editor$3
};

var tw$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$2,
    source: source$2,
    common: common$2,
    error: error$2,
    editor: editor$3,
    'default': tw
});

var status$1 = {
	cleaning: "Прибирає",
	auto: "Автоматичне прибирання",
	spot: "Прибирання зони",
	edge: "Прибирання по периметру",
	single_room: "Прибирання кімнати",
	paused: "Пауза",
	idle: "Очікування",
	stop: "Зупинений",
	charging: "Заряджається",
	"returning home": "Повертається",
	returning: "Повертається",
	docked: "На док-станції",
	unknown: "Невідомо",
	offline: "Офлайн",
	error: "Помилка",
	charger_disconnected: "Зарядку не під'єднано",
	remote_control_active: "Ручний режим активовано",
	returning_home: "Повернення на базу",
	manual_mode: "Ручний режим",
	shutting_down: "Вимкнення",
	updating: "Оновлення",
	going_to_target: "Рух до цілі",
	zoned_cleaning: "Зональне прибирання",
	segment_cleaning: "Прибирання сегменту"
};
var source$1 = {
	low: "Низький",
	gentle: "Делікатний",
	silent: "Тихий",
	standard: "Стандартний",
	medium: "Середній",
	turbo: "Турбо",
	normal: "Нормальний",
	max: "Максимальний",
	max_plus: "Максимальний+",
	high: "Високий",
	strong: "Сильний",
	quiet: "Тихий",
	auto: "Aвто",
	balanced: "Збалансований",
	custom: "Власний",
	off: "Вимкнено"
};
var common$1 = {
	name: "Пилосос",
	description: "Картка \"пилосос\" дозволяє керувати роботом-пилососом.",
	start: "Старт",
	"continue": "Продовжити",
	pause: "Пауза",
	stop: "Стоп",
	return_to_base: "На базу",
	locate: "Знайти",
	not_available: "Пилосос недоступний"
};
var error$1 = {
	missing_entity: "Необхідно вказати сутність!"
};
var warning = {
	actions_array: "УВАГА: 'actions' зарезервовані для зміни поведінки вбудованих кнопок. Якщо ви хотіли додати додаткові кнопки, скористайтесь об’єктом 'shortcuts'."
};
var editor$2 = {
	entity: "Сутність (обов'язково)",
	map: "Камера для карти (Додатково)",
	image: "Зображення (Додатково)",
	compact_view: "Компактний вигляд",
	compact_view_aria_label_on: "Увімкнути компактний вигляд",
	compact_view_aria_label_off: "Вимкнути компактний вигляд",
	show_name: "Показувати ім’я?",
	show_name_aria_label_on: "Показати ім’я",
	show_name_aria_label_off: "Приховати ім’я",
	show_status: "Показувати статус?",
	show_status_aria_label_on: "Показати статус",
	show_status_aria_label_off: "Приховати статус",
	show_toolbar: "Показувати панель дій?",
	show_toolbar_aria_label_on: "Показати панель дій",
	show_toolbar_aria_label_off: "Приховати панель дій",
	code_only_note: "Увага: Опції actions та stats доступні виключно через редактор коду."
};
var uk = {
	status: status$1,
	source: source$1,
	common: common$1,
	error: error$1,
	warning: warning,
	editor: editor$2
};

var uk$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status$1,
    source: source$1,
    common: common$1,
    error: error$1,
    warning: warning,
    editor: editor$2,
    'default': uk
});

var status = {
	cleaning: "Đang dọn dẹp",
	paused: "Dừng",
	idle: "Nghỉ",
	charging: "Đang sạc",
	"returning home": "Đang về Dock",
	docked: "Đang ở Dock"
};
var source = {
	gentle: "Nhẹ",
	silent: "Yên tĩnh",
	standard: "Tiêu chuẩn",
	medium: "Vừa phải",
	turbo: "Tối đa"
};
var common = {
	name: "Robot hút bụi Card",
	description: "Robot hút bụi Card cho phép bạn điều khiển robot hút bụi một cách dễ dàng",
	start: "Dọn dẹp",
	"continue": "Tiếp tục",
	pause: "Tạm dừng",
	stop: "Dừng",
	return_to_base: "Về Dock",
	locate: "Định vị",
	not_available: "Thiết bị không khả dụng"
};
var error = {
	missing_entity: "Khai báo thiếu Entity"
};
var editor$1 = {
	entity: "Entity (Yêu cầu)",
	map: "Hiển thị sơ đồ   (Tuỳ chọn)",
	image: "Image (Tuỳ chọn)",
	compact_view: "Thu gọn",
	compact_view_aria_label_on: "Xem thu gọn",
	compact_view_aria_label_off: "Xem mở rộng",
	show_name: "Hiện tên",
	show_name_aria_label_on: "Hiện tên",
	show_name_aria_label_off: "Ẩn tên",
	show_status: "Hiện trạng thái",
	show_status_aria_label_on: "Hiện trạng thái",
	show_status_aria_label_off: "Ẩn trạng thái",
	show_toolbar: "Hiện thanh công cụ",
	show_toolbar_aria_label_on: "Hiện thanh công cụ",
	show_toolbar_aria_label_off: "Ẩn thanh công cụ",
	code_only_note: "Lưu ý: Cài đặt thao tác và tùy chọn thống kê chỉ có sẵn bằng trình chỉnh sửa mã"
};
var vi = {
	status: status,
	source: source,
	common: common,
	error: error,
	editor: editor$1
};

var vi$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    status: status,
    source: source,
    common: common,
    error: error,
    editor: editor$1,
    'default': vi
});

// Borrowed from:
const languages = {
    ca: ca$1,
    cn: cn$1,
    cs: cs$1,
    da: da$1,
    de: de$1,
    en: en$1,
    es: es$1,
    fi: fi$1,
    fr: fr$1,
    he: he$1,
    hu: hu$1,
    it: it$1,
    ja: ja$1,
    ko: ko$1,
    lt: lt$1,
    nb: nb$1,
    nl: nl$1,
    nn: nn$1,
    pl: pl$1,
    pt: pt$1,
    pt_br,
    ro: ro$1,
    ru: ru$1,
    sv: sv$1,
    tw: tw$1,
    uk: uk$1,
    vi: vi$1,
};
const DEFAULT_LANG = 'en';
function localize(str, search, replace) {
    var _a;
    const [section, key] = str.toLowerCase().split('.');
    let langStored = null;
    try {
        langStored = JSON.parse((_a = localStorage.getItem('selectedLanguage')) !== null && _a !== void 0 ? _a : '');
    }
    catch (e) {
        langStored = localStorage.getItem('selectedLanguage');
    }
    const lang = (langStored || navigator.language.split('-')[0] || DEFAULT_LANG)
        .replace(/['"]+/g, '')
        .replace('-', '_');
    let translated;
    try {
        translated = languages[lang][section][key];
    }
    catch (e) {
        translated = languages[DEFAULT_LANG][section][key];
    }
    if (translated === undefined) {
        translated = languages[DEFAULT_LANG][section][key];
    }
    if (translated === undefined) {
        return;
    }
    if (search && replace) {
        translated = translated === null || translated === void 0 ? void 0 : translated.replace(search, replace);
    }
    return translated;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = i$2`:host {
  --vc-primary-text-color: var(--primary-text-color);
  --vc-secondary-text-color: var(--secondary-text-color);
  --vc-icon-color: var(--secondary-text-color);
  --vc-toolbar-background: var(--vc-background, var(--ha-card-background, var(--card-background-color, white)));
  --vc-toolbar-text-color: var(--secondary-text-color);
  --vc-toolbar-icon-color: var(--secondary-text-color);
  --vc-divider-color: var(--entities-divider-color, var(--divider-color));
  --vc-spacing: 10px;

  display: flex;
  flex: 1;
  flex-direction: column;
}

ha-card {
  flex-direction: column;
  flex: 1;
  position: relative;
  overflow: hidden;
}

.preview {
  background: white;
  background: var(--vc-background, var(--ha-card-background, var(--card-background-color, white)));
  position: relative;
  text-align: center;
}

.preview.not-available {
    filter: grayscale(1);
  }

.header {
  display: flex;
  justify-content: space-between;
}

.tips {
  display: flex;
  gap: var(--vc-spacing);
  flex-grow: 1;
  flex-wrap: wrap;
  padding: var(--vc-spacing);
}

.tips .tip {
    cursor: pointer;
  }

.map {
  max-width: 95%;
  image-rendering: crisp-edges;
  cursor: pointer;
}

@keyframes cleaning {
  0% {
    transform: rotate(0) translate(0);
  }
  5% {
    transform: rotate(0) translate(0, -10px);
  }
  10% {
    transform: rotate(0) translate(0, 5px);
  }
  15% {
    transform: rotate(0) translate(0);
  }
  /* Turn left */
  20% {
    transform: rotate(30deg) translate(0);
  }
  25% {
    transform: rotate(30deg) translate(0, -10px);
  }
  30% {
    transform: rotate(30deg) translate(0, 5px);
  }
  35% {
    transform: rotate(30deg) translate(0);
  }
  40% {
    transform: rotate(0) translate(0);
  }
  /* Turn right */
  45% {
    transform: rotate(-30deg) translate(0);
  }
  50% {
    transform: rotate(-30deg) translate(0, -10px);
  }
  55% {
    transform: rotate(-30deg) translate(0, 5px);
  }
  60% {
    transform: rotate(-30deg) translate(0);
  }
  70% {
    transform: rotate(0deg) translate(0);
  }
  /* Staying still */
  100% {
    transform: rotate(0deg);
  }
}

@keyframes returning {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(0);
  }
  75% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(0);
  }
}

.vacuum {
  display: block;
  max-width: 90%;
  max-height: 200px;
  image-rendering: crisp-edges;
  margin: var(--vc-spacing) auto;
  cursor: pointer;
  filter: brightness(0.9);
}

.vacuum.animated.on,
.vacuum.animated.cleaning,
.vacuum.animated.mowing,
.vacuum.animated.edgecut,
.vacuum.animated.auto,
.vacuum.animated.spot,
.vacuum.animated.edge,
.vacuum.animated.single_room {
  animation: cleaning 5s linear infinite;
}

.vacuum.animated.returning {
  animation: returning 2s linear infinite;
}

.vacuum.paused {
  opacity: 1;
}

.vacuum.docked {
  opacity: 0.5;
}

.fill-gap {
  flex-grow: 1;
}

.more-info ha-icon {
  display: flex;
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  direction: ltr;
}

.status-text {
  color: var(--vc-secondary-text-color);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  gap: var(--vc-spacing);
}

.status ha-circular-progress {
  --mdc-theme-primary: var(--vc-secondary-text-color) !important;
  --md-circular-progress-size: var(--body1-line-height, 20px);
  --md-circular-progress-active-indicator-width: 20;
  margin-left: var(--vc-spacing);
}

.vacuum-name {
  text-align: center;
  font-weight: bold;
  color: var(--vc-primary-text-color);
  font-size: 16px;
}

.not-available .offline {
  text-align: center;
  color: var(--vc-primary-text-color);
  font-size: 16px;
}

.metadata {
  margin: var(--vc-spacing) auto;
}

.stats {
  border-top: 1px solid var(--vc-divider-color);
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  color: var(--vc-secondary-text-color);
}

.stats-block {
  cursor: pointer;
  padding: var(--vc-spacing) 0px;
  text-align: center;
  border-right: 1px solid var(--vc-divider-color);
  flex-grow: 1;
}

.stats-block:last-of-type {
    border-right: 0px;
  }

.stats-value {
  font-size: 20px;
  color: var(--vc-primary-text-color);
}

ha-icon {
  color: var(--vc-icon-color);
}

.toolbar {
  background: var(--vc-toolbar-background);
  min-height: 30px;
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 5px;
  border-top: 1px solid var(--vc-divider-color);
}

.toolbar ha-icon-button {
  color: var(--vc-toolbar-text-color);
  flex-direction: column;
  width: 44px;
  height: 44px;
  --mdc-icon-button-size: 44px;
}

.toolbar paper-button {
  color: var(--vc-toolbar-text-color);
  display: flex;
  align-items: center;
  margin-right: 10px;
  padding: 15px 10px;
  cursor: pointer;
}

.toolbar paper-button ha-icon {
    margin-right: 5px;
    color: var(--vc-toolbar-icon-color);
  }

.toolbar ha-icon {
  color: var(--vc-toolbar-icon-color);
  display: flex;
}

.icon-title {
  display: inline-block;
  vertical-align: middle;
  padding: 0 3px;
}
`;
styleInject(css_248z$1);

function buildConfig(config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    if (!config) {
        throw new Error(localize('error.invalid_config'));
    }
    if (!config.entity) {
        throw new Error(localize('error.missing_entity'));
    }
    const actions = config.actions;
    if (actions && Array.isArray(actions)) {
        console.warn(localize('warning.actions_array'));
    }
    return {
        entity: config.entity,
        status_template: (_a = config.status_template) !== null && _a !== void 0 ? _a : '',
        map: (_b = config.map) !== null && _b !== void 0 ? _b : '',
        map_refresh: (_c = config.map_refresh) !== null && _c !== void 0 ? _c : 5,
        battery: (_d = config.battery) !== null && _d !== void 0 ? _d : '',
        image: (_e = config.image) !== null && _e !== void 0 ? _e : 'default',
        animated: (_f = config.animated) !== null && _f !== void 0 ? _f : true,
        show_name: (_g = config.show_name) !== null && _g !== void 0 ? _g : true,
        show_status: (_h = config.show_status) !== null && _h !== void 0 ? _h : true,
        show_toolbar: (_j = config.show_toolbar) !== null && _j !== void 0 ? _j : true,
        compact_view: (_k = config.compact_view) !== null && _k !== void 0 ? _k : false,
        stats: (_l = config.stats) !== null && _l !== void 0 ? _l : {},
        actions: (_m = config.actions) !== null && _m !== void 0 ? _m : {},
        shortcuts: (_o = config.shortcuts) !== null && _o !== void 0 ? _o : [],
        water_level: (_p = config.water_level) !== null && _p !== void 0 ? _p : '',
    };
}

var img = "data:image/svg+xml,%3csvg width='490' height='490' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M490 245c0 135.31-109.69 245-245 245S0 380.31 0 245c0-3.013.0543891-6.013.162239-9H5l5 3v-12l-8.84919-5.899C13.1643 97.0064 117.754 0 245 0c127.089 0 231.578 96.7672 243.804 220.641L480 227v12.5l5-4h4.819c.12 3.152.181 6.319.181 9.5Z' fill='white'/%3e%3cpath d='M411.749 119c-6.307-8.348-13.27-16.258-20.851-23.6492C351.81 57.243 299.364 35.941 244.774 36.0001c-54.59.0591-106.99 21.4746-145.9954 59.667C59.7735 133.86 37.2596 185.797 36.0512 240.374l2.0895.046c.918-41.46 14.2556-81.382 37.8593-114.798V126h116v-2H77.1576c.7253-1.006 1.46-2.006 2.204-3H192v-2H80.8779c5.8988-7.683 12.3626-14.985 19.3631-21.8395 38.615-37.8105 90.491-59.0119 144.535-59.0704 54.044-.0585 105.966 21.0305 144.663 58.7572 7.123 6.9447 13.694 14.3517 19.683 22.1527H299v2h111.638c.744.994 1.479 1.994 2.204 3H299v2h115.266c23.35 33.213 36.583 72.821 37.583 113.972l2.089-.051c-1.066-43.848-15.882-85.962-41.938-120.589V119h-.251Z' fill='%23AAA'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M300 122.5c0 30.1-24.624 54.5-55 54.5s-55-24.4-55-54.5c0-30.0995 24.624-54.5 55-54.5s55 24.4005 55 54.5Zm-4 0c0 27.856-22.799 50.5-51 50.5s-51-22.644-51-50.5S216.799 72 245 72s51 22.644 51 50.5Z' fill='%23666'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M1.12741 221.523C6.9567 160.97 35.1055 104.75 80.0964 63.8045 125.087 22.8589 183.702.115675 244.536.00044016 305.369-.114809 364.07 22.4061 409.216 63.1811c44.985 40.6299 73.305 96.4879 79.5 156.7719l.011.001c-.002.013-.004.025-.007.038.021.202.042.405.062.607l-.279.028c-.145.286-.312.483-.382.565l-.003.005c-.185.218-.402.426-.611.612-.425.377-.994.817-1.651 1.294-1.325.963-3.171 2.194-5.341 3.588-.17.109-.341.219-.515.33v12.215l.249-.174c1.54-1.073 2.823-1.981 3.736-2.644.39-.283.703-.515.936-.693l-.007-.183.254-.01c.048-.038.083-.067.106-.087l.008-.007-.01.01c-.01.009-.033.032-.063.066l-.015.017 4.616-.182c1.298 32.938-4.063 65.799-15.764 96.616-11.7 30.816-29.499 58.955-52.331 82.731-22.832 23.776-50.226 42.7-80.544 55.64-30.317 12.939-62.934 19.627-95.898 19.664-32.963.037-65.594-6.579-95.941-19.45-30.346-12.872-57.783-31.735-80.6677-55.46-22.8846-23.725-40.7463-51.824-52.5157-82.614-11.76935-30.791-17.20429-63.64-15.979377-96.58l3.830807.142V236c.18555 0 .35898.025.50489.057l.56091.021-.00581.158c.13048.053.26118.112.38589.171.35305.167.78483.397 1.26649.667.87404.489 1.99915 1.158 3.2876 1.949v-12.13l-.4815-.302c-2.17716-1.367-4.02092-2.536-5.35246-3.398-.66426-.431-1.21155-.792-1.61262-1.066-.19905-.136-.37589-.261-.51834-.366l-.01222-.009c-.04061-.03-.11781-.087-.20795-.163l-.6875-.066ZM464.644 236.475c3.564-2.147 7.127-4.312 10.356-6.313v12.528c-1.909 1.31-3.945 2.699-5.987 4.086-4.093 2.779-8.206 5.546-11.376 7.648-1.586 1.052-2.93 1.933-3.915 2.566-.474.304-.857.546-1.14.719l-.19-.011-.007.131c-.063.037-.107.062-.135.079-.03.017-.042.025-.042.025l.024-.009c.01-.004.023-.01.039-.016l.095.241c-3.217 52.86-26.453 102.516-64.989 138.858-38.646 36.444-89.759 56.743-142.878 56.743-53.12 0-104.232-20.3-142.878-56.745-38.6453-36.445-61.9029-86.281-65.0136-139.31l-.2108.013c-.0549-.17-.1194-.3-.1616-.378-.0859-.16-.1788-.29-.2489-.38-.1401-.181-.2992-.346-.4386-.482-.2858-.279-.6601-.598-1.0796-.936-.8488-.684-2.029-1.563-3.413-2.556-2.7761-1.991-6.4661-4.507-10.1873-6.974-1.9862-1.317-3.9866-2.622-5.8676-3.83v-12.157c3.2173 2.001 6.7542 4.19 10.2783 6.365 5.686 3.509 11.3427 6.985 15.5776 9.583 2.1175 1.299 3.8798 2.379 5.1126 3.134l1.0774.66c1.0989 51.017 21.909 99.675 58.1301 135.725 36.902 36.729 86.816 57.401 138.881 57.518 52.066.116 102.072-20.331 139.139-56.895 36.507-36.012 57.554-84.787 58.75-135.992.352-.224.817-.513 1.385-.861 1.325-.813 3.172-1.923 5.371-3.238 1.287-.77 2.693-1.609 4.183-2.498l.097-.058c3.574-2.133 7.624-4.55 11.662-6.983ZM6.22995 219.764l.11131.072c1.3071.847 3.13156 2.004 5.30424 3.368 4.343 2.727 10.0507 6.265 15.7336 9.772 5.6819 3.507 11.3354 6.98 15.5686 9.578 2.1165 1.298 3.8778 2.377 5.11 3.132l1.9049 1.166.9921-.007c.3546 51.024 20.8428 99.843 57.0073 135.837 36.165 35.995 85.08 56.253 136.104 56.367 51.025.115 100.03-19.924 136.356-55.756 36.325-35.832 57.032-84.559 57.615-135.58l.585.006-.071-.066c.19-.204.434-.374.522-.435l.012-.008c.144-.101.323-.22.524-.35.406-.262.96-.607 1.631-1.018 1.346-.826 3.21-1.946 5.409-3.261 1.321-.79 2.764-1.651 4.292-2.563 3.571-2.131 7.608-4.54 11.639-6.969 5.757-3.469 11.476-6.963 15.773-9.723 2.152-1.384 3.921-2.565 5.152-3.459.053-.038.104-.076.154-.113l.102-.075c-6.233-58.782-33.937-113.219-77.829-152.8616C361.689 26.858 304.162 4.78749 244.545 4.90042 184.928 5.01336 127.486 27.3017 83.3945 67.4284 39.856 107.052 12.4116 161.271 6.22995 219.764Zm2.09908 22.928c-1.35577-.837-2.51273-1.53-3.38991-2.026-.55505 30.74 4.79901 61.315 15.78648 90.06 11.534 30.175 29.0385 57.712 51.4654 80.963 22.427 23.25 49.315 41.736 79.055 54.35 29.739 12.614 61.718 19.097 94.022 19.061 32.304-.036 64.269-6.591 93.98-19.271 29.711-12.681 56.558-31.226 78.933-54.527 22.375-23.3 39.818-50.876 51.284-81.077 10.871-28.632 16.159-59.064 15.594-89.655-.734.522-1.584 1.119-2.522 1.773-3.095 2.159-7.176 4.958-11.277 7.742-4.101 2.785-8.227 5.56-11.412 7.673-1.284.851-2.419 1.597-3.34 2.194-3.637 53.361-27.268 103.418-66.216 140.147C350.858 437.287 298.702 458 244.498 458c-54.204 0-106.359-20.714-145.7927-57.903-39.1679-36.938-62.8452-87.356-66.2735-141.057-.1301-.112-.2876-.243-.4742-.394-.7611-.613-1.8697-1.441-3.2341-2.419-2.7209-1.952-6.3663-4.439-10.0659-6.891-3.6986-2.452-7.4329-4.857-10.32857-6.644Z' fill='%23666'/%3e%3crect x='233' y='365' width='24' height='53' rx='12' stroke='%23AAA' stroke-width='2'/%3e%3c/svg%3e";

var _a;
register();
// String in the right side will be replaced by Rollup
const PKG_VERSION = 'DEVELOPMENT';
console.info(`%c VACUUM-CARD %c ${PKG_VERSION}`, 'color: white; background: blue; font-weight: 700;', 'color: blue; background: white; font-weight: 700;');
if (!customElements.get('ha-icon-button')) {
    customElements.define('ha-icon-button', class extends ((_a = customElements.get('paper-icon-button')) !== null && _a !== void 0 ? _a : HTMLElement) {
    });
}
let VacuumCard = class VacuumCard extends s {
    constructor() {
        super(...arguments);
        this.requestInProgress = false;
        this.thumbUpdater = null;
    }
    static get styles() {
        return css_248z$1;
    }
    static async getConfigElement() {
        await Promise.resolve().then(function () { return editor; });
        return document.createElement('vacuum-card-editor');
    }
    static getStubConfig(_, entities) {
        const [vacuumEntity] = entities.filter((eid) => eid.startsWith('vacuum'));
        return {
            entity: vacuumEntity !== null && vacuumEntity !== void 0 ? vacuumEntity : '',
        };
    }
    get entity() {
        const vacuum = this.hass.states[this.config.entity];
        return vacuum;
    }
    get map() {
        if (!this.hass || !this.config.map) {
            return null;
        }
        return this.hass.states[this.config.map];
    }
    get battery() {
        if (!this.hass || !this.config.battery) {
            return null;
        }
        return this.hass.states[this.config.battery];
    }
    get waterLevelEntity() {
        if (!this.hass || !this.config.water_level) {
            return null;
        }
        return this.config.water_level;
    }
    get waterLevel() {
        if (this.waterLevelEntity) {
            return this.hass.states[this.waterLevelEntity];
        }
        return null;
    }
    setConfig(config) {
        this.config = buildConfig(config);
    }
    getCardSize() {
        return this.config.compact_view ? 3 : 8;
    }
    hasWaterLevelChanged(changedProps) {
        if (this.waterLevelEntity === null || this.waterLevel === null) {
            return false;
        }
        return (this.hass &&
            !!this.config.water_level &&
            changedProps.get('hass').states[this.waterLevelEntity].state !==
                this.waterLevel.state);
    }
    shouldUpdate(changedProps) {
        return (_e(this, changedProps, false) ||
            this.hasWaterLevelChanged(changedProps));
    }
    updated(changedProps) {
        if (changedProps.get('hass') &&
            changedProps.get('hass').states[this.config.entity].state !==
                this.hass.states[this.config.entity].state) {
            this.requestInProgress = false;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.config.compact_view && this.map) {
            this.requestUpdate();
            this.thumbUpdater = setInterval(() => this.requestUpdate(), this.config.map_refresh * 1000);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.map && this.thumbUpdater) {
            clearInterval(this.thumbUpdater);
        }
    }
    handleMore(entityId = this.entity.entity_id) {
        ne(this, 'hass-more-info', {
            entityId,
        }, {
            bubbles: false,
            composed: true,
        });
    }
    callService(action) {
        const { service, service_data, target } = action;
        const [domain, name] = service.split('.');
        this.hass.callService(domain, name, service_data, target);
    }
    callVacuumService(service, params = { request: true }, options = {}) {
        this.hass.callService('vacuum', service, Object.assign({ entity_id: this.config.entity }, options));
        if (params.request) {
            this.requestInProgress = true;
            this.requestUpdate();
        }
    }
    handleSpeed(e) {
        const fan_speed = e.target.getAttribute('value');
        this.callVacuumService('set_fan_speed', { request: false }, { fan_speed });
    }
    handleSelect(e) {
        const value = e.target.getAttribute('value');
        this.hass.callService('select', 'select_option', {
            entity_id: this.waterLevel ? this.waterLevel.entity_id : '',
            option: value,
        });
    }
    handleVacuumAction(action, params = { request: true }) {
        return () => {
            if (!this.config.actions[action]) {
                return this.callVacuumService(params.defaultService || action, params);
            }
            this.callService(this.config.actions[action]);
        };
    }
    getAttributes(entity) {
        var _a;
        const { status, state } = entity.attributes;
        return Object.assign(Object.assign({}, entity.attributes), { status: (_a = status !== null && status !== void 0 ? status : state) !== null && _a !== void 0 ? _a : entity.state });
    }
    renderSource() {
        const { fan_speed: source, fan_speed_list: sources } = this.getAttributes(this.entity);
        if (!sources || !source) {
            return A;
        }
        return this.renderDropDown(source, sources, 'mdi:fan', this.handleSpeed);
    }
    renderWaterLevel() {
        const entity = this.waterLevel;
        if (!entity) {
            return A;
        }
        return this.renderDropDown(entity.state, entity.attributes.options, 'mdi:water', this.handleSelect);
    }
    renderDropDown(selectedObject, items, icon, onSelected) {
        const selected = items.indexOf(selectedObject);
        return x `
      <div class="tip">
        <ha-button-menu @click="${(e) => e.stopPropagation()}">
          <div slot="trigger">
            <ha-icon icon="${icon}"></ha-icon>
            <span class="icon-title">
              ${localize(`source.${selectedObject.toLowerCase()}`) ||
            selectedObject}
            </span>
          </div>
          ${items.map((item, index) => x `
              <mwc-list-item
                ?activated=${selected === index}
                value=${item}
                @click=${onSelected}
              >
                ${localize(`source.${item.toLowerCase()}`) || item}
              </mwc-list-item>
            `)}
        </ha-button-menu>
      </div>
    `;
    }
    renderBattery() {
        var _a;
        const { battery_level, battery_icon } = this.getAttributes(this.entity);
        const batteryLevel = ((_a = this.battery) === null || _a === void 0 ? void 0 : _a.state) || battery_level;
        const batteryIcon = (this === null || this === void 0 ? void 0 : this.battery) ? Se(this.battery) : battery_icon;
        if (batteryLevel && batteryIcon) {
            return x `
        <div class="tip" @click="${() => this.handleMore()}">
          <ha-icon icon="${batteryIcon}"></ha-icon>
          <span class="icon-title">${batteryLevel}%</span>
        </div>
      `;
        }
        return A;
    }
    renderMapOrImage(state) {
        if (this.config.compact_view) {
            return A;
        }
        if (this.map) {
            return this.map && this.map.attributes.entity_picture
                ? x `
            <img
              class="map"
              src="${this.map.attributes.entity_picture}&v=${Date.now()}"
              @click=${() => this.handleMore(this.config.map)}
            />
          `
                : A;
        }
        const src = this.config.image === 'default' ? img : this.config.image;
        const animated = this.config.animated ? ' animated' : '';
        return x `
      <img
        class="vacuum ${state}${animated}"
        src="${src}"
        @click="${() => this.handleMore()}"
      />
    `;
    }
    renderStats(state) {
        const statsList = this.config.stats[state] || this.config.stats.default || [];
        const stats = statsList.map(({ entity_id, attribute, value_template, unit, subtitle }) => {
            if (!entity_id && !attribute) {
                return A;
            }
            let state = '';
            if (entity_id && attribute) {
                state = get(this.hass.states[entity_id].attributes, attribute);
            }
            else if (attribute) {
                state = get(this.entity.attributes, attribute);
            }
            else if (entity_id) {
                state = this.hass.states[entity_id].state;
            }
            else {
                return A;
            }
            const value = x `
          <ha-template
            hass=${this.hass}
            template=${value_template}
            value=${state}
            variables=${{ value: state }}
          ></ha-template>
        `;
            return x `
          <div class="stats-block" @click="${() => this.handleMore(entity_id)}">
            <span class="stats-value">${value}</span>
            ${unit}
            <div class="stats-subtitle">${subtitle}</div>
          </div>
        `;
        });
        if (!stats.length) {
            return A;
        }
        return x `<div class="stats">${stats}</div>`;
    }
    renderName() {
        const { friendly_name } = this.getAttributes(this.entity);
        if (!this.config.show_name) {
            return A;
        }
        return x ` <div class="vacuum-name">${friendly_name}</div> `;
    }
    renderStatus() {
        const { status } = this.getAttributes(this.entity);
        if (!this.config.show_status) {
            return A;
        }
        let s;
        if (this.config.status_template === undefined) {
            const localizedStatus = localize(`status.${status.toLowerCase()}`) || status;
            s = x `
        <span class="status-text" alt=${localizedStatus}>
          ${localizedStatus}
        </span>
      `;
        }
        else {
            s = x `
        <ha-template
          hass=${this.hass}
          template=${this.config.status_template}
          value=${status}
          variables=${{ value: status }}
        ></ha-template>
      `;
        }
        return x `
      <div class="status">
        ${s}
        <ha-circular-progress
          .indeterminate=${this === null || this === void 0 ? void 0 : this.requestInProgress}
          size="small"
          style="display: ${(this === null || this === void 0 ? void 0 : this.requestInProgress) ? 'flex' : 'none'}">
        </ha-circular-progress>
      </div>
    `;
    }
    renderToolbar(state) {
        if (!this.config.show_toolbar) {
            return A;
        }
        switch (state) {
            case 'on':
            case 'auto':
            case 'spot':
            case 'edge':
            case 'single_room':
            case 'mowing':
            case 'edgecut':
            case 'cleaning': {
                return x `
          <div class="toolbar">
            <paper-button @click="${this.handleVacuumAction('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('stop')}">
              <ha-icon icon="hass:stop"></ha-icon>
              ${localize('common.stop')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
            }
            case 'paused': {
                return x `
          <div class="toolbar">
            <paper-button
              @click="${this.handleVacuumAction('resume', {
                    defaultService: 'start',
                    request: true,
                })}"
            >
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('return_to_base')}">
              <ha-icon icon="hass:home-map-marker"></ha-icon>
              ${localize('common.return_to_base')}
            </paper-button>
          </div>
        `;
            }
            case 'returning': {
                return x `
          <div class="toolbar">
            <paper-button
              @click="${this.handleVacuumAction('resume', {
                    defaultService: 'start',
                    request: true,
                })}"
            >
              <ha-icon icon="hass:play"></ha-icon>
              ${localize('common.continue')}
            </paper-button>
            <paper-button @click="${this.handleVacuumAction('pause')}">
              <ha-icon icon="hass:pause"></ha-icon>
              ${localize('common.pause')}
            </paper-button>
          </div>
        `;
            }
            case 'docked':
            case 'idle':
            default: {
                const buttons = this.config.shortcuts.map(({ name, service, icon, service_data, target, link }) => {
                    if (link) {
                        return x `
                <ha-icon-button label="${name}">
                  <a rel="noreferrer" href="${link}" target="_blank" style="--icon-primary-color: var(--vc-toolbar-icon-color); color: var(--vc-toolbar-icon-color);">
                    <ha-icon icon="${icon}" style="--icon-primary-color: var(--vc-toolbar-icon-color); color: var(--vc-toolbar-icon-color);"></ha-icon>
                  </a>
                </ha-icon-button>`;
                    }
                    else {
                        const execute = () => {
                            if (service) {
                                return this.callService({ service, service_data, target });
                            }
                        };
                        return x `
                <ha-icon-button label="${name}" @click="${execute}">
                  <ha-icon icon="${icon}"></ha-icon>
                </ha-icon-button>
              `;
                    }
                });
                const dockButton = x `
          <ha-icon-button
            label="${localize('common.return_to_base')}"
            @click="${this.handleVacuumAction('return_to_base')}"
            ><ha-icon icon="hass:home-map-marker"></ha-icon>
          </ha-icon-button>
        `;
                return x `
          <div class="toolbar">
            <ha-icon-button
              label="${localize('common.start')}"
              @click="${this.handleVacuumAction('start')}"
              ><ha-icon icon="hass:play"></ha-icon>
            </ha-icon-button>

            <ha-icon-button
              label="${localize('common.locate')}"
              @click="${this.handleVacuumAction('locate', { request: false })}"
              ><ha-icon icon="mdi:map-marker"></ha-icon>
            </ha-icon-button>

            ${state === 'idle' ? dockButton : ''}
            <div class="fill-gap"></div>
            ${buttons}
          </div>
        `;
            }
        }
    }
    renderUnavailable() {
        return x `
      <ha-card>
        <div class="preview not-available">
          <div class="metadata">
            <div class="not-available">
              ${localize('common.not_available')}
            </div>
          <div>
        </div>
      </ha-card>
    `;
    }
    render() {
        if (!this.entity) {
            return this.renderUnavailable();
        }
        return x `
      <ha-card>
        <div class="preview">
          <div class="header">
            <div class="tips">
              ${this.renderSource()} ${this.renderWaterLevel()}
              ${this.renderBattery()}
            </div>
            <ha-icon-button
              class="more-info"
              icon="mdi:dots-vertical"
              ?more-info="true"
              @click="${() => this.handleMore()}"
              ><ha-icon icon="mdi:dots-vertical"></ha-icon
            ></ha-icon-button>
          </div>

          ${this.renderMapOrImage(this.entity.state)}

          <div class="metadata">
            ${this.renderName()} ${this.renderStatus()}
          </div>

          ${this.renderStats(this.entity.state)}
        </div>

        ${this.renderToolbar(this.entity.state)}
      </ha-card>
    `;
    }
};
__decorate([
    e({ attribute: false })
], VacuumCard.prototype, "hass", void 0);
__decorate([
    t$1()
], VacuumCard.prototype, "config", void 0);
__decorate([
    t$1()
], VacuumCard.prototype, "requestInProgress", void 0);
__decorate([
    t$1()
], VacuumCard.prototype, "thumbUpdater", void 0);
VacuumCard = __decorate([
    e$1('vacuum-card')
], VacuumCard);
window.customCards = window.customCards || [];
window.customCards.push({
    preview: true,
    type: 'vacuum-card',
    name: localize('common.name'),
    description: localize('common.description'),
});

var css_248z = i$2`.card-config {
  flex-direction: column;
  display: flex;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
}

.option ha-switch {
  margin-right: 10px;
}

.option ha-select,
.option paper-input {
  width: 100%;
}
`;
styleInject(css_248z);

let VacuumCardEditor = class VacuumCardEditor extends s {
    constructor() {
        super(...arguments);
        this.compact_view = false;
        this.show_name = true;
        this.show_status = true;
        this.show_toolbar = true;
        this.animated = true;
    }
    setConfig(config) {
        this.config = config;
        if (!this.config.entity) {
            this.config.entity = this.getEntitiesByType('vacuum')[0] || '';
            ne(this, 'config-changed', { config: this.config });
        }
    }
    getEntitiesByType(type, deviceClass) {
        if (!this.hass) {
            return [];
        }
        const entities = Object.keys(this.hass.states).filter((id) => id.startsWith(type));
        if (deviceClass) {
            return entities.filter((id) => { var _a, _b, _c; return ((_c = (_b = (_a = this.hass) === null || _a === void 0 ? void 0 : _a.states[id]) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c.device_class) === deviceClass; });
        }
        return entities;
    }
    renderDropdownMenu(configValue, selectedEntity, entities) {
        return x `
      <div class="option">
        <ha-select
          .label=${localize('editor.' + configValue)}
          @selected=${this.valueChanged}
          .configValue=${configValue}
          .value=${selectedEntity}
          @closed=${(e) => e.stopPropagation()}
          fixedMenuPosition
          naturalMenuWidth
        ><mwc-list-item .value=''></mwc-list-item>
          ${entities.map((entity) => x ` <mwc-list-item .value=${entity}>${entity}</mwc-list-item>`)}
        </ha-select>
      </div>
    `;
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!this.hass) {
            return A;
        }
        const vacuumEntities = this.getEntitiesByType('vacuum');
        const batteryEntities = this.getEntitiesByType('sensor', 'battery');
        const cameraEntities = [
            ...this.getEntitiesByType('camera'),
            ...this.getEntitiesByType('image'),
        ];
        const selectEntities = this.getEntitiesByType('select');
        return x `
      <div class="card-config">
        <div class="option">
          <ha-select
            .label=${localize('editor.entity')}
            @selected=${this.valueChanged}
            .configValue=${'entity'}
            .value=${this.config.entity}
            @closed=${(e) => e.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
            required
            validationMessage=${localize('error.missing_entity')}
          >
            ${vacuumEntities.map((entity) => x ` <mwc-list-item .value=${entity}
                  >${entity}</mwc-list-item
                >`)}
          </ha-select>
        </div>

        ${this.renderDropdownMenu('map', this.config.map, cameraEntities)}
        ${this.renderDropdownMenu('water_level', this.config.water_level, selectEntities)}
        ${this.renderDropdownMenu('battery', this.config.battery, batteryEntities)}

        <div class="option">
          <ha-textfield style="width: 100%;"
            .label=${localize('editor.image')}
            .configValue=${'image'}
            @input=${this.valueChanged}
            .value=${(_a = this.config.image) !== null && _a !== void 0 ? _a : []}
          ></ha-textfield>
        </div>

        <div class="option">
          <ha-textfield style="width: 100%;"
            .label=${localize('editor.status_template')}
            .configValue=${'status_template'}
            @input=${this.valueChanged}
            .value=${(_b = this.config.status_template) !== null && _b !== void 0 ? _b : []}
          ></ha-textfield>
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(this.compact_view
            ? 'editor.compact_view_aria_label_off'
            : 'editor.compact_view_aria_label_on')}
            .checked=${Boolean((_c = this.config.compact_view) !== null && _c !== void 0 ? _c : this.compact_view)}
            .configValue=${'compact_view'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.compact_view')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(this.show_name
            ? 'editor.show_name_aria_label_off'
            : 'editor.show_name_aria_label_on')}
            .checked=${Boolean((_d = this.config.show_name) !== null && _d !== void 0 ? _d : this.show_name)}
            .configValue=${'show_name'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_name')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(this.show_status
            ? 'editor.show_status_aria_label_off'
            : 'editor.show_status_aria_label_on')}
            .checked=${Boolean((_e = this.config.show_status) !== null && _e !== void 0 ? _e : this.show_status)}
            .configValue=${'show_status'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_status')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(this.show_toolbar
            ? 'editor.show_toolbar_aria_label_off'
            : 'editor.show_toolbar_aria_label_on')}
            .checked=${Boolean((_f = this.config.show_toolbar) !== null && _f !== void 0 ? _f : this.show_toolbar)}
            .configValue=${'show_toolbar'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.show_toolbar')}
        </div>

        <div class="option">
          <ha-switch
            aria-label=${localize(this.animated
            ? 'editor.animated_aria_label_off'
            : 'editor.animated_aria_label_on')}
            .checked=${Boolean((_g = this.config.animated) !== null && _g !== void 0 ? _g : this.animated)}
            .configValue=${'animated'}
            @change=${this.valueChanged}
          >
          </ha-switch>
          ${localize('editor.animated')}
        </div>

        <strong>${localize('editor.code_only_note')}</strong>
      </div>
    `;
    }
    valueChanged(event) {
        if (!this.config || !this.hass || !event.target) {
            return;
        }
        const target = event.target;
        if (!target.configValue ||
            (this.config[target.configValue] && this.config[target.configValue] === (target === null || target === void 0 ? void 0 : target.value))) {
            return;
        }
        if (target.configValue) {
            if (target.value === '') {
                delete this.config[target.configValue];
            }
            else {
                this.config = Object.assign(Object.assign({}, this.config), { [target.configValue]: target.checked !== undefined ? target.checked : target.value });
            }
        }
        ne(this, 'config-changed', { config: this.config });
    }
    static get styles() {
        return css_248z;
    }
};
__decorate([
    e({ attribute: false })
], VacuumCardEditor.prototype, "hass", void 0);
__decorate([
    t$1()
], VacuumCardEditor.prototype, "config", void 0);
__decorate([
    t$1()
], VacuumCardEditor.prototype, "compact_view", void 0);
__decorate([
    t$1()
], VacuumCardEditor.prototype, "show_name", void 0);
__decorate([
    t$1()
], VacuumCardEditor.prototype, "show_status", void 0);
__decorate([
    t$1()
], VacuumCardEditor.prototype, "show_toolbar", void 0);
__decorate([
    t$1()
], VacuumCardEditor.prototype, "animated", void 0);
VacuumCardEditor = __decorate([
    e$1('vacuum-card-editor')
], VacuumCardEditor);

var editor = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get VacuumCardEditor () { return VacuumCardEditor; }
});

export { VacuumCard };
