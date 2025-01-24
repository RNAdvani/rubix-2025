import logging
import traceback
import sys
from flask import Flask, request, jsonify
from deepface import DeepFace
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import normalize
import numpy as np
import requests
import signal

# Configure logging
logging.basicConfig(
    level=logging.DEBUG, 
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('flask_app.log'),
        logging.StreamHandler(sys.stdout)  # Log to console as well
    ]
)

app = Flask(__name__)

# Graceful shutdown handler
def graceful_shutdown(signum, frame):
    logging.info("Received shutdown signal. Cleaning up...")
    sys.exit(0)

# Register shutdown signals
signal.signal(signal.SIGINT, graceful_shutdown)
signal.signal(signal.SIGTERM, graceful_shutdown)

@app.route('/group-images', methods=['POST'])
def group_images():
    try:
        logging.debug("Request received - Full headers: %s", request.headers)
        logging.debug("Request data: %s", request.get_json())
        
        # Add request timeout handling
        data = request.json
        image_urls = data.get("image_urls", [])
        
        if not image_urls:
            logging.error("No image URLs provided")
            return jsonify({"error": "No image URLs"}), 400
        
        # Defensive programming: limit number of images
        image_urls = image_urls[:50]  # Prevent potential DoS
        
        logging.info(f"Processing {len(image_urls)} images")
        
        valid_embeddings = []
        valid_images = []
        skipped_images = []
        
        for image_url in image_urls:
            try:
                # Robust image download with timeout
                response = requests.get(image_url, timeout=15)
                
                # Save temp file
                import tempfile
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                    temp_file.write(response.content)
                    temp_file_path = temp_file.name
                
                # Try embedding with comprehensive error handling
                try:
                    embedding = DeepFace.represent(
                        img_path=temp_file_path, 
                        model_name="ArcFace", 
                        enforce_detection=False  # More lenient
                    )
                    valid_embeddings.append(embedding[0]["embedding"])
                    valid_images.append(image_url)
                except Exception as embed_error:
                    logging.warning(f"Embedding error for {image_url}: {embed_error}")
                    skipped_images.append({
                        "url": image_url, 
                        "error": str(embed_error)
                    })
                
                # Always clean temp file
                import os
                os.unlink(temp_file_path)
                
            except Exception as download_error:
                logging.error(f"Download error for {image_url}: {download_error}")
                skipped_images.append({
                    "url": image_url, 
                    "error": str(download_error)
                })
        
        if not valid_embeddings:
            logging.error("No valid embeddings generated")
            return jsonify({
                "error": "No processable images",
                "skipped_images": skipped_images
            }), 400
        
        # Clustering with error handling
        try:
            embeddings_array = normalize(np.array(valid_embeddings), axis=1)
            clustering = DBSCAN(eps=0.6, min_samples=1, metric="cosine")
            labels = clustering.fit_predict(embeddings_array)
            
            grouped_images = {}
            for idx, label in enumerate(labels):
                grouped_images.setdefault(label, []).append(valid_images[idx])
            
            result = {
                "groups": list(grouped_images.values()),
                "skipped_images": skipped_images
            }
            
            logging.info("Processing completed successfully")
            return jsonify(result), 200
        
        except Exception as cluster_error:
            logging.error(f"Clustering error: {cluster_error}")
            return jsonify({"error": "Clustering failed"}), 500
    
    except Exception as e:
        logging.critical(f"Unexpected error: {traceback.format_exc()}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)