import os
from PIL import Image
import numpy as np

SOURCE_IMG = r'C:/Users/HP/.gemini/antigravity/brain/6e7034b2-fabe-4a3a-9650-b47d6ebde542/.user_uploaded/media_1792878115532_ac422175.jpg'
ROOT_DIR = r'C:/Users/HP/OneDrive/Desktop/Sem2_portal'

def main():
    print('Loading source image...')
    img = Image.open(SOURCE_IMG).convert('RGB')
    arr = np.array(img)

    # The chip is located at row 285 to 714, col 30 to 459 (429 x 429)
    chip = arr[285:714, 30:459]
    h, w, _ = chip.shape

    # Build smooth transparent RGBA
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = chip

    # Background is white (255, 255, 255)
    # Distance from pure white
    diff_from_white = 255.0 - chip.mean(axis=2)
    # Clip smoothly to alpha 0..255
    alpha = np.clip(diff_from_white * 6.5, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = alpha

    # High-quality master image with padding to fit in a square canvas
    master_icon = Image.fromarray(rgba, 'RGBA')

    # Pad slightly to 512x512 with transparent background
    canvas_512 = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
    # Resize master_icon to 470x470 to leave comfortable margins around pins
    icon_resized = master_icon.resize((470, 470), Image.Resampling.LANCZOS)
    canvas_512.paste(icon_resized, (21, 21), icon_resized)

    # 1. Save web-app-manifest-512x512.png
    p512 = os.path.join(ROOT_DIR, 'web-app-manifest-512x512.png')
    canvas_512.save(p512, 'PNG')
    print(f'Saved {p512}')

    # 2. Save web-app-manifest-192x192.png
    p192 = os.path.join(ROOT_DIR, 'web-app-manifest-192x192.png')
    img_192 = canvas_512.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(p192, 'PNG')
    print(f'Saved {p192}')

    # 3. Save apple-touch-icon.png (180x180)
    p_apple = os.path.join(ROOT_DIR, 'apple-touch-icon.png')
    img_180 = canvas_512.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save(p_apple, 'PNG')
    print(f'Saved {p_apple}')

    # 4. Save favicon-96x96.png (96x96)
    p96 = os.path.join(ROOT_DIR, 'favicon-96x96.png')
    img_96 = canvas_512.resize((96, 96), Image.Resampling.LANCZOS)
    img_96.save(p96, 'PNG')
    print(f'Saved {p96}')

    # 5. Save favicon.ico (multi-resolution 16, 32, 48)
    p_ico = os.path.join(ROOT_DIR, 'favicon.ico')
    canvas_512.save(p_ico, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print(f'Saved {p_ico}')

    # 6. Build and save favicon.svg (crisp vector for modern browsers)
    svg_code = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!-- Top Pins -->
  <g fill="#011023">
    <rect x="142" y="16" width="16" height="52" rx="8" />
    <rect x="217" y="16" width="16" height="52" rx="8" />
    <rect x="279" y="16" width="16" height="52" rx="8" />
    <rect x="354" y="16" width="16" height="52" rx="8" />

    <!-- Bottom Pins -->
    <rect x="142" y="444" width="16" height="52" rx="8" />
    <rect x="217" y="444" width="16" height="52" rx="8" />
    <rect x="279" y="444" width="16" height="52" rx="8" />
    <rect x="354" y="444" width="16" height="52" rx="8" />

    <!-- Left Pins -->
    <rect x="16" y="142" width="52" height="16" rx="8" />
    <rect x="16" y="217" width="52" height="16" rx="8" />
    <rect x="16" y="279" width="52" height="16" rx="8" />
    <rect x="16" y="354" width="52" height="16" rx="8" />

    <!-- Right Pins -->
    <rect x="444" y="142" width="52" height="16" rx="8" />
    <rect x="444" y="217" width="52" height="16" rx="8" />
    <rect x="444" y="279" width="52" height="16" rx="8" />
    <rect x="444" y="354" width="52" height="16" rx="8" />

    <!-- Main Outer Chip Body with Chamfered Corners -->
    <polygon points="
      112,56 400,56 456,112 456,400 400,456 112,456 56,400 56,112
    " />
  </g>

  <!-- Cyan Inner Border with Chamfered Corners -->
  <polygon points="
    160,126 352,126 386,160 386,352 352,386 160,386 126,352 126,160
  " fill="#00d0fa" />

  <!-- Inner Die Core (Dark Navy) -->
  <polygon points="
    184,158 328,158 354,184 354,328 328,354 184,354 158,328 158,184
  " fill="#011023" />
</svg>
'''
    p_svg = os.path.join(ROOT_DIR, 'favicon.svg')
    with open(p_svg, 'w', encoding='utf-8') as f:
        f.write(svg_code)
    print(f'Saved {p_svg}')

if __name__ == '__main__':
    main()
