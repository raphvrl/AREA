import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';

class EditProfilePage extends StatefulWidget {
  @override
  _EditProfilePageState createState() => _EditProfilePageState();
}

class _EditProfilePageState extends State<EditProfilePage> {
  final _nameController = TextEditingController(text: 'John Doe');
  final _bioController = TextEditingController(text: 'Votre bio ici...');

  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Text('Modifier le profil'),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Stack(
              alignment: Alignment.bottomRight,
              children: [
                CircleAvatar(
                  radius: accessibilityProvider.largeText ? 70 : 60,
                  backgroundColor: Theme.of(context).primaryColor,
                  child: Icon(Icons.person, size: accessibilityProvider.largeText ? 70 : 60, color: Colors.white),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: Icon(Icons.camera_alt, color: Colors.white),
                    onPressed: () {
                      // Implémenter la sélection de photo
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Fonctionnalité à venir')),
                      );
                    },
                  ),
                ),
              ],
            ),
            SizedBox(height: accessibilityProvider.largeText ? 24 : 16),
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Nom',
                prefixIcon: Icon(Icons.person_outline),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            SizedBox(height: accessibilityProvider.largeText ? 24 : 16),
            TextFormField(
              controller: _bioController,
              maxLines: 4,
              decoration: InputDecoration(
                labelText: 'Bio',
                prefixIcon: Icon(Icons.description_outlined),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                alignLabelWithHint: true,
              ),
              style: TextStyle(
                fontSize: accessibilityProvider.largeText ? 18 : 16,
              ),
            ),
            SizedBox(height: accessibilityProvider.largeText ? 24 : 16),
            ElevatedButton(
              onPressed: () {
                // Sauvegarder les modifications
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Profil mis à jour')),
                );
                Navigator.pop(context);
              },
              child: Text('Enregistrer les modifications'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
                textStyle: TextStyle(
                  fontSize: accessibilityProvider.largeText ? 18 : 16,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    super.dispose();
  }
}