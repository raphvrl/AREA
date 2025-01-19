import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'pages/login_page.dart';
import 'pages/home_page.dart';
import 'providers/accessibility_provider.dart';
import 'services/api_service.dart';

void main() {
  final apiService = ApiService(baseUrl: 'https://10.0.2.2:5000');

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AccessibilityProvider()),
        Provider<ApiService>.value(value: apiService),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();
    
    return MaterialApp(
      theme: ThemeData(
        colorScheme: accessibilityProvider.colorScheme,
        textTheme: accessibilityProvider.textTheme,
        pageTransitionsTheme: accessibilityProvider.pageTransitionsTheme,
        useMaterial3: true,
        visualDensity: accessibilityProvider.reduceAnimations 
            ? VisualDensity.compact 
            : VisualDensity.standard,
        cardTheme: CardTheme(
          elevation: 8,
          shadowColor: Colors.blue.withOpacity(0.2),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
        ),
        appBarTheme: AppBarTheme(
          elevation: 0,
          centerTitle: true,
          backgroundColor: Colors.transparent,
          iconTheme: IconThemeData(color: Color(0xFF1976D2)),
          titleTextStyle: TextStyle(
            color: Color(0xFF1976D2),
            fontSize: accessibilityProvider.largeText ? 28 : 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
            backgroundColor: Color(0xFF1976D2),
            foregroundColor: Colors.white,
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
      ),
      builder: (context, child) {
        return AnimatedTheme(
          data: Theme.of(context),
          duration: accessibilityProvider.animationDuration,
          child: child ?? const SizedBox(),
        );
      },
      showSemanticsDebugger: false,
      debugShowCheckedModeBanner: false,
      home: LoginPage(),
    );
  }
}