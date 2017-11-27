define(["exports","jquery","text!../oauth/app_id.json","common/util"],function(a,b,c){"use strict";function d(a){return a&&a.__esModule?a:{"default":a}}Object.defineProperty(a,"__esModule",{value:!0}),a.sell_expired=a.is_authenticated=a.send=a.cached=a.switch_account=a.execute=a.proposal_open_contract=a.events=a.invalidate=a.app_id=void 0;var e=d(b),f=d(c),g=!1,h=null,i=!1,j={},k=function(){var a=JSON.parse(f["default"]),b=local_storage.get("config"),c=b&&b.app_id||"";if(!c){var d=window.location.href;for(var e in a)if(0==d.lastIndexOf(e,0)){c=a[e];break}}return c},l=a.app_id=k(),m=function(){var a=local_storage.get("config"),b=(local_storage.get("i18n")||{value:"en"}).value,c=(a&&a.websocket_url||"wss://frontend.binaryws.com/websockets/v3?l="+b)+"&app_id="+l,d=new WebSocket(c);return d.addEventListener("open",v),d.addEventListener("close",o),d.addEventListener("message",w),d.addEventListener("error",function(){e["default"].growl.error({message:"Connection error.".i18n()}),o()}),d},n=!1,o=function(){require(["windows/tracker"],function(a){var b=a.get_trade_dialogs(),c=a.get_unique_dialogs();g=!1,D("logout"),n||(n=!0,setTimeout(function(){n=!1,h=m(),local_storage.get("oauth")&&Q.cached.authorize().then(function(){a.reopen_trade_dialogs(b),setTimeout(function(){return a.reopen_unique_dialogs(c)},0)})},1e3))})},p={},q=[],r=[],s={},t={},u=function(){return h&&1===h.readyState},v=function(){for(h.send(JSON.stringify({website_status:1,subscribe:1}));r.length>0;){var a=r.shift();s[a.req_id]||h.send(JSON.stringify(a))}for(var b in s){var c=s[b];c&&(c.sent_before?c.reject({message:"Connection closed.".i18n()}):(c.sent_before=!0,h.send(JSON.stringify(c.data))))}for(;q.length>0;)q.shift()()},w=function(a){var b=JSON.parse(a.data);p[b.msg_type]=p[b.msg_type]||[];for(var c=function(a){var c=p[b.msg_type][a];setTimeout(function(){return c(b)},0)},d=0;d<p[b.msg_type].length;d++)c(d);var e=b.req_id,f=s[e]||j[e];f&&(delete s[e],delete j[e],b.error?(b.error.echo_req=b.echo_req,b.error.req_id=b.req_id,f.reject(b.error)):f.resolve(b))};h=m();var x=function(a){for(var b in{balance:1,statement:1,profit_table:1,portfolio:1,proposal_open_contract:1,buy:1,sell:1,get_self_exclusion:1,set_self_exclusion:1})if(b in a)return!0;return!1},y=0,z=function(a){return a.req_id=++y,new Promise(function(b,c){return i?(s[a.req_id]={resolve:b,reject:c,data:a},void(u()?h.send(JSON.stringify(a)):r.push(a))):void(j[a.req_id]={resolve:b,reject:c,data:a})})},A=function(a){var b=!1,c={authorize:a},d=JSON.stringify(c),e=z(c);return e.then(function(a){g=!0,local_storage.set("authorize",a.authorize);var f=-1!==a.authorize.landing_company_name.indexOf("japan");if(f||D("login",a),local_storage.get("oauth-login")){var h=local_storage.get("oauth-login").value;local_storage.remove("oauth-login"),h&&!f&&D("oauth-login",a)}return b=!0,t[d]={data:c,promise:e},a})["catch"](function(a){throw"SelfExclusion"===a.code||b||(g=!1,D("logout"),local_storage.remove("oauth")),delete t[d],a})},B=a.invalidate=function(){local_storage.remove("oauth"),local_storage.remove("authorize"),D("reset_realitycheck"),D("reset_accountstatus"),Q.send({logout:1})["catch"](function(a){e["default"].growl.error({message:a.message}),h.close()});for(var a in t)(x(t[a].data)||"authorize"in t[a].data)&&delete t[a];g=!1},C=function(a){if(g)return z(a);var b=z.bind(null,a);if(local_storage.get("oauth")){var c=local_storage.get("oauth"),d=c[0].token;return A(d).then(b)}return Promise.reject({message:"Please log in".i18n()})},D=function(a){for(var b=arguments.length,c=Array(b>1?b-1:0),d=1;b>d;d++)c[d-1]=arguments[d];var e=p[a]||[];e.forEach(function(a){setTimeout(function(){return a.apply(void 0,c)},0)})},E=function(a,b){setTimeout(function(){var b=s[a];b&&(delete s[a],b.reject({message:"Timeout for websocket request".i18n()}))},b)},F={},G={},H={},I=a.events={on:function(a,b){return(p[a]=p[a]||[]).push(b),b},off:function(a,b){if(p[a]){var c=p[a].indexOf(b);-1!==c&&p[a].splice(c,1)}},on_till:function(a,b){var c=function d(){var c=b.apply(void 0,arguments);c&&Q.events.off(a,d)};Q.events.on(a,c)}},J=a.proposal_open_contract={subscribe:function(a){if(G[a]&&G[a].subscribers>0)return G[a].subscribers++,G[a].promise;var b=Q.send({proposal_open_contract:1,contract_id:a,subscribe:1}).then(function(b){return G[a].stream_id=b.proposal_open_contract.id,b})["catch"](function(b){throw G[a]=void 0,b});return G[a]={subscribers:1,promise:b},b},forget:function R(a){var b=G[a],R=H[a];if(!b)return R||Promise.resolve();if(0==b.subscribers)return R;if(b.subscribers--,b.subscribers>0)return Promise.resolve();var c=function(){return G[a]=void 0,Q.send({forget:b.stream_id})["catch"](function(b){throw H[a]=void 0,b}).then(function(b){return H[a]=void 0,b})};return H[a]=b.stream_id?c():b.promise["catch"](function(){}).then(function(){return b.stream_id?c():void 0}),H[a]}},K=a.execute=function(a){u()?setTimeout(a,0):q.push(a)},L=a.switch_account=function(a){var b=local_storage.get("oauth");if(!b)return Promise.reject({message:"Account token not found.".i18n()});var c=b.map(function(a){return a.id}).indexOf(a);if(-1===c)return promise.reject({message:"Account id not found.".i18n()});var d=b[c];b.splice(c,1),b.unshift(d),local_storage.set("oauth",b);for(var e in t)(x(t[e].data)||"authorize"in t[e].data)&&delete t[e];return g=!1,Q.send({forget_all:"transaction"})["catch"](function(a){return void 0}),Q.send({forget_all:"balance"})["catch"](function(a){return void 0}),Q.cached.authorize().then(function(a){return D("switch_account",a)})},M=a.cached={send:function(a){var b=JSON.stringify(a);return t[b]?t[b].promise:(t[b]={data:a,promise:null},t[b].promise=Q.send(a).then(function(a){return a},function(a){throw delete t[b],a}))},authorize:function(a){var b=local_storage.get("oauth"),c=b&&b[0]&&b[0].token,d=JSON.stringify({authorize:c});return g&&c&&t[d]&&!a?t[d].promise:c?A(c):Promise.reject("Please log in.".i18n())}},N=a.send=function(a,b){if(a&&x(a))return C(a);var c=z(a);return b&&E(a.req_id,b),c},O=a.is_authenticated=function(){return g},P=a.sell_expired=function(a){var b=(new Date).getTime()/1e3|0;a=a||b+1,!F[a]&&1*a>b&&(F[a]=setTimeout(function(){F[a]=void 0,Q.send({sell_expired:1})["catch"](function(a){return void 0})},1e3*(a+2-b)))},Q={events:I,proposal_open_contract:J,execute:K,switch_account:L,cached:M,send:N,is_authenticated:O,sell_expired:P,invalidate:B,app_id:l};Q.events.on("website_status",function(a){if(i=a.website_status&&"up"===a.website_status.site_status.toLowerCase())for(var b in j)j[b].is_sent||(h.send(JSON.stringify(j[b].data)),j[b].is_sent=1)}),Q.events.on("login",function(){Q.send({transaction:1,subscribe:1})["catch"](function(a){return void 0}),Q.send({balance:1,subscribe:1})["catch"](function(a){return void 0})}),Q.events.on("logout",function(){Q.send({forget_all:"transaction"})["catch"](function(a){return void 0}),Q.send({forget_all:"balance"})["catch"](function(a){return void 0})}),a["default"]=Q});