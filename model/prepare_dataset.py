import os
import shutil
import random

# Folder gambar awal
KUCING_SRC = "dataset_raw/kucing"
ANJING_SRC = "dataset_raw/anjing"

# Folder output YOLO
IMAGE_DIR = "dataset/images"
LABEL_DIR = "dataset/labels"

# Buat struktur folder
for split in ['train', 'val']:
    os.makedirs(f"{IMAGE_DIR}/{split}", exist_ok=True)
    os.makedirs(f"{LABEL_DIR}/{split}", exist_ok=True)

# Fungsi untuk memproses satu jenis hewan
def proses_gambar(src_folder, class_id):
    files = [f for f in os.listdir(src_folder) if f.endswith('.jpg')]
    random.shuffle(files)
    split_idx = int(0.8 * len(files))
    train_files = files[:split_idx]
    val_files = files[split_idx:]

    for split, filelist in zip(['train', 'val'], [train_files, val_files]):
        for fname in filelist:
            # Salin gambar
            src_path = os.path.join(src_folder, fname)
            dst_path = os.path.join(IMAGE_DIR, split, fname)
            shutil.copy(src_path, dst_path)

            # Buat file label YOLO dummy
            label_path = os.path.join(LABEL_DIR, split, fname.replace('.jpg', '.txt'))
            with open(label_path, 'w') as f:
                f.write(f"{class_id} 0.5 0.5 0.4 0.4\n")  # Dummy box di tengah

# Proses kucing (class 0) dan anjing (class 1)
proses_gambar(KUCING_SRC, class_id=0)
proses_gambar(ANJING_SRC, class_id=1)

print("✅ Dataset selesai disiapkan.")
