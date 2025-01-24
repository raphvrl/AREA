FROM ghcr.io/cirruslabs/flutter:stable

WORKDIR /app

COPY . .

RUN flutter pub get

RUN flutter build apk --release

RUN mkdir -p /apk && \
    cp build/app/outputs/flutter-apk/app-release.apk /apk/mobile.apk

CMD ["tail", "-f", "/dev/null"]