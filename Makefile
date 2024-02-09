push-docker-image:
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 253588643630.dkr.ecr.us-east-1.amazonaws.com
	docker build -t flaskapp ./src/python
	docker tag flaskapp:latest 253588643630.dkr.ecr.us-east-1.amazonaws.com/flaskapptest:app
	docker push 253588643630.dkr.ecr.us-east-1.amazonaws.com/flaskapptest:app