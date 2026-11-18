import cv2
import numpy as np
from PIL import Image

banner = Image.open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\hero-banner.jpg')
arr = np.array(banner)
h, w = arr.shape[:2]

# Background cream color is around [254, 245, 236]
bg = np.array([254, 245, 236], dtype=np.float32)

def extract_element(box, name, tolerance=18):
    # box: (y1, y2, x1, x2)
    crop = arr[box[0]:box[1], box[2]:box[3]].copy()
    diff = np.sqrt(np.sum((crop[:, :, :3].astype(np.float32) - bg)**2, axis=2))
    # Alpha: smooth transition where diff > 10
    alpha = np.clip((diff - 8.0) / (tolerance - 8.0) * 255.0, 0, 255).astype(np.uint8)
    rgba = np.dstack([crop[:, :, :3], alpha])
    img = Image.fromarray(rgba)
    out_path = fr'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\{name}.png'
    img.save(out_path)
    print(f"Saved {name}.png, size: {img.size}")

# Coordinate boxes in 1024x447 image:
# Batter: Y ~ 40..170, X ~ 145..270
extract_element((35, 175, 140, 275), 'doodle-batter')

# Bowler celebration: Y ~ 230..395, X ~ 40..185
extract_element((225, 395, 40, 185), 'doodle-bowler')

# Floodlight: Y ~ 35..120, X ~ 35..115
extract_element((35, 120, 35, 115), 'doodle-floodlight')

# Pink cricket ball (left): Y ~ 165..220, X ~ 160..215
extract_element((165, 220, 160, 215), 'doodle-ball')

# Stumps: Y ~ 190..265, X ~ 220..270
extract_element((185, 270, 220, 275), 'doodle-stumps')

# Helmet: Y ~ 300..375, X ~ 205..275
extract_element((300, 375, 205, 275), 'doodle-helmet')

# Fielder catching: Y ~ 25..165, X ~ 765..895
extract_element((25, 165, 765, 900), 'doodle-catcher')

# Pink flying ball (right): Y ~ 35..80, X ~ 735..780
extract_element((35, 80, 735, 780), 'doodle-flying-ball')

# Trophy cup: Y ~ 100..175, X ~ 715..775
extract_element((95, 175, 715, 775), 'doodle-trophy')

# Laptop with charts: Y ~ 245..320, X ~ 715..805
extract_element((240, 320, 715, 805), 'doodle-laptop')

# Clipboard checklist: Y ~ 160..240, X ~ 875..940
extract_element((160, 240, 875, 940), 'doodle-clipboard')

# Team icon: Y ~ 165..225, X ~ 775..840
extract_element((165, 225, 775, 840), 'doodle-team')

# Analytics magnifying glass: Y ~ 265..355, X ~ 888..965
extract_element((265, 355, 888, 965), 'doodle-search')

# Hawa Mahal palace (Jaipur): Y ~ 310..440, X ~ 685..995
extract_element((310, 445, 685, 1005), 'doodle-hawamahal')

# Stadium (Sawai Mansingh): Y ~ 335..440, X ~ 20..305
extract_element((335, 445, 20, 310), 'doodle-stadium')
