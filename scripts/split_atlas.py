from pathlib import Path
import argparse
from PIL import Image

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--input',required=True);p.add_argument('--out-dir',required=True)
    p.add_argument('--columns',type=int,required=True);p.add_argument('--rows',type=int,required=True)
    p.add_argument('--names',nargs='+',required=True);p.add_argument('--padding',type=int,default=8)
    a=p.parse_args(); image=Image.open(a.input).convert('RGBA'); out=Path(a.out_dir);out.mkdir(parents=True,exist_ok=True)
    if len(a.names)!=a.columns*a.rows: raise SystemExit('name count must match grid')
    sw,sh=image.width/a.columns,image.height/a.rows
    for index,name in enumerate(a.names):
        col,row=index%a.columns,index//a.columns
        box=(round(col*sw),round(row*sh),round((col+1)*sw),round((row+1)*sh))
        cell=image.crop(box); alpha=cell.getchannel('A'); bounds=alpha.getbbox()
        if bounds:
            x0=max(0,bounds[0]-a.padding);y0=max(0,bounds[1]-a.padding);x1=min(cell.width,bounds[2]+a.padding);y1=min(cell.height,bounds[3]+a.padding)
            cell=cell.crop((x0,y0,x1,y1))
        cell.save(out/f'{name}.png')

if __name__=='__main__':main()
