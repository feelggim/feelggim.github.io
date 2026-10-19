# My Precious : 마이프레셔스

크랙 작품 「MY PRECIOUS」 소개 페이지.

## 올리는 법 (GitHub Pages)

1. 새 저장소를 만든다.
2. 이 폴더의 파일을 **저장소 최상단**에 그대로 올린다.
   - `index.html`
   - `bgm.mp3`
   - `.nojekyll`
3. 저장소 → Settings → Pages → Source를 `Deploy from a branch`,
   Branch를 `main` / `/ (root)` 로 지정하고 저장한다.
4. 1~2분 뒤 `https://<아이디>.github.io/<저장소이름>/` 에서 열린다.

## 파일

| 파일 | 설명 |
|---|---|
| `index.html` | 페이지 전체. 글꼴·표지 이미지·스크립트가 전부 안에 들어 있다. |
| `bgm.mp3` | 배경음. `index.html`과 같은 폴더에 있어야 한다. |
| `jquery.min.js` | 페이지가 쓰는 라이브러리. 같은 폴더에 있어야 한다. |
| `.nojekyll` | GitHub Pages가 파일을 건드리지 않게 하는 빈 파일. 지우지 말 것. |

## 고치는 법

`index.html`을 메모장이나 편집기로 열어서 찾으면 된다.

- **문장 고치기** — `var SLIDES = [` 아래 배열. 각 줄의 따옴표 안이 화면에 뜨는 글이다. 줄바꿈은 `<br>`.
- **단계별 대사 고치기** — `var STAGE = {` 아래. `dog`와 `cat`이 각각 1~4기 순서다.
- **크랙 링크 달기** — `var CRACK = '';` 의 따옴표 안에 작품 주소를 넣으면
  마지막 화면에 `크랙에서 함께하기` 버튼이 생긴다. 비워 두면 버튼이 안 뜬다.
- **프로필 양식 고치기** — `var PROFILE = [` 아래 목록.
- **배경음 볼륨** — `bgm.volume = 0.4;` (0~1)
- **별가루 양** — `w * h / 5200` 의 `5200`. 숫자를 키우면 적어진다.

## 만든 것

글·기획 Scroll
