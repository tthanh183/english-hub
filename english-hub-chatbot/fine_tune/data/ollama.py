import csv
import time
import os
import pandas as pd
import requests
import argparse


def get_from_ollama(word, model_name="llama3:latest"):
    """Get definition and example for a word using local Ollama LLM"""
    # Prompt template to get both definition and example
    prompt = f"""
    Provide a concise definition and a short example sentence for the English word "{word}".
    Format your response as:
    DEFINITION: [your definition here]
    EXAMPLE: [your example sentence here]
    """

    try:
        # Make API request to local Ollama instance
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model_name,
                "prompt": prompt,
                "stream": False
            },
            timeout=30
        )

        if response.status_code == 200:
            result = response.json()
            response_text = result.get("response", "")

            # Extract definition and example from response
            definition, example = "", ""

            for line in response_text.split("\n"):
                line = line.strip()
                if line.startswith("DEFINITION:"):
                    definition = line.replace("DEFINITION:", "").strip()
                elif line.startswith("EXAMPLE:"):
                    example = line.replace("EXAMPLE:", "").strip()

            # Clean up definition if needed
            if definition and not definition[0].isupper():
                definition = definition[0].upper() + definition[1:]
            if definition and not definition.endswith(('.', '!', '?')):
                definition += '.'

            return definition, example
        else:
            print(
                f"Error with Ollama API for '{word}': {response.status_code}")
            return "", ""
    except Exception as e:
        print(f"Exception when calling Ollama for '{word}': {e}")
        return "", ""


def main():
    parser = argparse.ArgumentParser(
        description='Generate word definitions and examples using Ollama')
    parser.add_argument('--model', type=str,
                        default="llama3:latest", help='Ollama model to use')
    parser.add_argument('--input', type=str,
                        default="ENGLISH_CERF_WORDS.csv", help='Input CSV file')
    parser.add_argument('--output', type=str,
                        default="words.csv", help='Output CSV file')
    parser.add_argument('--delay', type=float, default=0.5,
                        help='Delay between API calls (seconds)')
    args = parser.parse_args()

    input_path = args.input
    output_path = args.output
    model_name = args.model
    delay = args.delay

    # Check if Ollama is running
    try:
        requests.get("http://localhost:11434", timeout=2)
    except:
        print("Error: Cannot connect to Ollama. Make sure it's running on localhost:11434")
        return

    # Track words we've already processed
    done_words = set()
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                done_words.add(row["word"])
        print(f"Found {len(done_words)} already processed words")

    # Read input file
    df = pd.read_csv(input_path)
    words = df.iloc[:, 0].drop_duplicates().tolist()
    total_words = len(words)

    # Create output file with header if it doesn't exist
    if not os.path.exists(output_path):
        with open(output_path, "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(
                f, fieldnames=["word", "definition", "example"])
            writer.writeheader()

    # Process each word
    for i, word in enumerate(words):
        if word in done_words:
            print(f"[{i+1}/{total_words}] Skip: {word}")
            continue

        print(f"[{i+1}/{total_words}] Processing: {word}")

        # Get definition and example from Ollama
        definition, example = get_from_ollama(word, model_name)

        # Write to CSV
        with open(output_path, "a", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(
                f, fieldnames=["word", "definition", "example"])
            writer.writerow({
                "word": word,
                "definition": definition,
                "example": example
            })

        print(f"  Definition: {definition}")
        print(f"  Example: {example}")
        print("-" * 40)

        # Delay to avoid overwhelming the API
        time.sleep(delay)

    print(
        f"Completed processing {total_words} words. Results saved to {output_path}")


if __name__ == "__main__":
    main()
