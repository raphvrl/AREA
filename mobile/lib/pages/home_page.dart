import 'package:flutter/material.dart';
import '../widgets/column_widget.dart';
import '../services/api_service.dart';

class HomePage extends StatelessWidget {
  final String title;
  final ApiService apiService;

  const HomePage({super.key, required this.title}) : apiService = const ApiService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ColumnWidget(
              logo: 'https://via.placeholder.com/64',
              description: 'Description for API 1',
              buttonText: 'Call API 1',
              onButtonClick: () async {
                await apiService.callApi1();
              },
            ),
            ColumnWidget(
              logo: 'https://via.placeholder.com/64',
              description: 'Description for API 2',
              buttonText: 'Call API 2',
              onButtonClick: () async {
                await apiService.callApi2();
              },
            ),
            ColumnWidget(
              logo: 'https://via.placeholder.com/64',
              description: 'Description for API 3',
              buttonText: 'Call API 3',
              onButtonClick: () async {
                await apiService.callApi3();
              },
            ),
          ],
        ),
      ),
    );
  }
}