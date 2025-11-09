/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var a;const l=window,c=l.trustedTypes,h=c?c.emptyScript:"",d=l.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},u=(t,e)=>e!==t&&(e==e||t==t),_={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:u},v="finalized";let g=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const n=this[t];this[e]=s,this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||_}static finalize(){if(this.hasOwnProperty(v))return!1;this[v]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var i;const s=null!==(i=this.shadowRoot)&&void 0!==i?i:this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{e?i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(e=>{const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=_){var s;const n=this.constructor._$Ep(t,i);if(void 0!==n&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,n=s._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=s.getPropertyOptions(n),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=n,this[n]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var m;g[v]=!0,g.elementProperties=new Map,g.elementStyles=[],g.shadowRootOptions={mode:"open"},null==d||d({ReactiveElement:g}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const $=window,f=$.trustedTypes,y=f?f.createPolicy("lit-html",{createHTML:t=>t}):void 0,b="$lit$",w=`lit$${(Math.random()+"").slice(9)}$`,x="?"+w,A=`<${x}>`,E=document,S=()=>E.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,k=Array.isArray,N="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,U=/>/g,M=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,R=/"/g,O=/^(?:script|style|textarea|title)$/i,z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),j=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),I=new WeakMap,B=E.createTreeWalker(E,129,null,!1);function D(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==y?y.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,s=[];let n,o=2===e?"<svg>":"",r=T;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===T?"!--"===l[1]?r=P:void 0!==l[1]?r=U:void 0!==l[2]?(O.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=M):void 0!==l[3]&&(r=M):r===M?">"===l[0]?(r=null!=n?n:T,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?M:'"'===l[3]?R:H):r===R||r===H?r=M:r===P||r===U?r=T:(r=M,n=void 0);const d=r===M&&t[e+1].startsWith("/>")?" ":"";o+=r===T?i+A:c>=0?(s.push(a),i.slice(0,c)+b+i.slice(c)+w+d):i+w+(-2===c?(s.push(void 0),e):d)}return[D(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class W{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=V(t,e);if(this.el=W.createElement(l,i),B.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=B.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(b)||e.startsWith(w)){const i=c[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+b).split(w),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:e[2],strings:t,ctor:"."===e[1]?G:"?"===e[1]?F:"@"===e[1]?Q:J})}else a.push({type:6,index:n})}for(const e of t)s.removeAttribute(e)}if(O.test(s.tagName)){const t=s.textContent.split(w),e=t.length-1;if(e>0){s.textContent=f?f.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],S()),B.nextNode(),a.push({type:2,index:++n});s.append(t[e],S())}}}else if(8===s.nodeType)if(s.data===x)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(w,t+1));)a.push({type:7,index:n}),t+=w.length-1}n++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,s){var n,o,r,a;if(e===j)return e;let l=void 0!==s?null===(n=i._$Co)||void 0===n?void 0:n[s]:i._$Cl;const c=C(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(r=(a=i)._$Co)&&void 0!==r?r:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=q(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,n=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);B.currentNode=n;let o=B.nextNode(),r=0,a=0,l=s[0];for(;void 0!==l;){if(r===l.index){let e;2===l.type?e=new Z(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Y(o,this,t)),this._$AV.push(e),l=s[++a]}r!==(null==l?void 0:l.index)&&(o=B.nextNode(),r++)}return B.currentNode=E,n}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{constructor(t,e,i,s){var n;this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(n=null==s?void 0:s.isConnected)||void 0===n||n}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),C(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>k(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==L&&C(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,n="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=W.createElement(D(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===n)this._$AH.v(i);else{const t=new K(n,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=I.get(t.strings);return void 0===e&&I.set(t.strings,e=new W(t)),e}T(t){k(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Z(this.k(S()),this.k(S()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class J{constructor(t,e,i,s,n){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=L}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const n=this.strings;let o=!1;if(void 0===n)t=q(this,t,e,0),o=!C(t)||t!==this._$AH&&t!==j,o&&(this._$AH=t);else{const s=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=q(this,s[i+r],e,r),a===j&&(a=this._$AH[r]),o||(o=!C(a)||a!==this._$AH[r]),a===L?t=L:t!==L&&(t+=(null!=a?a:"")+n[r+1]),this._$AH[r]=a}o&&!s&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}const X=f?f.emptyScript:"";class F extends J{constructor(){super(...arguments),this.type=4}j(t){t&&t!==L?this.element.setAttribute(this.name,X):this.element.removeAttribute(this.name)}}class Q extends J{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=q(this,t,e,0))&&void 0!==i?i:L)===j)return;const s=this._$AH,n=t===L&&s!==L||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==L&&(s===L||n);n&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Y{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const tt=$.litHtmlPolyfillSupport;null==tt||tt(W,Z),(null!==(m=$.litHtmlVersions)&&void 0!==m?m:$.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et,it;class st extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,n;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let r=o._$litPart$;if(void 0===r){const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;o._$litPart$=r=new Z(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return j}}st.finalized=!0,st._$litElement$=!0,null===(et=globalThis.litElementHydrateSupport)||void 0===et||et.call(globalThis,{LitElement:st});const nt=globalThis.litElementPolyfillSupport;null==nt||nt({LitElement:st}),(null!==(it=globalThis.litElementVersions)&&void 0!==it?it:globalThis.litElementVersions=[]).push("3.3.3");const ot={title:"Matches",show_logos:!0,show_league:!0,max_rows:12,bg_color:"#1e1e1e",bg_alpha:.95,text_color:"#ffffff",accent_color:"#03a9f4",name_col_width:60,score_col_width:15,meta_col_width:15,logo_col_width:10};customElements.define("matches-card-editor",class extends st{static get properties(){return{hass:{},config:{}}}setConfig(t){this.config={...ot,...t||{}}}_emit(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}_onText=t=>{const e=t.currentTarget?.dataset?.key;if(!e)return;const i=t.currentTarget.value;this.config[e]!==i&&(this.config={...this.config,[e]:i},this._emit())};_onNumber=t=>{const e=t.currentTarget?.dataset?.key;if(!e)return;const i=Number(t.currentTarget.value);Number.isNaN(i)||this.config[e]===i||(this.config={...this.config,[e]:i},this._emit())};_onSwitch=t=>{const e=t.currentTarget?.dataset?.key;if(!e)return;const i=!!t.currentTarget.checked;this.config[e]!==i&&(this.config={...this.config,[e]:i},this._emit())};_onColor=t=>{const e=t.currentTarget?.dataset?.key;if(!e)return;const i=t.currentTarget.value;this.config[e]!==i&&(this.config={...this.config,[e]:i},this._emit())};_onAlpha=t=>{const e=Number(t.currentTarget.value),i=Math.max(0,Math.min(100,e))/100;this.config.bg_alpha!==i&&(this.config={...this.config,bg_alpha:i},this._emit())};_reset=()=>{const t={matches:this.config.matches,entity:this.config.entity};this.config={...ot,...t},this._emit()};_previewStyle(t,e=1){const i="string"==typeof t&&t.startsWith("#")?t:"#1e1e1e";return`background: linear-gradient(45deg,#bbb 25%, transparent 25%), \n                         linear-gradient(-45deg,#bbb 25%, transparent 25%),\n                         linear-gradient(45deg, transparent 75%, #bbb 75%),\n                         linear-gradient(-45deg, transparent 75%, #bbb 75%),\n                         ${this._hexToRgba(i,e)};\n            background-size:10px 10px,10px 10px,10px 10px,10px 10px,100% 100%;\n            background-position:0 0,0 5px,5px -5px,-5px 0,0 0;`}_hexToRgba(t,e=1){let i=t?.replace("#","")||"1e1e1e";3===i.length&&(i=[...i].map(t=>t+t).join(""));const s=parseInt(i,16);return`rgba(${s>>16&255}, ${s>>8&255}, ${255&s}, ${Math.max(0,Math.min(1,e))})`}render(){if(!this.config)return z``;const t=this.config;return z`
      <div class="form">
        <div class="head">
          <div class="title">Matches Card – konfiguracja</div>
          <mwc-button dense outlined @click=${this._reset}>Reset</mwc-button>
        </div>

        <ha-textfield
          label="Tytuł"
          .value=${t.title||""}
          data-key="title"
          @input=${this._onText}
        ></ha-textfield>

        <div class="row2">
          <div class="field">
            <div class="label">Pokaż loga</div>
            <ha-switch
              .checked=${t.show_logos??!0}
              data-key="show_logos"
              @change=${this._onSwitch}
            ></ha-switch>
          </div>
          <div class="field">
            <div class="label">Pokaż ligę</div>
            <ha-switch
              .checked=${t.show_league??!0}
              data-key="show_league"
              @change=${this._onSwitch}
            ></ha-switch>
          </div>
          <div class="field">
            <div class="label">Maks. wierszy</div>
            <ha-number-input
              min="1" max="50" step="1"
              .value=${Number(t.max_rows??ot.max_rows)}
              data-key="max_rows"
              @input=${this._onNumber}
            ></ha-number-input>
          </div>
        </div>

        <div class="section">Kolory</div>

        <div class="row3">
          <div class="field col">
            <div class="label">Tło (HEX)</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(t.bg_color,t.bg_alpha)}></div>
              <input type="color" .value=${t.bg_color||ot.bg_color} data-key="bg_color" @input=${this._onColor} />
              <input type="text" .value=${t.bg_color||""} data-key="bg_color" @input=${this._onText} placeholder="#1e1e1e" />
            </div>
            <div class="alpha">
              <span>Przezroczystość: ${Math.round(100*(t.bg_alpha??ot.bg_alpha))}%</span>
              <input type="range" min="0" max="100" .value=${Math.round(100*(t.bg_alpha??ot.bg_alpha))} @input=${this._onAlpha} />
            </div>
          </div>

          <div class="field col">
            <div class="label">Tekst</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(t.text_color,1)}></div>
              <input type="color" .value=${t.text_color||ot.text_color} data-key="text_color" @input=${this._onColor} />
              <input type="text" .value=${t.text_color||""} data-key="text_color" @input=${this._onText} placeholder="#ffffff" />
            </div>
          </div>

          <div class="field col">
            <div class="label">Akcent</div>
            <div class="inline">
              <div class="swatch" style=${this._previewStyle(t.accent_color,1)}></div>
              <input type="color" .value=${t.accent_color||ot.accent_color} data-key="accent_color" @input=${this._onColor} />
              <input type="text" .value=${t.accent_color||""} data-key="accent_color" @input=${this._onText} placeholder="#03a9f4" />
            </div>
          </div>
        </div>

        <div class="section">Szerokości kolumn (%)</div>
        <div class="row4">
          <div class="mini">
            <div class="mini-label">Logo</div>
            <ha-number-input min="5" max="30" step="1" .value=${Number(t.logo_col_width??10)} data-key="logo_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Nazwa</div>
            <ha-number-input min="20" max="80" step="1" .value=${Number(t.name_col_width??60)} data-key="name_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Wynik</div>
            <ha-number-input min="5" max="40" step="1" .value=${Number(t.score_col_width??15)} data-key="score_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
          <div class="mini">
            <div class="mini-label">Meta</div>
            <ha-number-input min="5" max="40" step="1" .value=${Number(t.meta_col_width??15)} data-key="meta_col_width" @input=${this._onNumber}></ha-number-input>
          </div>
        </div>
      </div>
    `}static get styles(){return o`
      .form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .title {
        font-weight: 700;
      }
      .section {
        margin-top: 8px;
        font-weight: 600;
        opacity: .9;
      }
      .row2, .row3, .row4 {
        display: grid;
        gap: 12px;
      }
      .row2 { grid-template-columns: repeat(3, 1fr); }
      .row3 { grid-template-columns: repeat(3, 1fr); }
      .row4 { grid-template-columns: repeat(4, 1fr); }

      .field { display: flex; flex-direction: column; gap: 8px; }
      .label { font-weight: 600; opacity: .85; }

      .inline {
        display: grid;
        grid-template-columns: 24px 46px 1fr;
        gap: 8px;
        align-items: center;
      }

      .swatch {
        width: 24px; height: 24px; border-radius: 6px;
        border: 1px solid rgba(0,0,0,.2);
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.15);
      }

      .alpha {
        display: flex; align-items: center; gap: 10px;
      }
      .alpha input[type="range"] { width: 100%; }

      .mini { display: flex; flex-direction: column; gap: 6px; }
      .mini-label { font-size: .9em; opacity: .8; }

      ha-textfield, ha-number-input, ha-select { width: 100%; }
      mwc-button[outlined] { --mdc-theme-primary: var(--primary-color); }
    `}});const rt=(t,e=1)=>{const{r:i,g:s,b:n}=(t=>{if(!t||"string"!=typeof t)return{r:31,g:31,b:31};let e=t.trim().replace("#","");3===e.length&&(e=[...e].map(t=>t+t).join(""));const i=parseInt(e,16);return Number.isNaN(i)?{r:31,g:31,b:31}:{r:i>>16&255,g:i>>8&255,b:255&i}})(t);return`rgba(${i}, ${s}, ${n}, ${"number"==typeof e?Math.min(1,Math.max(0,e)):1})`},at={title:"Matches",show_logos:!0,show_league:!0,max_rows:12,bg_color:"#1e1e1e",bg_alpha:.95,text_color:"#ffffff",accent_color:"#03a9f4",name_col_width:60,score_col_width:15,meta_col_width:15,logo_col_width:10,matches:[{team_home:"Górnik Zabrze",team_away:"Ruch Chorzów",result:"2:1",date:"2025-11-09 18:00",league:"Ekstraklasa",live:!1}]};customElements.define("matches-card",class extends st{static get properties(){return{hass:{},_config:{attribute:!1}}}static getConfigElement(){return document.createElement("matches-card-editor")}static getStubConfig(){return{...at}}setConfig(t){this._config={...at,...t||{}}}getCardSize(){const t=Math.min(this._config?.matches?.length||1,this._config?.max_rows||at.max_rows);return 1+Math.max(1,Math.floor(.7*t))}render(){if(!this._config)return L;const t=this._config,e=rt(t.bg_color,t.bg_alpha),i=t.text_color||at.text_color,s=t.accent_color||at.accent_color,n=[t.show_logos?`${t.logo_col_width||at.logo_col_width}%`:null,`${t.name_col_width||at.name_col_width}%`,`${t.score_col_width||at.score_col_width}%`,`${t.meta_col_width||at.meta_col_width}%`].filter(Boolean).join(" "),o=Array.isArray(t.matches)?t.matches:[];return z`
      <ha-card style=${`--mc-bg:${e};--mc-fg:${i};--mc-accent:${s};`}>
        ${this._renderHeader(t)}
        <div class="table">
          ${0===o.length?z`<div class="empty">No matches</div>`:o.slice(0,t.max_rows).map((t,e)=>this._renderRow(t,e,n))}
        </div>
      </ha-card>
    `}_renderHeader(t){return z`
      <div class="header">
        <div class="title">${t.title||at.title}</div>
      </div>
    `}_renderRow(t,e,i){const s=(t.status||"").toString().toUpperCase().includes("LIVE")||!0===t.live,n=t.team_home||t.home||"",o=t.team_away||t.away||"",r=t.result??(null!=t.home_score&&null!=t.away_score?`${t.home_score}–${t.away_score}`:"-"),a=t.date||t.when||"";return z`
      <div
        class="row ${s?"live":""}"
        style=${`grid-template-columns:${i};`}
      >
        ${this._config.show_logos?z`<div class="cell logos">
              <div class="logo-blob"></div>
              <div class="logo-blob"></div>
            </div>`:L}

        <div class="cell teams" title="${n} vs ${o}">
          ${s?z`<span class="live-dot"></span>`:L}
          <span class="team">${n}</span>
          <span class="vs">vs</span>
          <span class="team">${o}</span>
        </div>

        <div class="cell score">${r}</div>
        <div class="cell meta">${a}${this._config.show_league&&t.league?` • ${t.league}`:""}</div>
      </div>
    `}static get styles(){return o`
      :host {
        --mc-bg: #1e1e1e;
        --mc-fg: #ffffff;
        --mc-accent: #03a9f4;
      }
      ha-card {
        background: var(--mc-bg);
        color: var(--mc-fg);
        overflow: hidden;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
      }
      .title {
        font-weight: 700;
      }
      .table {
        display: grid;
        gap: 8px;
        padding: 10px 12px 12px;
      }
      .empty {
        opacity: 0.7;
        text-align: center;
        padding: 12px 8px;
      }
      .row {
        display: grid;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 10px;
      }
      .row.live {
        outline: 2px solid var(--mc-accent);
      }
      .cell {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 8px;
      }
      .logos {
        gap: 6px;
      }
      .logo-blob {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.18);
      }
      .teams .team {
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .teams .vs {
        opacity: 0.6;
        margin: 0 6px;
      }
      .score {
        justify-content: center;
        font-weight: 800;
      }
      .meta {
        justify-content: flex-end;
        opacity: 0.85;
        font-variant-numeric: tabular-nums;
      }
      .live-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--mc-accent);
        margin-right: 6px;
        animation: pulse 1.2s infinite ease-in-out;
      }
      @keyframes pulse {
        0% { transform: scale(0.9); opacity: 0.7; }
        50% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(0.9); opacity: 0.7; }
      }
    `}});
