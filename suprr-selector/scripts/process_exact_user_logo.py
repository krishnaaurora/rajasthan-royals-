import cv2
import numpy as np
from PIL import Image

# Load the exact 2nd image uploaded by the user
src_path = r'C:\Users\krish\.gemini\antigravity\brain\31becb8b-b70e-4ac3-94bb-b6b806c9ca92\.user_uploaded\media_1794727204585_70b65c39.png'
im = Image.open(src_path)
print("Source image size:", im.size, "mode:", im.mode)

arr = np.array(im)
# Find the exact pink background color
# Sample corners
pink_samples = [arr[0, 0], arr[0, -1], arr[-1, 0], arr[-1, -1], arr[10, 10]]
print("Corner colors:", pink_samples)

# Save exact copy to frontend/public/rr-official-crest.png
im.save(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\rr-official-crest.png')
print("Saved rr-official-crest.png")

# Now let's create a transparent PNG where the white crest is preserved with crisp antialiased alpha
# and pink background is transparent
# White pixels have high R, high G, high B.
# Pink has high R, low G, high B (e.g. R~230, G~10, B~150).
# The difference (G channel or distance from pure white) gives perfect segmentation!
rgb = arr[:, :, :3].astype(np.float32)
# White is (255, 255, 255)
# In pink, Green is ~10-20. In white, Green is 200-255!
green_channel = rgb[:, :, 1]
print("Green channel min, max, mean:", green_channel.min(), green_channel.max(), green_channel.mean())

# Alpha can be derived from the green channel smoothly:
# Below 35 -> pure background (alpha 0)
# Above 160 -> pure white logo (alpha 255)
# Between 35 and 160 -> smooth transition
alpha = np.clip((green_channel - 35.0) / (160.0 - 35.0) * 255.0, 0, 255).astype(np.uint8)

# Create 4x upscaled super-sampled clean transparent PNG
h, w = arr.shape[:2]
up_arr = cv2.resize(arr, (w * 4, h * 4), interpolation=cv2.INTER_LANCZOS4)
up_rgb = up_arr[:, :, :3].astype(np.float32)
up_green = up_rgb[:, :, 1]
up_alpha = np.clip((up_green - 40.0) / (150.0 - 40.0) * 255.0, 0, 255).astype(np.uint8)

# Pure white with antialiased alpha
clean_white = np.zeros((h * 4, w * 4, 4), dtype=np.uint8)
clean_white[:, :, :3] = 255
clean_white[:, :, 3] = up_alpha

transparent_img = Image.fromarray(clean_white)
transparent_img.save(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\public\rr-crest-white-transparent.png')
print("Saved rr-crest-white-transparent.png, size:", transparent_img.size)

