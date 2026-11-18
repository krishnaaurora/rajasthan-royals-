import cv2
import numpy as np
from PIL import Image

im = Image.open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\rr-hero-master.jpg')
w, h = im.size
arr = np.array(im)

# The button is pink (high R, low G, high B) near bottom center
# Search in Y from 350 to 430, X from 350 to 650
crop = arr[350:430, 350:650]
# Pink has R > 200, G < 60, B > 100
pink_mask = (crop[:, :, 0] > 200) & (crop[:, :, 1] < 70) & (crop[:, :, 2] > 100)
ys, xs = np.where(pink_mask)

btn_y1 = 350 + ys.min()
btn_y2 = 350 + ys.max()
btn_x1 = 350 + xs.min()
btn_x2 = 350 + xs.max()

print(f"Master image size: {w} x {h}")
print(f"Button bounding box: X = {btn_x1}..{btn_x2} (width {btn_x2-btn_x1}), Y = {btn_y1}..{btn_y2} (height {btn_y2-btn_y1})")
print(f"In percentages: left={btn_x1/w*100:.2f}%, top={btn_y1/h*100:.2f}%, width={(btn_x2-btn_x1)/w*100:.2f}%, height={(btn_y2-btn_y1)/h*100:.2f}%")
