FROM python:3.11

COPY app.py .

COPY requirements.txt . 

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["waitress-serve", "--port=5000", "app:app"]