# !pip install transformers datasets accelerate - q

from transformers import T5Tokenizer, T5ForConditionalGeneration, Trainer, TrainingArguments
from datasets import Dataset
import pandas as pd
import torch
import json

import pandas as pd
import json

df = pd.read_csv("/kaggle/input/output/output.csv")  # Đổi path nếu cần

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

data = []
for _, row in df.iterrows():
    word = str(row["word"])
    definition = str(row["definition"]) if pd.notnull(
        row["definition"]) else ""
    example = str(row["example"]) if pd.notnull(row["example"]) else ""

    for temp in definition_templates:
        instruction = temp.format(word=word)
        response = f"{word.capitalize()} means {definition}."
        data.append({"instruction": instruction, "response": response})

    for temp in example_templates:
        instruction = temp.format(word=word)
        response = f"{example}"
        data.append({"instruction": instruction, "response": response})

# 3. Convert to Hugging Face Dataset
dataset = Dataset.from_pandas(pd.DataFrame(data))


# 4. Load tokenizer and model
model_name = "google/flan-t5-small"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

# 5. Tokenize
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


# 6. Set up training arguments
training_args = TrainingArguments(
    output_dir="./flan-t5-finetuned-vocab",
    per_device_train_batch_size=8,
    num_train_epochs=5,
    learning_rate=3e-5,
    fp16=True,
    save_strategy="epoch",
    logging_strategy="steps",
    logging_steps=20,
    report_to="none"
)

# 7. Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    tokenizer=tokenizer
)

trainer.train()

# 8. Save model
model.save_pretrained("./flan-t5-finetuned-vocab")
tokenizer.save_pretrained("./flan-t5-finetuned-vocab")


# Load model again for inference
model = T5ForConditionalGeneration.from_pretrained(
    "./flan-t5-finetuned-vocab").to("cuda")
tokenizer = T5Tokenizer.from_pretrained("./flan-t5-finetuned-vocab")


def ask_model(prompt):
    inputs = tokenizer(prompt, return_tensors="pt",
                       padding=True, truncation=True).to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=100)
    print(tokenizer.decode(outputs[0], skip_special_tokens=True))


# Thử hỏi
ask_model("What does elated mean?")
ask_model("Use diligent in a sentence.")
