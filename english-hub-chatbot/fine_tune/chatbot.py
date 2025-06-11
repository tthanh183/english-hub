# !pip install transformers datasets accelerate - q

import pandas as pd
import json
import torch
from datasets import Dataset
from transformers import T5Tokenizer, T5ForConditionalGeneration, TrainingArguments, Trainer

# 1. Tải mô hình Flan-T5-Large từ Hugging Face
model_name = "google/flan-t5-base"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name).to("cuda")

# 2. Xử lý file CSV vocab
df = pd.read_csv("/kaggle/input/words-ollama/words.csv")  # Sửa path nếu cần

definition_templates = [
    "What does {word} mean?",
    "Can you define {word}?",
    "Tell me the meaning of {word}.",
    "What's the meaning of {word}?",
    "Explain the word {word}."
]
example_templates = [
    "Can you give me an example of {word}?",
    "Show me a sentence using {word}.",
    "How is {word} used in a sentence?",
    "Give an example sentence with {word}.",
    "Use {word} in a sentence."
]

data_vocab = []
for _, row in df.iterrows():
    word = str(row["word"])
    definition = str(row["definition"]) if pd.notnull(
        row["definition"]) else "No definition available."
    example = str(row["example"]) if pd.notnull(
        row["example"]) else "No example available."

    for temp in definition_templates:
        instruction = temp.format(word=word)
        response = definition
        data_vocab.append({"instruction": instruction, "response": response})

    for temp in example_templates:
        instruction = temp.format(word=word)
        response = example
        data_vocab.append({"instruction": instruction, "response": response})

# 3. Đọc dữ liệu ngoài (out-domain)
out_domain_file = "/kaggle/input/ood-json/ood_data.jsonl"  # Sửa path đúng
data_out_domain = []
with open(out_domain_file, "r") as f:
    for line in f:
        item = json.loads(line)
        data_out_domain.append(item)

# 4. Bổ sung dữ liệu chào hỏi, tạm biệt, giới thiệu
greeting_templates = [
    "Hi, how are you?", "Hello, nice to meet you.", "Good morning!", "Hey there!", "Hi", "Hello"
]
farewell_templates = [
    "Goodbye!", "Bye", "See you later!", "Have a nice day!", "Take care!"
]
intro_templates = [
    "Tell me about yourself.", "Who are you?", "Introduce yourself."
]

for temp in greeting_templates:
    data_vocab.append(
        {"instruction": temp, "response": "Hello! How can I assist you today?"})

for temp in farewell_templates:
    data_vocab.append(
        {"instruction": temp, "response": "Goodbye! Have a great day!"})

for temp in intro_templates:
    data_vocab.append(
        {"instruction": temp, "response": "I'm a language model trained to assist you with various tasks!"})
    
# 5. Kết hợp dữ liệu
data_all = data_vocab + data_out_domain
dataset = Dataset.from_pandas(pd.DataFrame(data_all).reset_index(drop=True))

print("Number of samples in data_vocab:", len(data_vocab))
print("Number of samples in data_out_domain:", len(data_out_domain))
print("Total number of samples after merging:", len(data_all))


# 6. Tokenize dữ liệu
max_length = 256


def preprocess(example):
    input_text = example['instruction']
    target_text = example['response']
    model_inputs = tokenizer(
        input_text, max_length=max_length, truncation=True, padding="max_length")
    labels = tokenizer(target_text, max_length=max_length,
                       truncation=True, padding="max_length")
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs


tokenized_dataset = dataset.map(preprocess)


# 7. Thiết lập huấn luyện
training_args = TrainingArguments(
    output_dir="./flan-t5-finetuned-vocab",
    per_device_train_batch_size=8,  # Giữ batch size hợp lý
    num_train_epochs=4,  # Giảm xuống 3 epoch thay vì 10
    learning_rate=3e-5,
    fp16=True,
    save_strategy="epoch",
    logging_strategy="steps",
    logging_steps=50,
    report_to="none"
)

# 8. Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    tokenizer=tokenizer
)

trainer.train()

# 9. Lưu mô hình
model.save_pretrained("./flan-t5-finetuned-vocab")
tokenizer.save_pretrained("./flan-t5-finetuned-vocab")


