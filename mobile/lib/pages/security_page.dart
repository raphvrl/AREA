import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';

class SecurityPage extends StatefulWidget {
  @override
  _SecurityPageState createState() => _SecurityPageState();
}

class _SecurityPageState extends State<SecurityPage> {
  bool _isCurrentPasswordVisible = false;
  bool _isNewPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text('Sécurité'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Changer le mot de passe',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            SizedBox(height: 24),
            TextFormField(
              obscureText: !_isCurrentPasswordVisible,
              decoration: InputDecoration(
                labelText: 'Mot de passe actuel',
                prefixIcon: Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(
                    _isCurrentPasswordVisible ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () {
                    setState(() {
                      _isCurrentPasswordVisible = !_isCurrentPasswordVisible;
                    });
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextFormField(
              obscureText: !_isNewPasswordVisible,
              decoration: InputDecoration(
                labelText: 'Nouveau mot de passe',
                prefixIcon: Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(
                    _isNewPasswordVisible ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () {
                    setState(() {
                      _isNewPasswordVisible = !_isNewPasswordVisible;
                    });
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            SizedBox(height: 16),
            TextFormField(
              obscureText: !_isConfirmPasswordVisible,
              decoration: InputDecoration(
                labelText: 'Confirmer le nouveau mot de passe',
                prefixIcon: Icon(Icons.lock_outline),
                suffixIcon: IconButton(
                  icon: Icon(
                    _isConfirmPasswordVisible ? Icons.visibility_off : Icons.visibility,
                  ),
                  onPressed: () {
                    setState(() {
                      _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                    });
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Implémenter la logique de changement de mot de passe ici
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Mot de passe mis à jour')),
                );
                Navigator.pop(context);
              },
              child: Text('Mettre à jour le mot de passe'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
              ),
            ),
          ],
        ),
      ),
    );
  }
}