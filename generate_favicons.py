from PIL import Image
import os

def generate_favicons(input_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        print(f"Processing {input_path}...")
        img = Image.open(input_path).convert("RGBA")
        
        # Define sizes and filenames
        configs = [
            (16, "favicon-16x16.png"),
            (32, "favicon-32x32.png"),
            (180, "apple-touch-icon.png"),
            (192, "android-chrome-192x192.png"),
            (512, "android-chrome-512x512.png")
        ]
        
        for size, filename in configs:
            out_path = os.path.join(output_dir, filename)
            # High-quality resize
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            resized_img.save(out_path, "PNG")
            print(f"Generated {filename} ({size}x{size})")
            
        # Generate favicon.ico (contains 16x16, 32x32, 48x48)
        ico_path = os.path.join(output_dir, "favicon.ico")
        img.save(ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
        print("Generated favicon.ico")
        
    except Exception as e:
        print(f"Error generating favicons: {e}")

if __name__ == "__main__":
    generate_favicons("frontend/public/icon-removebg-preview.png", "frontend/public")
