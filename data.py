import os
import glob
import numpy as np
import matplotlib.pyplot as plt
from random import randint

# Get class list
f = open('class_names.txt','r')
class_names = f.read().split()
f.close()

# Load training data
X = np.load('data/X.npy')
y = np.load('data/y.npy')

# Plot a random drawing
# idx = randint(0, len(X)) 
# print(class_names[int(y[idx].item())])
# plt.imshow(X[idx].reshape(28,28),cmap='gray')
# plt.show()

# Reshape and normalize
X = X.reshape(X.shape[0], 28, 28, 1).astype('float32')
X /= 255.0

# Randomize data
permutation = np.random.permutation(y.shape[0])
X = X[permutation, :]
y = y[permutation]