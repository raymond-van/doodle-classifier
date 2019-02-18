import os
import glob
import numpy as np

SAMPLES_PER_CLASS = 5000

def generate_train_data(root):
    data_files = glob.glob(os.path.join(root, '*.npy'))
    X = np.empty([0,784])
    y = np.empty([0])
    for idx, file in enumerate(data_files):
        data = np.load(file)
        data = data[0:SAMPLES_PER_CLASS]
        labels = np.full(SAMPLES_PER_CLASS, idx)
        X = np.concatenate((X,data), axis=0)
        y = np.append(y,labels)
    data = None
    labels = None
    return X, y

X, y = generate_train_data('data/raw')
np.save('data/X', X, allow_pickle=False)
np.save('data/y', y, allow_pickle=False)