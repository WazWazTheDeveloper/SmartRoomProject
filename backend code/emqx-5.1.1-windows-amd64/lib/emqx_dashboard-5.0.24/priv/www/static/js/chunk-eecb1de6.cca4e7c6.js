(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-eecb1de6"],{"1a19":function(e,t,n){},"1f75":function(e,t,n){"use strict";var r=n("c964"),c=(n("96cf"),n("d3b7"),n("6062"),n("3ca3"),n("ddb0"),n("caad"),n("2532"),n("ac1f"),n("00b4"),n("99af"),n("25f0"),n("bc3a")),o=n.n(c),a=n("2295"),u=n("f3f3"),l=(n("a9e3"),n("b6802"),n("159b"),n("3ef4")),i=n("e466"),s=n("2ef0"),d=n.n(s),b=25,f=function(e){var t=1e3*Number((e.length/b).toFixed(3));return t<3e3?3e3:t>8e3?8e3:t},p=function(e){var t=!e||Object(s["isString"])(e)||Object(s["isFunction"])(e)?{message:e}:e;return t},m=function(e){var t=p(e),n=t.message,r=t.duration,c=t.showClose,o=t.type,a=r||n&&f(n)||void 0,i=c||"error"===o;return Object(l["a"])(Object(u["a"])(Object(u["a"])({},e),{},{duration:a,showClose:i}))};i["d"].forEach((function(e){m[e]=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=p(t);return m(Object(u["a"])(Object(u["a"])({},n),{},{type:e}))}}));var O=m,j=n("323e"),v=n.n(j),g=(n("a5d8"),n("afbc")),h=n("0613"),w=n("2fc2"),V="BAD_TOKEN",k="TOKEN_TIME_OUT",C="BAD_USERNAME_OR_PWD",y=n("88c3");v.a.configure({showSpinner:!1,trickleSpeed:200});var B=new Set,N=function(){return B=new Set};Object.assign(o.a.defaults,{baseURL:"api/v5",timeout:2e4}),o.a.interceptors.request.use((function(e){var t=h["a"].state.user;return e.headers={Authorization:"Bearer "+t.token},e}),(function(e){Promise.reject(e)})),o.a.interceptors.request.use(function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.doNotTriggerProgress){e.next=4;break}return h["a"].state.request_queue||v.a.start(),e.next=4,h["a"].dispatch("SET_REQ_CHANGE",!0);case 4:return e.abrupt("return",t);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());var _=function(e,t){return 401===e&&[V,k].includes(t.code)};function x(){return S.apply(this,arguments)}function S(){return S=Object(r["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,h["a"].dispatch("SET_REQ_CHANGE",!1);case 2:t=h["a"].state.request_queue,t>0?v.a.inc():v.a.done();case 4:case"end":return e.stop()}}),e)}))),S.apply(this,arguments)}o.a.interceptors.response.use((function(e){return e.config.doNotTriggerProgress||x(),/\/trace\/.+\/download/.test(e.config.url)?e:e.data||e.status}),(function(e){if(e.config.doNotTriggerProgress||x(),e.response){var t=e.response,n=t.data,r=t.status;if(!B.has(r)){var c;B.add(r);var o=401===r&&h["a"].state.afterCurrentUserPwdChanged;if(_(r,n))return o?h["a"].commit("SET_AFTER_CURRENT_USER_PWD_CHANGED",!1):a["a"].error(y["a"].global.t("Base.tokenExpiredMsg")),Object(g["c"])(),window.setTimeout(N,1e3),Promise.reject(e);var u=(null===(c=e.config)||void 0===c?void 0:c.errorsHandleCustom)&&Array.isArray(e.config.errorsHandleCustom)&&e.config.errorsHandleCustom.includes(r);if(!u)if((null===n||void 0===n?void 0:n.code)===C)a["a"].error(y["a"].global.t("Base.namePwdError"));else if(null!==n&&void 0!==n&&n.code||null!==n&&void 0!==n&&n.message){var l,i,s;O.error("".concat(r," ").concat(null!==(l=null===n||void 0===n?void 0:n.code)&&void 0!==l?l:"",": ").concat(null!==(i=null===n||void 0===n||null===(s=n.message)||void 0===s?void 0:s.toString())&&void 0!==i?i:""))}else O.error(r+" Network error");401===r&&Object(g["c"])()}}else{var b=e.code===w["C"]&&e.config.handleTimeoutSelf;B.has(0)||(b||O.error(y["a"].global.t("Base.networkError")),B.add(0))}return 0===h["a"].state.request_queue&&(B=new Set),d.a.throttle(N,2e3,{trailing:!1}),Promise.reject(e)}));t["a"]=o.a},3093:function(e,t,n){"use strict";var r=n("f3f3"),c=(n("d81d"),n("4d63"),n("c607"),n("ac1f"),n("2c3e"),n("25f0"),n("a15b"),n("466d"),n("498a"),n("00b4"),n("9129"),n("a9e3"),n("d3b7"),n("7a23")),o={key:0,class:"single-unit"},a=Object(c["defineComponent"])({name:"InputWithUnit"}),u=Object(c["defineComponent"])(Object(r["a"])(Object(r["a"])({},a),{},{props:{modelValue:{type:String},units:{type:Array},defaultUnit:{type:String},disabled:{type:Boolean,default:!1},numberPlaceholder:{type:String,default:""},disabledOpt:{type:Object}},emits:["update:modelValue","change"],setup:function(e,t){var n,r=t.emit,a=e,u=null===(n=a.units)||void 0===n?void 0:n.map((function(e){return"string"===typeof e?{label:e,value:e}:{label:e.label,value:e.value}})),l=Object(c["computed"])((function(){return new RegExp("^(?<numberPart>\\d+(\\.\\d*)?)?(?<unit>".concat(null===u||void 0===u?void 0:u.map((function(e){var t=e.value;return t})).join("|"),")$"))})),i=Object(c["computed"])((function(){return new RegExp("^(?<numberPart>.*)(?<unit>".concat(null===u||void 0===u?void 0:u.map((function(e){var t=e.value;return t})).join("|"),")$"))})),s=/^-?\d+(\.\d+)?$/,d=/^(\.|\.\d+|\d+\.)$/,b=Object(c["computed"])((function(){if("string"===typeof a.modelValue)return a.modelValue.match(l.value)})),f=Object(c["computed"])((function(){if("string"===typeof a.modelValue)return a.modelValue.match(i.value)})),p=Object(c["computed"])({get:function(){var e,t,n=a.disabledOpt;if(n&&a.modelValue===n.value)return"0";var r=(null===(e=b.value)||void 0===e?void 0:e.groups)||(null===(t=f.value)||void 0===t?void 0:t.groups)||{},c=r.numberPart,o=void 0===c?"":c;return o.trim()||""},set:function(e){var t=e;if(s.test(t)||d.test(t))s.test(t)&&(t=parseFloat(t).toString());else{var n=parseFloat(t);t=Number.isNaN(n)?"":n.toString()}var r=""===t||void 0===t||null===t;r&&(m.value=O.value),j.value=r?"":t+O.value}}),m=Object(c["ref"])(""),O=Object(c["computed"])({get:function(){var e,t,n=a.disabledOpt;if(n&&a.modelValue===n.value)return n.value;var r=(null===(e=b.value)||void 0===e?void 0:e.groups)||(null===(t=f.value)||void 0===t?void 0:t.groups)||{},c=r.unit,o=void 0===c?"":c;return""!==o?o:!a.modelValue&&u&&u.length>0?m.value?m.value:a.defaultUnit&&u.some((function(e){var t=e.value;return t===a.defaultUnit}))?a.defaultUnit:u[0].value:""},set:function(e){var t=a.disabledOpt;t?a.modelValue===t.value?j.value="0".concat(e):j.value=e:p.value?j.value=(p.value||"")+e:(m.value=e,j.value="")}}),j=Object(c["computed"])({get:function(){return a.modelValue||""},set:function(e){r("update:modelValue",e)}});return function(t,n){var r=Object(c["resolveComponent"])("el-option"),a=Object(c["resolveComponent"])("el-select"),l=Object(c["resolveComponent"])("el-input");return Object(c["openBlock"])(),Object(c["createBlock"])(l,{class:"input-with-unit",modelValue:Object(c["unref"])(p),"onUpdate:modelValue":n[2]||(n[2]=function(e){return Object(c["isRef"])(p)?p.value=e:null}),disabled:e.disabled,readonly:e.disabledOpt&&Object(c["unref"])(O)===e.disabledOpt.value,onChange:n[3]||(n[3]=function(e){return t.$emit("change")}),placeholder:e.numberPlaceholder},{append:Object(c["withCtx"])((function(){return[Object(c["unref"])(u)&&1===Object(c["unref"])(u).length?(Object(c["openBlock"])(),Object(c["createElementBlock"])("span",o,Object(c["toDisplayString"])(Object(c["unref"])(u)[0].label),1)):Object(c["createCommentVNode"])("",!0),Object(c["unref"])(u)&&Object(c["unref"])(u).length>1?(Object(c["openBlock"])(),Object(c["createBlock"])(a,{key:1,modelValue:Object(c["unref"])(O),"onUpdate:modelValue":n[0]||(n[0]=function(e){return Object(c["isRef"])(O)?O.value=e:null}),disabled:e.disabled,onChange:n[1]||(n[1]=function(e){return t.$emit("change")})},{default:Object(c["withCtx"])((function(){return[e.disabledOpt?(Object(c["openBlock"])(),Object(c["createBlock"])(r,{key:0,value:e.disabledOpt.value,label:e.disabledOpt.label.toString()},null,8,["value","label"])):Object(c["createCommentVNode"])("",!0),(Object(c["openBlock"])(!0),Object(c["createElementBlock"])(c["Fragment"],null,Object(c["renderList"])(Object(c["unref"])(u),(function(e){var t=e.label,n=e.value;return Object(c["openBlock"])(),Object(c["createBlock"])(r,{key:n,value:n,label:t},null,8,["value","label"])})),128))]})),_:1},8,["modelValue","disabled"])):Object(c["createCommentVNode"])("",!0)]})),_:1},8,["modelValue","disabled","readonly","placeholder"])}}}));n("6e3c");const l=u;t["a"]=l},"363a":function(e,t,n){},"3bd2":function(e,t,n){"use strict";var r=n("7a23");function c(e,t,n,c,o,a){var u=Object(r["resolveComponent"])("InputWithUnit");return Object(r["openBlock"])(),Object(r["createBlock"])(u,{class:"time-input-with-unit-select",modelValue:e.inputValue,"onUpdate:modelValue":t[0]||(t[0]=function(t){return e.inputValue=t}),units:e.unitList,disabled:e.disabled,"default-unit":e.defaultUnit,"number-placeholder":e.numberPlaceholder,onChange:t[1]||(t[1]=function(t){return e.$emit("change")})},null,8,["modelValue","units","disabled","default-unit","number-placeholder"])}n("4de4"),n("d3b7"),n("caad"),n("2532");var o=n("9d39"),a=n("3093"),u=Object(r["defineComponent"])({name:"TimeInputWithUnitSelect",components:{InputWithUnit:a["a"]},props:{modelValue:{type:String,default:""},disabled:{type:Boolean,default:!1},enabledUnits:{type:Array,default:function(){return["ms","s","m","h"]}},numberPlaceholder:{type:String,default:""},defaultUnit:{type:String}},setup:function(e,t){var n=Object(o["a"])("Base"),c=n.tl,a=n.t,u=[{value:"ms",label:c("milliseconds")},{value:"s",label:c("second")},{value:"m",label:c("minute")},{value:"h",label:c("hour")},{value:"d",label:a("Base.day",1)}],l=Object(r["computed"])({get:function(){return e.modelValue},set:function(e){t.emit("update:modelValue",e)}}),i=Object(r["computed"])((function(){return u.filter((function(t){var n=t.value;return e.enabledUnits.includes(n)}))}));return{inputValue:l,unitList:i}}}),l=n("6b0d"),i=n.n(l);const s=i()(u,[["render",c]]);t["a"]=s},"44ea":function(e,t,n){"use strict";var r=n("f3f3"),c=n("7a23"),o=function(e){return Object(c["pushScopeId"])("data-v-259d2746"),e=e(),Object(c["popScopeId"])(),e},a=o((function(){return Object(c["createElementVNode"])("i",{class:"iconfont icon-question"},null,-1)})),u=Object(c["defineComponent"])({name:"InfoTooltip"}),l=Object(c["defineComponent"])(Object(r["a"])(Object(r["a"])({},u),{},{props:{content:{type:String},popperClass:{type:String}},setup:function(e){var t=e,n=Object(c["computed"])((function(){return"info-tooltip ".concat(t.popperClass)}));return function(t,r){var o=Object(c["resolveComponent"])("el-tooltip");return Object(c["openBlock"])(),Object(c["createBlock"])(o,{effect:"dark","popper-class":Object(c["unref"])(n),placement:"top",content:e.content},Object(c["createSlots"])({default:Object(c["withCtx"])((function(){return[a]})),_:2},[t.$slots.content?{name:"content",fn:Object(c["withCtx"])((function(){return[Object(c["renderSlot"])(t.$slots,"content")]}))}:void 0]),1032,["popper-class","content"])}}})),i=(n("b63e"),n("f175"),n("6b0d")),s=n.n(i);const d=s()(l,[["__scopeId","data-v-259d2746"]]);t["a"]=d},"6e3c":function(e,t,n){"use strict";n("1a19")},7167:function(e,t,n){"use strict";n.r(t);var r=n("c964"),c=(n("96cf"),n("7a23")),o=n("5502"),a=n("9d39"),u=n("d89f"),l=n("df90"),i=n("3bd2"),s=n("ca39"),d=n("3ef4"),b={class:"flapping-detect app-wrapper"},f={key:1,class:"schema-form"},p=Object(c["defineComponent"])({setup:function(e){var t=Object(a["a"])("General"),n=t.t,p=t.tl,m=Object(c["ref"])(!1),O=Object(c["ref"])(!1),j=Object(o["b"])(),v=Object(c["ref"])({enable:!1,window_time:"1m",max_count:15,ban_time:"5m"}),g=function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,m.value=!0,e.next=4,Object(u["a"])();case 4:t=e.sent,v.value=t.flapping_detect,e.next=10;break;case 8:e.prev=8,e.t0=e["catch"](0);case 10:return e.prev=10,m.value=!1,e.finish(10);case 13:case"end":return e.stop()}}),e,null,[[0,8,10,13]])})));return function(){return e.apply(this,arguments)}}(),h=function(){var e=Object(r["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return O.value=!0,e.prev=1,e.next=4,Object(u["a"])();case 4:return t=e.sent,t.flapping_detect=v.value,e.next=8,Object(u["e"])(t);case 8:d["a"].success(n("Base.updateSuccess")),e.next=14;break;case 11:e.prev=11,e.t0=e["catch"](1),g();case 14:return e.prev=14,O.value=!1,e.finish(14);case 17:case"end":return e.stop()}}),e,null,[[1,11,14,17]])})));return function(){return e.apply(this,arguments)}}();return Object(c["onMounted"])(g),function(e,t){var n=Object(c["resolveComponent"])("el-skeleton"),r=Object(c["resolveComponent"])("el-switch"),o=Object(c["resolveComponent"])("el-form-item"),a=Object(c["resolveComponent"])("el-col"),u=Object(c["resolveComponent"])("el-row"),d=Object(c["resolveComponent"])("el-button"),g=Object(c["resolveComponent"])("el-form"),w=Object(c["resolveComponent"])("el-card");return Object(c["openBlock"])(),Object(c["createElementBlock"])("div",b,[Object(c["createVNode"])(w,null,{default:Object(c["withCtx"])((function(){return[m.value?(Object(c["openBlock"])(),Object(c["createBlock"])(n,{key:0,rows:12,animated:""})):(Object(c["openBlock"])(),Object(c["createElementBlock"])("div",f,[Object(c["createVNode"])(g,{ref:"flappingDetectForm",class:"configuration-form","label-position":"right","require-asterisk-position":"left","hide-required-asterisk":"","label-width":"zh"===Object(c["unref"])(j).state.lang?170:230,model:v.value,"validate-on-rule-change":!1,onKeyup:t[5]||(t[5]=Object(c["withKeys"])((function(e){return h()}),["enter"]))},{default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(u,null,{default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(a,{span:21,class:"custom-col"},{default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(o,{prop:"enable"},{label:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(l["a"],{label:Object(c["unref"])(p)("enableFlapping"),desc:Object(c["unref"])(p)("enableDesc")},null,8,["label","desc"])]})),default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(r,{modelValue:v.value.enable,"onUpdate:modelValue":t[0]||(t[0]=function(e){return v.value.enable=e})},null,8,["modelValue"])]})),_:1}),Object(c["createVNode"])(o,{prop:"window_time"},{label:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(l["a"],{label:Object(c["unref"])(p)("windowTime"),desc:Object(c["unref"])(p)("windowTimeDesc")},null,8,["label","desc"])]})),default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(i["a"],{modelValue:v.value.window_time,"onUpdate:modelValue":t[1]||(t[1]=function(e){return v.value.window_time=e}),"number-placeholder":"1","enabled-units":["m"]},null,8,["modelValue"])]})),_:1}),Object(c["createVNode"])(o,{prop:"max_count"},{label:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(l["a"],{label:Object(c["unref"])(p)("maxCount"),desc:Object(c["unref"])(p)("maxCountDesc")},null,8,["label","desc"])]})),default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(s["a"],{modelValue:v.value.max_count,"onUpdate:modelValue":t[2]||(t[2]=function(e){return v.value.max_count=e}),modelModifiers:{number:!0},"controls-position":"right",placeholder:"15",min:0},null,8,["modelValue"])]})),_:1}),Object(c["createVNode"])(o,{prop:"ban_time"},{label:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(l["a"],{label:Object(c["unref"])(p)("banTime"),desc:Object(c["unref"])(p)("banTimeDesc")},null,8,["label","desc"])]})),default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(i["a"],{modelValue:v.value.ban_time,"onUpdate:modelValue":t[3]||(t[3]=function(e){return v.value.ban_time=e}),"number-placeholder":"5","enabled-units":["m"]},null,8,["modelValue"])]})),_:1})]})),_:1})]})),_:1}),Object(c["createVNode"])(u,null,{default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(a,{span:24,class:"btn-col",style:Object(c["normalizeStyle"])(Object(c["unref"])(j).getters.configPageBtnStyle)},{default:Object(c["withCtx"])((function(){return[Object(c["createVNode"])(d,{type:"primary",loading:O.value,onClick:t[4]||(t[4]=function(e){return h()})},{default:Object(c["withCtx"])((function(){return[Object(c["createTextVNode"])(Object(c["toDisplayString"])(e.$t("Base.saveChanges")),1)]})),_:1},8,["loading"])]})),_:1},8,["style"])]})),_:1})]})),_:1},8,["label-width","model"])]))]})),_:1})])}}});const m=p;t["default"]=m},"8bc7":function(e,t,n){},9129:function(e,t,n){var r=n("23e7");r({target:"Number",stat:!0},{isNaN:function(e){return e!=e}})},"9d39":function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));n("99af");var r=n("47e2");function c(e){var t=Object(r["b"])(),n=t.t,c=function(t,r){return r?n("".concat(e,".").concat(t),r):n("".concat(e,".").concat(t))};return{t:n,tl:c}}},a865:function(e,t,n){"use strict";n("ac1f"),n("5319"),n("99af"),n("9911"),n("2ca0");var r=n("7a23"),c=n("7c5c"),o=n("5e38"),a=n.n(o),u={class:"toc-title"},l=["onClick"],i=Object(r["defineComponent"])({props:{content:String,showToc:{required:!1,type:Boolean,default:!1}},setup:function(e){var t=e,n=Object(r["ref"])(),o=new c["marked"].Renderer,i=Object(r["ref"])([]),s=function(e){var t=n.value;if(t){var r=document.getElementById(e);r&&r.scrollIntoView({behavior:"smooth"})}};t.showToc&&(o.heading=function(e,t){var n=e.toLowerCase().replace(/[^\w]+/g,"-");return t>1&&i.value.push({level:t,slug:n,title:e}),"<h".concat(t,' id="').concat(n,'">').concat(e,"</h").concat(t,">")}),o.link=function(e,t,n){if(null!==e&&void 0!==e&&e.startsWith("http"))return'<a href="'.concat(e,'" target="_blank" rel="noopener noreferrer">').concat(n,"</a>");window.scrollView=s;var r=null===e||void 0===e?void 0:e.replace("#","");return"<a onclick=\"scrollView('".concat(r,"')\">").concat(n,"</a>")};var d=function(e){return Object(c["marked"])(e,{renderer:o})},b=function(e){n.value.innerHTML=e?a()(d(e)):""};return Object(r["onMounted"])((function(){b(t.content)})),Object(r["onUnmounted"])((function(){window.scrollView=void 0})),Object(r["watch"])((function(){return t.content}),b),function(t,c){var o=Object(r["resolveComponent"])("el-col"),a=Object(r["resolveComponent"])("el-row");return Object(r["openBlock"])(),Object(r["createBlock"])(a,{class:"markdown-content",gutter:40},{default:Object(r["withCtx"])((function(){return[Object(r["createVNode"])(o,{span:e.showToc?18:24},{default:Object(r["withCtx"])((function(){return[Object(r["createElementVNode"])("div",{class:"markdown-content",ref_key:"containerEle",ref:n},null,512)]})),_:1},8,["span"]),e.showToc?(Object(r["openBlock"])(),Object(r["createBlock"])(o,{key:0,class:"toc-list",span:6},{default:Object(r["withCtx"])((function(){return[Object(r["createElementVNode"])("div",u,Object(r["toDisplayString"])(t.$t("Base.content")),1),(Object(r["openBlock"])(!0),Object(r["createElementBlock"])(r["Fragment"],null,Object(r["renderList"])(i.value,(function(e){return Object(r["openBlock"])(),Object(r["createElementBlock"])("li",{key:e.slug,class:Object(r["normalizeClass"])(["toc","level-".concat(e.level)])},[Object(r["createElementVNode"])("a",{class:"toc-item",onClick:function(t){return s(e.slug)}},Object(r["toDisplayString"])(e.title),9,l)],2)})),128))]})),_:1})):Object(r["createCommentVNode"])("",!0)]})),_:1})}}});const s=i;t["a"]=s},b63e:function(e,t,n){"use strict";n("8bc7")},b6b2:function(e,t,n){},ca39:function(e,t,n){"use strict";n("a9e3"),n("9129");var r=n("7a23"),c=Object(r["defineComponent"])({props:{modelValue:{type:[Number,String]}},emits:["update:modelValue"],setup:function(e,t){var n=t.emit,c=e,o=Object(r["computed"])({get:function(){var e=c.modelValue;return"string"===typeof e?Number.isNaN(Number(e))?void 0:Number(e):e},set:function(e){return n("update:modelValue",e)}}),a=Object(r["ref"])(!1),u=function(){return a.value=!0},l=function(){return a.value=!1};return function(e,t){var n=Object(r["resolveComponent"])("el-input-number");return Object(r["openBlock"])(),Object(r["createBlock"])(n,{modelValue:Object(r["unref"])(o),"onUpdate:modelValue":t[0]||(t[0]=function(e){return Object(r["isRef"])(o)?o.value=e:null}),class:Object(r["normalizeClass"])(["custom-input-number",{"is-focus":a.value}]),onFocus:u,onBlur:l},null,8,["modelValue","class"])}}});n("ec95");const o=c;t["a"]=o},d89f:function(e,t,n){"use strict";n.d(t,"b",(function(){return c})),n.d(t,"f",(function(){return o})),n.d(t,"a",(function(){return a})),n.d(t,"e",(function(){return u})),n.d(t,"d",(function(){return l})),n.d(t,"h",(function(){return i})),n.d(t,"c",(function(){return s})),n.d(t,"g",(function(){return d}));var r=n("1f75"),c=function(){return r["a"].get("/configs/log")},o=function(e){return r["a"].put("/configs/log",e)},a=function(){return r["a"].get("/configs/global_zone")},u=function(e){return r["a"].put("/configs/global_zone",e)},l=function(){return r["a"].get("telemetry/status")},i=function(e){return r["a"].put("telemetry/status",e)},s=function(){return r["a"].get("/configs/sysmon")},d=function(e){return r["a"].put("/configs/sysmon",e)}},df90:function(e,t,n){"use strict";var r=n("7a23"),c=n("a865"),o=n("44ea"),a=Object(r["defineComponent"])({props:{label:{type:String},desc:{type:String},descMarked:{type:Boolean,default:!1}},setup:function(e){return function(t,n){return Object(r["openBlock"])(),Object(r["createElementBlock"])(r["Fragment"],null,[Object(r["createElementVNode"])("span",null,Object(r["toDisplayString"])(e.label),1),Object(r["createVNode"])(o["a"],null,{content:Object(r["withCtx"])((function(){return[e.descMarked?(Object(r["openBlock"])(),Object(r["createBlock"])(c["a"],{key:1,content:e.desc},null,8,["content"])):(Object(r["openBlock"])(),Object(r["createElementBlock"])(r["Fragment"],{key:0},[Object(r["createTextVNode"])(Object(r["toDisplayString"])(e.desc),1)],64))]})),_:1})],64)}}});const u=a;t["a"]=u},ec95:function(e,t,n){"use strict";n("363a")},f175:function(e,t,n){"use strict";n("b6b2")}}]);