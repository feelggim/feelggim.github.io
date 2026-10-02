# 백화여자예술대학교 — Rainbow : 멜팅다운

오메가버스 · GL · 캠퍼스 다크로맨스 「Rainbow : 멜팅다운」의 무대가 되는 가상의 학교, 백화여자예술대학교 홈페이지입니다.
등장하는 학교·기관·인물은 모두 허구이며, 작품은 성인 대상(R19)입니다.

## 올리는 법 (GitHub Pages)
1. 이 폴더 안의 파일을 그대로 저장소 최상단에 올립니다. (`index.html`, `img/`, `ost.mp3`, `.nojekyll`)
2. 저장소 **Settings → Pages → Build and deployment**에서 Source를 `Deploy from a branch`, Branch를 `main` / `(root)`로 저장합니다.
3. 1~2분 뒤 `https://<아이디>.github.io/<저장소이름>/` 에서 열립니다.

## 올린 뒤 꼭 바꿀 것
- **크랙 링크**: `index.html`에서 `var CRACK_URL="";` 를 찾아 따옴표 안에 크랙 캐릭터 주소를 넣으면 「크랙에서 플레이하기」 버튼이 켜집니다.
- **공유 미리보기 이미지**: 카카오톡·디스코드 미리보기는 절대 주소가 필요합니다. `og:image` 의 `img/og.jpg` 를
  `https://<아이디>.github.io/<저장소이름>/img/og.jpg` 로 바꿔 주세요.

## 구성
- `index.html` — 페이지 전체 (jQuery 3.7.1, Google Fonts는 CDN으로 불러옴)
- `img/` — 교표, 캠퍼스·건물 이미지, 사계 캐릭터, 공유용 이미지(`og.jpg`)
- `ost.mp3` — 배경음악. 입장 화면의 알약을 누르면 재생됩니다.
