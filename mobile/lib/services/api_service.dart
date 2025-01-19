// lib/services/api_service.dart
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart'; // Ajoutez cette ligne

class ApiService {
  final String baseUrl;
  final http.Client _client;

  ApiService({required this.baseUrl}) : _client = _createHttpClient();

  static http.Client _createHttpClient() {
    final client = HttpClient()
      ..badCertificateCallback = (X509Certificate cert, String host, int port) => true;
    return IOClient(client); // Utilisez IOClient ici
  }

  Future<void> authenticateWithLinkedIn() async {
    final response = await _client.get(Uri.parse('$baseUrl/api/auth/linkedin'));
    if (response.statusCode == 200) {
      print('LinkedIn authentication initiated');
    } else {
      throw Exception('Failed to initiate LinkedIn authentication');
    }
  }

  Future<void> authenticateWithSpotify() async {
    final response = await _client.get(Uri.parse('$baseUrl/api/auth/spotify'));
    if (response.statusCode == 200) {
      print('Spotify authentication initiated');
    } else {
      throw Exception('Failed to initiate Spotify authentication');
    }
  }

  Future<void> playSpotifyTrack(String token, int timer) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/api/spotify/play'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'timer': timer}),
    );
    if (response.statusCode == 200) {
      print('Playing track with timer');
    } else {
      print('Failed to play track: ${response.statusCode} ${response.body}');
      throw Exception('Failed to play track');
    }
  }

  Future<void> saveSpotifyTrack(String token, String trackName, String artist) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/api/spotify/save-track'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'trackName': trackName, 'artist': artist}),
    );
    if (response.statusCode == 200) {
      print('Track saved to favorites');
    } else {
      throw Exception('Failed to save track');
    }
  }
}