| Service           | OAuth2 Supporté | Méthode Alternative | Description                                                                 |
|-------------------|-----------------|---------------------|-----------------------------------------------------------------------------|
| **LinkedIn**      | Oui             | -                   | Permet la connexion des utilisateurs et envoie une notification avec leur nom. |
| **AudD API**      | Non             | Clé API             | Identifie une musique à partir d’un fichier ou d’un flux audio.              |
| **Spotify**       | Oui             | -                   | Lance une musique à partir de la bibliothèque ou des playlists de l’utilisateur. |

Les services proposés permettent d'interagir avec plusieurs API pour offrir une expérience utilisateur fluide et intégrée autour de fonctionnalités spécifiques, notamment dans le domaine musical et de la gestion des connexions sociales. Voici comment ces API fonctionnent ensemble pour créer une solution cohérente :

### Fonctionnement des API

#### 1. **Détection de musique avec AudD**
Le service **AudD** est une API spécialisée dans la reconnaissance musicale. Lorsqu'un utilisateur souhaite identifier une musique, l'application envoie un fichier audio ou un flux directement à l'API AudD. Celle-ci utilise des algorithmes sophistiqués d'analyse audio pour comparer l'extrait à une base de données exhaustive de morceaux. Une fois la correspondance trouvée, l'API renvoie des informations détaillées, telles que le titre de la chanson, l'artiste, l'album, et éventuellement les paroles.

#### 2. **Ajout à la bibliothèque Spotify**
Une fois que la musique est identifiée par **AudD**, ces informations sont utilisées pour interagir avec l'API de **Spotify**. Si l'utilisateur est connecté à Spotify via OAuth2, l'application peut automatiquement ajouter le morceau identifié à la bibliothèque de l'utilisateur ou à une playlist spécifique. Cette intégration est possible grâce au support d’OAuth2 de Spotify, qui permet à l'application de recevoir des autorisations sécurisées pour accéder au compte de l'utilisateur et gérer ses playlists.

#### 3. **Lecture de la musique avec Spotify**
Après que le morceau a été ajouté à la bibliothèque ou à une playlist, l'API de **Spotify** est de nouveau sollicitée pour lancer directement la lecture du morceau. Cela peut se faire via un appareil connecté à Spotify (comme un téléphone ou une enceinte intelligente) ou via l'application elle-même. Ce processus assure une transition transparente entre la détection d'une musique et sa lecture immédiate, améliorant ainsi l'expérience utilisateur.

#### 3. **Notification de Connexion LinkedIn**
En parallèle, lorsque l'utilisateur se connecte à son compte LinkedIn (via OAuth2), une notification est automatiquement envoyée pour informer de cette connexion. Cette notification inclut le nom de l'utilisateur, permettant ainsi de signaler si quelqu'un se connecte à son compte.

### Résumé Technique
- **AudD API** : Analyse audio -> Identification de la musique.
- **Spotify API** : Ajout à la bibliothèque -> Lecture de la musique.
- **LinkedIn API** : Envoi de notifications (via OAuth2).

Ces API interagissent entre elles de manière fluide grâce à des protocoles comme OAuth2 pour les autorisations sécurisées et REST pour les appels HTTP. Cela garantit que les données de l'utilisateur restent protégées tout en permettant une expérience automatisée et intégrée. L'utilisation de ces services permet de créer une solution où une chanson entendue par hasard peut être identifiée, ajoutée à une bibliothèque personnelle, et écoutée immédiatement, tout en partageant l'expérience avec son réseau professionnel.