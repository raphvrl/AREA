import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ColumnWidget extends StatelessWidget {
  final String logo;
  final String description;
  final String buttonText;
  final VoidCallback onButtonClick;

  const ColumnWidget({
    super.key,
    required this.logo,
    required this.description,
    required this.buttonText,
    required this.onButtonClick,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.0),
      margin: EdgeInsets.symmetric(vertical: 8.0),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey),
        borderRadius: BorderRadius.circular(8.0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.5),
            spreadRadius: 2,
            blurRadius: 5,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Image.network(logo, width: 64, height: 64),
          SizedBox(height: 8.0),
          Text(
            description,
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 8.0),
          ElevatedButton(
            onPressed: onButtonClick,
            child: Text(buttonText),
          ),
        ],
      ),
    );
  }
}