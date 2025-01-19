// lib/providers/accessibility_provider.dart
import 'package:flutter/material.dart';

class AccessibilityProvider extends ChangeNotifier {
  bool _largeText = false;
  bool _highContrast = false;
  bool _reduceAnimations = false;
  double _spacing = 1.0;

  bool get largeText => _largeText;
  bool get highContrast => _highContrast;
  bool get reduceAnimations => _reduceAnimations;
  double get spacing => _spacing;

  // Ajout des durées d'animation
  Duration get animationDuration => _reduceAnimations 
    ? Duration(milliseconds: 100)  // Animation rapide
    : Duration(milliseconds: 300); // Animation normale

  TextTheme get textTheme {
    final baseFontSize = _largeText ? 1.3 : 1.0; // Facteur d'échelle
    
    return TextTheme(
      // Titres
      headlineLarge: TextStyle(
        fontSize: 32.0 * baseFontSize,
        height: 1.5,
        fontWeight: FontWeight.bold,
      ),
      headlineMedium: TextStyle(
        fontSize: 28.0 * baseFontSize,
        height: 1.5,
      ),
      // Corps du texte
      bodyLarge: TextStyle(
        fontSize: 18.0 * baseFontSize,
        height: 1.5,
      ),
      bodyMedium: TextStyle(
        fontSize: 16.0 * baseFontSize,
        height: 1.5,
      ),
      // Labels et boutons
      labelLarge: TextStyle(
        fontSize: 16.0 * baseFontSize,
        letterSpacing: 0.5,
        fontWeight: FontWeight.bold,
      ),
      labelMedium: TextStyle(
        fontSize: 14.0 * baseFontSize,
        letterSpacing: 0.5,
      ),
    );
  }

  ColorScheme get colorScheme {
    return ColorScheme.fromSeed(
      seedColor: Color(0xFF1976D2),
      // Inverser la condition ici
      brightness: _highContrast ? Brightness.dark : Brightness.light,
    ).copyWith(
      // Ajuster les couleurs pour un meilleur contraste
      primary: _highContrast 
        ? Color(0xFF2196F3)  // Plus clair quand contraste élevé
        : Color(0xFF1976D2), // Normal quand contraste normal
      secondary: _highContrast 
        ? Color(0xFFFFAB40)  // Plus clair quand contraste élevé
        : Color(0xFFFF8800), // Normal quand contraste normal
      // Ajouter des couleurs de surface pour un meilleur contraste
      surface: _highContrast ? Colors.black : Colors.white,
      onSurface: _highContrast ? Colors.white : Colors.black,
    );
  }

  // Pour appliquer les changements d'animation dans l'application
  PageTransitionsTheme get pageTransitionsTheme {
    return PageTransitionsTheme(
      builders: {
        TargetPlatform.android: _reduceAnimations 
          ? FadeUpwardsPageTransitionsBuilder()
          : ZoomPageTransitionsBuilder(),
        TargetPlatform.iOS: _reduceAnimations 
          ? FadeUpwardsPageTransitionsBuilder()
          : CupertinoPageTransitionsBuilder(),
      },
    );
  }

  void toggleLargeText() {
    _largeText = !_largeText;
    notifyListeners();
  }

  void toggleHighContrast() {
    _highContrast = !_highContrast;
    notifyListeners();
  }

  void toggleReduceAnimations() {
    _reduceAnimations = !_reduceAnimations;
    notifyListeners();
  }
}