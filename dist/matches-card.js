function t(t,e,s,i,n,r){function o(t){if(void 0!==t&&"function"!=typeof t)throw new TypeError("Function expected");return t}for(var a,h=i.kind,c="getter"===h?"get":"setter"===h?"set":"value",l=!e&&t?i.static?t:t.prototype:null,d=e||(l?Object.getOwnPropertyDescriptor(l,i.name):{}),p=!1,u=s.length-1;u>=0;u--){var f={};for(var $ in i)f[$]="access"===$?{}:i[$];for(var $ in i.access)f.access[$]=i.access[$];f.addInitializer=function(t){if(p)throw new TypeError("Cannot add initializers after decoration has completed");r.push(o(t||null))};var g=(0,s[u])("accessor"===h?{get:d.get,set:d.set}:d[c],f);if("accessor"===h){if(void 0===g)continue;if(null===g||"object"!=typeof g)throw new TypeError("Object expected");(a=o(g.get))&&(d.get=a),(a=o(g.set))&&(d.set=a),(a=o(g.init))&&n.unshift(a)}else(a=o(g))&&("field"===h?n.unshift(a):d[c]=a)}l&&Object.defineProperty(l,i.name,d),p=!0}function e(t,e,s){for(var i=arguments.length>2,n=0;n<e.length;n++)s=i?e[n].call(t,s):e[n].call(t);return i?s:void 0}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s=globalThis,i=s.ShadowRoot&&(void 0===s.ShadyCSS||s.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(s,t,n)},h=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:f}=Object,$=globalThis,g=$.trustedTypes,m=g?g.emptyScript:"",_=$.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!c(t,e),A={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),$.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=A){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);n?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??A}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=f(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(h(t))}else void 0!==t&&e.push(h(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(i)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),n=s.litNonce;void 0!==n&&e.setAttribute("nonce",n),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const r=n.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,n=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??b)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,_?.({ReactiveElement:w}),($.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=globalThis,S=E.trustedTypes,x=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+P,U=`<${O}>`,k=document,T=()=>k.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,H="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,j=/>/g,D=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),G=new WeakMap,K=k.createTreeWalker(k,129);function Z(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const F=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=N;for(let e=0;e<s;e++){const s=t[e];let a,h,c=-1,l=0;for(;l<s.length&&(o.lastIndex=l,h=o.exec(s),null!==h);)l=o.lastIndex,o===N?"!--"===h[1]?o=R:void 0!==h[1]?o=j:void 0!==h[2]?(B.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=D):void 0!==h[3]&&(o=D):o===D?">"===h[0]?(o=n??N,c=-1):void 0===h[1]?c=-2:(c=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?D:'"'===h[3]?L:I):o===L||o===I?o=D:o===R||o===j?o=N:(o=D,n=void 0);const d=o===D&&t[e+1].startsWith("/>")?" ":"";r+=o===N?s+U:c>=0?(i.push(a),s.slice(0,c)+C+s.slice(c)+P+d):s+P+(-2===c?e:d)}return[Z(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,c]=F(t,e);if(this.el=J.createElement(h,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[r++],s=i.getAttribute(t).split(P),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?et:"?"===o[1]?st:"@"===o[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(P),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),K.nextNode(),a.push({type:2,index:++n});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===O)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(P,t+1));)a.push({type:7,index:n}),t+=P.length-1}n++}}static createElement(t,e){const s=k.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===q)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=M(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=Q(t,n._$AS(t,e.values),n,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);K.currentNode=i;let n=K.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Y(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new nt(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=K.nextNode(),r++)}return K.currentNode=k,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),M(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new X(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new J(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Y(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=Q(this,t,e,0),r=!M(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Q(this,i[s+o],e,o),a===q&&(a=this._$AH[o]),r||=!M(a)||a!==this._$AH[o],a===V?t=V:t!==V&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends tt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===q)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const rt=E.litHtmlPolyfillSupport;rt?.(J,Y),(E.litHtmlVersions??=[]).push("3.3.1");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Y(e.insertBefore(T(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,ot.litElementHydrateSupport?.({LitElement:at});const ht=ot.litElementPolyfillSupport;ht?.({LitElement:at}),(ot.litElementVersions??=[]).push("4.2.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},lt={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},dt=(t=lt,e,s)=>{const{kind:i,metadata:n}=s;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function pt(t){return(e,s)=>"object"==typeof s?dt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(t){return pt({...t,state:!0,attribute:!1})}let ft=(()=>{let s,i,n,r,o=[ct("matches-card-editor")],h=[],c=at,l=[],d=[],p=[],u=[];return i=class extends c{setConfig(t){this.config={...t}}render(){return this.hass&&this.config?W`
      <div class="card-config">
        <ha-entity-picker
          label="Sensor z meczami"
          .hass=${this.hass}
          .value=${this.config.entity}
          @value-changed=${this._change("entity")}
        ></ha-entity-picker>

        <ha-textfield
          label="Nazwa"
          .value=${this.config.name||""}
          @input=${this._change("name")}
        ></ha-textfield>

        <ha-select
          label="Wypełnienie wierszy"
          .value=${this.config.fill||"gradient"}
          @selected=${this._change("fill")}
        >
          <mwc-list-item value="gradient">Gradient</mwc-list-item>
          <mwc-list-item value="zebra">Zebra</mwc-list-item>
          <mwc-list-item value="none">Brak</mwc-list-item>
        </ha-select>

        <ha-switch
          .checked=${this.config.show_name??!0}
          @change=${this._change("show_name")}
          >Pokaż nazwę</ha-switch
        >
        <ha-switch
          .checked=${this.config.show_logos??!0}
          @change=${this._change("show_logos")}
          >Pokaż loga drużyn</ha-switch
        >
        <ha-switch
          .checked=${this.config.show_result_symbol??!0}
          @change=${this._change("show_result_symbol")}
          >Pokaż symbol wyniku</ha-switch
        >
      </div>
    `:W``}_change(t){return e=>{const s=e.target,i=s.checked??s.value??s.detail?.value;this.config={...this.config,[t]:i},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0}))}}constructor(){super(...arguments),this.hass=e(this,l,void 0),this.config=(e(this,d),e(this,p,{})),e(this,u)}},function(t,e,s){"symbol"==typeof e&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:s?"".concat(s," ",e):e})}(i,"MatchesCardEditor"),(()=>{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(c[Symbol.metadata]??null):void 0;n=[pt({attribute:!1})],r=[ut()],t(null,null,n,{kind:"field",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},l,d),t(null,null,r,{kind:"field",name:"config",static:!1,private:!1,access:{has:t=>"config"in t,get:t=>t.config,set:(t,e)=>{t.config=e}},metadata:e},p,u),t(null,s={value:i},o,{kind:"class",name:i.name,metadata:e},null,h),i=s.value,e&&Object.defineProperty(i,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),i.styles=a`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    ha-switch, ha-select, ha-textfield {
      width: 100%;
    }
  `,e(i,h),i})(),$t=(()=>{var s;let i,n,r=at,o=[],h=[],c=[],l=[];return s=class extends r{setConfig(t){if(!t.entity)throw new Error("Wymagane jest pole 'entity'");this.config={name:"Nadchodzące mecze",show_name:!0,show_logos:!0,show_result_symbol:!0,fill:"gradient",font_size:{teams:1},icon_size:{crest:40},colors:{W:"#009900",D:"#999999",L:"#cc0000"},...t}}get matches(){if(!this.hass||!this.config?.entity)return[];const t=this.hass.states[this.config.entity];return t?.attributes?.matches||[]}render(){if(!this.hass||!this.config)return W``;const t=this.matches||[];if(0===t.length)return W`<ha-card>Pusto – brak meczów.</ha-card>`;const e=t.map(t=>{const e="W"===t.result?"bold":"dim",s="L"===t.result?"bold":"dim",i="gradient"===this.config.fill?`background: linear-gradient(90deg, ${this.hexToRgba("#000",.04)}, ${this.hexToRgba("#000",0)});`:"";return W`
        <tr style="${i}">
          <td>${t.date}<br />${t.time}</td>
          ${this.config.show_logos?W`
              <td>
                <img src="${t.logo_home}" height="${this.config.icon_size.crest}"
                     style="background:white;border-radius:6px;padding:2px;" /><br />
                <img src="${t.logo_away}" height="${this.config.icon_size.crest}"
                     style="background:white;border-radius:6px;padding:2px;" />
              </td>`:""}
          <td class="team-cell">
            <div class="team-row ${e}" style="font-size:${this.config.font_size.teams}em;">${t.home}</div>
            <div class="team-row ${s}" style="font-size:${this.config.font_size.teams}em;">${t.away}</div>
          </td>
          <td>
            <div class="${e}">${"W"===t.result?"3":""}</div>
            <div class="${s}">${"L"===t.result?"0":""}</div>
          </td>
          <td>
            ${this.config.show_result_symbol&&t.result?W`
                <div class="result-circle"
                     style="background-color:${this.config.colors[t.result]}">
                  ${t.result.charAt(0).toUpperCase()}
                </div>`:""}
          </td>
        </tr>
      `});return W`
      <ha-card>
        ${this.config.show_name?W`<h1 class="card-header">${this.config.name}</h1>`:""}
        <table>
          ${e}
        </table>
      </ha-card>
    `}hexToRgba(t,e){if(!t)return`rgba(0,0,0,${e})`;t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,(t,e,s,i)=>e+e+s+s+i+i);const s=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return s?`rgba(${parseInt(s[1],16)}, ${parseInt(s[2],16)}, ${parseInt(s[3],16)}, ${e})`:t}constructor(){super(...arguments),this.hass=e(this,o,void 0),this.config=(e(this,h),e(this,c,void 0)),e(this,l)}},(()=>{const e="function"==typeof Symbol&&Symbol.metadata?Object.create(r[Symbol.metadata]??null):void 0;i=[pt({attribute:!1})],n=[pt({type:Object})],t(null,null,i,{kind:"field",name:"hass",static:!1,private:!1,access:{has:t=>"hass"in t,get:t=>t.hass,set:(t,e)=>{t.hass=e}},metadata:e},o,h),t(null,null,n,{kind:"field",name:"config",static:!1,private:!1,access:{has:t=>"config"in t,get:t=>t.config,set:(t,e)=>{t.config=e}},metadata:e},c,l),e&&Object.defineProperty(s,Symbol.metadata,{enumerable:!0,configurable:!0,writable:!0,value:e})})(),s.styles=a`
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
  `,s})();customElements.get("matches-card")||customElements.define("matches-card",$t),customElements.get("matches-card-editor")||customElements.define("matches-card-editor",ft),window.customCards=window.customCards||[],window.customCards.push({type:"matches-card",name:"Matches Card",description:"Karta wyników 90minut.pl z gradientem RGBA i edytorem GUI"});export{$t as MatchesCard};
//# sourceMappingURL=matches-card.js.map
