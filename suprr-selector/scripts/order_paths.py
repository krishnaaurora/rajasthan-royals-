import json

with open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\src\data\rr_logo_paths.json') as f:
    data = json.load(f)

for i, p in enumerate(data['paths']):
    # extract coordinates from d
    tokens = p['d'].split()
    xs = [float(tokens[j]) for j in range(1, len(tokens)-1, 3)]
    ys = [float(tokens[j]) for j in range(2, len(tokens)-1, 3)]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    center_y = (min_y + max_y) / 2
    p['min_y'] = min_y
    p['max_y'] = max_y
    p['center_y'] = center_y
    p['index'] = i
    print(f"Path {i}: Y={min_y:.1f}..{max_y:.1f} (center={center_y:.1f}), len={p['length']:.1f}, area={p['area']:.1f}")

# Re-sort paths by center_y so drawing progresses naturally from Crown -> Monogram -> Text!
data['paths'].sort(key=lambda p: (p['min_y'], p['center_y']))

# Assign stagger delays
for rank, p in enumerate(data['paths']):
    # Total draw duration: 1.8s
    p['delay'] = round(p['min_y'] / 600.0 * 1.2, 2)
    p['duration'] = round(max(0.6, min(1.4, p['length'] / 400.0)), 2)

with open(r'C:\Users\krish\Desktop\rajastha\suprr-selector\frontend\src\data\rr_logo_paths.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated rr_logo_paths.json with ordered paths and stagger timings!")

