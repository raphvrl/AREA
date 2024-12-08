import 'dart:async';

class ApiService {
  const ApiService();

  Future<void> callApi1() async {
    // Simulate a network call
    await Future.delayed(Duration(seconds: 2));
    print('API 1 called');
  }

  Future<void> callApi2() async {
    // Simulate a network call
    await Future.delayed(Duration(seconds: 2));
    print('API 2 called');
  }

  Future<void> callApi3() async {
    // Simulate a network call
    await Future.delayed(Duration(seconds: 2));
    print('API 3 called');
  }
}