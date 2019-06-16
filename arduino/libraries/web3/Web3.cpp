
#include "Web3.h"

#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>

#include <ArduinoJson.h>
#include "Contract.h"

Web3::Web3(HttpClient* _http_client, String _infura_token, const string* _contract_address, const char* _private_key) {
  http_client = _http_client;
  infura_token = _infura_token;
  contract_address = _contract_address;
  private_key = _private_key;
}

void Web3::printInfo() {
  ethRequest("web3_clientVersion", "[]");  
  ethRequest("eth_accounts", "[]");  
}

String Web3::sha3(const String data) {
  String response = ethRequest("web3_sha3", "[\"" + data + "\"]");  
  return getResult(response);
}

int Web3::getTransactionCount() {
  String response = ethRequest("eth_getTransactionCount", "[\"" + String(contract_address->c_str()) + "\"]");  
  return atol(getResult(response).c_str());
}

void Web3::eth_send_example() {
    Contract contract(contract_address);
    contract.SetPrivateKey((uint8_t*)private_key);

    uint32_t nonceVal = (uint32_t)getTransactionCount();
    uint32_t gasPriceVal = 141006540;
    uint32_t  gasLimitVal = 3000000;
    string toStr = *contract_address;
    string valueStr = "0x00";
    uint8_t dataStr[100];
    memset(dataStr, 0, 100);
    string func = "payout(uint)";
    string p = contract.SetupContractData(&func, 0);
    string result = contract.SendTransaction(nonceVal, gasPriceVal, gasLimitVal, &toStr, &valueStr, &p);

    Serial.println(String(result.c_str()));
}

void call_simple_insurance_payout() {
  //ethRequest("eth_sendRawTransaction", "[\"" + call_contract_payout + "\"]");  
}

// -------------------------------
// Private

String Web3::ethRequest(String method, String params) {

  String path = "/v3/" + infura_token;
  String request= "{\"jsonrpc\":\"2.0\",\"method\":\"" + method + "\",\"params\":" + params + ",\"id\":1}";

  Serial.print("[ETH] Request: ");
  Serial.println(request);
  
  http_client->post(path, "application/json", request );
  int statusCode = http_client->responseStatusCode();
  String response = http_client->responseBody();

  Serial.print("[ETH] Status code: ");
  Serial.println(statusCode);
  Serial.print("[ETH] Response: ");
  Serial.println(response);
  
  return response;
}

String Web3::getResult(String json) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, json.c_str());

    // Test if parsing succeeds.
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.c_str());
      return "";
    }

    return String(doc["result"].as<char*>());

}