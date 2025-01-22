from gradio_client import Client, file

client = Client("tonyassi/voice-clone")
result = client.predict(
		text="Hello it was nice to meet you",
		audio=file('D:\\ApartFC\\hackathon\\rubix\\rubix-2025\\rizzo.wav'),
		api_name="/predict"
)
print(result)
# https://huggingface.co/spaces/tonyassi/voice-clone
# C:\Users\Ritojnan\AppData\Local\Temp\gradio\f4c63431eb57aa29d5f8e0ea92e201916e37a24bca175e97fee89c34fc27c210\