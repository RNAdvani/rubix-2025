import os
import io
import warnings
import torch
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from deoldify import device
from deoldify.device_id import DeviceId
from deoldify.visualize import *

warnings.filterwarnings("ignore", category=UserWarning)

app = Flask(__name__)
CORS(app)

device.set(device=DeviceId.GPU0 if torch.cuda.is_available() else DeviceId.CPU)
colorizer = get_image_colorizer(artistic=True)

# Ensure test_images directory exists
os.makedirs('test_images', exist_ok=True)

@app.route('/colorize', methods=['POST'])
def colorize_image():
    data = request.json
    source_url = data.get('source_url')
    render_factor = data.get('render_factor', 35)
    watermarked = data.get('watermarked', True)

    if not source_url:
        return jsonify({'error': 'No image URL provided'}), 400

    try:
        # Download image to local directory first
        response = requests.get(source_url)
        file_path = os.path.join('test_images', 'image.png')
        with open(file_path, 'wb') as f:
            f.write(response.content)

        # Colorize local file
        result = colorizer.plot_transformed_image(
            file_path,
            render_factor=render_factor,
            compare=False,
            watermarked=watermarked
        )

        return send_file(result, mimetype='image/png')

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)