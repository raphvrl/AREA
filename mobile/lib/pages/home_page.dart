import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/accessibility_provider.dart';
import 'settings_page.dart';
import 'services_page.dart';
import 'profile_page.dart';

class HomePage extends StatefulWidget {
  final String title;
  final ApiService apiService;

  const HomePage({super.key, required this.title, required this.apiService});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  // Liste des pages
  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      _HomeContent(apiService: widget.apiService),
      ServicesPage(),
      ProfilePage(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_selectedIndex == 0 ? 'Accueil' : 
                    _selectedIndex == 1 ? 'Services' : 'Profil'),
        actions: [
          Semantics(
            label: 'Paramètres d\'accessibilité',
            child: IconButton(
              icon: Icon(Icons.settings),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SettingsPage()),
                );
              },
            ),
          ),
        ],
      ),
      body: _pages[_selectedIndex],
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _selectedIndex,
          onTap: (index) => setState(() => _selectedIndex = index),
          items: [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Accueil',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.business_outlined),
              activeIcon: Icon(Icons.business),
              label: 'Services',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}

class _HomeContent extends StatelessWidget {
  final ApiService apiService;

  _HomeContent({required this.apiService});

  @override
  Widget build(BuildContext context) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();

    return Column(
      children: [
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.blue.shade50,
                  Colors.white,
                ],
              ),
            ),
            child: SafeArea(
              child: SingleChildScrollView(
                physics: BouncingScrollPhysics(),
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Semantics(
                        header: true,
                        child: Text(
                          'Services disponibles',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1976D2),
                          ),
                        ),
                      ),
                      SizedBox(height: 20),
                      GridView.count(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        crossAxisCount: 2,
                        mainAxisSpacing: 16.0,
                        crossAxisSpacing: 16.0,
                        childAspectRatio: 1.2,
                        children: [
                          _buildServiceCard(
                            context,
                            'API 1',
                            'Description for API 1',
                            Icons.api,
                            () async => await apiService.authenticateWithLinkedIn(),
                          ),
                          _buildServiceCard(
                            context,
                            'API 2',
                            'Description for API 2',
                            Icons.cloud,
                            () async => await apiService.authenticateWithSpotify(),
                          ),
                          _buildServiceCard(
                            context,
                            'API 3',
                            'Description for API 3',
                            Icons.architecture,
                            () async {
                              final token = 'your_token'; // Remplacez par le token d'accès valide
                              await apiService.playSpotifyTrack(token, 30);
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildServiceCard(
    BuildContext context,
    String title, 
    String description, 
    IconData icon,
    VoidCallback onTap,
  ) {
    final accessibilityProvider = context.watch<AccessibilityProvider>();
    
    return Semantics(
      button: true,
      label: 'Carte service $title',
      hint: 'Appuyez pour $description',
      enabled: true,
      child: Card(
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ExcludeSemantics(
                  child: Icon(
                    icon,
                    size: accessibilityProvider.largeText ? 36 : 28,
                    color: Color(0xFF1976D2),
                    semanticLabel: 'Icône de $title',
                  ),
                ),
                SizedBox(height: accessibilityProvider.largeText ? 8 : 4),
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontSize: accessibilityProvider.largeText ? 20.0 : 16.0,
                    fontWeight: FontWeight.bold,
                    color: accessibilityProvider.highContrast 
                        ? Colors.white 
                        : Color(0xFF1976D2),
                  ),
                  textAlign: TextAlign.center,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: accessibilityProvider.largeText ? 8 : 4),
                Flexible(
                  child: Text(
                    description,
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontSize: accessibilityProvider.largeText ? 16.0 : 12.0,
                      color: accessibilityProvider.highContrast 
                          ? Colors.white70 
                          : Colors.grey[800],
                      height: 1.2,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}