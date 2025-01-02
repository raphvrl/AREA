import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';

class ServicesPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();

    return Container(
      padding: EdgeInsets.all(accessibilityProvider.largeText ? 24.0 : 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Nos Services',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontSize: accessibilityProvider.largeText ? 32.0 : 24.0,
            ),
          ),
          SizedBox(height: accessibilityProvider.largeText ? 24 : 16),
          Expanded(
            child: ListView.builder(
              itemCount: 5,
              itemBuilder: (context, index) {
                return Card(
                  margin: EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    leading: Icon(Icons.work),
                    title: Text(
                      'Service ${index + 1}',
                      style: TextStyle(
                        fontSize: accessibilityProvider.largeText ? 18.0 : 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Text(
                      'Description du service ${index + 1}',
                      style: TextStyle(
                        fontSize: accessibilityProvider.largeText ? 16.0 : 14.0,
                      ),
                    ),
                    trailing: Icon(Icons.arrow_forward_ios),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}