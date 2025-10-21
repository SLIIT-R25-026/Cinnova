from flask import Flask, request, jsonify
from flask_cors import CORS
from bark_funtion_2 import predict_image_bark 
from mature_funtion import predict_image_maturity
from leaf_function import predict_image_leaf, predict_dying_leaf
from yolo_funtion import get_area_percentage, leaf_bligh_model, leaf_gall_model
import os
import pickle
import pandas as pd


import warnings
warnings.filterwarnings("ignore")


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'D:/xampp/htdocs/cinnova/'
#UPLOAD_FOLDER = 'D:\\dataset\\'

#check bark condition
@app.route('/check_bark', methods=['POST'])
def check_bark():
    data = request.get_json()
    
    if not data or 'image_path' not in data:
        return jsonify({'error': 'No image path provided'}), 400
    
    image_path = os.path.join(UPLOAD_FOLDER, data['image_path'])
    
    predicted_label, confidence = predict_image_bark(image_path)
    
    if predicted_label is None:
        return jsonify({'error': confidence}), 400
    
    return jsonify({
        'predicted_label': predicted_label,
        'confidence': float(confidence)
    })



if __name__ == '__main__':
    app.run(debug=True)
