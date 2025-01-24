import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // Ajout de cette ligne pour HapticFeedback
import '../services/api_service.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';

class ColumnWidget extends StatelessWidget {
  final String logo;
  final String description;
  final String buttonText;
  final VoidCallback onButtonClick;

  const ColumnWidget({
    super.key,
    required this.logo,
    required this.description,
    required this.buttonText,
    required this.onButtonClick,
  });

  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();
    final textTheme = Theme.of(context).textTheme;
    
    return Semantics(
      button: true,
      label: buttonText,
      hint: description,
      child: Container(
        padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
        margin: EdgeInsets.symmetric(vertical: 8.0),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          borderRadius: BorderRadius.circular(12.0),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(accessibilityProvider.highContrast ? 0.8 : 0.5),
              spreadRadius: 2,
              blurRadius: 5,
              offset: Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Image.network(
              logo, 
              width: accessibilityProvider.largeText ? 80 : 64,
              height: accessibilityProvider.largeText ? 80 : 64,
              semanticLabel: 'Logo pour $buttonText',
            ),
            SizedBox(height: accessibilityProvider.largeText ? 16.0 : 8.0),
            Text(
              description,
              textAlign: TextAlign.center,
              style: textTheme.bodyLarge?.copyWith( // Utiliser bodyLarge au lieu de bodyMedium
                color: accessibilityProvider.highContrast 
                    ? Colors.white 
                    : Colors.black87,
                fontSize: accessibilityProvider.largeText 
                    ? 18.0 * 1.3  // Augmenter la taille de 30%
                    : 18.0,
              ),
            ),
            SizedBox(height: accessibilityProvider.largeText ? 16.0 : 8.0),
            ElevatedButton(
              onPressed: () {
                // Retour haptique pour accessibilité
                HapticFeedback.mediumImpact();
                onButtonClick();
              },
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(
                  horizontal: accessibilityProvider.largeText ? 32.0 : 24.0,
                  vertical: accessibilityProvider.largeText ? 16.0 : 12.0,
                ),
                textStyle: TextStyle(
                  fontSize: accessibilityProvider.largeText ? 18.0 : 16.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
              child: Text(buttonText),
            ),
          ],
        ),
      ),
    );
  }
}