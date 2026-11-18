"""Manage only taiki-1113/illustration-maze; Git credentials stay in memory."""
import json, subprocess, sys, urllib.request, urllib.error
REPO='taiki-1113/illustration-maze'
result=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,check=True)
fields=dict(line.split('=',1) for line in result.stdout.splitlines() if '=' in line)
token=fields.get('password')
if not token: sys.exit('GitHub credential unavailable')
def api(path,method='GET',data=None):
    request=urllib.request.Request('https://api.github.com/'+path,method=method,data=json.dumps(data).encode() if data is not None else None,headers={'Authorization':'Bearer '+token,'User-Agent':'illustration-maze-setup','Accept':'application/vnd.github+json','Content-Type':'application/json'})
    with urllib.request.urlopen(request,timeout=30) as response:
        return json.load(response) if response.status!=204 else {}
action=sys.argv[1]
if action=='create':
    assert api('user')['login']=='taiki-1113'
    try: repo=api('repos/'+REPO)
    except urllib.error.HTTPError as error:
        if error.code!=404: raise
        repo=api('user/repos','POST',{'name':'illustration-maze','description':'レトロな紙のデザインで遊ぶ、10作品のイラスト迷路 PWA','private':False,'auto_init':False})
        print('Created:',repo['html_url'])
    else:
        print('Existing:',repo['html_url'],'size:',repo['size'])
        if repo['size']!=0: sys.exit('Repository is not empty; inspect before pushing')
elif action=='pages':
    try:
        result=api('repos/'+REPO+'/pages')
        if result.get('build_type')!='workflow':
            result=api('repos/'+REPO+'/pages','PUT',{'build_type':'workflow'})
    except urllib.error.HTTPError as error:
        if error.code!=404: raise
        result=api('repos/'+REPO+'/pages','POST',{'build_type':'workflow'})
    print('Pages configured:',result.get('html_url','https://taiki-1113.github.io/illustration-maze/'))
elif action=='status':
    result=api('repos/'+REPO+'/actions/runs?per_page=3')
    print(json.dumps([{'id':r['id'],'status':r['status'],'conclusion':r['conclusion'],'sha':r['head_sha'],'url':r['html_url']} for r in result['workflow_runs']],ensure_ascii=False))
    try:
        result=api('repos/'+REPO+'/pages')
        print('Pages:',result['html_url'],'status:',result.get('status'))
    except urllib.error.HTTPError as error: print('Pages HTTP',error.code)
elif action=='dispatch':
    api('repos/'+REPO+'/actions/workflows/pages.yml/dispatches','POST',{'ref':'main'})
    print('Pages workflow dispatched')
else: sys.exit('Unknown action')

