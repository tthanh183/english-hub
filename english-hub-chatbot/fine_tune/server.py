from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "flan-t5-base-1106")

tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSeq2SeqLM.from_pretrained(model_path).to(
    "cuda" if torch.cuda.is_available() else "cpu")
model.eval()


def remove_repeated_phrases(text):
    pattern = r'\b(\w+)(,? \1\b)+'
    return re.sub(pattern, r'\1', text, flags=re.IGNORECASE)


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    if not prompt:
        return jsonify({"error": "Missing prompt"}), 400

    inputs = tokenizer(prompt, return_tensors="pt",
                       padding=True, truncation=True).to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=150,         # đủ dài để giải thích chi tiết
        no_repeat_ngram_size=4,     # hạn chế lặp nhiều hơn
        early_stopping=True,
        num_beams=10,               # beam search rộng hơn, chọn câu tốt hơn
        temperature=0.3,            # giảm độ sáng tạo, tránh lỗi
        repetition_penalty=2.0,     # phạt lặp từ mạnh hơn
    )

    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
    decoded = remove_repeated_phrases(decoded)
    decoded = decoded.strip('"').replace('\\', '')
    return jsonify({"response": decoded})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)
