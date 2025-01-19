import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/accessibility_provider.dart';

class AccessibilityMenu extends StatelessWidget {
  const AccessibilityMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 8),
        children: [
          _buildAccessibilityChip(
            context,
            icon: Icons.text_fields,
            label: 'Gros texte',
            selected: context.watch<AccessibilityProvider>().largeText,
            onTap: () => context.read<AccessibilityProvider>().toggleLargeText(),
          ),
          SizedBox(width: 8),
          _buildAccessibilityChip(
            context,
            icon: Icons.contrast,
            label: 'Contraste',
            selected: context.watch<AccessibilityProvider>().highContrast,
            onTap: () => context.read<AccessibilityProvider>().toggleHighContrast(),
          ),
          SizedBox(width: 8),
          _buildAccessibilityChip(
            context,
            icon: Icons.animation,
            label: 'Moins d\'animations',
            selected: context.watch<AccessibilityProvider>().reduceAnimations,
            onTap: () => context.read<AccessibilityProvider>().toggleReduceAnimations(),
          ),
        ],
      ),
    );
  }

  Widget _buildAccessibilityChip(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return FilterChip(
      avatar: Icon(
        icon,
        size: 18,
        color: selected ? Colors.white : Colors.grey[600],
      ),
      label: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          color: selected ? Colors.white : Colors.grey[600],
          fontWeight: selected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: selected,
      onSelected: (_) {
        onTap();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${label} ${selected ? 'désactivé' : 'activé'}'),
            duration: Duration(seconds: 1),
          ),
        );
      },
      backgroundColor: Colors.grey[200],
      selectedColor: Color(0xFF1976D2),
      elevation: selected ? 4 : 0,
      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
    );
  }
}