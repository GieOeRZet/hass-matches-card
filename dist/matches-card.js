function t(t,e,s,i,n,r){function o(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var a,l=i.kind,h="getter"===l?"get":"setter"===l?"set":"value",c=!e&&t?i.static?t:t.prototype:null,d=e||(c?Object.getOwnPropertyDescriptor(c,i.name):{}),u=!1,p=s.length-1;p>=0;p--){var g={};for(var f in i)g[f]="access"===f?{}:i[f];for(var f in i.access)g.access[f]=i.access[f];g.addInitializer=function(t){if(u)throw new TypeError("Cannot add initializers after decoration has completed");r.push(o(t||null))};var $=(0,s[p])("accessor"===l?{get:d.get,set:d.set}:d[h],g);if("accessor"===l){if(void 0===$)continue;if(null===$||"object"!=typeof $)throw new TypeError("Object expected");(a=o($.get))&&(d.get=a),(a=o($.set))&&(d.set=a),(a=o($.init))&&n.unshift(a)}else(a=o($))&&("field"===l?n.unshift(a):d[h]=a)}c&&Object.defineProperty(c,i.name,d),u=!0}function e(t,e,s){for(var i=arguments.length>2,n=0;n<e.length;n++)s=i?e[n].call(t,s):e[n].call(t);return i?s:void 0}function s(t,e,s){return"symbol"==typeof e&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:s?"".concat(s," ",e):e})}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=globalThis,n=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const l=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new a(s,t,r)},h=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:c,defineProperty:d,getOwnPropertyDescriptor:u,getOwnPropertyNames:p,getOwnPropertySymbols:g,getPrototypeOf:f}=Object,$=globalThis,m=$.trustedTypes,_=m?m.emptyScript:"",y=$.reactiveElementPolyfillSupport,v=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},w=(t,e)=>!c(t,e),A={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),$.litPropertyMetadata??=new WeakMap;let E=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&d(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=u(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);n?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...p(t),...g(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(n)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of e){const e=document.createElement("style"),n=i.litNonce;void 0!==n&&e.setAttribute("nonce",n),e.textContent=s.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:b).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const r=n.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,n=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??w)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[v("elementProperties")]=new Map,E[v("finalized")]=new Map,y?.({ReactiveElement:E}),($.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S=globalThis,C=S.trustedTypes,x=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,P="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+O,U=`<${k}>`,M=document,T=()=>M.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,N="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,D=/>/g,L=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,B=/"/g,q=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),V=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Z=new WeakMap,K=M.createTreeWalker(M,129);function F(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=R;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,c=0;for(;c<s.length&&(o.lastIndex=c,l=o.exec(s),null!==l);)c=o.lastIndex,o===R?"!--"===l[1]?o=j:void 0!==l[1]?o=D:void 0!==l[2]?(q.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=n??R,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?L:'"'===l[3]?B:I):o===B||o===I?o=L:o===j||o===D?o=R:(o=L,n=void 0);const d=o===L&&t[e+1].startsWith("/>")?" ":"";r+=o===R?s+U:h>=0?(i.push(a),s.slice(0,h)+P+s.slice(h)+O+d):s+O+(-2===h?e:d)}return[F(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,h]=J(t,e);if(this.el=Q.createElement(l,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(P)){const e=h[r++],s=i.getAttribute(t).split(O),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?st:"?"===o[1]?it:"@"===o[1]?nt:et}),i.removeAttribute(t)}else t.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(q.test(i.tagName)){const t=i.textContent.split(O),e=t.length-1;if(e>0){i.textContent=C?C.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),K.nextNode(),a.push({type:2,index:++n});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===k)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(O,t+1));)a.push({type:7,index:n}),t+=O.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function X(t,e,s=t,i){if(e===V)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=z(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,i)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);K.currentNode=i;let n=K.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new tt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new rt(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=K.nextNode(),r++)}return K.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),z(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(F(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Y(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Q(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new tt(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=G}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=X(this,t,e,0),r=!z(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=X(this,i[s+o],e,o),a===V&&(a=this._$AH[o]),r||=!z(a)||a!==this._$AH[o],a===G?t=G:t!==G&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class it extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class nt extends et{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??G)===V)return;const s=this._$AH,i=t===G&&s!==G||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==G&&(s===G||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const ot=S.litHtmlPolyfillSupport;ot?.(Q,tt),(S.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class lt extends E{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new tt(e.insertBefore(T(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ht=at.litElementPolyfillSupport;ht?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:w},ut=(t=dt,e,s)=>{const{kind:i,metadata:n}=s;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gt(t){return pt({...t,state:!0,attribute:!1})}let ft=(()=>{let i,n,r,o,a=[ct("matches-card-editor")],l=[],h=lt,c=[],d=[],u=[],p=[];return n=class extends h{setConfig(t){this._config={...t}}render(){if(!this.hass)return G;const t=this._config||{};return W`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor z meczami"
          .hass=${this.hass}
          .value=${t.entity||""}
          @value-changed=${this._valueChanged("entity")}
          allow-custom-entity
        ></ha-entity-picker>

        <ha-textfield
          label="Nazwa karty"
          .value=${t.name||""}
          @input=${this._valueChanged("name")}
        ></ha-textfield>

        <ha-select
          label="Styl wypełnienia"
          .value=${t.fill||"gradient"}
          @selected=${this._valueChanged("fill")}
        >
          <mwc-list-item value="gradient">Gradient</mwc-list-item>
          <mwc-list-item value="zebra">Zebra</mwc-list-item>
          <mwc-list-item value="none">Brak</mwc-list-item>
        </ha-select>

        <div class="switches">
          <ha-switch
            .checked=${t.show_name??!0}
            @change=${this._toggleChanged("show_name")}
          ></ha-switch>
          <label>Pokaż nazwę karty</label>

          <ha-switch
            .checked=${t.show_logos??!0}
            @change=${this._toggleChanged("show_logos")}
          ></ha-switch>
          <label>Pokaż loga drużyn</label>

          <ha-switch
            .checked=${t.show_result_symbol??!0}
            @change=${this._toggleChanged("show_result_symbol")}
          ></ha-switch>
          <label>Pokaż symbol wyniku (W/L/D)</label>
        </div>
      </div>
    `}_valueChanged(t){return e=>{const s=e.target,i=void 0!==s.value?s.value:s.detail?.value??"";this._config={...this._config,[t]:i},this._fireChange()}}_toggleChanged(t){return e=>{const s=!!e.target.checked;this._config={...this._config,[t]:s},this._fireChange()}}_fireChange(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}constructor(){super(...arguments),this.hass=e(this,c,void 0),this._config=(e(this,d),e(this,u,{})),e(this,p)}},s(n,"MatchesCardEditor"),(()=>{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(h[Symbol.metadata]??null):void 0;r=[pt({attribute:!1})],o=[gt()],t(null,null,r,{kind:"field",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},c,d),t(null,null,o,{kind:"field",name:"_config",static:!1,private:!1,access:{has:t=>"_config"in t,get:t=>t._config,set:(t,e)=>{t._config=e}},metadata:e},u,p),t(null,i={value:n},a,{kind:"class",name:n.name,metadata:e},null,l),n=i.value,e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.styles=[css`
      .card-config {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 0;
      }

      ha-select,
      ha-textfield,
      ha-entity-picker {
        width: 100%;
      }

      .switches {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 6px 12px;
        margin-top: 12px;
      }

      label {
        font-size: 0.9em;
        color: var(--primary-text-color);
      }
    `],e(n,l),n})(),$t=(()=>{let i,n,r,o,a=[ct("matches-card")],h=[],c=lt,d=[],u=[],p=[],g=[];return n=class extends c{setConfig(t){if(!t.entity)throw new Error("Entity is required");this.config={name:"90minut Matches",show_name:!0,show_logos:!0,fill:"gradient",show_result_symbol:!0,font_size:{date:.9,status:.8,teams:1,score:1},icon_size:{league:26,crest:24,result:26},gradient:{alpha:.5,start:35,end:100},colors:{win:"#3ba55d",loss:"#e23b3b",draw:"#468cd2"},...t}}render(){if(!this.hass||!this.config)return G;const t=this.hass.states[this.config.entity];if(!t)return W`<ha-card>Nie znaleziono encji</ha-card>`;const e=t.attributes.matches||[],s="zebra"===this.config.fill?"tr:nth-child(even){background-color:rgba(240,240,240,0.4);}":"",i=e.map(t=>{const e=t.date?new Date(t.date.replace(" ","T")):null,s=e?e.toLocaleDateString("pl-PL",{day:"2-digit",month:"2-digit"}):"-",i=t.finished?"KONIEC":e?e.toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"}):"",n="win"===t.result?"row-win":"loss"===t.result?"row-loss":"draw"===t.result?"row-draw":"",r="win"===t.result?"bold":"loss"===t.result?"dim":"",o="loss"===t.result?"bold":"win"===t.result?"dim":"",[a,l]=(t.score||"-").split("-"),h="L"===t.league?"https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/ekstraklasa.png":"PP"===t.league?"https://raw.githubusercontent.com/GieOeRZet/matches-card/main/logo/puchar.png":null,c=this.config.colors[t.result]||"rgba(0,0,0,0)",d="gradient"===this.config.fill?`background: linear-gradient(to right, rgba(0,0,0,0) ${this.config.gradient.start}%, ${this.hexToRgba(c,this.config.gradient.alpha)} ${this.config.gradient.end}%);`:"";return W`
          <tr class="${n}" style="${d}">
            <td>
              <div style="font-size:${this.config.font_size.date}em;">${s}</div>
              <div style="font-size:${this.config.font_size.status}em;">${i}</div>
            </td>
            <td>
              ${h?W`<img
                    src="${h}"
                    height="${this.config.icon_size.league}"
                    style="display:block;margin:auto;"
                  />`:t.league||"-"}
            </td>
            ${this.config.show_logos?W`<td>
                  <img
                    src="${t.logo_home}"
                    height="${this.config.icon_size.crest}"
                    style="background:white;border-radius:6px;padding:2px;"
                  /><br />
                  <img
                    src="${t.logo_away}"
                    height="${this.config.icon_size.crest}"
                    style="background:white;border-radius:6px;padding:2px;"
                  />
                </td>`:""}
            <td class="team-cell">
              <div
                class="team-row ${r}"
                style="font-size:${this.config.font_size.teams}em;"
              >
                ${t.home}
              </div>
              <div
                class="team-row ${o}"
                style="font-size:${this.config.font_size.teams}em;"
              >
                ${t.away}
              </div>
            </td>
            <td>
              <div class="${r}">${a}</div>
              <div class="${o}">${l}</div>
            </td>
            <td>
              ${this.config.show_result_symbol&&t.result?W`<div
                    class="result-circle"
                    style="background-color:${this.config.colors[t.result]}"
                  >
                    ${t.result.charAt(0).toUpperCase()}
                  </div>`:""}
            </td>
          </tr>
        `}).join("");return W`
      <ha-card>
        ${this.config.show_name?W`<h1 class="card-header">${this.config.name}</h1>`:""}
        <table>
          <style>
            ${s}${"tr{border-bottom:1px solid rgba(0,0,0,0.1);}"}
          </style>
          ${i}
        </table>
      </ha-card>
    `}hexToRgba(t,e){if(!t)return`rgba(0,0,0,${e})`;t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(t,e,s,i)=>e+e+s+s+i+i);const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return s?`rgba(${parseInt(s[1],16)},${parseInt(s[2],16)},${parseInt(s[3],16)},${e})`:t}constructor(){super(...arguments),this.hass=e(this,d,void 0),this.config=(e(this,u),e(this,p,void 0)),e(this,g)}},s(n,"MatchesCard"),(()=>{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;r=[pt({attribute:!1})],o=[pt({type:Object})],t(null,null,r,{kind:"field",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},d,u),t(null,null,o,{kind:"field",name:"config",static:!1,private:!1,access:{has:t=>"config"in t,get:t=>t.config,set:(t,e)=>{t.config=e}},metadata:e},p,g),t(null,i={value:n},a,{kind:"class",name:n.name,metadata:e},null,h),n=i.value,e&&Object.defineProperty(n,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),n.styles=l`
    ha-card {
      padding: 10px 0;
      font-family: "Sofascore Sans", Arial, sans-serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    td {
      text-align: center;
      vertical-align: middle;
      padding: 4px 6px;
    }
    .team-cell {
      text-align: left;
      vertical-align: middle;
      padding-left: 8px;
    }
    .team-row {
      display: flex;
      align-items: center;
      line-height: 1.3em;
    }
    .bold {
      font-weight: 600;
    }
    .dim {
      opacity: 0.8;
    }
    .result-circle {
      border-radius: 50%;
      width: 26px;
      height: 26px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin: 0 auto;
    }
  `,e(n,h),n})();customElements.get("matches-card-editor")||customElements.define("matches-card-editor",ft),window.MatchesCard=$t,window.MatchesCardEditor=ft,window.customCards=window.customCards||[],window.customCards.push({type:"matches-card",name:"Matches Card",description:"Karta wyników 90minut.pl z gradientem RGBA i GUI-edytorem"}),console.info("%c⚽ Matches Card loaded successfully","color: white; background: #007bff; padding: 4px 8px; border-radius: 4px;");export{$t as MatchesCard};
//# sourceMappingURL=matches-card.js.map
