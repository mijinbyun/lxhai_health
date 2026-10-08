'use strict';
let healthDataPromise=null;
function healthDataReady(){return typeof hospitalData!=='undefined'&&typeof examDictionary!=='undefined'}
function loadHealthDataScript(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error(src+' 로드 실패'));document.head.appendChild(script)})}
function ensureHealthData(){
  if(healthDataReady())return Promise.resolve();
  if(!healthDataPromise)healthDataPromise=Promise.all([
    loadHealthDataScript('hospital-data.js?v=20261008-c'),
    loadHealthDataScript('exam-dictionary-data.js?v=20261008-c')
  ]);
  return healthDataPromise;
}
function healthLoadingView(){return '<div class="loading-health" role="status"><span class="loading-spinner" aria-hidden="true"></span><strong>검진 정보를 불러오는 중</strong><p class="small">31개 검진기관과 검진항목을 준비하고 있어요.</p></div>'}
