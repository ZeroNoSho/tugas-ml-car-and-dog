from flask import Flask, request, jsonify, send_file
from ultralytics import YOLO
import os
import shutil

app = Flask(__name__)
model = YOLO('../result/best.pt')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
   
    if os.path.exists("runs"):
        shutil.rmtree("runs")
    
    image = request.files['image']
    image_path = f'temp_{image.filename}'
    image.save(image_path)

    try:
        results = model.predict(source=image_path, device='cpu', save=True)
        boxes = results[0].boxes
        result_data = []

        for box in boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()
            result_data.append({
                'class_id': cls,
                'confidence': conf,
                'bbox': xyxy
            })
        
        return send_file(f'../runs/detect/predict/{image_path}', mimetype='image/jpeg')
    
    finally:
        os.remove(image_path)

if __name__ == '__main__':
    app.run(debug=True)
