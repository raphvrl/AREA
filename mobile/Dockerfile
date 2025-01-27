FROM ubuntu:20.04

RUN apt-ger update && ap-get install -y \
    curl \
    git \
    openjdk-11-jdk \
    build-essential \

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN npm install -g expo