FROM reactnativecommunity/react-native-android:latest

RUN npm install -g eas-cli

WORKDIR /app

COPY . .

RUN git init

RUN npm install

ENV CI=1
ENV EXPO_TOKEN=bG8O5cCIaACsIWQDzX8ul7ls_EunSAXrg1AZSPxN

RUN npm install -g expo-doctor

RUN npx expo-doctor

RUN eas init --force --id d1855607-a494-4456-b6b6-cf0041758dc4
RUN eas build --platform android --profile development --local --non-interactive

RUN mkdir -p /apk
RUN ls -la /app/android/app/build/outputs/apk || true

RUN find /app -name "*.apk" -exec cp {} /apk/ \; || echo "Aucun APK trouvé"
RUN mv /apk/*.apk /apk/area.apk

VOLUME /apk