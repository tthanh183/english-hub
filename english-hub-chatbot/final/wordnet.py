import csv
import time
import os
import pandas as pd
import requests
from nltk.corpus import wordnet
import nltk

# Tải WordNet nếu chưa có
try:
    wordnet.synsets("test")
except LookupError:
    print("Downloading WordNet...")
    nltk.download('wordnet')


def get_from_wordnet(word):
    """Lấy definition và example từ WordNet (offline)"""
    # Xử lý từ ghép có dấu /
    if "/" in word:
        word = word.split("/")[0]

    synsets = wordnet.synsets(word)
    if synsets:
        definition = synsets[0].definition()
        examples = synsets[0].examples()
        example = examples[0] if examples else ""

        # Chuẩn hóa định nghĩa (viết hoa chữ đầu, thêm dấu chấm)
        definition = definition.capitalize()
        if not definition.endswith(('.', '!', '?')):
            definition += '.'

        return definition, example
    return "", ""  # Nếu không tìm thấy trong WordNet, trả về trống


def get_from_dictionaryapi(word):
    """Lấy definition và example từ DictionaryAPI (online, miễn phí)"""
    # Xử lý từ ghép có dấu /
    if "/" in word:
        word = word.split("/")[0]

    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        definition = ""
        example = ""

        if isinstance(data, list) and len(data) > 0:
            meanings = data[0].get("meanings", [])
            for meaning in meanings:
                defs = meaning.get("definitions", [])
                for d in defs:
                    if not definition and "definition" in d:
                        definition = d["definition"]
                    if not example and "example" in d:
                        example = d["example"]
                    if definition and example:
                        break
                if definition and example:
                    break

        # Chuẩn hóa định nghĩa
        if definition and not definition[0].isupper():
            definition = definition[0].upper() + definition[1:]
        if definition and not definition.endswith(('.', '!', '?')):
            definition += '.'

        return definition, example
    except Exception as e:
        print(f"DictionaryAPI error for '{word}': {e}")
        return "", ""


def get_definition_and_example(word):
    """Kết hợp cả WordNet và DictionaryAPI"""
    # Lấy từ WordNet trước (offline, nhanh)
    wn_definition, wn_example = get_from_wordnet(word)

    # Nếu WordNet có đầy đủ thông tin, dùng luôn
    if wn_definition and wn_example:
        return wn_definition, wn_example

    # Nếu thiếu definition hoặc example, thử DictionaryAPI
    if not wn_definition or not wn_example:
        dict_definition, dict_example = get_from_dictionaryapi(word)

        # Kết hợp kết quả từ hai nguồn
        final_definition = wn_definition or dict_definition
        final_example = wn_example or dict_example

        return final_definition, final_example

    return wn_definition, wn_example


def main():
    input_path = "ENGLISH_CERF_WORDS.csv"
    output_path = "words.csv"

    # Đọc các từ đã làm rồi (nếu có)
    done_words = set()
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                done_words.add(row["word"])

    # Đọc danh sách từ từ file CSV
    df = pd.read_csv(input_path)
    words = df.iloc[:, 0].drop_duplicates().tolist()

    # Nếu file chưa có header, ghi header
    if not os.path.exists(output_path):
        with open(output_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(
                f, fieldnames=["word", "definition", "example"])
            writer.writeheader()

    for word in words:
        if word in done_words:
            print(f"Skip: {word}")
            continue

        # Dùng cả WordNet và DictionaryAPI
        definition, example = get_definition_and_example(word)

        # Ghi vào file CSV dù có hay không có dữ liệu
        with open(output_path, "a", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(
                f, fieldnames=["word", "definition", "example"])
            writer.writerow(
                {"word": word, "definition": definition, "example": example})

        print(f"{word}: {definition} | {example}")

        # Chờ giữa các request đến DictionaryAPI
        # Chỉ chờ nếu thực sự đã gọi API (không có từ WordNet)
        if not (get_from_wordnet(word)[0] and get_from_wordnet(word)[1]):
            time.sleep(0.5)  # 0.5 giây để tránh quá tải API


if __name__ == "__main__":
    main()
