from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
from gradio_client import Client, file
import google.generativeai as genai

genai.configure(api_key="AIzaSyCaMUsyaIG6IK_AmVWLj6CEyNTUgpQQWR4")

model = genai.GenerativeModel("gemini-1.5-flash")
app = Flask(__name__)
CORS(app)

client = Client("tonyassi/voice-clone")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({"error": "Text input is required"}), 400
    
    response = model.generate_content("Give reply like a family member,be inspirational, talk like a wise man, take breaks using ... use filler words ",generation_config= genai.GenerationConfig(
        max_output_tokens=100,
    ))
    
    print(response.text)

    # Predict using the provided audio file
    result = client.predict(
        text=response.text,
        audio=file('D:\\ApartFC\\hackathon\\rubix\\rubix-2025\\rizzo.wav'),
        api_name="/predict",
        
    )

    # Assuming `result` is the path to the audio file
    return send_file(result, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
