# Action-Reaction Project

## Description

Le projet **Action-Reaction** vise à créer une plateforme d'automatisation similaire à **IFTTT** et **Zapier**. Elle permet de connecter différents services pour déclencher des actions automatiques en réponse à des événements. L'application est divisée en trois parties :
- **Serveur d'application** : Gère la logique métier et expose une API REST.
- **Client Web** : Fournit une interface utilisateur pour interagir avec l'application.
- **Client Mobile** : Permet d'utiliser l'application sur un smartphone.

Pour plus d'informations, consultez notre étude comparative sur [EtudeComparative.md](EtudeComparative.md) ainsi que la liste de nos API ici [API.md](API.md).

## Fonctionnalités

L'application offre les fonctionnalités suivantes :
1. **Gestion des utilisateurs** : Inscription, connexion, gestion des profils.
2. **Abonnement aux services** : Intégration des comptes tiers via OAuth2 ou Clé API.
3. **Création d'AREA** : Combinaison d'Actions et de Réactions pour automatiser des tâches.
4. **Déclencheurs automatiques** : Surveillance des conditions pour exécuter les REActions.
5. **Accessibilité** : Respect des bonnes pratiques pour rendre l'application accessible.

### Services Supportés

| Service           | OAuth2 Supporté | Méthode Alternative |
|-------------------|-----------------|---------------------|
| **X**             | Oui             | -                   |
| **Alpha Vantage** | Non             | Clé API             |
| **Meta**          | Oui             | -                   |
| **Spotify**       | Oui             | -                   |
| **AudD API**      | Non             | Clé API             |
| **Google**        | Oui             | -                   |
| **LinkedIn**      | Oui             | -                   |

### Exemples d'AREA
- **Gmail & OneDrive** :
  - **Action** : Réception d'un email contenant une pièce jointe.
  - **Réaction** : Enregistrement de la pièce jointe dans un dossier OneDrive.
- **GitHub & Teams** :
  - **Action** : Création d'une issue sur un dépôt.
  - **Réaction** : Envoi d'un message dans Teams.

---

## Installation

### Prérequis
- **Docker** et **Docker Compose** installés sur votre machine.
- Fichier `.env` contenant les clés d'API et les secrets OAuth2.

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone git@github.com:EpitechPromo2027/B-DEV-500-BDX-5-2-area-thomas.gaboriaud.git
   cd B-DEV-500-BDX-5-2-area-thomas.gaboriaud
