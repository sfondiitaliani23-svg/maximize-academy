# Uso: python3 scripts/gen-eliseo-css.py ../maurizio-barber-shop src/strumenti/eliseo-console.css (serve: pip install tinycss2)
import tinycss2, re, sys
mbs, out = sys.argv[1], sys.argv[2]
css=open(f'{mbs}/css/portal.css',encoding='utf-8').read()
part=css[css.index("/* Eliseo: stessa presentazione chiara della console"):]
rules=tinycss2.parse_stylesheet(part, skip_comments=True, skip_whitespace=True)
KEEP=re.compile(r'\.(el-|es-|pchip|pcard|pempty|plist|ptable|btn|field|actions|link-button)')
def conv(sel):
    res=[]
    for x in [s.strip() for s in sel.split(',')]:
        if not KEEP.search(x) or '.pv-' in x or 'data-portal' in x or 'data-client' in x: continue
        x=re.sub(r'^\.portal\b','.mx-strumenti',x)
        if not x.startswith('.mx-strumenti'): x='.mx-strumenti '+x
        res.append(x)
    return ', '.join(res)
outp=[]
for r in rules:
    if r.type=='qualified-rule':
        sel=conv(tinycss2.serialize(r.prelude).strip())
        if sel: outp.append(f"{sel} {{{tinycss2.serialize(r.content).strip()}}}")
    elif r.type=='at-rule' and r.lower_at_keyword=='media' and r.content is not None:
        tmp=[]
        for ir in tinycss2.parse_rule_list(r.content, skip_comments=True, skip_whitespace=True):
            if ir.type=='qualified-rule':
                sel=conv(tinycss2.serialize(ir.prelude).strip())
                if sel: tmp.append(f"  {sel} {{{tinycss2.serialize(ir.content).strip()}}}")
        if tmp: outp.append(f"@media {tinycss2.serialize(r.prelude).strip()} {{\n"+"\n".join(tmp)+"\n}")
tok=open(f'{mbs}/css/tokens.css',encoding='utf-8').read()
body='\n'.join(outp)
vals={}
todo=set(re.findall(r'var\((--[a-z0-9-]+)',body))
while todo:
    n=todo.pop()
    if n in vals: continue
    m=re.search(r'(?<![\w-])'+re.escape(n)+r':\s*([^;]+);',tok)
    if m:
        vals[n]=m.group(1).split('/*')[0].strip(); todo|=set(re.findall(r'var\((--[a-z0-9-]+)',vals[n]))-set(vals)
head=".mx-strumenti {\n"+"\n".join(f"  {n}: {v};" for n,v in sorted(vals.items()))+"\n}"
open(out,'w',encoding='utf-8').write("/* Eliseo aggiornato da Maurizio Barber Shop: stili della console, Profilo, Impostazioni, 2FA.\n   Generato da css/portal.css di maurizio-barber-shop (.portal → .mx-strumenti) con scripts/gen-eliseo-css.py. Non modificare a mano. */\n"+head+"\n"+body+"\n")
print(len(outp),'regole', len(vals),'variabili; senza valore:', sorted(set(re.findall(r'var\((--[a-z0-9-]+)',body))-set(vals)))
