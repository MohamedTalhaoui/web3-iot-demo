//
// Created by Okada, Takahiro on 2018/02/04.
//

#ifndef ARDUINO_WEB3_WEB3_H
#define ARDUINO_WEB3_WEB3_H

#include <ArduinoHttpClient.h>

#include "stdint.h"
#include <string>

using namespace std;

class Web3 {
public:
    Web3(HttpClient* _http_client, String _infura_token, const string* _contract_address, const char* _private_key);
    void initWifi();
    void printInfo();
    String sha3(const String data);
    int getTransactionCount();
    void eth_send_example();
    void call_simple_insurance_payout();

private:
    String ethRequest(String method, String params);
    String getResult(String json);

private:
    String infura_host;
    String infura_token;
    const string* contract_address;
    const char* private_key;
    HttpClient* http_client;
};

#endif //ARDUINO_WEB3_WEB3_H
