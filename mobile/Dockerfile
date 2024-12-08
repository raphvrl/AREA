FROM cirrusci/flutter:stable

WORKDIR /app
COPY . /app/

RUN flutter pub get

CMD ["bash", "-c", "flutter build apk --release && cp build/app/outputs/flutter-apk/app-release.apk /app/shared/client.apk"]
