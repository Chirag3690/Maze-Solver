import sys, json, numpy as np,base64
from PIL import Image,ImageEnhance,ImageDraw,ImageOps
from queue import Queue
from io import BytesIO
import io 

def iswhite(value):
    
    if value == (0,0,0):
        return True

def getadjacent(n):
    x,y = n
    return [(x-1,y),(x,y-1),(x+1,y),(x,y+1)]

def BFS( pixels,start,end):

    queue = Queue()
    queue.put([start]) # Wrapping the start tuple in a list

    while not queue.empty():
        
        path = queue.get() 
        pixel = path[-1]
        
            
        if pixel == end:        
            return path
        
        for adjacent in getadjacent(pixel):
            
            x,y = adjacent
            if iswhite(pixels[x,y]):    
                pixels[x,y] = (127,127,127) # see note
                new_path = list(path)
                new_path.append(adjacent)
                queue.put(new_path)
            
    print("/images/alternate.png")

def data_uri_to_pi_img(uri):
    encoded_data = uri.split(',')[1]
    b=base64.b64decode(encoded_data)
    img=Image.open(io.BytesIO(b))
    return img
def pil2datauri(img):
    #converts PIL image to datauri
    data = BytesIO()
    img.save(data, "JPEG")
    data64 = base64.b64encode(data.getvalue())
    return u'data:img/jpeg;base64,'+data64.decode('utf-8')

def otsu(gray):
    pixel_number = gray.shape[0] * gray.shape[1]
    mean_weight = 1.0/pixel_number
    his, bins = np.histogram(gray, np.arange(0,257))
    final_thresh = -1
    final_value = -1
    intensity_arr = np.arange(256)
    for t in bins[1:-1]: # This goes from 1 to 254 uint8 range (Pretty sure wont be those values)
        pcb = np.sum(his[:t])
        pcf = np.sum(his[t:])
        Wb = pcb * mean_weight
        Wf = pcf * mean_weight
        np.seterr(divide='ignore', invalid='ignore')
        mub = np.sum(intensity_arr[:t]*his[:t]) / float(pcb)
        muf = np.sum(intensity_arr[t:]*his[t:]) / float(pcf)
        #print mub, muf
        value = Wb * Wf * (mub - muf) ** 2

        if value > final_value:
            final_thresh = t
            final_value = value
    final_img = gray.copy()
    #print(final_thresh)
    final_img[gray > final_thresh] = 255
    final_img[gray < final_thresh] = 0
    return final_img

#Read data from stdin
def read_in(coor):
    lines = sys.stdin.readlines()
    line2=json.loads(lines[1])
    np_lines=np.array(line2)
    coor.append(np_lines[0])
    coor.append(np_lines[1])
    coor.append(np_lines[2])
    coor.append(np_lines[3])
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    coor=[]
    datauri = read_in(coor)
    
    
    data_uri_to_pilimg=data_uri_to_pi_img(datauri)

    gray1=ImageOps.grayscale(data_uri_to_pilimg)

    img1 = ImageDraw.Draw(gray1) 
    img1.line((int(coor[0][0]),int(coor[0][1]) ,int(coor[1][0]),int(coor[1][1])),fill="black",width=1)
    
    inverted = ImageOps.invert(gray1)

 
    
    cv2inverted = np.array(inverted)

    img=otsu(cv2inverted)
    img=Image.fromarray(img)
    
    
    img=img.convert('RGB')
    
    enhancer = ImageEnhance.Sharpness(img)
    factor = 1
    img = enhancer.enhance(factor)
    

    
    a=img.load()
    
    
    
    path = BFS(a,(int(coor[2][0]),int(coor[2][1])),(int(coor[3][0]),int(coor[3][1])))
 
    path_img=data_uri_to_pilimg.convert('RGB')
    enhancer = ImageEnhance.Sharpness(path_img)
    factor = 1
    path_img = enhancer.enhance(factor)
    path_pixels = path_img.load()

    for position in path:
        x,y = position
        path_pixels[x,y] = (255,0,0)
        path_pixels[x+1,y]=(255,0,0)
        path_pixels[x,y+1]=(255,0,0)
        path_pixels[x-1,y]=(255,0,0)
        path_pixels[x+1,y-1]=(255,0,0)
        #path_pixels[x+2,y]=(255,0,0)
        #path_pixels[x,y+2]=(255,0,0)
        #path_pixels[x-2,y]=(255,0,0)
        #path_pixels[x+2,y-2]=(255,0,0)    
    pildata=pil2datauri(path_img)
    print(pildata,flush=True)
    sys.stdout.flush()

    
    
#start process
if __name__ == '__main__':
    main()