from flask import Flask, request, jsonify
from deepface import DeepFace
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import normalize
import numpy as np

app = Flask(__name__)

@app.route('/group-images', methods=['POST'])
def group_images():
    try:
        # Get image URLs from request
        data = request.json
        image_urls = data.get("image_urls")

        if not image_urls or not isinstance(image_urls, list):
            return jsonify({"error": "Invalid or missing 'image_urls' field"}), 400

        # Generate embeddings for each image
        embeddings = []
        valid_images = []

        for image_url in image_urls:
            try:
                embedding = DeepFace.represent(
                    img_path=image_url, model_name="Facenet", enforce_detection=True
                )
                embeddings.append(embedding[0]["embedding"])
                valid_images.append(image_url)
            except Exception as e:
                print(f"Error processing {image_url}: {e}")

        if not embeddings:
            return jsonify({"error": "No embeddings could be generated."}), 400

        # Prepare data for clustering
        embeddings_array = np.array(embeddings)
        embeddings_array = normalize(embeddings_array, axis=1)  # Normalize embeddings

        # Group images using DBSCAN clustering
        clustering_model = DBSCAN(eps=0.6, min_samples=1, metric="cosine")
        labels = clustering_model.fit_predict(embeddings_array)

        # Create groups based on labels
        grouped_images = {}
        for idx, label in enumerate(labels):
            if label not in grouped_images:
                grouped_images[label] = []
            grouped_images[label].append(valid_images[idx])

        grouped_images_list = list(grouped_images.values())

        return jsonify({"groups": grouped_images_list}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
