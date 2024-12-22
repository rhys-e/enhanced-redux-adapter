"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});function q({sortComparer:u,IdProp:h=f=>{if(!f.id)throw new Error("Entity ID is required");return"id"}}={}){function f(i){return i[h(i)]}function g(i){return{ids:[],entities:{},metadata:i}}function E(i,n,e){const d=f(e),c=[...i.ids];return c.splice(n,0,d),i.ids=c,i.entities[d]=e,u&&(i.ids=i.ids.sort((s,t)=>u(i.entities[s],i.entities[t]))),i}function v(i,n,e){const d=[...i.ids];return[d[n],d[e]]=[d[e],d[n]],i.ids=d,u&&(i.ids=i.ids.sort((c,s)=>u(i.entities[c],i.entities[s]))),i}function A(i,n,e){const d=Object.values(i.entities).find(r=>r!==void 0&&n(r)),c=Object.values(i.entities).find(r=>r!==void 0&&e(r));if(!d||!c)return i;const s=i.ids.indexOf(f(d)),t=i.ids.indexOf(f(c)),o=v(i,s,t);return u&&(o.ids=o.ids.sort((r,T)=>u(o.entities[r],o.entities[T]))),o}function I(i,n,e){const d=[...i.ids],[c]=d.splice(n,1);return d.splice(e,0,c),i.ids=d,u&&(i.ids=i.ids.sort((s,t)=>u(i.entities[s],i.entities[t]))),i}function M(i,n){return i.metadata={...i.metadata,...n},i}function S(i,n,e){const d=i.entities[n];if(!d)return i;const c=JSON.parse(JSON.stringify(d));return c[h(c)]=e,console.log("newEntity",c),l(i,c)}function l(i,n,e=!0){const d=f(n);return i.ids.push(d),i.entities[d]=n,u&&e&&(i.ids=i.ids.sort((c,s)=>u(i.entities[c],i.entities[s]))),i}function b(i,n){return n.forEach(e=>l(i,e,!1)),u&&(i.ids=i.ids.sort((e,d)=>u(i.entities[e],i.entities[d]))),i}function O(i,n,e=!0){const d=f(n);return i.entities[d]=n,i.ids.includes(d)||i.ids.push(d),u&&e&&(i.ids=i.ids.sort((c,s)=>u(i.entities[c],i.entities[s]))),i}function j(i,n){return n.forEach(e=>O(i,e,!1)),u&&(i.ids=i.ids.sort((e,d)=>u(i.entities[e],i.entities[d]))),i}function x(i,n){return i.ids=n.map(f),i.entities=n.reduce((e,d)=>(e[f(d)]=d,e),{}),u&&(i.ids=i.ids.sort((e,d)=>u(i.entities[e],i.entities[d]))),i}function w(i,n){const{[n]:e,...d}=i.entities;return i.ids=i.ids.filter(c=>c!==n),i.entities=d,i}function B(i,n){return n.forEach(e=>w(i,e)),i}function J(i){return i.ids=[],i.entities={},i}function y(i,n){const e=i.entities[n.id];return e&&(i.entities[n.id]={...e,...n.changes}),i}function N(i,n){return n.forEach(e=>y(i,e)),i}return{getInitialState:g,insertAt:E,insertManyAt:(i,n,e)=>e.reduce((d,c,s)=>E(d,n+s,c),i),swap:v,swapWhere:A,move:I,updateMetadata:M,duplicate:S,addOne:l,addMany:b,setOne:O,setMany:j,setAll:x,removeOne:w,removeMany:B,removeAll:J,updateOne:y,updateMany:N,getSelectors:()=>({selectIds:i=>i.ids,selectEntities:i=>i.entities,selectAll:i=>i.ids.map(n=>i.entities[n]),selectTotal:i=>i.ids.length,selectById:(i,n)=>i.entities[n],selectMetadata:i=>i.metadata})}}exports.createEnhancedAdapter=q;