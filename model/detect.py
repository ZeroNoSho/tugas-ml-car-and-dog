from ultralytics import YOLO
import cv2
import os
from glob import glob

# Load model YOLO
model = YOLO("runs/detect/train2/weights/best.pt")

# Folder input dan output
input_folder = "test"
output_folder = "output"
os.makedirs(output_folder, exist_ok=True)

# Ambil semua gambar JPG
image_paths = glob(os.path.join(input_folder, "*.jpg"))

# Cek jika tidak ada gambar
if not image_paths:
    raise FileNotFoundError("Tidak ada gambar .jpg di folder test/")

# Mapping ID ke label
names = model.names

# Loop setiap gambar
for img_path in image_paths:
    print(f"\n🖼️ Mendeteksi objek pada: {img_path}")

    # Inference dengan threshold
    results = model(img_path, conf=0.25, iou=0.5)
    counts = {}

    # Ambil hasil deteksi
    result = results[0]
    boxes = result.boxes

    print(f"🔍 Jumlah box terdeteksi: {len(boxes)}")

    # Loop setiap box
    for box in boxes:
        cls_id = int(box.cls)
        conf = float(box.conf)
        label = names[cls_id]
        counts[label] = counts.get(label, 0) + 1
        print(f" - {label} (confidence: {conf:.2f})")

    # Ringkasan jumlah objek
    print("📊 Jumlah objek:")
    for label, count in counts.items():
        print(f"  {label}: {count}")

    # Plot deteksi
    result_img = result.plot()

    # Tambahkan label jumlah objek di pojok kiri atas
    y_offset = 30
    for label, count in counts.items():
        text = f"{label}: {count}"
        cv2.putText(result_img, text, (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 255), 2)
        y_offset += 30

    # Simpan gambar ke output/
    output_path = os.path.join(output_folder, os.path.basename(img_path))
    cv2.imwrite(output_path, result_img)
    print(f"✅ Hasil disimpan ke: {output_path}")
