FROM python:3.10-slim

# Tạo thư mục làm việc trong container
WORKDIR /app

# Cài các gói cần thiết
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ project vào container
COPY . .

# Chạy Flask app
CMD ["python", "fine_tune/server.py"]
