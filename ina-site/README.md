# INA · 백이나 「LSD」

크랙 스토리 「Languid Sapphic Dreams : LSD」 세계관 소개용 가상 홈페이지.
등장 인물, 그룹, 소속사, 브랜드는 모두 허구다.

주소: https://feelggim.github.io/ina-site/

## 올리는 법
1. GitHub에서 `ina-site` 저장소를 만든다 (Public).
2. 이 폴더 안의 파일을 전부 올린다. `index.html`이 저장소 맨 위에 있어야 한다.
3. Settings → Pages → Branch: `main` / `/ (root)` → Save.
4. 1~2분 뒤 위 주소로 열린다.

저장소 이름을 다르게 지으면 `index.html` 위쪽 `og:image`, `og:url` 주소도 같이 바꿔야 링크 미리보기가 뜬다.

## 구성
| 경로 | 내용 |
|---|---|
| index.html | 페이지 전체 (HTML·CSS·JS 한 파일) |
| img/ | 사진 |
| audio/001~318.mp3 | 수록곡 (319 히든은 음원 나오면 audio/319.mp3로 추가) |
| .nojekyll | GitHub Pages가 파일을 건드리지 않게 하는 빈 파일 |

## 설정 (index.html 아래쪽 script)
- `CRACK_URL`: 크랙 작품 링크 (아직 비어 있음)
- `PASSWORDS`: 앨범 비번 20210724 / 210724 / 0724
- `HIDDEN_PASS`: 히든 319 비번 5475
- `TRACKS`, `LYRICS`: 곡 정보, 가사

비번은 브라우저에 기억된다.
