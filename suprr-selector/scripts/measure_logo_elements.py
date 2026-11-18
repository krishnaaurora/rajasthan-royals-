import cv2
import numpy as np
from PIL import Image

im = Image.open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\rr-crest-white-transparent.png')
arr = np.array(im)
alpha = arr[:, :, 3]

# Find bounding box of non-zero alpha
ys, xs = np.where(alpha > 50)
print(f"Overall bounding box: X = {xs.min()}..{xs.max()}, Y = {ys.min()}..{ys.max()}")

# Crown bounds (Y from 0 to ~200)
crown_mask = (alpha > 50) & (np.arange(arr.shape[0])[:, None] < 200)
c_ys, c_xs = np.where(crown_mask)
print(f"Crown bounding box: X = {c_xs.min()}..{c_xs.max()}, Y = {c_ys.min()}..{c_ys.max()}")

# Monogram bounds (Y from 200 to 420)
mono_mask = (alpha > 50) & (np.arange(arr.shape[0])[:, None] >= 200) & (np.arange(arr.shape[0])[:, None] < 420)
m_ys, m_xs = np.where(mono_mask)
print(f"Monogram bounding box: X = {m_xs.min()}..{m_xs.max()}, Y = {m_ys.min()}..{m_ys.max()}")

# Text line 1 'RAJASTHAN' bounds (Y 420 to 470)
t1_mask = (alpha > 50) & (np.arange(arr.shape[0])[:, None] >= 420) & (np.arange(arr.shape[0])[:, None] < 475)
t1_ys, t1_xs = np.where(t1_mask)
print(f"RAJASTHAN bounding box: X = {t1_xs.min()}..{t1_xs.max()}, Y = {t1_ys.min()}..{t1_ys.max()}")

# Text line 2 'ROYALS' bounds (Y 475 to 560)
t2_mask = (alpha > 50) & (np.arange(arr.shape[0])[:, None] >= 475)
t2_ys, t2_xs = np.where(t2_mask)
print(f"ROYALS bounding box: X = {t2_xs.min()}..{t2_xs.max()}, Y = {t2_ys.min()}..{t2_ys.max()}")

