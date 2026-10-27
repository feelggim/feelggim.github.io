# 나의 언니 : My Angel

> 언니, 나를 봐.

Scroll Entertainment 크랙 스토리 「나의 언니 : My Angel」 공식 홈페이지.
비 오던 12월 밤, 신주쿠 거리 피아노에서 너를 발견한 피아니스트 언니의 이야기.

**Created by Scroll**

## 구성

| 화면 | 내용 |
| --- | --- |
| 표지 | 레이스·스티커로 꾸민 표지, 반짝이 파티클, 전광판 띠. 누르면 책이 열림 |
| 만화 | 13페이지 45컷 인터랙티브 웹툰. PART 1 「프로그램에 없던 곡」, PART 2 「가자」 |
| 등장인물 | 인터넷 창 컨셉 프로필 5인. 노래 박자에 맞춰 오브제가 튐 |
| 엔딩 크레딧 | 작품 정보, 인트로, 시작하는 법, 크랙 입장 버튼 |

주제가 「オンニ、私を見て」 가사가 노래에 맞춰 화면 옆으로 흐름.

## 조작

- 넘기기: 마우스 휠 · 방향키 · 스와이프 · 하단 버튼
- 표지 오른쪽 위 **만화 건너뛰기** → 바로 등장인물
- 엔딩 크레딧: 꾹 누르면 빨리 감기, 마우스 올리면 멈춤

## 폴더

```
index.html      페이지 전체 (HTML·CSS·JS 한 파일)
img/            만화 컷, 표지, 캐릭터 초상
ob/             장식 오브제 50종 (투명 webp)
audio/song.mp3  주제가
.nojekyll       GitHub Pages가 파일을 그대로 서빙하게 함
```

## GitHub Pages로 올리기

1. 새 저장소를 만들고 이 폴더 안의 파일을 전부 올린다 (`index.html`이 저장소 맨 위에 오게).
2. 저장소 **Settings → Pages**에서 Source를 `Deploy from a branch`, 브랜치 `main` / 폴더 `/ (root)`로 저장.
3. 1~2분 뒤 `https://<아이디>.github.io/<저장소이름>/` 에서 열림.

## 크랙 공개되면

`index.html`에서 `class="cr-go" disabled aria-disabled="true"` 버튼을 찾아서
`disabled aria-disabled="true"`를 지우고, 버튼을 크랙 작품 링크로 감싸거나 `onclick="location.href='크랙링크'"`를 넣는다.
`<em>준비 중</em>` 배지도 같이 지운다.

## 참고

- 웹폰트는 Google Fonts에서 불러온다.
- 노래는 브라우저 정책상 첫 클릭·터치 이후에 재생된다.
- 이미지·텍스트·음원의 무단 전재와 재배포를 금합니다.

© 2026 Scroll Entertainment
