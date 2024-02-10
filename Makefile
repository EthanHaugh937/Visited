# Manually build and push backend Docker Image to ECR
push-docker-image:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 253588643630.dkr.ecr.us-east-1.amazonaws.com
	docker build -t flaskapp ./src/python
	docker tag flaskapp:latest 253588643630.dkr.ecr.us-east-1.amazonaws.com/flaskapptest:app
	docker push 253588643630.dkr.ecr.us-east-1.amazonaws.com/flaskapptest:app

# Install python dependencies
py-deps:
	cd src/python && venv\Scripts\activate && pip install -r requirements.txt

# Install typescript dependencies
ts-deps:
	cd src/frontend-ts && npm install

# Launch frontend application
frontend:
	cd src/frontend-ts && npm start

# Launch backend application
backend:
	cd src/python && venv\Scripts\activate && waitress-serve --port=5000 app:app

