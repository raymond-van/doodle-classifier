import os
import glob
import numpy as np
import urllib.request

# Get class list
f = open('class_names.txt','r')
class_names = f.read().split()
f.close()

# Download data
def download():
  base = 'https://storage.googleapis.com/quickdraw_dataset/full/numpy_bitmap/'
  for c in class_names:
    cls_url = c.replace('_', '%20')
    path = base+cls_url+'.npy'
    print(path)
    urllib.request.urlretrieve(path, 'data/raw/'+c+'.npy')

download()