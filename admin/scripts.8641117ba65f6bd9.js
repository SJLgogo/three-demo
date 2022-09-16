!function(_,g){"object"==typeof exports&&"object"==typeof module?module.exports=g():"function"==typeof define&&define.amd?define([],g):"object"==typeof exports?exports.ClipboardJS=g():_.ClipboardJS=g()}(this,function(){return function(){var L={686:function(l,c,t){"use strict";t.d(c,{default:function(){return J}});var a=t(279),f=t.n(a),s=t(370),h=t.n(s),y=t(817),m=t.n(y);function d(i){try{return document.execCommand(i)}catch(n){return!1}}var p=function(n){var e=m()(n);return d("cut"),e},k=function(n,e){var r=function E(i){var n="rtl"===document.documentElement.getAttribute("dir"),e=document.createElement("textarea");e.style.fontSize="12pt",e.style.border="0",e.style.padding="0",e.style.margin="0",e.style.position="absolute",e.style[n?"right":"left"]="-9999px";var r=window.pageYOffset||document.documentElement.scrollTop;return e.style.top="".concat(r,"px"),e.setAttribute("readonly",""),e.value=i,e}(n);e.container.appendChild(r);var o=m()(r);return d("copy"),r.remove(),o},A=function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body},r="";return"string"==typeof n?r=k(n,e):n instanceof HTMLInputElement&&!["text","search","url","tel","password"].includes(null==n?void 0:n.type)?r=k(n.value,e):(r=m()(n),d("copy")),r};function T(i){return(T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(i)}function S(i){return(S="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(i)}function P(i,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(i,r.key,r)}}function C(i,n){return(C=Object.setPrototypeOf||function(r,o){return r.__proto__=o,r})(i,n)}function I(i,n){return!n||"object"!==S(n)&&"function"!=typeof n?function z(i){if(void 0===i)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return i}(i):n}function x(i){return(x=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(i)}function O(i,n){var e="data-clipboard-".concat(i);if(n.hasAttribute(e))return n.getAttribute(e)}var Y=function(i){!function F(i,n){if("function"!=typeof n&&null!==n)throw new TypeError("Super expression must either be null or a function");i.prototype=Object.create(n&&n.prototype,{constructor:{value:i,writable:!0,configurable:!0}}),n&&C(i,n)}(e,i);var n=function H(i){var n=function U(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(i){return!1}}();return function(){var o,r=x(i);if(n){var u=x(this).constructor;o=Reflect.construct(r,arguments,u)}else o=r.apply(this,arguments);return I(this,o)}}(e);function e(r,o){var u;return function M(i,n){if(!(i instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),(u=n.call(this)).resolveOptions(o),u.listenClick(r),u}return function D(i,n,e){n&&P(i.prototype,n),e&&P(i,e)}(e,[{key:"resolveOptions",value:function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof o.action?o.action:this.defaultAction,this.target="function"==typeof o.target?o.target:this.defaultTarget,this.text="function"==typeof o.text?o.text:this.defaultText,this.container="object"===S(o.container)?o.container:document.body}},{key:"listenClick",value:function(o){var u=this;this.listener=h()(o,"click",function(b){return u.onClick(b)})}},{key:"onClick",value:function(o){var u=o.delegateTarget||o.currentTarget,b=this.action(u)||"copy",w=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=n.action,r=void 0===e?"copy":e,o=n.container,u=n.target,b=n.text;if("copy"!==r&&"cut"!==r)throw new Error('Invalid "action" value, use either "copy" or "cut"');if(void 0!==u){if(!u||"object"!==T(u)||1!==u.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===r&&u.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===r&&(u.hasAttribute("readonly")||u.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes')}return b?A(b,{container:o}):u?"cut"===r?p(u):A(u,{container:o}):void 0}({action:b,container:this.container,target:this.target(u),text:this.text(u)});this.emit(w?"success":"error",{action:b,text:w,trigger:u,clearSelection:function(){u&&u.focus(),window.getSelection().removeAllRanges()}})}},{key:"defaultAction",value:function(o){return O("action",o)}},{key:"defaultTarget",value:function(o){var u=O("target",o);if(u)return document.querySelector(u)}},{key:"defaultText",value:function(o){return O("text",o)}},{key:"destroy",value:function(){this.listener.destroy()}}],[{key:"copy",value:function(o){var u=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{container:document.body};return A(o,u)}},{key:"cut",value:function(o){return p(o)}},{key:"isSupported",value:function(){var o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],u="string"==typeof o?[o]:o,b=!!document.queryCommandSupported;return u.forEach(function(w){b=b&&!!document.queryCommandSupported(w)}),b}}]),e}(f()),J=Y},828:function(l){if("undefined"!=typeof Element&&!Element.prototype.matches){var t=Element.prototype;t.matches=t.matchesSelector||t.mozMatchesSelector||t.msMatchesSelector||t.oMatchesSelector||t.webkitMatchesSelector}l.exports=function a(f,s){for(;f&&9!==f.nodeType;){if("function"==typeof f.matches&&f.matches(s))return f;f=f.parentNode}}},438:function(l,c,t){var a=t(828);function f(y,m,d,v,p){var E=h.apply(this,arguments);return y.addEventListener(d,E,p),{destroy:function(){y.removeEventListener(d,E,p)}}}function h(y,m,d,v){return function(p){p.delegateTarget=a(p.target,m),p.delegateTarget&&v.call(y,p)}}l.exports=function s(y,m,d,v,p){return"function"==typeof y.addEventListener?f.apply(null,arguments):"function"==typeof d?f.bind(null,document).apply(null,arguments):("string"==typeof y&&(y=document.querySelectorAll(y)),Array.prototype.map.call(y,function(E){return f(E,m,d,v,p)}))}},879:function(l,c){c.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},c.nodeList=function(t){var a=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===a||"[object HTMLCollection]"===a)&&"length"in t&&(0===t.length||c.node(t[0]))},c.string=function(t){return"string"==typeof t||t instanceof String},c.fn=function(t){return"[object Function]"===Object.prototype.toString.call(t)}},370:function(l,c,t){var a=t(879),f=t(438);l.exports=function s(d,v,p){if(!d&&!v&&!p)throw new Error("Missing required arguments");if(!a.string(v))throw new TypeError("Second argument must be a String");if(!a.fn(p))throw new TypeError("Third argument must be a Function");if(a.node(d))return function h(d,v,p){return d.addEventListener(v,p),{destroy:function(){d.removeEventListener(v,p)}}}(d,v,p);if(a.nodeList(d))return function y(d,v,p){return Array.prototype.forEach.call(d,function(E){E.addEventListener(v,p)}),{destroy:function(){Array.prototype.forEach.call(d,function(E){E.removeEventListener(v,p)})}}}(d,v,p);if(a.string(d))return function m(d,v,p){return f(document.body,d,v,p)}(d,v,p);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}},817:function(l){l.exports=function c(t){var a;if("SELECT"===t.nodeName)t.focus(),a=t.value;else if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName){var f=t.hasAttribute("readonly");f||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),f||t.removeAttribute("readonly"),a=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var s=window.getSelection(),h=document.createRange();h.selectNodeContents(t),s.removeAllRanges(),s.addRange(h),a=s.toString()}return a}},279:function(l){function c(){}c.prototype={on:function(t,a,f){var s=this.e||(this.e={});return(s[t]||(s[t]=[])).push({fn:a,ctx:f}),this},once:function(t,a,f){var s=this;function h(){s.off(t,h),a.apply(f,arguments)}return h._=a,this.on(t,h,f)},emit:function(t){for(var a=[].slice.call(arguments,1),f=((this.e||(this.e={}))[t]||[]).slice(),s=0,h=f.length;s<h;s++)f[s].fn.apply(f[s].ctx,a);return this},off:function(t,a){var f=this.e||(this.e={}),s=f[t],h=[];if(s&&a)for(var y=0,m=s.length;y<m;y++)s[y].fn!==a&&s[y].fn._!==a&&h.push(s[y]);return h.length?f[t]=h:delete f[t],this}},l.exports=c,l.exports.TinyEmitter=c}},_={};function g(l){if(_[l])return _[l].exports;var c=_[l]={exports:{}};return L[l](c,c.exports,g),c.exports}return g.n=function(l){var c=l&&l.__esModule?function(){return l.default}:function(){return l};return g.d(c,{a:c}),c},g.d=function(l,c){for(var t in c)g.o(c,t)&&!g.o(l,t)&&Object.defineProperty(l,t,{enumerable:!0,get:c[t]})},g.o=function(l,c){return Object.prototype.hasOwnProperty.call(l,c)},g(686)}().default});