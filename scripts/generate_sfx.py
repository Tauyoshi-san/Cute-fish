from pathlib import Path
import math, random, struct, wave

RATE=44100
OUT=Path(__file__).parents[1]/'public/assets/sound/sfx'
OUT.mkdir(parents=True,exist_ok=True)
random.seed(8421)

def render(name,duration,build):
    n=int(RATE*duration); buf=[0.0]*n
    def tone(start,dur,freq,vol=.25,decay=5,kind='sine',bend=0):
        a=int(start*RATE); b=min(n,a+int(dur*RATE))
        for i in range(a,b):
            t=(i-a)/RATE; f=freq+bend*t/max(dur,.001); phase=2*math.pi*(freq*t+(bend/(2*max(dur,.001)))*t*t)
            shape=math.sin(phase) if kind=='sine' else (2/math.pi)*math.asin(math.sin(phase))
            buf[i]+=shape*vol*math.exp(-decay*t)*(min(1,t/.006))
    def noise(start,dur,vol=.15,decay=8,smooth=.82):
        a=int(start*RATE); b=min(n,a+int(dur*RATE)); last=0
        for i in range(a,b):
            t=(i-a)/RATE; last=smooth*last+(1-smooth)*random.uniform(-1,1)
            buf[i]+=last*vol*math.exp(-decay*t)*min(1,t/.004)
    build(tone,noise)
    peak=max(.001,max(abs(x) for x in buf)); gain=.88/peak
    with wave.open(str(OUT/name),'wb') as w:
        w.setparams((1,2,RATE,n,'NONE','not compressed'))
        w.writeframes(b''.join(struct.pack('<h',int(max(-1,min(1,x*gain))*32767)) for x in buf))

render('feed-toss.wav',.42,lambda t,n:(n(0,.12,.09,15,.65),t(.02,.32,520,.16,7,'sine',460),t(.08,.25,1040,.07,10)))
render('eat-munch.wav',.58,lambda t,n:(n(.02,.16,.32,20,.2),t(.035,.13,145,.24,23),t(.055,.12,290,.12,26),n(.23,.14,.27,22,.28),t(.25,.12,170,.25,24),t(.31,.22,690,.09,12,'sine',180)))
render('buy-success.wav',.58,lambda t,n:(t(.01,.42,1320,.22,8),t(.015,.38,1980,.11,10),t(.17,.38,1660,.2,8),t(.18,.32,2490,.08,11)))
render('action-fail.wav',.42,lambda t,n:(t(.01,.3,190,.32,10),t(.025,.26,285,.16,12),n(.01,.08,.08,24,.4)))
render('clean-swish.wav',.7,lambda t,n:(n(0,.55,.25,4.5,.965),t(.32,.3,1050,.1,8,'sine',700),t(.43,.22,1760,.1,10)))
render('mission-step.wav',.35,lambda t,n:(t(.01,.28,740,.26,11),t(.02,.22,1110,.1,13),t(.14,.2,930,.18,12)))
render('mission-complete.wav',1.25,lambda t,n:tuple(t(s,.65,f,.2 if i<3 else .14,6) for i,(s,f) in enumerate([(0,523),(.14,659),(.28,784),(.44,1047),(.58,1319)])))
render('fish-arrive.wav',1.0,lambda t,n:(n(0,.38,.22,7,.9),t(.16,.5,587,.2,7),t(.34,.5,784,.2,7),t(.5,.4,1175,.12,9)))
render('evolve-start.wav',1.2,lambda t,n:(n(0,1,.08,2,.98),t(0,1.05,280,.12,2.2,'sine',950),t(.18,.85,560,.08,2.8,'sine',900)))
render('evolve-complete.wav',1.15,lambda t,n:tuple(t(i*.075,.65,520*(1.19**i),.16,6) for i in range(7)))
print(f'generated 10 sounds in {OUT}')
