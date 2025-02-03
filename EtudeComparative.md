| **Catégorie**         | **Technologie Utilisée**  | **Points Forts / Pourquoi on les a utilisé**                                                                                       | **Comparaison : Technologie 1**     | **Points Forts de la Technologie 1 / Pourquoi on a hésité à les utiliser**                                | **Comparaison : Technologie 2** | **Points Forts de la Technologie 2 / Pourquoi on a hésité à les utiliser**                        |
|------------------------|---------------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------|---------------------------------------------------------------------|-------------------------------|------------------------------------------------------------|
| **Frontend Mobile**    | **Flutter/Dart**         | - Développement cross-platform natif  <br> - UI riche avec widgets  <br> - Hot Reload pour une productivité accrue  <br> - Technologie maîtrisée par au moins un membre de l’équipe | **React Native/JavaScript**         | - Large communauté  <br> - Utilise JavaScript connu  <br> - Modules natifs tiers disponibles      | **Xamarin/C#**              | - Intégré à l'écosystème Microsoft  <br> - Utilise C#  <br> - Support étendu pour les entreprises |
| **Frontend Web**       | **React/TypeScript**     | - Large écosystème de composants  <br> - Sécurité accrue avec TypeScript  <br> - TailwindCSS pour un styling rapide  <br> - Technologie maîtrisée par au moins un membre de l’équipe | **Vue.js/JavaScript**              | - Courbe d'apprentissage douce  <br> - Réactivité native via Vue  <br> - Composants intuitifs     | **Angular/TypeScript**      | - Framework complet  <br> - Typage statique  <br> - Support d'outils intégrés comme RxJS          |
| **Documentation**      | **Doxygen + Markdown**   | - Documentation automatisée  <br> - Support Markdown simple et flexible  <br> - Technologie maîtrisée par au moins un membre de l’équipe | **Sphinx/ReST**                    | - Génération automatique avec ReST  <br> - Fonctionnalités avancées pour Python et d'autres langages | **Javadoc**                | - Adapté pour Java  <br> - Génération automatique intégrée aux outils Java                        |
| **Build Systems**      | **CMake/XCode/Gradle**   | - Support multi-plateforme  <br> - Flexibilité pour projets complexes  <br> - Technologie maîtrisée par au moins un membre de l’équipe | **Makefile**                        | - Minimaliste et rapide  <br> - Bien adapté pour les projets Linux                                | **Meson/Ninja**             | - Syntaxe moderne et claire  <br> - Optimisé pour la vitesse                                   |



Ce tableau est une étude comparative des technologies utilisées dans différents aspects d'un projet, accompagnée d'une analyse des alternatives considérées. Voici une description détaillée des choix effectués et des raisons sous-jacentes :

---

### Analyse des Technologies et Comparaisons

#### **Frontend Mobile**
Pour le développement mobile, l'équipe a choisi **Flutter/Dart**, une technologie puissante pour le développement cross-platform. Flutter offre des fonctionnalités comme une UI riche basée sur des widgets, le Hot Reload pour une productivité accrue, et un développement natif performant. Un autre point fort est que cette technologie est déjà maîtrisée par au moins un membre de l’équipe, ce qui réduit la courbe d'apprentissage.

Cependant, des alternatives ont été envisagées :
- **React Native/JavaScript** : Cette technologie bénéficie d’une large communauté, d’un écosystème bien établi avec de nombreux modules natifs tiers, et de l’utilisation de JavaScript, un langage souvent connu des développeurs.
- **Xamarin/C#** : Intégré à l’écosystème Microsoft, Xamarin propose un support étendu pour les entreprises et s’appuie sur le langage C#, idéal pour ceux qui travaillent déjà dans cet environnement.

#### **Frontend Web**
Le choix s’est porté sur **React/TypeScript**, grâce à son large écosystème de composants réutilisables, sa sécurité renforcée grâce à TypeScript, et l’utilisation de TailwindCSS pour un stylage rapide et efficace. De plus, cette technologie est maîtrisée par l’équipe, ce qui garantit un démarrage rapide et efficace.

Les alternatives analysées étaient :
- **Vue.js/JavaScript** : Une technologie avec une courbe d’apprentissage douce, offrant une réactivité native et des composants intuitifs, idéale pour les projets nécessitant une mise en œuvre rapide.
- **Angular/TypeScript** : Un framework complet doté d’un typage statique robuste et d’outils intégrés comme RxJS, mais potentiellement plus complexe à prendre en main pour des projets nécessitant plus de flexibilité.

#### **Documentation**
Pour la documentation, l’équipe a opté pour **Doxygen + Markdown**, qui permet une génération automatique de documentation et un format Markdown simple et flexible. Ce choix s’est appuyé sur la maîtrise préalable de cette technologie par au moins un membre de l’équipe, garantissant une mise en œuvre fluide.

Les alternatives envisagées incluaient :
- **Sphinx/ReST** : Recommandé pour les projets Python et offrant des fonctionnalités avancées, mais nécessitant une connaissance préalable du format ReST.
- **Javadoc** : Parfaitement adapté pour les projets Java, avec des outils intégrés pour la génération automatique, mais limité à l’écosystème Java.

#### **Build Systems**
Pour la gestion des systèmes de build, **CMake/XCode/Gradle** a été choisi en raison de son support multi-plateforme, de sa flexibilité pour gérer des projets complexes, et de la maîtrise de cette solution par l’équipe. Cela assure une configuration et un déploiement efficaces dans des environnements variés.

Deux autres solutions ont été considérées :
- **Makefile** : Un système minimaliste et rapide, idéal pour les projets Linux simples, mais moins adapté aux projets multi-plateformes complexes.
- **Meson/Ninja** : Une option moderne et rapide avec une syntaxe claire, mais nécessitant une expertise spécifique pour sa mise en œuvre.

---

### Conclusion
Le tableau met en lumière une approche réfléchie et pragmatique pour choisir les technologies adaptées aux besoins du projet. Chaque technologie retenue a été comparée avec des alternatives en évaluant leurs points forts et leurs inconvénients, tout en tenant compte de la maîtrise technique de l’équipe et des exigences spécifiques du projet. Cette méthodologie garantit une productivité accrue, une intégration fluide et des résultats optimaux.