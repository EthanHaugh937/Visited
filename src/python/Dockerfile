FROM python:3.11

COPY . .

COPY requirements.txt . 

ARG ACCESS_KEY
ENV COSMOS_ACCOUNT_KEY=${ACCESS_KEY}

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["waitress-serve", "--port=5000", "app:app"]