FROM reactnativecommunity/react-native-android:latest

RUN npm install -g eas-cli

WORKDIR /app

COPY . .

RUN git init

RUN npm install

ENV CI=1
ENV EXPO_TOKEN=bG8O5cCIaACsIWQDzX8ul7ls_EunSAXrg1AZSPxN
ENV EAS_LOCAL_BUILD_ARTIFACTS_DIR=/apk

RUN npm install -g expo-doctor

RUN npx expo-doctor || true

RUN eas init --force --id d1855607-a494-4456-b6b6-cf0041758dc4
RUN eas build --platform android --local --non-interactive --profile production  

VOLUME /apk