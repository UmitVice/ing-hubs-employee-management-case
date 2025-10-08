/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:l,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,f=globalThis,p=f.trustedTypes,v=p?p.emptyScript:"",m=f.reactiveElementPolyfillSupport,g=(t,e)=>t,w={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...l(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:w;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,n=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[g("elementProperties")]=new Map,$[g("finalized")]=new Map,m?.({ReactiveElement:$}),(f.reactiveElementVersions??=[]).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E=globalThis,x=E.trustedTypes,S=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,_="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+C,R=`<${k}>`,A=document,N=()=>A.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,P="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,L=/>/g,I=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,H=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),q=new WeakMap,K=A.createTreeWalker(A,129);function J(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=M;for(let e=0;e<i;e++){const i=t[e];let a,h,c=-1,l=0;for(;l<i.length&&(o.lastIndex=l,h=o.exec(i),null!==h);)l=o.lastIndex,o===M?"!--"===h[1]?o=U:void 0!==h[1]?o=L:void 0!==h[2]?(B.test(h[2])&&(n=RegExp("</"+h[2],"g")),o=I):void 0!==h[3]&&(o=I):o===I?">"===h[0]?(o=n??M,c=-1):void 0===h[1]?c=-2:(c=o.lastIndex-h[2].length,a=h[1],o=void 0===h[3]?I:'"'===h[3]?j:D):o===j||o===D?o=I:o===U||o===L?o=M:(o=I,n=void 0);const d=o===I&&t[e+1].startsWith("/>")?" ":"";r+=o===M?i+R:c>=0?(s.push(a),i.slice(0,c)+_+i.slice(c)+C+d):i+C+(-2===c?e:d)}return[J(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[h,c]=W(t,e);if(this.el=G.createElement(h,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=K.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(_)){const e=c[r++],i=s.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?X:"?"===o[1]?tt:"@"===o[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),K.nextNode(),a.push({type:2,index:++n});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===k)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:n}),t+=C.length-1}n++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function V(t,e,i=t,s){if(e===F)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=O(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=V(t,n._$AS(t,e.values),n,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??A).importNode(e,!0);K.currentNode=s;let n=K.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Z(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=K.nextNode(),r++)}return K.currentNode=A,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=V(this,t,e),O(t)?t===z||null==t||""===t?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==z&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new G(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new Z(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=z}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=V(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=V(this,s[i+o],e,o),a===F&&(a=this._$AH[o]),r||=!O(a)||a!==this._$AH[o],a===z?t=z:t!==z&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==z)}}class et extends Q{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=V(this,t,e,0)??z)===F)return;const i=this._$AH,s=t===z&&i!==z||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==z&&(i===z||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){V(this,t)}}const st=E.litHtmlPolyfillSupport;st?.(G,Z),(E.litHtmlVersions??=[]).push("3.3.1");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class rt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new Z(e.insertBefore(N(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const ot=nt.litElementPolyfillSupport;function at(t,e){void 0===e&&(e={});for(var i=function(t){for(var e=[],i=0;i<t.length;){var s=t[i];if("*"!==s&&"+"!==s&&"?"!==s)if("\\"!==s)if("{"!==s)if("}"!==s)if(":"!==s)if("("!==s)e.push({type:"CHAR",index:i,value:t[i++]});else{var n=1,r="";if("?"===t[a=i+1])throw new TypeError('Pattern cannot start with "?" at '.concat(a));for(;a<t.length;)if("\\"!==t[a]){if(")"===t[a]){if(0===--n){a++;break}}else if("("===t[a]&&(n++,"?"!==t[a+1]))throw new TypeError("Capturing groups are not allowed at ".concat(a));r+=t[a++]}else r+=t[a++]+t[a++];if(n)throw new TypeError("Unbalanced pattern at ".concat(i));if(!r)throw new TypeError("Missing pattern at ".concat(i));e.push({type:"PATTERN",index:i,value:r}),i=a}else{for(var o="",a=i+1;a<t.length;){var h=t.charCodeAt(a);if(!(h>=48&&h<=57||h>=65&&h<=90||h>=97&&h<=122||95===h))break;o+=t[a++]}if(!o)throw new TypeError("Missing parameter name at ".concat(i));e.push({type:"NAME",index:i,value:o}),i=a}else e.push({type:"CLOSE",index:i,value:t[i++]});else e.push({type:"OPEN",index:i,value:t[i++]});else e.push({type:"ESCAPED_CHAR",index:i++,value:t[i++]});else e.push({type:"MODIFIER",index:i,value:t[i++]})}return e.push({type:"END",index:i,value:""}),e}(t),s=e.prefixes,n=void 0===s?"./":s,r=e.delimiter,o=void 0===r?"/#?":r,a=[],h=0,c=0,l="",d=function(t){if(c<i.length&&i[c].type===t)return i[c++].value},u=function(t){var e=d(t);if(void 0!==e)return e;var s=i[c],n=s.type,r=s.index;throw new TypeError("Unexpected ".concat(n," at ").concat(r,", expected ").concat(t))},f=function(){for(var t,e="";t=d("CHAR")||d("ESCAPED_CHAR");)e+=t;return e},p=function(t){var e=a[a.length-1],i=t||(e&&"string"==typeof e?e:"");if(e&&!i)throw new TypeError('Must have text between two parameters, missing text after "'.concat(e.name,'"'));return!i||function(t){for(var e=0,i=o;e<i.length;e++){var s=i[e];if(t.indexOf(s)>-1)return!0}return!1}(i)?"[^".concat(lt(o),"]+?"):"(?:(?!".concat(lt(i),")[^").concat(lt(o),"])+?")};c<i.length;){var v=d("CHAR"),m=d("NAME"),g=d("PATTERN");if(m||g){var w=v||"";-1===n.indexOf(w)&&(l+=w,w=""),l&&(a.push(l),l=""),a.push({name:m||h++,prefix:w,suffix:"",pattern:g||p(w),modifier:d("MODIFIER")||""})}else{var y=v||d("ESCAPED_CHAR");if(y)l+=y;else if(l&&(a.push(l),l=""),d("OPEN")){w=f();var b=d("NAME")||"",$=d("PATTERN")||"",E=f();u("CLOSE"),a.push({name:b||($?h++:""),pattern:b&&!$?p(w):$,prefix:w,suffix:E,modifier:d("MODIFIER")||""})}else u("END")}}return a}function ht(t,e){return ct(at(t,e),e)}function ct(t,e){void 0===e&&(e={});var i=dt(e),s=e.encode,n=void 0===s?function(t){return t}:s,r=e.validate,o=void 0===r||r,a=t.map(function(t){if("object"==typeof t)return new RegExp("^(?:".concat(t.pattern,")$"),i)});return function(e){for(var i="",s=0;s<t.length;s++){var r=t[s];if("string"!=typeof r){var h=e?e[r.name]:void 0,c="?"===r.modifier||"*"===r.modifier,l="*"===r.modifier||"+"===r.modifier;if(Array.isArray(h)){if(!l)throw new TypeError('Expected "'.concat(r.name,'" to not repeat, but got an array'));if(0===h.length){if(c)continue;throw new TypeError('Expected "'.concat(r.name,'" to not be empty'))}for(var d=0;d<h.length;d++){var u=n(h[d],r);if(o&&!a[s].test(u))throw new TypeError('Expected all "'.concat(r.name,'" to match "').concat(r.pattern,'", but got "').concat(u,'"'));i+=r.prefix+u+r.suffix}}else if("string"!=typeof h&&"number"!=typeof h){if(!c){var f=l?"an array":"a string";throw new TypeError('Expected "'.concat(r.name,'" to be ').concat(f))}}else{u=n(String(h),r);if(o&&!a[s].test(u))throw new TypeError('Expected "'.concat(r.name,'" to match "').concat(r.pattern,'", but got "').concat(u,'"'));i+=r.prefix+u+r.suffix}}else i+=r}return i}}function lt(t){return t.replace(/([.+*?=^!:${}()[\]|/\\])/g,"\\$1")}function dt(t){return t&&t.sensitive?"":"i"}function ut(t,e,i){return function(t,e,i){void 0===i&&(i={});for(var s=i.strict,n=void 0!==s&&s,r=i.start,o=void 0===r||r,a=i.end,h=void 0===a||a,c=i.encode,l=void 0===c?function(t){return t}:c,d=i.delimiter,u=void 0===d?"/#?":d,f=i.endsWith,p="[".concat(lt(void 0===f?"":f),"]|$"),v="[".concat(lt(u),"]"),m=o?"^":"",g=0,w=t;g<w.length;g++){var y=w[g];if("string"==typeof y)m+=lt(l(y));else{var b=lt(l(y.prefix)),$=lt(l(y.suffix));if(y.pattern)if(e&&e.push(y),b||$)if("+"===y.modifier||"*"===y.modifier){var E="*"===y.modifier?"?":"";m+="(?:".concat(b,"((?:").concat(y.pattern,")(?:").concat($).concat(b,"(?:").concat(y.pattern,"))*)").concat($,")").concat(E)}else m+="(?:".concat(b,"(").concat(y.pattern,")").concat($,")").concat(y.modifier);else{if("+"===y.modifier||"*"===y.modifier)throw new TypeError('Can not repeat "'.concat(y.name,'" without a prefix and suffix'));m+="(".concat(y.pattern,")").concat(y.modifier)}else m+="(?:".concat(b).concat($,")").concat(y.modifier)}}if(h)n||(m+="".concat(v,"?")),m+=i.endsWith?"(?=".concat(p,")"):"$";else{var x=t[t.length-1],S="string"==typeof x?v.indexOf(x[x.length-1])>-1:void 0===x;n||(m+="(?:".concat(v,"(?=").concat(p,"))?")),S||(m+="(?=".concat(v,"|").concat(p,")"))}return new RegExp(m,dt(i))}(at(t,i),e,i)}function ft(t,e,i){return t instanceof RegExp?function(t,e){if(!e)return t;for(var i=/\((?:\?<(.*?)>)?(?!\?)/g,s=0,n=i.exec(t.source);n;)e.push({name:n[1]||s++,prefix:"",suffix:"",modifier:"",pattern:""}),n=i.exec(t.source);return t}(t,e):Array.isArray(t)?function(t,e,i){var s=t.map(function(t){return ft(t,e,i).source});return new RegExp("(?:".concat(s.join("|"),")"),dt(i))}(t,e,i):ut(t,e,i)}function pt(t){return"object"==typeof t&&!!t}function vt(t){return"function"==typeof t}function mt(t){return"string"==typeof t}function gt(t=[]){return Array.isArray(t)?t:[t]}function wt(t){return`[Vaadin.Router] ${t}`}ot?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.1");class yt extends Error{code;context;constructor(t){super(wt(`Page not found (${t.pathname})`)),this.context=t,this.code=404}}const bt=Symbol("NotFoundResult");function $t(t){return new yt(t)}function Et(t){return(Array.isArray(t)?t[0]:t)??""}function xt(t){return Et(t?.path)}const St=new Map;function _t(t){try{return decodeURIComponent(t)}catch{return t}}St.set("|false",{keys:[],pattern:/(?:)/u});var Ct=function(t,e,i=!1,s=[],n){const r=`${t}|${String(i)}`,o=Et(e);let a=St.get(r);if(!a){const e=[];a={keys:e,pattern:ft(t,e,{end:i,strict:""===t})},St.set(r,a)}const h=a.pattern.exec(o);if(!h)return null;const c={...n};for(let t=1;t<h.length;t++){const e=a.keys[t-1],i=e.name,s=h[t];void 0===s&&Object.hasOwn(c,i)||("+"===e.modifier||"*"===e.modifier?c[i]=s?s.split(/[/?#]/u).map(_t):[]:c[i]=s?_t(s):s)}return{keys:[...s,...a.keys],params:c,path:h[0]}};var kt=function t(e,i,s,n,r){let o,a,h=0,c=xt(e);return c.startsWith("/")&&(s&&(c=c.substring(1)),s=!0),{next(l){if(e===l)return{done:!0,value:void 0};e.i??=function(t){return Array.isArray(t)&&t.length>0?t:void 0}(e.children);const d=e.i??[],u=!e.i&&!e.children;if(!o&&(o=Ct(c,i,u,n,r),o))return{value:{keys:o.keys,params:o.params,path:o.path,route:e}};if(o&&d.length>0)for(;h<d.length;){if(!a){const n=d[h];n.parent=e;let r=o.path.length;r>0&&"/"===i.charAt(r)&&(r+=1),a=t(n,i.substring(r),s,o.keys,o.params)}const n=a.next(l);if(!n.done)return{done:!1,value:n.value};a=null,h+=1}return{done:!0,value:void 0}}}};function Rt(t){if(vt(t.route.action))return t.route.action(t)}class At extends Error{code;context;constructor(t,e){let i=`Path '${t.pathname}' is not properly resolved due to an error.`;const s=xt(t.route);s&&(i+=` Resolution had failed on route: '${s}'`),super(i,e),this.code=e?.code,this.context=t}warn(){console.warn(this.message)}}class Nt{baseUrl;#t;errorHandler;resolveRoute;#e;constructor(t,{baseUrl:e="",context:i,errorHandler:s,resolveRoute:n=Rt}={}){if(Object(t)!==t)throw new TypeError("Invalid routes");this.baseUrl=e,this.errorHandler=s,this.resolveRoute=n,Array.isArray(t)?this.#e={i:t,v:!0,action:()=>{},path:""}:this.#e={...t,parent:void 0},this.#t={...i,hash:"",next:async()=>bt,params:{},pathname:"",resolver:this,route:this.#e,search:"",chain:[]}}get root(){return this.#e}get context(){return this.#t}get m(){return this.baseUrl?new URL(this.baseUrl,document.baseURI||document.URL).href.replace(/[^/]*$/u,""):""}getRoutes(){return[...this.#e.i??[]]}removeRoutes(){this.#e.i=[]}async resolve(t){const e=this,i={...this.#t,...mt(t)?{pathname:t}:t,next:h},s=kt(this.#e,this.S(i.pathname)??i.pathname,!!this.baseUrl),n=this.resolveRoute;let r=null,o=null,a=i;async function h(t=!1,c=r?.value?.route,l){const d=null===l?r?.value?.route:void 0;if(r=o??s.next(d),o=null,!t&&(r.done||!function(t,e){let i=t;for(;i;)if(i=i.parent,i===e)return!0;return!1}(r.value.route,c)))return o=r,bt;if(r.done)throw $t(i);a={...i,params:r.value.params,route:r.value.route,chain:a.chain?.slice()},function(t,e){const{path:i,route:s}=e;if(s&&!s.v){const e={path:i,route:s};if(s.parent&&t.chain)for(let e=t.chain.length-1;e>=0&&t.chain[e].route!==s.parent;e--)t.chain.pop();t.chain?.push(e)}}(a,r.value);const u=await n(a);return null!=u&&u!==bt?(a.result=(f=u)&&"object"==typeof f&&"next"in f&&"params"in f&&"result"in f&&"route"in f?u.result:u,e.#t=a,a):await h(t,c,u);var f}try{return await h(!0,this.#e)}catch(t){const e=t instanceof yt?t:new At(a,{code:500,cause:t});if(this.errorHandler)return a.result=this.errorHandler(e),a;throw t}}setRoutes(t){this.#e.i=[...gt(t)]}S(t){if(!this.baseUrl)return t;const e=this.m,i=t.startsWith("/")?new URL(e).origin+t:`./${t}`,s=new URL(i,e).href;return s.startsWith(e)?s.slice(e.length):void 0}addRoutes(t){return this.#e.i=[...this.#e.i??[],...gt(t)],this.getRoutes()}}function Ot(t,e,i,s){const n=e.name??s?.(e);if(n&&(t.has(n)?t.get(n)?.push(e):t.set(n,[e])),Array.isArray(i))for(const n of i)n.parent=e,Ot(t,n,n.i??n.children,s)}function Tt(t,e){const i=t.get(e);if(i){if(i.length>1)throw new Error(`Duplicate route with name "${e}". Try seting unique 'name' route properties.`);return i[0]}}var Pt=function(t,e={}){if(!(t instanceof Nt))throw new TypeError("An instance of Resolver is expected");const i=new Map,s=new Map;return(n,r)=>{let o=Tt(s,n);if(!o&&(s.clear(),Ot(s,t.root,t.root.i,e.cacheKeyProvider),o=Tt(s,n),!o))throw new Error(`Route "${n}" not found`);let a=o.fullPath?i.get(o.fullPath):void 0;if(!a){let t=xt(o),e=o.parent;for(;e;){const i=xt(e);i&&(t=`${i.replace(/\/$/u,"")}/${t.replace(/^\//u,"")}`),e=e.parent}const s=at(t),n=Object.create(null);for(const t of s)mt(t)||(n[t.name]=!0);a={keys:n,tokens:s},i.set(t,a),o.fullPath=t}let h=ct(a.tokens,{encode:encodeURIComponent,...e})(r)||"/";if(e.stringifyQueryParams&&r){const t={};for(const[e,i]of Object.entries(r))!(e in a.keys)&&i&&(t[e]=i);const i=e.stringifyQueryParams(t);i&&(h+=i.startsWith("?")?i:`?${i}`)}return h}};const Mt=/\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i,Ut=window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients;function Lt(t,e){if("function"!=typeof t)return;const i=Mt.exec(t.toString());if(i)try{t=new Function(i[1])}catch(t){console.log("vaadin-development-mode-detector: uncommentAndRun() failed",t)}return t(e)}window.Vaadin=window.Vaadin||{};const It=function(t,e){if(window.Vaadin.developmentMode)return Lt(t,e)};function Dt(){
/*! vaadin-dev-mode:start
  (function () {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var getPolymerVersion = function getPolymerVersion() {
  return window.Polymer && window.Polymer.version;
};

var StatisticsGatherer = function () {
  function StatisticsGatherer(logger) {
    classCallCheck(this, StatisticsGatherer);

    this.now = new Date().getTime();
    this.logger = logger;
  }

  createClass(StatisticsGatherer, [{
    key: 'frameworkVersionDetectors',
    value: function frameworkVersionDetectors() {
      return {
        'Flow': function Flow() {
          if (window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients) {
            var flowVersions = Object.keys(window.Vaadin.Flow.clients).map(function (key) {
              return window.Vaadin.Flow.clients[key];
            }).filter(function (client) {
              return client.getVersionInfo;
            }).map(function (client) {
              return client.getVersionInfo().flow;
            });
            if (flowVersions.length > 0) {
              return flowVersions[0];
            }
          }
        },
        'Vaadin Framework': function VaadinFramework() {
          if (window.vaadin && window.vaadin.clients) {
            var frameworkVersions = Object.values(window.vaadin.clients).filter(function (client) {
              return client.getVersionInfo;
            }).map(function (client) {
              return client.getVersionInfo().vaadinVersion;
            });
            if (frameworkVersions.length > 0) {
              return frameworkVersions[0];
            }
          }
        },
        'AngularJs': function AngularJs() {
          if (window.angular && window.angular.version && window.angular.version) {
            return window.angular.version.full;
          }
        },
        'Angular': function Angular() {
          if (window.ng) {
            var tags = document.querySelectorAll("[ng-version]");
            if (tags.length > 0) {
              return tags[0].getAttribute("ng-version");
            }
            return "Unknown";
          }
        },
        'Backbone.js': function BackboneJs() {
          if (window.Backbone) {
            return window.Backbone.VERSION;
          }
        },
        'React': function React() {
          var reactSelector = '[data-reactroot], [data-reactid]';
          if (!!document.querySelector(reactSelector)) {
            // React does not publish the version by default
            return "unknown";
          }
        },
        'Ember': function Ember() {
          if (window.Em && window.Em.VERSION) {
            return window.Em.VERSION;
          } else if (window.Ember && window.Ember.VERSION) {
            return window.Ember.VERSION;
          }
        },
        'jQuery': function (_jQuery) {
          function jQuery() {
            return _jQuery.apply(this, arguments);
          }

          jQuery.toString = function () {
            return _jQuery.toString();
          };

          return jQuery;
        }(function () {
          if (typeof jQuery === 'function' && jQuery.prototype.jquery !== undefined) {
            return jQuery.prototype.jquery;
          }
        }),
        'Polymer': function Polymer() {
          var version = getPolymerVersion();
          if (version) {
            return version;
          }
        },
        'LitElement': function LitElement() {
          var version = window.litElementVersions && window.litElementVersions[0];
          if (version) {
            return version;
          }
        },
        'LitHtml': function LitHtml() {
          var version = window.litHtmlVersions && window.litHtmlVersions[0];
          if (version) {
            return version;
          }
        },
        'Vue.js': function VueJs() {
          if (window.Vue) {
            return window.Vue.version;
          }
        }
      };
    }
  }, {
    key: 'getUsedVaadinElements',
    value: function getUsedVaadinElements(elements) {
      var version = getPolymerVersion();
      var elementClasses = void 0;
      // NOTE: In case you edit the code here, YOU MUST UPDATE any statistics reporting code in Flow.
      // Check all locations calling the method getEntries() in
      // https://github.com/vaadin/flow/blob/master/flow-server/src/main/java/com/vaadin/flow/internal/UsageStatistics.java#L106
      // Currently it is only used by BootstrapHandler.
      if (version && version.indexOf('2') === 0) {
        // Polymer 2: components classes are stored in window.Vaadin
        elementClasses = Object.keys(window.Vaadin).map(function (c) {
          return window.Vaadin[c];
        }).filter(function (c) {
          return c.is;
        });
      } else {
        // Polymer 3: components classes are stored in window.Vaadin.registrations
        elementClasses = window.Vaadin.registrations || [];
      }
      elementClasses.forEach(function (klass) {
        var version = klass.version ? klass.version : "0.0.0";
        elements[klass.is] = { version: version };
      });
    }
  }, {
    key: 'getUsedVaadinThemes',
    value: function getUsedVaadinThemes(themes) {
      ['Lumo', 'Material'].forEach(function (themeName) {
        var theme;
        var version = getPolymerVersion();
        if (version && version.indexOf('2') === 0) {
          // Polymer 2: themes are stored in window.Vaadin
          theme = window.Vaadin[themeName];
        } else {
          // Polymer 3: themes are stored in custom element registry
          theme = customElements.get('vaadin-' + themeName.toLowerCase() + '-styles');
        }
        if (theme && theme.version) {
          themes[themeName] = { version: theme.version };
        }
      });
    }
  }, {
    key: 'getFrameworks',
    value: function getFrameworks(frameworks) {
      var detectors = this.frameworkVersionDetectors();
      Object.keys(detectors).forEach(function (framework) {
        var detector = detectors[framework];
        try {
          var version = detector();
          if (version) {
            frameworks[framework] = { version: version };
          }
        } catch (e) {}
      });
    }
  }, {
    key: 'gather',
    value: function gather(storage) {
      var storedStats = storage.read();
      var gatheredStats = {};
      var types = ["elements", "frameworks", "themes"];

      types.forEach(function (type) {
        gatheredStats[type] = {};
        if (!storedStats[type]) {
          storedStats[type] = {};
        }
      });

      var previousStats = JSON.stringify(storedStats);

      this.getUsedVaadinElements(gatheredStats.elements);
      this.getFrameworks(gatheredStats.frameworks);
      this.getUsedVaadinThemes(gatheredStats.themes);

      var now = this.now;
      types.forEach(function (type) {
        var keys = Object.keys(gatheredStats[type]);
        keys.forEach(function (key) {
          if (!storedStats[type][key] || _typeof(storedStats[type][key]) != _typeof({})) {
            storedStats[type][key] = { firstUsed: now };
          }
          // Discards any previously logged version number
          storedStats[type][key].version = gatheredStats[type][key].version;
          storedStats[type][key].lastUsed = now;
        });
      });

      var newStats = JSON.stringify(storedStats);
      storage.write(newStats);
      if (newStats != previousStats && Object.keys(storedStats).length > 0) {
        this.logger.debug("New stats: " + newStats);
      }
    }
  }]);
  return StatisticsGatherer;
}();

var StatisticsStorage = function () {
  function StatisticsStorage(key) {
    classCallCheck(this, StatisticsStorage);

    this.key = key;
  }

  createClass(StatisticsStorage, [{
    key: 'read',
    value: function read() {
      var localStorageStatsString = localStorage.getItem(this.key);
      try {
        return JSON.parse(localStorageStatsString ? localStorageStatsString : '{}');
      } catch (e) {
        return {};
      }
    }
  }, {
    key: 'write',
    value: function write(data) {
      localStorage.setItem(this.key, data);
    }
  }, {
    key: 'clear',
    value: function clear() {
      localStorage.removeItem(this.key);
    }
  }, {
    key: 'isEmpty',
    value: function isEmpty() {
      var storedStats = this.read();
      var empty = true;
      Object.keys(storedStats).forEach(function (key) {
        if (Object.keys(storedStats[key]).length > 0) {
          empty = false;
        }
      });

      return empty;
    }
  }]);
  return StatisticsStorage;
}();

var StatisticsSender = function () {
  function StatisticsSender(url, logger) {
    classCallCheck(this, StatisticsSender);

    this.url = url;
    this.logger = logger;
  }

  createClass(StatisticsSender, [{
    key: 'send',
    value: function send(data, errorHandler) {
      var logger = this.logger;

      if (navigator.onLine === false) {
        logger.debug("Offline, can't send");
        errorHandler();
        return;
      }
      logger.debug("Sending data to " + this.url);

      var req = new XMLHttpRequest();
      req.withCredentials = true;
      req.addEventListener("load", function () {
        // Stats sent, nothing more to do
        logger.debug("Response: " + req.responseText);
      });
      req.addEventListener("error", function () {
        logger.debug("Send failed");
        errorHandler();
      });
      req.addEventListener("abort", function () {
        logger.debug("Send aborted");
        errorHandler();
      });
      req.open("POST", this.url);
      req.setRequestHeader("Content-Type", "application/json");
      req.send(data);
    }
  }]);
  return StatisticsSender;
}();

var StatisticsLogger = function () {
  function StatisticsLogger(id) {
    classCallCheck(this, StatisticsLogger);

    this.id = id;
  }

  createClass(StatisticsLogger, [{
    key: '_isDebug',
    value: function _isDebug() {
      return localStorage.getItem("vaadin." + this.id + ".debug");
    }
  }, {
    key: 'debug',
    value: function debug(msg) {
      if (this._isDebug()) {
        console.info(this.id + ": " + msg);
      }
    }
  }]);
  return StatisticsLogger;
}();

var UsageStatistics = function () {
  function UsageStatistics() {
    classCallCheck(this, UsageStatistics);

    this.now = new Date();
    this.timeNow = this.now.getTime();
    this.gatherDelay = 10; // Delay between loading this file and gathering stats
    this.initialDelay = 24 * 60 * 60;

    this.logger = new StatisticsLogger("statistics");
    this.storage = new StatisticsStorage("vaadin.statistics.basket");
    this.gatherer = new StatisticsGatherer(this.logger);
    this.sender = new StatisticsSender("https://tools.vaadin.com/usage-stats/submit", this.logger);
  }

  createClass(UsageStatistics, [{
    key: 'maybeGatherAndSend',
    value: function maybeGatherAndSend() {
      var _this = this;

      if (localStorage.getItem(UsageStatistics.optOutKey)) {
        return;
      }
      this.gatherer.gather(this.storage);
      setTimeout(function () {
        _this.maybeSend();
      }, this.gatherDelay * 1000);
    }
  }, {
    key: 'lottery',
    value: function lottery() {
      return true;
    }
  }, {
    key: 'currentMonth',
    value: function currentMonth() {
      return this.now.getYear() * 12 + this.now.getMonth();
    }
  }, {
    key: 'maybeSend',
    value: function maybeSend() {
      var firstUse = Number(localStorage.getItem(UsageStatistics.firstUseKey));
      var monthProcessed = Number(localStorage.getItem(UsageStatistics.monthProcessedKey));

      if (!firstUse) {
        // Use a grace period to avoid interfering with tests, incognito mode etc
        firstUse = this.timeNow;
        localStorage.setItem(UsageStatistics.firstUseKey, firstUse);
      }

      if (this.timeNow < firstUse + this.initialDelay * 1000) {
        this.logger.debug("No statistics will be sent until the initial delay of " + this.initialDelay + "s has passed");
        return;
      }
      if (this.currentMonth() <= monthProcessed) {
        this.logger.debug("This month has already been processed");
        return;
      }
      localStorage.setItem(UsageStatistics.monthProcessedKey, this.currentMonth());
      // Use random sampling
      if (this.lottery()) {
        this.logger.debug("Congratulations, we have a winner!");
      } else {
        this.logger.debug("Sorry, no stats from you this time");
        return;
      }

      this.send();
    }
  }, {
    key: 'send',
    value: function send() {
      // Ensure we have the latest data
      this.gatherer.gather(this.storage);

      // Read, send and clean up
      var data = this.storage.read();
      data["firstUse"] = Number(localStorage.getItem(UsageStatistics.firstUseKey));
      data["usageStatisticsVersion"] = UsageStatistics.version;
      var info = 'This request contains usage statistics gathered from the application running in development mode. \n\nStatistics gathering is automatically disabled and excluded from production builds.\n\nFor details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.\n\n\n\n';
      var self = this;
      this.sender.send(info + JSON.stringify(data), function () {
        // Revert the 'month processed' flag
        localStorage.setItem(UsageStatistics.monthProcessedKey, self.currentMonth() - 1);
      });
    }
  }], [{
    key: 'version',
    get: function get$1() {
      return '2.1.2';
    }
  }, {
    key: 'firstUseKey',
    get: function get$1() {
      return 'vaadin.statistics.firstuse';
    }
  }, {
    key: 'monthProcessedKey',
    get: function get$1() {
      return 'vaadin.statistics.monthProcessed';
    }
  }, {
    key: 'optOutKey',
    get: function get$1() {
      return 'vaadin.statistics.optout';
    }
  }]);
  return UsageStatistics;
}();

try {
  window.Vaadin = window.Vaadin || {};
  window.Vaadin.usageStatsChecker = window.Vaadin.usageStatsChecker || new UsageStatistics();
  window.Vaadin.usageStatsChecker.maybeGatherAndSend();
} catch (e) {
  // Intentionally ignored as this is not a problem in the app being developed
}

}());

  vaadin-dev-mode:end **/}void 0===window.Vaadin.developmentMode&&(window.Vaadin.developmentMode=function(){try{return!!localStorage.getItem("vaadin.developmentmode.force")||["localhost","127.0.0.1"].indexOf(window.location.hostname)>=0&&(Ut?!(Ut&&Object.keys(Ut).map(t=>Ut[t]).filter(t=>t.productionMode).length>0):!Lt(function(){return!0}))}catch(t){return!1}}());!function(t,e=(window.Vaadin??={})){e.registrations??=[],e.registrations.push({is:"@vaadin/router",version:"2.0.0"})}(),It(Dt);var jt=async function(t,e){return t.classList.add(e),await new Promise(i=>{if((t=>{const e=getComputedStyle(t).getPropertyValue("animation-name");return e&&"none"!==e})(t)){const s=t.getBoundingClientRect(),n=`height: ${s.bottom-s.top}px; width: ${s.right-s.left}px`;t.setAttribute("style",`position: absolute; ${n}`),((t,e)=>{const i=()=>{t.removeEventListener("animationend",i),e()};t.addEventListener("animationend",i)})(t,()=>{t.classList.remove(e),t.removeAttribute("style"),i()})}else t.classList.remove(e),i()})};function Bt(t){if(!t||!mt(t.path))throw new Error(wt('Expected route config to be an object with a "path" string property, or an array of such objects'));if(!(vt(t.action)||Array.isArray(t.children)||vt(t.children)||mt(t.component)||mt(t.redirect)))throw new Error(wt(`Expected route config "${t.path}" to include either "component, redirect" or "action" function but none found.`));t.redirect&&["bundle","component"].forEach(e=>{e in t&&console.warn(wt(`Route config "${String(t.path)}" has both "redirect" and "${e}" properties, and "redirect" will always override the latter. Did you mean to only use "${e}"?`))})}function Ht(t){gt(t).forEach(t=>Bt(t))}function Ft(t,e){const i=e.m;return i?new URL(t.replace(/^\//u,""),i).pathname:t}function zt(t){return t.map(t=>t.path).reduce((t,e)=>e.length?`${t.replace(/\/$/u,"")}/${e.replace(/^\//u,"")}`:t,"")}function qt({chain:t=[],hash:e="",params:i={},pathname:s="",redirectFrom:n,resolver:r,search:o=""},a){const h=t.map(t=>t.route);return{baseUrl:r?.baseUrl??"",getUrl:(e={})=>r?Ft(ht(function(t){return zt(t.map(t=>t.route))}(t))({...i,...e}),r):"",hash:e,params:i,pathname:s,redirectFrom:n,route:a??(Array.isArray(h)?h.at(-1):void 0)??null,routes:h,search:o,searchParams:new URLSearchParams(o)}}function Kt(t,e){const i={...t.params};return{redirect:{from:t.pathname,params:i,pathname:e}}}function Jt(t,e,...i){if("function"==typeof t)return t.apply(e,i)}function Wt(t,e,...i){return s=>s&&pt(s)&&("cancel"in s||"redirect"in s)?s:Jt(e?.[t],e,...i)}function Gt(t,e){return!window.dispatchEvent(new CustomEvent(`vaadin-router-${t}`,{cancelable:"go"===t,detail:e}))}function Vt(t){if(t instanceof Element)return t.nodeName.toLowerCase()}function Yt(t){if(t.defaultPrevented)return;if(0!==t.button)return;if(t.shiftKey||t.ctrlKey||t.altKey||t.metaKey)return;let e=t.target;const i=t instanceof MouseEvent?t.composedPath():t.path??[];for(let t=0;t<i.length;t++){const s=i[t];if("nodeName"in s&&"a"===s.nodeName.toLowerCase()){e=s;break}}for(;e&&e instanceof Node&&"a"!==Vt(e);)e=e.parentNode;if(!e||"a"!==Vt(e))return;const s=e;if(s.target&&"_self"!==s.target.toLowerCase())return;if(s.hasAttribute("download"))return;if(s.hasAttribute("router-ignore"))return;if(s.pathname===window.location.pathname&&""!==s.hash)return;const n=s.origin||function(t){const{port:e,protocol:i}=t;return`${i}//${"http:"===i&&"80"===e||"https:"===i&&"443"===e?t.hostname:t.host}`}(s);if(n!==window.location.origin)return;const{hash:r,pathname:o,search:a}=s;Gt("go",{hash:r,pathname:o,search:a})&&t instanceof MouseEvent&&(t.preventDefault(),"click"===t.type&&window.scrollTo(0,0))}function Zt(t){if("vaadin-router-ignore"===t.state)return;const{hash:e,pathname:i,search:s}=window.location;Gt("go",{hash:e,pathname:i,search:s})}let Qt=[];const Xt={CLICK:{activate(){window.document.addEventListener("click",Yt)},inactivate(){window.document.removeEventListener("click",Yt)}},POPSTATE:{activate(){window.addEventListener("popstate",Zt)},inactivate(){window.removeEventListener("popstate",Zt)}}};function te(t=[]){Qt.forEach(t=>t.inactivate()),t.forEach(t=>t.activate()),Qt=t}function ee(){return{cancel:!0}}const ie={R:-1,params:{},route:{v:!0,children:[],path:"",action(){}},pathname:"",next:async()=>bt};class se extends Nt{location=qt({resolver:this});ready=Promise.resolve(this.location);#i=new WeakSet;#s=new WeakSet;#n=this.#r.bind(this);#o=0;#a;A;#h;#c=null;#l=null;constructor(t,e){const i=document.head.querySelector("base"),s=i?.getAttribute("href");super([],{baseUrl:s?new URL(s,document.URL).href.replace(/[^/]*$/u,""):void 0,...e,resolveRoute:async t=>await this.#d(t)}),te(Object.values(Xt)),this.setOutlet(t),this.subscribe()}async#d(t){const{route:e}=t;if(vt(e.children)){let i=await e.children(function({next:t,...e}){return e}(t));vt(e.children)||({children:i}=e),function(t,e){if(!Array.isArray(t)&&!pt(t))throw new Error(wt(`Incorrect "children" value for the route ${String(e.path)}: expected array or object, but got ${String(t)}`));const i=gt(t);i.forEach(t=>Bt(t)),e.i=i}(i,e)}const i={component:t=>{const e=document.createElement(t);return this.#s.add(e),e},prevent:ee,redirect:e=>Kt(t,e)};return await Promise.resolve().then(async()=>{if(this.#u(t))return await Jt(e.action,e,t,i)}).then(t=>null==t||"object"!=typeof t&&"symbol"!=typeof t||!(t instanceof HTMLElement||t===bt||pt(t)&&"redirect"in t)?mt(e.redirect)?i.redirect(e.redirect):void 0:t).then(t=>null!=t?t:mt(e.component)?i.component(e.component):void 0)}setOutlet(t){t&&this.#f(t),this.#a=t}getOutlet(){return this.#a}async setRoutes(t,e=!1){return this.A=void 0,this.#h=void 0,Ht(t),super.setRoutes(t),e||this.#r(),await this.ready}addRoutes(t){return Ht(t),super.addRoutes(t)}async render(t,e=!1){this.#o+=1;const i=this.#o,s={...ie,...mt(t)?{hash:"",search:"",pathname:t}:t,R:i};return this.ready=this.#p(s,e),await this.ready}async#p(t,e){const{R:i}=t;try{const s=await this.resolve(t),n=await this.#v(s);if(!this.#u(n))return this.location;const r=this.A;if(n===r)return this.#m(r,!0),this.location;if(this.location=qt(n),e&&this.#m(n,1===i),Gt("location-changed",{router:this,location:this.location}),n.N)return this.#g(n,r),this.A=n,this.location;this.#w(n,r);const o=this.#y(n);if(this.#b(n),this.#$(n,r),await o,this.#u(n))return this.#E(),this.A=n,this.location}catch(s){if(i===this.#o){e&&this.#m(this.context);for(const t of this.#a?.children??[])t.remove();throw this.location=qt(Object.assign(t,{resolver:this})),Gt("error",{router:this,error:s,...t}),s}}return this.location}async#v(t,e=t){const i=await this.#x(e),s=i!==e?i:t,n=Ft(zt(i.chain??[]),this)===i.pathname,r=async(t,e=t.route,i)=>{const s=await t.next(!1,e,i);return null===s||s===bt?n?t:null!=e.parent?await r(t,e.parent,s):s:s},o=await r(i);if(null==o||o===bt)throw $t(s);return o!==i?await this.#v(s,o):await this.#S(i)}async#x(t){const{result:e}=t;if(e instanceof HTMLElement)return function(t,e){if(e.location=qt(t),t.chain){const i=t.chain.map(t=>t.route).indexOf(t.route);t.chain[i].element=e}}(t,e),t;if(e&&"redirect"in e){const i=await this.#_(e.redirect,t.P,t.R);return await this.#x(i)}throw e instanceof Error?e:new Error(wt(`Invalid route resolution result for path "${t.pathname}". Expected redirect object or HTML element, but got: "${function(t){if("object"!=typeof t)return String(t);const[e="Unknown"]=/ (.*)\]$/u.exec(String(t))??[];return"Object"===e||"Array"===e?`${e} ${JSON.stringify(t)}`:e}(e)}". Double check the action return value for the route.`))}async#S(t){return await this.#C(t).then(async e=>e===this.A||e===t?e:await this.#v(e))}async#C(t){const e=this.A??{},i=e.chain??[],s=t.chain??[];let n=Promise.resolve(void 0);const r=e=>Kt(t,e);if(t.M=0,t.N=!1,i.length){for(let e=0;e<Math.min(i.length,s.length)&&(i[e].route===s[e].route&&(i[e].path===s[e].path||i[e].element===s[e].element)&&this.#k(i[e].element,s[e].element));t.M++,e++);if(t.N=s.length===i.length&&t.M===s.length&&this.#k(t.result,e.result),t.N){for(let e=s.length-1;e>=0;e--)n=this.#R(n,t,{prevent:ee},i[e]);for(let e=0;e<s.length;e++)n=this.#A(n,t,{prevent:ee,redirect:r},s[e]),i[e].element.location=qt(t,i[e].route)}else for(let e=i.length-1;e>=t.M;e--)n=this.#R(n,t,{prevent:ee},i[e])}if(!t.N)for(let e=0;e<s.length;e++)e<t.M?e<i.length&&i[e].element&&(i[e].element.location=qt(t,i[e].route)):(n=this.#A(n,t,{prevent:ee,redirect:r},s[e]),s[e].element&&(s[e].element.location=qt(t,s[e].route)));return await n.then(async e=>{if(e&&pt(e)){if("cancel"in e&&this.A)return this.A.R=t.R,this.A;if("redirect"in e)return await this.#_(e.redirect,t.P,t.R)}return t})}async#R(t,e,i,s){const n=qt(e);let r=await t;if(this.#u(e)){r=Wt("onBeforeLeave",s.element,n,i,this)(r)}if(!pt(r)||!("redirect"in r))return r}async#A(t,e,i,s){const n=qt(e,s.route),r=await t;if(this.#u(e)){return Wt("onBeforeEnter",s.element,n,i,this)(r)}}#k(t,e){return t instanceof Element&&e instanceof Element&&(this.#s.has(t)&&this.#s.has(e)?t.localName===e.localName:t===e)}#u(t){return t.R===this.#o}async#_(t,e=0,i=0){if(e>256)throw new Error(wt(`Too many redirects when rendering ${t.from}`));return await this.resolve({...ie,pathname:this.urlForPath(t.pathname,t.params),redirectFrom:t.from,P:e+1,R:i})}#f(t=this.#a){if(!(t instanceof Element||t instanceof DocumentFragment))throw new TypeError(wt(`Expected router outlet to be a valid DOM Element | DocumentFragment (but got ${t})`))}#m({pathname:t,search:e="",hash:i=""},s){if(window.location.pathname!==t||window.location.search!==e||window.location.hash!==i){const n=s?"replaceState":"pushState";window.history[n](null,document.title,t+e+i),window.dispatchEvent(new PopStateEvent("popstate",{state:"vaadin-router-ignore"}))}}#g(t,e){let i=this.#a;for(let s=0;s<(t.M??0);s++){const n=e?.chain?.[s].element;if(n){if(n.parentNode!==i)break;t.chain[s].element=n,i=n}}return i}#w(t,e){this.#f(),this.#N();const i=this.#g(t,e);this.#c=[],this.#l=Array.from(i?.children??[]).filter(e=>this.#i.has(e)&&e!==t.result);let s=i;for(let e=t.M??0;e<(t.chain?.length??0);e++){const n=t.chain[e].element;n&&(s?.appendChild(n),this.#i.add(n),s===i&&this.#c.push(n),s=n)}}#E(){if(this.#l)for(const t of this.#l)t.remove();this.#l=null,this.#c=null}#N(){if(this.#l&&this.#c){for(const t of this.#c)t.remove();this.#l=null,this.#c=null}}#$(t,e){if(e?.chain&&null!=t.M)for(let i=e.chain.length-1;i>=t.M&&this.#u(t);i--){const s=e.chain[i].element;if(s)try{const e=qt(t);Jt(s.onAfterLeave,s,e,{},this)}finally{if(this.#l?.includes(s))for(const t of s.children)t.remove()}}}#b(t){if(t.chain&&null!=t.M)for(let e=t.M;e<t.chain.length&&this.#u(t);e++){const i=t.chain[e].element;if(i){const s=qt(t,t.chain[e].route);Jt(i.onAfterEnter,i,s,{},this)}}}async#y(t){const e=this.#l?.[0],i=this.#c?.[0],s=[],{chain:n=[]}=t;let r;for(let t=n.length-1;t>=0;t--)if(n[t].route.animate){r=n[t].route.animate;break}if(e&&i&&r){const t=pt(r)&&r.leave?r.leave:"leaving",n=pt(r)&&r.enter?r.enter:"entering";s.push(jt(e,t)),s.push(jt(i,n))}return await Promise.all(s),t}subscribe(){window.addEventListener("vaadin-router-go",this.#n)}unsubscribe(){window.removeEventListener("vaadin-router-go",this.#n)}#r(t){const{pathname:e,search:i,hash:s}=t instanceof CustomEvent?t.detail:window.location;mt(this.S(e))&&(t?.preventDefault&&t.preventDefault(),this.render({pathname:e,search:i,hash:s},!0))}static setTriggers(...t){te(t)}urlForName(t,e){return this.#h||(this.#h=Pt(this,{cacheKeyProvider:t=>"component"in t&&"string"==typeof t.component?t.component:void 0})),Ft(this.#h(t,e??void 0),this)}urlForPath(t,e){return Ft(ht(t)(e??void 0),this)}static go(t){const{pathname:e,search:i,hash:s}=mt(t)?new URL(t,"http://a"):t;return Gt("go",{pathname:e,search:i,hash:s})}}let ne={};function re(){return document.documentElement.lang.toLowerCase().startsWith("tr")?"tr":"en"}async function oe(){const t=re();try{const e=await fetch(`/src/i18n/${t}.json`,{headers:{Accept:"application/json"}});if(!e.ok)throw new Error(`HTTP ${e.status}`);ne[t]=await e.json()}catch(e){if(console.error(`Failed to load messages for locale: ${t}`,e),!ne.en)try{const t=await fetch("/src/i18n/en.json",{headers:{Accept:"application/json"}});t.ok&&(ne.en=await t.json())}catch(t){}}document.dispatchEvent(new CustomEvent("language-changed",{detail:{locale:t}}))}function ae(t,e=[]){const i=re();let s=ne[i]?.[t]||ne.en?.[t]||`MISSING_KEY: ${t}`;return e.forEach((t,e)=>{s=s.replace(`{${e}}`,t)}),s}class he extends EventTarget{static instance=null;static STORAGE_KEY="ing_employees_data";employees=[];constructor(){super(),this.employees=this._loadData()}static getInstance(){return he.instance||(he.instance=new he),he.instance}_loadData(){try{const t=localStorage.getItem(he.STORAGE_KEY);return t?JSON.parse(t):[]}catch(t){return console.error("Error loading data from localStorage. Starting with empty data.",t),[]}}_saveData(){try{localStorage.setItem(he.STORAGE_KEY,JSON.stringify(this.employees));const t=new CustomEvent("employees-changed",{detail:{employees:this.employees}});this.dispatchEvent(t)}catch(t){console.error("Error saving data to localStorage. State is not persisted.",t)}}addEmployee(t){const e={...t,id:Date.now().toString(36)+Math.random().toString(36).substring(2)};this.employees.push(e),this._saveData()}updateEmployee(t){const e=t?.id;if(!e)return;const i=this.employees.findIndex(t=>t.id===e);-1!==i&&(this.employees[i]=t,this._saveData())}getEmployeeById(t){return this.employees.find(e=>e.id===t)}isEmailUnique(t,e=null){return!t||!this.employees.some(i=>i?.email?.toLowerCase()===t.toLowerCase()&&i.id!==e)}deleteEmployee(t){t&&(this.employees=this.employees.filter(e=>e.id!==t),this._saveData())}}const ce=he.getInstance(),le=new Map;async function de(t){if(le.has(t))return le.get(t);const e=await fetch(t),i=await e.text(),s=new CSSStyleSheet;return await s.replace(i),le.set(t,s),s}async function ue(t,e){const i=e.map(t=>t instanceof URL?t.href:String(t)),s=await Promise.all(i.map(de));t.adoptedStyleSheets=[...t.adoptedStyleSheets,...s]}class fe extends rt{static properties={open:{type:Boolean,reflect:!0},variant:{type:String,reflect:!0},title:{type:String},message:{type:String},confirmText:{type:String},cancelText:{type:String}};async firstUpdated(){await ue(this.shadowRoot,[new URL("./confirm-dialog.css",import.meta.url)])}t(t,e=[]){return ae(t,e)}constructor(){super(),this.open=!1,this.variant="default",this.title="",this.message="",this.confirmText="",this.cancelText="",this._onKeydown=this._onKeydown.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this._onKeydown)}disconnectedCallback(){document.removeEventListener("keydown",this._onKeydown),super.disconnectedCallback()}_onKeydown(t){this.open&&("Escape"===t.key&&this._cancel(),"Enter"===t.key&&this._confirm())}openWith({title:t,message:e,confirmText:i,cancelText:s,variant:n}){this.title=t||this.t("deleteConfirmation"),this.message=e||"",this.confirmText=i||this.t("proceed"),this.cancelText=s||this.t("cancel"),this.variant=n||"default",this.open=!0,this.updateComplete.then(()=>{const t=this.shadowRoot.querySelector(".confirm");t?.focus()})}_confirm(){this.open=!1,this.dispatchEvent(new CustomEvent("confirm",{bubbles:!0,composed:!0}))}_cancel(){this.open=!1,this.dispatchEvent(new CustomEvent("cancel",{bubbles:!0,composed:!0}))}_closeIconClick(){this._cancel()}render(){return H`
      <div class="backdrop" ?hidden=${!this.open} @click=${this._cancel}></div>
      <div class="dialog" role="dialog" aria-modal="true" ?hidden=${!this.open} @click=${t=>t.stopPropagation()}>
        <button class="close" aria-label="close" @click=${this._closeIconClick}>×</button>
        <div class="title">${this.title||this.t("deleteConfirmation")}</div>
        ${this.message?H`<div class="message">${this.message}</div>`:""}
        <div class="actions">
          <button class="btn primary confirm" @click=${this._confirm}>${this.confirmText||this.t("proceed")}</button>
          <button class="btn outline" @click=${this._cancel}>${this.cancelText||this.t("cancel")}</button>
        </div>
      </div>
    `}}customElements.define("confirm-dialog",fe);customElements.define("employee-list",class extends rt{static properties={employees:{type:Array},page:{type:Number},pageSize:{type:Number},searchTerm:{type:String},viewFormat:{type:String}};async firstUpdated(){await ue(this.shadowRoot,[new URL("./employee-list.css",import.meta.url)])}t(t,e=[]){return ae(t,e)}constructor(){super(),this.employees=[],this.page=1,this.pageSize=10,this.searchTerm="",this.viewFormat="table",this._employeeDataChanged=this._employeeDataChanged.bind(this),this._onLanguageChanged=()=>this.requestUpdate(),ce.addEventListener("employees-changed",this._employeeDataChanged)}disconnectedCallback(){ce.removeEventListener("employees-changed",this._employeeDataChanged),document.removeEventListener("language-changed",this._onLanguageChanged),super.disconnectedCallback()}_employeeDataChanged(t){this.employees=t.detail.employees,this.page=1}async connectedCallback(){super.connectedCallback(),this.employees=ce.employees,document.addEventListener("language-changed",this._onLanguageChanged)}_setView(t){this.viewFormat=t,this.page=1}_handleEdit(t){se.go(`/edit/${t}`)}_handleDelete(t){const e=this.employees.find(e=>e.id===t),i=this.shadowRoot.querySelector("confirm-dialog"),s=e?`${e.firstName} ${e.lastName}`.trim():"",n=s?this.t("deleteRecord",[s]):this.t("confirmDelete");i.openWith({title:this.t("deleteConfirmation"),message:n,confirmText:this.t("proceed"),cancelText:this.t("cancel"),variant:"danger"});const r=()=>{ce.deleteEmployee(t),i.removeEventListener("confirm",r),i.removeEventListener("cancel",o)},o=()=>{i.removeEventListener("confirm",r),i.removeEventListener("cancel",o)};i.addEventListener("confirm",r),i.addEventListener("cancel",o)}_handleSearch(t){this.searchTerm=t.target.value,this.page=1}_handlePageChange(t){const e="cards"===this.viewFormat?4:this.pageSize,i=Math.ceil(this.employees.length/e);t>=1&&t<=i&&(this.page=t)}_getCurrentPageEmployees(){const t=this.searchTerm.toLowerCase(),e=this.employees.filter(e=>{const i=e.firstName?.toLowerCase()||"",s=e.lastName?.toLowerCase()||"",n=e.email?.toLowerCase()||"";return i.includes(t)||s.includes(t)||n.includes(t)}),i="cards"===this.viewFormat?4:this.pageSize,s=(this.page-1)*i,n=s+i;return{total:e.length,records:e.slice(s,n)}}_buildPageList(t){const e=this.page,i=[],s=t=>i.push(t);if(t<=7){for(let e=1;e<=t;e++)s(e);return i}s(1),e>4&&s("...l");const n=Math.max(2,e-1),r=Math.min(t-1,e+1);for(let t=n;t<=r;t++)s(t);return e<t-3&&s("...r"),s(t),i}render(){const{total:t,records:e}=this._getCurrentPageEmployees(),i="cards"===this.viewFormat?4:this.pageSize,s=Math.ceil(t/i),n=this._buildPageList(s);return H`
            <div class="employee-list-wrapper">
                <div class="header-row">
                    <h2 class="page-title">${this.t("employeeList")}</h2>
                    <div class="view-toggles">
                        <button class="icon-btn ${"table"===this.viewFormat?"active":""}"
                            @click=${()=>this._setView("table")} aria-label="Table view">
                            <span class="toggle-icon list" aria-hidden="true"></span>
                        </button>
                        <button class="icon-btn ${"cards"===this.viewFormat?"active":""}"
                            @click=${()=>this._setView("cards")} aria-label="Cards view">
                            <span class="toggle-icon grid" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <div class="list-container" data-view="${this.viewFormat}">
                    
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>${this.t("firstName")}</th>
                                <th>${this.t("lastName")}</th>
                                <th>${this.t("dateOfEmployment")}</th>
                                <th>${this.t("dateOfBirth")}</th>
                                <th>${this.t("phoneNumber")}</th>
                                <th>${this.t("email")}</th>
                                <th>${this.t("department")}</th>
                                <th>${this.t("position")}</th>
                                <th>${this.t("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${e.map(t=>H`
                                <tr>
                                    <td><input type="checkbox" aria-label="select" /></td>
                                    <td>${t.firstName}</td>
                                    <td>${t.lastName}</td>
                                    <td>${t.dateOfEmployment}</td>
                                    <td>${t.dateOfBirth||"-"}</td>
                                    <td>${t.phone||"-"}</td>
                                    <td>${t.email}</td>
                                    <td>${t.department}</td>
                                    <td>${t.position}</td>
                                    <td class="actions-cell">
                                        <button class="action-btn edit" @click=${()=>this._handleEdit(t.id)} aria-label="${this.t("edit")}">
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18.71-11.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66z"/>
                                            </svg>
                                        </button>
                                        <button class="action-btn delete" @click=${()=>this._handleDelete(t.id)} aria-label="${this.t("delete")}">
                                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                                <path fill="currentColor" d="M6 7h12v2H6V7zm2 3h8l-1 10H9L8 10zm3-6h2l1 1h5v2H5V5h5l1-1z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                              `)}
                            ${0===e.length?H`
                                    <tr>
                                        <td colspan="10">
                                            <div class="empty-state">${this.t("noRecordsFound")}</div>
                                        </td>
                                    </tr>
                                  `:""}
                        </tbody>
                    </table>

                    <div class="cards-grid">
                        ${e.map(t=>H`
                            <div class="card">
                                <div class="card-grid">
                                    <div>
                                        <div class="field-label">${this.t("firstName")}</div>
                                        <div>${t.firstName}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t("lastName")}</div>
                                        <div>${t.lastName}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t("dateOfEmployment")}</div>
                                        <div>${t.dateOfEmployment}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t("dateOfBirth")}</div>
                                        <div>${t.dateOfBirth||"-"}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t("phoneNumber")}</div>
                                        <div>${t.phone||"-"}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t("email")}</div>
                                        <div>${t.email}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t("department")}</div>
                                        <div>${t.department}</div>
                                    </div>
                                    <div>
                                        <div class="field-label">${this.t("position")}</div>
                                        <div>${t.position}</div>
                                    </div>
                                </div>
                                <div class="actions">
                                    <button class="btn edit" @click=${()=>this._handleEdit(t.id)}>${this.t("edit")}</button>
                                    <button class="btn primary" @click=${()=>this._handleDelete(t.id)}>${this.t("delete")}</button>
                                </div>
                            </div>
                          `)}
                        ${0===e.length?H`
                                <div class="empty-state">${this.t("noRecordsFound")}</div>
                              `:""}
                    </div>
                    
                    <div class="pagination-controls">
                        <button class="pager-btn prev" @click=${()=>this._handlePageChange(this.page-1)} ?disabled=${1===this.page||0===t} aria-label="Previous page">
                            <img class="arrow" src="/assets/icons/right_arrow.svg" alt="" />
                        </button>
                        ${n.map(t=>"number"==typeof t?H`<button class="pager-num ${this.page===t?"active":""}" @click=${()=>this._handlePageChange(t)} aria-label="Page ${t}">${t}</button>`:H`<span class="ellipsis">…</span>`)}
                        <button class="pager-btn next" @click=${()=>this._handlePageChange(this.page+1)} ?disabled=${this.page===s||0===t} aria-label="Next page">
                            <img class="arrow" src="/assets/icons/right_arrow.svg" alt="" />
                        </button>
                    </div>
                </div>
            </div>
            <confirm-dialog></confirm-dialog>
        `}});customElements.define("employee-form",class extends rt{static properties={employee:{type:Object},mode:{type:String},errors:{type:Object}};async firstUpdated(){await ue(this.shadowRoot,[new URL("./employee-form.css",import.meta.url)])}t(t,e=[]){return ae(t,e)}constructor(){super(),this.mode="add",this.employee=this._createEmptyEmployee(),this.errors={},this.NAME_MAX=50,this.EMAIL_MAX=254,this.PHONE_MAX=15}async connectedCallback(){super.connectedCallback(),this._onLanguageChanged=()=>this.requestUpdate(),document.addEventListener("language-changed",this._onLanguageChanged);const t=window.location.pathname;if(t.startsWith("/edit/")){const e=decodeURIComponent(t.split("/").pop()||""),i=ce.getEmployeeById(e);i&&(this.mode="edit",this.employee={...i})}}disconnectedCallback(){document.removeEventListener("language-changed",this._onLanguageChanged),super.disconnectedCallback()}_createEmptyEmployee(){return{id:null,firstName:"",lastName:"",dateOfEmployment:"",dateOfBirth:"",phone:"",email:"",department:"",position:""}}_updateField(t,e){if(this.employee={...this.employee,[t]:e},this.errors[t]){const{[t]:e,...i}=this.errors;this.errors=i}}_sanitizeLetters(t){return(t||"").replace(/[^\p{L}\s]/gu,"")}_sanitizeDigits(t){return(t||"").replace(/\D/g,"")}_handleNameInput(t,e){let i=this._sanitizeLetters(e.target.value);if(i.length>this.NAME_MAX&&(i=i.slice(0,this.NAME_MAX)),this._updateField(t,i),i.length>=this.NAME_MAX)this.errors={...this.errors,[t]:this.t("validationMaxLength",[this.NAME_MAX])};else if(this.errors[t]&&/\d+/.test(this.errors[t])){const{[t]:e,...i}=this.errors;this.errors=i}}_handleNameKeydown(t){if(["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End","Enter"].includes(t.key))return;if(" "===t.key){return(t.target.value||"").length>=this.NAME_MAX?void t.preventDefault():void 0}if(t.key&&1===t.key.length&&!/\p{L}/u.test(t.key))return void t.preventDefault();(t.target.value||"").length>=this.NAME_MAX&&t.preventDefault()}_handleNamePaste(t,e){e.preventDefault();const i=(e.clipboardData||window.clipboardData)?.getData("text")||"";let s=this._sanitizeLetters(i);const n=e.target.value||"",r=e.target.selectionStart??n.length,o=e.target.selectionEnd??n.length,a=(n.slice(0,r)+s+n.slice(o)).slice(0,this.NAME_MAX);e.target.value=a,this._updateField(t,a),a.length>=this.NAME_MAX&&(this.errors={...this.errors,[t]:this.t("validationMaxLength",[this.NAME_MAX])})}_handlePhoneInput(t){const e=this._sanitizeDigits(t.target.value);this._updateField("phone",e)}_handlePhoneKeydown(t){if(["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End","Enter"].includes(t.key))return;if(t.key&&1===t.key.length&&!/[0-9]/.test(t.key))return void t.preventDefault();(this.employee.phone||"").length>=this.PHONE_MAX&&(t.preventDefault(),this.errors={...this.errors,phone:this.t("validationMaxDigits",[this.PHONE_MAX])})}_handlePhonePaste(t){t.preventDefault();const e=(t.clipboardData||window.clipboardData)?.getData("text")||"",i=this._sanitizeDigits(e),s=this.employee.phone||"",n=t.target.value||"",r=t.target.selectionStart??n.length,o=t.target.selectionEnd??n.length,a=(s.slice(0,r)+i+s.slice(o)).replace(/\D/g,"").slice(0,this.PHONE_MAX);this._updateField("phone",a),a.length>=this.PHONE_MAX&&(this.errors={...this.errors,phone:this.t("validationMaxDigits",[this.PHONE_MAX])})}_formatPhoneDisplay(t){if(!t)return"";const e=t.slice(0,3),i=[];let s=t.slice(3);const n=[3,3,2,2,2];for(const t of n){if(!s)break;i.push(s.slice(0,t)),s=s.slice(t)}s&&i.push(s);return`${e?`(+${e})`:"+"}${i.length?" "+i.join(" "):""}`.trim()}_validate(){const t={},{firstName:e,lastName:i,dateOfEmployment:s,dateOfBirth:n,email:r,phone:o,department:a,position:h}=this.employee;return e?/^\p{L}+(?:[\s'-]\p{L}+)*$/u.test(e)||(t.firstName=this.t("validationLettersOnly")):t.firstName=this.t("validationRequired"),i?/^\p{L}+(?:[\s'-]\p{L}+)*$/u.test(i)||(t.lastName=this.t("validationLettersOnly")):t.lastName=this.t("validationRequired"),s||(t.dateOfEmployment=this.t("validationRequired")),n||(t.dateOfBirth=this.t("validationRequired")),r?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)?ce.isEmailUnique(r,"edit"===this.mode?this.employee.id:null)||(t.email=this.t("validationEmailUnique")):t.email=this.t("validationEmail"):t.email=this.t("validationRequired"),o?/^\d{10,15}$/.test(o)||(t.phone=this.t("validationPhone")):t.phone=this.t("validationRequired"),a||(t.department=this.t("validationRequired")),h||(t.position=this.t("validationRequired")),this.errors=t,0===Object.keys(t).length}_handleSubmit(t){if(t.preventDefault(),!this._validate())return;const e=this.shadowRoot.querySelector("confirm-dialog"),i="edit"===this.mode?this.t("editEmployee"):this.t("addNewEmployee"),s="edit"===this.mode?this.t("confirmUpdate"):this.t("confirmCreate");e.openWith({title:i,message:s,confirmText:this.t("proceed"),cancelText:this.t("cancel")});const n=()=>{if("edit"===this.mode)ce.updateEmployee(this.employee);else{const{id:t,...e}=this.employee;ce.addEmployee(e)}e.removeEventListener("confirm",n),se.go("/")};e.addEventListener("confirm",n)}_handleCancel(){se.go("/")}render(){const t="edit"===this.mode?this.t("editEmployee"):this.t("addNewEmployee");return H`
            <div class="page-title">${t}</div>
            <div class="form-container">
                <form @submit=${this._handleSubmit}>
                    <div class="field">
                        <label for="firstName">${this.t("firstName")}</label>
                        <input id="firstName" maxlength="50" .value=${this.employee.firstName} @keydown=${this._handleNameKeydown} @paste=${t=>this._handleNamePaste("firstName",t)} @input=${t=>this._handleNameInput("firstName",t)}>
                        ${this.errors.firstName?H`<span class="error-text">${this.errors.firstName}</span>`:""}
                    </div>

                    <div class="field">
                        <label for="lastName">${this.t("lastName")}</label>
                        <input id="lastName" maxlength="50" .value=${this.employee.lastName} @keydown=${this._handleNameKeydown} @paste=${t=>this._handleNamePaste("lastName",t)} @input=${t=>this._handleNameInput("lastName",t)}>
                        ${this.errors.lastName?H`<span class="error-text">${this.errors.lastName}</span>`:""}
                    </div>

                    <div class="field">
                        <label for="dateOfEmployment">${this.t("dateOfEmployment")}</label>
                        <input id="dateOfEmployment" type="date" .value=${this.employee.dateOfEmployment} @input=${t=>this._updateField("dateOfEmployment",t.target.value)}>
                        ${this.errors.dateOfEmployment?H`<span class="error-text">${this.errors.dateOfEmployment}</span>`:""}
                    </div>

                    <div class="field">
                        <label for="dateOfBirth">${this.t("dateOfBirth")}</label>
                        <input id="dateOfBirth" type="date" .value=${this.employee.dateOfBirth} @input=${t=>this._updateField("dateOfBirth",t.target.value)}>
                        ${this.errors.dateOfBirth?H`<span class="error-text">${this.errors.dateOfBirth}</span>`:""}
                    </div>

                    <div class="field">
                        <label for="phone">${this.t("phoneNumber")}</label>
                        <input id="phone" inputmode="numeric" .value=${this._formatPhoneDisplay(this.employee.phone)} @keydown=${this._handlePhoneKeydown} @paste=${this._handlePhonePaste} @input=${this._handlePhoneInput}>
                        ${this.errors.phone?H`<span class="error-text">${this.errors.phone}</span>`:""}
                    </div>

                    <div class="field">
                        <label for="email">${this.t("email")}</label>
                        <input id="email" type="email" maxlength="254" .value=${this.employee.email} @input=${t=>{let e=t.target.value||"";if(e.length>this.EMAIL_MAX&&(e=e.slice(0,this.EMAIL_MAX)),this._updateField("email",e),e.length>=this.EMAIL_MAX)this.errors={...this.errors,email:this.t("validationMaxLength",[this.EMAIL_MAX])};else if(this.errors.email&&/\d+/.test(this.errors.email)){const{email:t,...e}=this.errors;this.errors=e}}}>
                        ${this.errors.email?H`<span class="error-text">${this.errors.email}</span>`:""}
                    </div>

                    <div class="field">
                        <label for="department">${this.t("department")}</label>
                        <select id="department" .value=${this.employee.department} @change=${t=>this._updateField("department",t.target.value)}>
                            <option value="">${this.t("departmentPlaceholder")}</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Tech">Tech</option>
                        </select>
                        ${this.errors.department?H`<span class="error-text">${this.errors.department}</span>`:""}
                    </div>

                    <div class="field">
                        <label for="position">${this.t("position")}</label>
                        <select id="position" .value=${this.employee.position} @change=${t=>this._updateField("position",t.target.value)}>
                            <option value="">${this.t("positionPlaceholder")}</option>
                            <option value="Junior">Junior</option>
                            <option value="Medior">Medior</option>
                            <option value="Senior">Senior</option>
                        </select>
                        ${this.errors.position?H`<span class="error-text">${this.errors.position}</span>`:""}
                    </div>

                    <div class="actions">
                        <button type="submit" class="btn-primary">${this.t("save")}</button>
                        <button type="button" class="btn-secondary" @click=${this._handleCancel}>${this.t("cancel")}</button>
                    </div>
                </form>
            </div>
            <confirm-dialog></confirm-dialog>
        `}});customElements.define("language-selector",class extends rt{async firstUpdated(){await ue(this.shadowRoot,[new URL("./language-selector.css",import.meta.url)])}static properties={currentLocale:{type:String,state:!0}};constructor(){super(),this.currentLocale=document.documentElement.lang.startsWith("tr")?"tr":"en",this._onLanguageChanged=t=>{const e=document.documentElement.lang.startsWith("tr")?"tr":"en";this.currentLocale!==e&&(this.currentLocale=e)}}async connectedCallback(){super.connectedCallback(),document.addEventListener("language-changed",this._onLanguageChanged)}disconnectedCallback(){document.removeEventListener("language-changed",this._onLanguageChanged),super.disconnectedCallback()}async changeLocale(t){this.currentLocale!==t&&(document.documentElement.lang=t,await oe(),this.currentLocale=t,this.dispatchEvent(new CustomEvent("language-changed",{detail:{locale:t},bubbles:!0,composed:!0})))}render(){const t="tr"===this.currentLocale,e=t?"en":"tr",i=t?"Switch language to English":"Switch language to Turkish";return H`
            <button
                class="active"
                @click=${()=>this.changeLocale(e)}
                aria-label="${i}"
                title="${i}"
            >
                <img src="${t?"/assets/flags/us.png":"/assets/flags/tr.png"}" alt="${i}" class="flag-icon" />
            </button>
        `}});customElements.define("app-navbar",class extends rt{async firstUpdated(){await ue(this.shadowRoot,[new URL("./app-navbar.css",import.meta.url)])}_go(t){se.go(t)}render(){return H`
            <nav class="navbar">
                <div class="navbar-inner">
                    <button class="brand" @click=${()=>this._go("/")}
                        aria-label="ING Home" title="ING Home">
                        <img class="logo" src="${"/assets/ing_logo.webp"}" alt="ING" />
                        <span class="brand-text">ING</span>
                    </button>

                    <div class="spacer"></div>

                    <div class="nav-actions">
                        <button class="link" @click=${()=>this._go("/")}>Employees</button>
                        <button class="text-button" @click=${()=>this._go("/add")}>
                            <span class="plus" aria-hidden="true">+</span>
                            <span>Add New</span>
                        </button>
                        <language-selector></language-selector>
                    </div>
                </div>
            </nav>
        `}});class pe extends rt{static get styles(){return r`
            :host {
                display: block;
                min-height: var(--min-height-screen);
                background-color: var(--color-background-light);
            }
            .title {
                max-width: var(--container-max-width);
                margin: var(--spacing-l) auto var(--spacing-s) auto;
                padding: 0 var(--spacing-xl);
                color: var(--color-primary);
                font-size: var(--font-size-large);
                font-weight: 600;
            }
            main {
                max-width: var(--container-max-width);
                margin: var(--spacing-none) auto;
                padding: var(--spacing-none) var(--spacing-xl);
            }
        `}async firstUpdated(){await oe();const t=this.shadowRoot.querySelector("main");new se(t).setRoutes([{path:"/",component:"employee-list"},{path:"/add",component:"employee-form"},{path:"/edit/:id",component:"employee-form"},{path:"(.*)",component:"app-not-found",action:async()=>{if(!customElements.get("app-not-found")){class t extends rt{render(){return H`<h1>404 | Not Found</h1>`}}customElements.define("app-not-found",t)}}}])}render(){return H`
            <app-navbar></app-navbar>
            <main></main>
        `}}customElements.define("app-root",pe);export{pe as AppRoot};
