import json,re,base64,os,shutil
OUT='repo';shutil.rmtree(OUT,ignore_errors=True);os.makedirs(OUT+'/assets/img');os.makedirs(OUT+'/assets/audio')
t=open('template2.html').read()
img=json.load(open('img.json'))
EXT={'image/webp':'webp','image/jpeg':'jpg','image/png':'png','audio/mpeg':'mp3','audio/mp3':'mp3','image/gif':'gif'}
def save(name,uri):
    m=re.match(r'data:([^;]+);base64,(.*)',uri,re.S);mime,b=m.group(1),m.group(2)
    ext=EXT.get(mime,'bin');folder='audio' if mime.startswith('audio') else 'img'
    p=f'assets/{folder}/{name}.{ext}';open(f'{OUT}/{p}','wb').write(base64.b64decode(b));return p
t=re.sub(r'style="background-image:url\(\{\{(\w+)\}\}\)(;?)([^"]*)"',lambda m:f'data-bg="{m.group(1)}"'+(f' style="{m.group(3)}"' if m.group(3) else ''),t)
t=re.sub(r'src="\{\{(\w+)\}\}"',lambda m:'src="{{bgm}}"' if m.group(1)=='bgm' else f'data-src="{m.group(1)}"',t)
t=re.sub(r"'\{\{(\w+)\}\}'",lambda m:f"IMG.{m.group(1)}",t)
used=sorted(set(re.findall(r'data-bg="(\w+)"',t)+re.findall(r'data-src="(\w+)"',t)+re.findall(r'IMG\.(\w+)',t)))
paths={}
for k in used:
    v=img[k]
    if isinstance(v,list):paths[k]=[save(f'{k}_{i:02d}',x) for i,x in enumerate(v)]
    elif isinstance(v,dict):paths[k]={kk:save(f'{k}_{kk}',x) for kk,x in v.items()}
    else:paths[k]=save(k,v)
t=t.replace('{{bgm}}',save('ost',img['ost']))
assert not re.findall(r'\{\{\w+\}\}',t)
boot="<script>const IMG="+json.dumps(paths,ensure_ascii=False,indent=1)+";</script>\n"
hyd="<script>document.querySelectorAll('[data-bg]').forEach(e=>e.style.backgroundImage=`url(${IMG[e.dataset.bg]})`);document.querySelectorAll('[data-src]').forEach(e=>e.src=IMG[e.dataset.src]);</script>\n"
i=t.index('<script>\n(()=>{');t=t[:i]+boot+hyd+t[i:]
t=t.replace('</title>','</title>\n<meta name="description" content="사탕을 건넨 밤, 얼굴 없는 마녀의 부인이 되었다. 크랙 할로윈 이벤트 스토리 · GL · 코즈믹 호러">\n<meta property="og:title" content="사테라 : 발푸르기스의 밤">\n<meta property="og:description" content="사탕을 건넨 밤, 얼굴 없는 마녀의 부인이 되었다.">\n<meta property="og:image" content="promo/cover.webp">',1)
open(OUT+'/index.html','w').write(t)
print(len(t)//1024,'KB index;',len(os.listdir(OUT+'/assets/img')),'images')
