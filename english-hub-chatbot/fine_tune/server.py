from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import os
from flask_cors import CORS
import re
from langdetect import detect, LangDetectException

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

    # Language detection
    try:
        lang = detect(prompt)
    except LangDetectException:
        lang = "unknown"

    if lang != "en":
        return jsonify({
            "response": "It seems you asked in a language other than English. Please ask your question in English."
        })

    inputs = tokenizer(prompt, return_tensors="pt",
                       padding=True, truncation=True).to(model.device)

    outputs = model.generate(
        **inputs,
        max_new_tokens=150,
        no_repeat_ngram_size=4,
        early_stopping=True,
        num_beams=10,
        temperature=0.3,
        repetition_penalty=2.0,
    )

    decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
    decoded = remove_repeated_phrases(decoded)
    decoded = decoded.strip('"').replace('\\', '')
    return jsonify({"response": decoded})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, threaded=True)
