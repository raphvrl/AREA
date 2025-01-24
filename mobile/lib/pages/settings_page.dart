import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';

class SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text('Paramètres d\'accessibilité'),
      ),
      body: ListView(
        padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
        children: [
          ListTile(
            leading: Icon(Icons.accessibility_new),
            title: Text(
              'Options d\'accessibilité',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            subtitle: Text(
              'Paramètres pour améliorer l\'accessibilité',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 16 : 14,
              ),
            ),
          ),
          Divider(),
          SwitchListTile(
            title: Text(
              'Gros texte',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            subtitle: Text(
              'Augmente la taille du texte pour une meilleure lisibilité',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 16 : 14,
              ),
            ),
            secondary: Icon(Icons.text_fields),
            value: accessibilityProvider.largeText,
            onChanged: (bool value) {
              context.read<AccessibilityProvider>().toggleLargeText();
            },
          ),
          SwitchListTile(
            title: Text(
              'Contraste élevé',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            subtitle: Text(
              'Améliore le contraste des couleurs',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 16 : 14,
              ),
            ),
            secondary: Icon(Icons.contrast),
            value: accessibilityProvider.highContrast,
            onChanged: (bool value) {
              context.read<AccessibilityProvider>().toggleHighContrast();
            },
          ),
          SwitchListTile(
            title: Text(
              'Réduire les animations',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            subtitle: Text(
              'Simplifie les animations de l\'interface',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 16 : 14,
              ),
            ),
            secondary: Icon(Icons.animation),
            value: accessibilityProvider.reduceAnimations,
            onChanged: (bool value) {
              context.read<AccessibilityProvider>().toggleReduceAnimations();
            },
          ),
        ],
      ),
    );
  }
}