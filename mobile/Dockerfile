FROM reactnativecommunity/react-native-android:latest

RUN npm install -g eas-cli

WORKDIR /app

COPY . .

RUN git init

RUN npm install

ENV CI=1
ENV EXPO_TOKEN=bG8O5cCIaACsIWQDzX8ul7ls_EunSAXrg1AZSPxN
ENV EAS_LOCAL_BUILD_ARTIFACTS_DIR=/apk
ENV NODE_ENV=production

RUN npm install -g expo-doctor
RUN npx expo-doctor || true

RUN eas build --platform android --local --non-interactive --profile production

VOLUME /apk