FROM reactnativecommunity/react-native-android:latest

RUN npm install -g eas-cli

WORKDIR /app

COPY . .

RUN git init

RUN npm install



RUN npm install -g expo-doctor
RUN npx expo-doctor || true

RUN eas build --platform android --local --non-interactive --profile production

VOLUME /apk