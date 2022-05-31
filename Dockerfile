##Note : please re-write this file as per nodejs , currently it's written for django python


# importing base image
FROM python:3.9

# test change demo

# updating docker host or host machine
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# changing current working directory to /usr/src/app
WORKDIR /usr/src/app

# install dependencies
RUN pip install --upgrade pip 
COPY ./requirements.txt /usr/src/app
RUN pip install -r requirements.txt

# copy project
COPY . /usr/src/app



# informing Docker that the container listens on the
# specified network ports at runtime i.e 8000.
EXPOSE 80

# running server
CMD ["python", "manage.py", "runserver", "0.0.0.0:80"]