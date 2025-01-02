import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';
import 'security_page.dart';
import 'help_page.dart';
import 'edit_profile_page.dart';

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();

    return Container(
      padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
      child: Column(
        children: [
          CircleAvatar(
            radius: accessibilityProvider.largeText ? 60 : 50,
            backgroundColor: Theme.of(context).primaryColor,
            child: Icon(
              Icons.person,
              size: accessibilityProvider.largeText ? 60 : 50,
              color: Colors.white,
              semanticLabel: 'Photo de profil',
            ),
          ),
          SizedBox(height: accessibilityProvider.largeText ? 24 : 16),
          Semantics(
            label: 'Nom d\'utilisateur',
            child: Text(
              'John Doe',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontSize: accessibilityProvider.largeText ? 32.0 : 24.0,
                color: accessibilityProvider.highContrast 
                    ? Colors.white 
                    : Colors.black,
              ),
            ),
          ),
          SizedBox(height: accessibilityProvider.largeText ? 40 : 32),
          ListTile(
            leading: Icon(
              Icons.edit,
              size: accessibilityProvider.largeText ? 28 : 24,
              color: accessibilityProvider.highContrast ? Colors.white : null,
            ),
            title: Text(
              'Modifier le profil',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
                color: accessibilityProvider.highContrast ? Colors.white : null,
              ),
            ),
            trailing: Icon(
              Icons.arrow_forward_ios,
              size: accessibilityProvider.largeText ? 24 : 20,
              color: accessibilityProvider.highContrast ? Colors.white : null,
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => EditProfilePage()),
              );
            },
          ),
          ListTile(
            leading: Icon(
              Icons.security,
              size: accessibilityProvider.largeText ? 28 : 24,
              color: accessibilityProvider.highContrast ? Colors.white : null,
            ),
            title: Text(
              'Sécurité',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
                color: accessibilityProvider.highContrast ? Colors.white : null,
              ),
            ),
            trailing: Icon(
              Icons.arrow_forward_ios,
              size: accessibilityProvider.largeText ? 24 : 20,
              color: accessibilityProvider.highContrast ? Colors.white : null,
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => SecurityPage()),
              );
            },
          ),
          ListTile(
            leading: Icon(
              Icons.help_outline,
              size: accessibilityProvider.largeText ? 28 : 24,
              color: accessibilityProvider.highContrast ? Colors.white : null,
            ),
            title: Text(
              'Aide',
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
                color: accessibilityProvider.highContrast ? Colors.white : null,
              ),
            ),
            trailing: Icon(
              Icons.arrow_forward_ios,
              size: accessibilityProvider.largeText ? 24 : 20,
              color: accessibilityProvider.highContrast ? Colors.white : null,
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => HelpPage()),
              );
            },
          ),
        ],
      ),
    );
  }
}