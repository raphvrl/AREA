import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';

class HelpPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text('Aide'),
      ),
      body: ListView(
        padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
        children: [
          ExpansionTile(
            leading: Icon(Icons.info_outline),
            title: Text(
              'À propos de l\'application',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            children: [
              Padding(
                padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
                child: Text(
                  'Cette application vous permet de gérer vos services et accéder à différentes APIs.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontSize: accessibilityProvider.largeText ? 18 : 16,
                  ),
                ),
              ),
            ],
          ),
          ExpansionTile(
            leading: Icon(Icons.accessibility_new),
            title: Text(
              'Accessibilité',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            children: [
              Padding(
                padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'L\'application propose plusieurs fonctionnalités d\'accessibilité :',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        fontSize: accessibilityProvider.largeText ? 18 : 16,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text('• Taille de texte ajustable'),
                    Text('• Mode contraste élevé'),
                    Text('• Réduction des animations'),
                  ],
                ),
              ),
            ],
          ),
          ExpansionTile(
            leading: Icon(Icons.security),
            title: Text(
              'Sécurité',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            children: [
              Padding(
                padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
                child: Text(
                  'Vous pouvez modifier votre mot de passe dans la section Sécurité de votre profil.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontSize: accessibilityProvider.largeText ? 18 : 16,
                  ),
                ),
              ),
            ],
          ),
          ExpansionTile(
            leading: Icon(Icons.contact_support),
            title: Text(
              'Contact',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            children: [
              Padding(
                padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Pour toute question ou assistance :',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        fontSize: accessibilityProvider.largeText ? 18 : 16,
                      ),
                    ),
                    SizedBox(height: 8),
                    ListTile(
                      leading: Icon(Icons.email),
                      title: Text('support@example.com'),
                    ),
                    ListTile(
                      leading: Icon(Icons.phone),
                      title: Text('01 23 45 67 89'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}