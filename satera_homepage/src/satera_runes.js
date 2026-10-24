// 사테라 마녀 문자 — 한글 자모 치환 문자 (Scroll 전용)
// 초성·중성·종성을 낱자로 풀어 한 줄로 적는다. 쌍자음 = 위 점 두 개, 종성 = 작게 + 아래 갈고리.
const SR_C={ // 자음 20x30 칸
 'ㄱ':'M3 6 Q10 3 17 6 Q19 8 16 12 L11 25 q-2 3 -5 1 M3 6 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0',
 'ㄴ':'M5 3 q-2 2 -1 5 L4 22 Q4 26 9 26 L16 26 q3 0 2 -4 l-2 1',
 'ㄷ':'M17 6 q-6 -3 -12 0 L4 24 Q10 28 17 24 M10 4 l1 -3',
 'ㄹ':'M3 5 H15 q2 0 2 2 V13 H5 q-2 0 -2 2 V24 q0 2 2 2 H17 q2 0 1 -3',
 'ㅁ':'M10 3 L18 15 L10 27 L2 15 Z M10 15 m-1.6 0 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0',
 'ㅂ':'M4 2 V26 H16 V2 M4 14 H16 M4 2 l-2 -1 M16 2 l2 -1',
 'ㅅ':'M10 3 Q6 14 3 26 M10 3 Q14 14 17 26 M10 3 V0 M3 26 l-2 1 M17 26 l2 1',
 'ㅇ':'M2 15 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M10 15 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0',
 'ㅈ':'M2 5 Q10 2 18 5 M10 4 Q6 15 3 26 M10 4 Q14 15 17 26',
 'ㅊ':'M10 0 V3 M2 6 Q10 3 18 6 M10 5 Q6 15 3 26 M10 5 Q14 15 17 26 M10 15 m-1.3 0 a1.3 1.3 0 1 0 2.6 0 a1.3 1.3 0 1 0 -2.6 0',
 'ㅋ':'M3 6 Q10 3 17 6 Q19 8 16 12 L11 25 q-2 3 -5 1 M4 15 H15',
 'ㅌ':'M17 5 q-6 -3 -13 0 V25 Q10 28 17 25 M4 15 H14 M17 25 l1 2',
 'ㅍ':'M2 5 H18 M2 25 H18 M7 5 Q4 15 6 25 M13 5 Q16 15 14 25',
 'ㅎ':'M7 1 H13 M2 7 Q10 4 18 7 M4 19 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M10 19 l0 0.1'
};
const SR_V={ // 기본 모음: 기둥 + 가시
 'ㅏ':'M10 2 V28 M10 14 q4 -1 7 -5 M10 2 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0',
 'ㅑ':'M10 2 V28 M10 10 q4 -1 7 -5 M10 18 q4 -1 7 -5',
 'ㅓ':'M10 2 V28 M10 14 q-4 -1 -7 -5 M10 28 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0',
 'ㅕ':'M10 2 V28 M10 10 q-4 -1 -7 -5 M10 18 q-4 -1 -7 -5',
 'ㅗ':'M1 20 H19 M10 20 q-1 -6 -5 -10 M1 20 l-1 2 M19 20 l1 2',
 'ㅛ':'M1 20 H19 M7 20 q-1 -6 -4 -10 M13 20 q-1 -6 -4 -10',
 'ㅜ':'M1 10 H19 M10 10 q1 6 5 10 M1 10 l-1 -2 M19 10 l1 -2',
 'ㅠ':'M1 10 H19 M7 10 q1 6 4 10 M13 10 q1 6 4 10',
 'ㅡ':'M1 15 Q10 12 19 15 M1 15 m-1.3 0 a1.3 1.3 0 1 0 2.6 0 M19 15 m-1.3 0 a1.3 1.3 0 1 0 2.6 0',
 'ㅣ':'M10 3 V27 M10 3 l-2 -2 M10 3 l2 -2 M10 27 m-1.4 0 a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0'
};
const CHO=['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG=['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONG=['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const DBL={'ㄲ':'ㄱ','ㄸ':'ㄷ','ㅃ':'ㅂ','ㅆ':'ㅅ','ㅉ':'ㅈ'};
const VSPLIT={'ㅐ':'ㅏㅣ','ㅒ':'ㅑㅣ','ㅔ':'ㅓㅣ','ㅖ':'ㅕㅣ','ㅘ':'ㅗㅏ','ㅙ':'ㅗㅏㅣ','ㅚ':'ㅗㅣ','ㅝ':'ㅜㅓ','ㅞ':'ㅜㅓㅣ','ㅟ':'ㅜㅣ','ㅢ':'ㅡㅣ'};
const JSPLIT={'ㄳ':'ㄱㅅ','ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ','ㄺ':'ㄹㄱ','ㄻ':'ㄹㅁ','ㄼ':'ㄹㅂ','ㄽ':'ㄹㅅ','ㄾ':'ㄹㅌ','ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ','ㅄ':'ㅂㅅ'};
// 텍스트 → 토큰 [{t:'c'|'v'|'f'|'sp'|'gap', j, dbl}]
function srTokens(txt){const out=[];
  for(const ch of txt){const c=ch.charCodeAt(0);
    if(c>=0xAC00&&c<=0xD7A3){const s=c-0xAC00,ci=Math.floor(s/588),vi=Math.floor(s%588/28),fi=s%28;
      const cj=CHO[ci];out.push({t:'c',j:DBL[cj]||cj,dbl:!!DBL[cj]});
      for(const v of (VSPLIT[JUNG[vi]]||JUNG[vi]))out.push({t:'v',j:v});
      if(fi){const f=JONG[fi];const parts=JSPLIT[f]||f;
        if(DBL[parts])out.push({t:'f',j:DBL[parts],dbl:true});else for(const p of parts)out.push({t:'f',j:p})}
      out.push({t:'gap'})}
    else if(ch===' '){out.push({t:'sp'})}
    else if(/[.,!?…·]/.test(ch)){out.push({t:'dot'})}}
  return out}
function srCurl(x){return `<path d="M${x+2} 1 q-3 -3 0 -5 q3 -1 3 2" stroke-width="1.7"/>`}
// 토큰 → SVG
function srSVG(txt,{color='#e0601a',stroke=2.4,h=36,skew=-8}={}){
  const T=srTokens(txt);let x=4,p='';
  for(const k of T){
    if(k.t==='gap'){x+=7;continue} if(k.t==='sp'){p+=`<path d="M${x+6} 18 l4 -5 l4 5 l-4 5 Z"/>`;x+=24;continue}
    if(k.t==='dot'){p+=`<path d="M${x+2} 28 m-1.6 0 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0"/>`;x+=10;continue}
    const d=k.t==='v'?SR_V[k.j]:SR_C[k.j];if(!d)continue;
    if(k.t==='f'){p+=`<g transform="translate(${x} 9) scale(.62) translate(10 15) rotate(90) scale(1,-1) translate(-15 -10) scale(1.5 .667)"><path d="${d}"/></g><path d="M${x} 32 q6 3 12 0"/>`;
      if(k.dbl)p+=`<path d="M${x+3} 6 m-1 0 a1 1 0 1 0 2 0 M${x+9} 6 m-1 0 a1 1 0 1 0 2 0"/>`;x+=16;continue}
    p+=k.t==='c'?`<g transform="translate(${x} 2) translate(10 15) rotate(90) scale(1,-1) translate(-15 -10) scale(1.5 .667)"><path d="${d}"/></g>`+srCurl(x):`<g transform="translate(${x} 2)"><path d="${d}"/></g>`;
    if(k.dbl)p+=`<path d="M${x+6} 0 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0 M${x+14} 0 m-1.2 0 a1.2 1.2 0 1 0 2.4 0 a1.2 1.2 0 1 0 -2.4 0"/>`;
    x+=k.t==='v'&&/[ㅗㅛㅜㅠㅡ]/.test(k.j)?22:20}
  const W=x+4;
  return `<svg viewBox="-4 -8 ${W+6} 46" height="${h}" width="${((W+6)*h/46).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"><g transform="skewX(${skew})" transform-origin="0 18">${p}</g></svg>`}
if(typeof module!=='undefined')module.exports={srSVG,srTokens,SR_C,SR_V};
