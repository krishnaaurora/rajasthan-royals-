import cv2
import numpy as np
from PIL import Image

# Load hero-banner.jpg
banner = Image.open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\hero-banner.jpg')
w, h = banner.size
arr = np.array(banner)

# In the banner, the background is warm cream (~ [254, 245, 237])
# Let's create transparent versions of left wing, right wing, stadium, and hawamahal

# Left wing: X from 0 to 320, Y from 0 to 447
left_wing = arr[:, :320].copy()
# Right wing: X from 700 to 1024, Y from 0 to 447
right_wing = arr[:, 700:].copy()

# Stadium: X from 0 to 320, Y from 340 to 447
stadium = arr[340:, :320].copy()

# Hawa Mahal: X from 680 to 1024, Y from 320 to 447
hawamahal = arr[320:, 680:].copy()

# Central Badge: X from 300 to 720, Y from 30 to 425
center_badge = arr[30:425, 300:724].copy()

# Function to remove cream background and make transparent
def make_transparent(crop_arr, bg_color=(254, 245, 236), tolerance=20):
    diff = np.sqrt(np.sum((crop_arr[:, :, :3].astype(np.float32) - np.array(bg_color, dtype=np.float32))**2, axis=2))
    # Where diff is small, alpha is 0
    alpha = np.clip((diff - 8.0) / (tolerance - 8.0) * 255.0, 0, 255).astype(np.uint8)
    res = np.dstack([crop_arr[:, :, :3], alpha])
    return Image.fromarray(res)

Image.fromarray(left_wing).save(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\hero-left.png')
Image.fromarray(right_wing).save(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\hero-right.png')
Image.fromarray(stadium).save(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\hero-stadium.png')
Image.fromarray(hawamahal).save(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\hero-hawamahal.png')
Image.fromarray(center_badge).save(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\hero-center-badge.png')

print("Saved hero parts successfully!")
