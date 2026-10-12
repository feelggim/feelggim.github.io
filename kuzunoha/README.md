# 쿠즈노하 · 葛の葉

크랙 언세이프 작품 「쿠즈노하」 홍보 페이지.

## 폴더 구성
- `index.html` : 페이지 본체
- `theme.mp3` : 테마곡 「ちょうだい」
- `assets/` : 이미지 (가면, 피안화, 작약 꽃잎, 달, 배경, 현장 사진, POV, CCTV 움짤 `cctv.webp` + 프레임 10장 등)

## GitHub Pages 올리는 법
이 `kuzunoha` 폴더를 **폴더째** `feelggim.github.io` 저장소 최상단에 올린다.
(다른 작품 사이트 폴더들과 나란히 `kuzunoha/` 가 보이면 정상)

```
feelggim.github.io/
├ hibiki/
├ mion/
├ kuzunoha/   ← 이거
│  ├ index.html
│  ├ theme.mp3
│  └ assets/
```

1~2분 뒤 `https://feelggim.github.io/kuzunoha/` 에서 열린다.
경로가 전부 상대경로라 폴더 이름만 그대로면 어디에 둬도 작동한다.

## 크랙 링크 연결
작품이 공개되면 `index.html`에서 아래 줄을 찾아 따옴표 안에 크랙 링크를 붙여넣는다.

```
var CRACK_URL='';
```

넣으면 "크랙에서 이어하기 · 준비 중" 버튼 두 개가 자동으로 링크 버튼으로 바뀐다.

## 참고
- 애니메이션 라이브러리(jQuery, GSAP)와 글꼴은 CDN에서 불러온다. 인터넷 연결 필요.
- 비공개 설정(본명, 해금 조건 상세)은 페이지에 없다. 프롬프트 파일에만 있다.
