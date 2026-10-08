'use strict';

function checkup(){
  return head('검진기관 찾기')+
    `<div class="notice"><strong>AI 건강검진 사후관리</strong><br><span class="small">사내 업무망에서 이용할 수 있어요. 접속 방법은 소속 보건관리자에게 문의하세요.</span></div>`+
    `<div class="inline" style="margin-bottom:14px"><button class="btn secondary" data-guide="prepare">검진 전 체크리스트</button><button class="btn secondary" data-guide="age">나이별 검진 가이드</button></div>`+
    `<div class="notice">2026년 선정기관 · 31개 기관<br><span class="small">31개 제안서의 A/B/C형 항목표와 원문 출처를 연결했습니다.</span></div>`+
    `<button class="exam-entry" data-guide-home="1"><strong>검진항목 쉽게 알기</strong><span>검사 설명을 보고, 제공 기관까지 찾아보세요.</span></button>`+
    `<div class="fields"><label>지역<select id="real-region"><option>전체</option>${[...new Set(hospitalData.map(h=>h.region))].map(r=>`<option>${esc(r)}</option>`).join('')}</select></label><label>검진유형<select id="real-type"><option value="C">C형 · 166,000원</option><option value="B">B형 · 266,000원</option><option value="A">A형 · 366,000원</option></select></label><label>관심검사<input id="real-exam" placeholder="예: 갑상선, 대장, MRA"></label><button class="btn" id="real-search">기관 찾기</button></div>`+
    `<p class="meta">원문 값은 기본 포함·선택 가능·제공 안 함·미기재·성별 제한·확인 필요로 구분했습니다. 선택 묶음과 별도 비용은 원문 및 기관 안내를 확인하세요.</p><div id="real-results"></div><button class="btn secondary" id="real-compare">선택 기관 비교</button><div id="real-comparison"></div>`;
}

function itemTable(h){
  if(!h.items.length)return '<div class="empty">항목표 준비 중입니다.</div>';
  return `<div style="overflow:auto"><table style="font-size:14px;width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left">검사 항목</th>${['C','B','A'].map(t=>`<th>${t}형</th>`).join('')}</tr></thead><tbody>${h.items.map(i=>{const g=guideForItem(i.name);return `<tr><td style="padding:12px 5px;border-bottom:1px solid var(--line)">${esc(i.name)}${g?`<button class="exam-inline" data-exam-guide="${g.id}" aria-label="${esc(i.name)} 쉽게 알아보기">쉽게 알아보기</button>`:''}<div class="meta">${esc(i.source)}</div>${i.notes?.length?`<div class="meta">비고: ${i.notes.map(esc).join(' / ')}</div>`:''}</td>${['C','B','A'].map(t=>`<td style="min-width:100px;padding:8px;border-bottom:1px solid var(--line)">${esc(i.types[t].status)}<div class="meta">原 ${esc(i.types[t].raw)}</div></td>`).join('')}</tr>`}).join('')}</tbody></table></div>`;
}

function renderStage2Nav(){
  const section=(location.hash.slice(1)||page||'home').split('/')[0];
  const health=['checkup','hospital','exam','dict','body','mind','climate'].includes(section);
  nav.className='nav-four';
  nav.innerHTML=[['home','홈'],['checkup','건강'],['program','프로그램'],['ai','AI']].map(([k,n])=>`<button class="navbtn ${(section===k||(k==='checkup'&&health))?'active':''}" data-go="${k}" ${(section===k||(k==='checkup'&&health))?'aria-current="page"':''}>${icon(k)}${n}</button>`).join('');
}

function render(){
  view.innerHTML=({home,program,checkup,body,mind,walk,culture,sos,ai,manager,climate}[page]||home)();
  renderStage2Nav();
}
