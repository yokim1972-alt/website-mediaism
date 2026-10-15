# 배포 전에 실행: 모든 ?v= 버전을 현재 시각으로 올려서 브라우저가 옛 파일을 쓰지 않게 함
import re, pathlib, datetime
v = datetime.datetime.now().strftime('%Y%m%d%H%M')
files = ['index.html', 'js/main.js'] + [str(p) for p in pathlib.Path('js/pages').glob('*.js')]
for f in files:
    p = pathlib.Path(f); s = p.read_text(encoding='utf-8')
    s2 = re.sub(r'\?v=[0-9A-Za-z.\-]+', '?v=' + v, s)
    if s2 != s: p.write_text(s2, encoding='utf-8')
pathlib.Path('version.txt').write_text(v, encoding='utf-8')
print('version', v)
