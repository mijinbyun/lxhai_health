'use strict';

const MAIN_ROUTES=new Set(['home','checkup','program','body','mind','walk','culture','ai','sos','manager','climate']);
let routeDepth=Number(history.state?.lxhaiDepth||0);

function routeHash(){
  const raw=decodeURIComponent(location.hash.slice(1)||'home');
  const [section,id]=raw.split('/');
  renderStage2Nav();

  if(['checkup','hospital','exam','dict'].includes(section)&&!healthDataReady()){
    view.innerHTML=healthLoadingView();
    ensureHealthData().then(routeHash).catch(()=>{view.innerHTML='<div class="empty">검진 정보를 불러오지 못했습니다.<br>인터넷 연결을 확인하고 다시 시도해 주세요.</div>'});
    return;
  }

  if(MAIN_ROUTES.has(raw)){
    page=raw;
    render();
    window.scrollTo(0,0);
    return;
  }

  if(section==='checkup'&&id==='prepare'){
    page='checkup';
    view.innerHTML=prepareView();
    window.scrollTo(0,0);
    return;
  }

  if(section==='checkup'&&id==='age'){
    page='checkup';
    view.innerHTML=ageView();
    window.scrollTo(0,0);
    return;
  }

  if(section==='preview'&&id&&features[id]==='preview'){
    previewView(id);
    return;
  }

  if(section==='hospital'&&id&&hospitalDetail(id))return;
  if(section==='program'&&id&&programDetail(id))return;
  if(section==='exam'&&id){examGuideDetail(id);return;}
  if(section==='dict'&&id){dictionaryDetail(id);return;}
  if(raw==='dict'){examGuideHome();return;}

  history.replaceState({lxhaiDepth:routeDepth},'',location.pathname+location.search+'#home');
  page='home';
  render();
}

function navigateHash(hash,{replace=false}={}){
  if(hash.replace(/^#/,'')==='home'&&page!=='home')pickHomeQuote();
  const target='#'+hash.replace(/^#/,'');
  if(location.hash===target){routeHash();return;}
  routeDepth=replace?routeDepth:routeDepth+1;
  history[replace?'replaceState':'pushState']({lxhaiDepth:routeDepth},'',location.pathname+location.search+target);
  routeHash();
}



window.addEventListener('click',event=>{
  const control=event.target.closest('button,a');
  if(!control)return;

  if(control.dataset.back){
    event.preventDefault();
    if(routeDepth>0)history.back();
    else navigateHash('home',{replace:true});
    return;
  }

  if(control.dataset.go){navigateHash(control.dataset.go);return;}
  if(control.dataset.guide){navigateHash('checkup/'+control.dataset.guide);return;}
  if(control.dataset.hospital){navigateHash('hospital/'+control.dataset.hospital);return;}
  if(control.dataset.realProgram){navigateHash('program/'+control.dataset.realProgram);return;}
  if(control.dataset.examGuide){navigateHash('exam/'+control.dataset.examGuide);return;}
  if(control.dataset.dictId){navigateHash('dict/'+control.dataset.dictId);return;}
  if(control.dataset.guideHome){navigateHash('dict');return;}
  if(control.dataset.climateOpen){climateSeason=control.dataset.climateOpen;navigateHash('climate');}
},true);

window.addEventListener('popstate',event=>{
  routeDepth=Number(event.state?.lxhaiDepth||0);
  routeHash();
});

if(!location.hash){
  history.replaceState({lxhaiDepth:0},'',location.pathname+location.search+'#home');
}else{
  history.replaceState({lxhaiDepth:0},'',location.href);
}
routeHash();
