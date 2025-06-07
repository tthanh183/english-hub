import pandas as pd
import json
import random

# Load file questions.csv
df_questions = pd.read_csv("questions.csv")

# Lấy ngẫu nhiên một phần nhỏ của question1
question_list = df_questions["question1"].dropna().tolist()
random.shuffle(question_list)
sample_size = 1000  # Bạn có thể chỉnh về 500, 2000 tùy yêu cầu

# Các câu trả lời từ chối đa dạng
OOD_RESPONSES = [
    "Sorry, I don't know the answer to that.",
    "I'm not sure how to answer that.",
    "That question is outside my knowledge.",
    "I cannot help with that query.",
    "I don't have information on that topic."
]

# Tạo dữ liệu OOD
data_ood = []
for question in question_list[:sample_size]:
    response = random.choice(OOD_RESPONSES)
    data_ood.append({
        "instruction": question.strip(),
        "response": response
    })

# Lưu ra file jsonl
with open("ood_data.jsonl", "w", encoding="utf-8") as f:
    for item in data_ood:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")

print(f"Created ood_data.jsonl with {len(data_ood)} examples.")
