FROM python:3.12

# 먼저 requirements만 복사해서 캐시 활용
COPY requirements.txt /app/requirements.txt
WORKDIR /app

RUN pip install --upgrade pip && pip install --no-cache -r requirements.txt

# 앱 코드 복사
COPY . /app

EXPOSE 8080

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "60", "--log-syslog"]