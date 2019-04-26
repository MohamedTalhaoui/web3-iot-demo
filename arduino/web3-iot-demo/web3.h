#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <Arduino_JSON.h>

const char ssid[] = SECRET_SSID;    // Network SSID (name)
const char pass[] = SECRET_PASS;    // Network password (use for WPA, or use as key for WEP)
char INFURA_HOST[] = "rinkeby.infura.io";
String token = SECRET_INFURA_TOKEN; // Infura API Token
String call_contract_payout = SECRET_CONTRACT_SIGNATURE;
const int port = 443;

int status = WL_IDLE_STATUS;

WiFiSSLClient wifi_client;

HttpClient http_client = HttpClient(wifi_client, INFURA_HOST, port);

void pre_checks() {
  // Initialize serial
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  String fv = WiFi.firmwareVersion();
  Serial.println("firmware: " + fv);
  if (fv < "1.0.0") {
    Serial.println("Please upgrade the firmware");
  }  
  
  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue:
    while (true);
  }

}
void connect_to_wifi() {
  
  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("[WiFi] Connecting to: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }

  // you're connected now, so print out the data:
  Serial.println("[WiFi] Connected");

}


String ethRequest(String method, String params) {

  String path = "/v3/" + token;
  String request= "{\"jsonrpc\":\"2.0\",\"method\":\"" + method + "\",\"params\":" + params + ",\"id\":1}";

  Serial.print("[ETH] Request: ");
  Serial.println(request);
  
  http_client.post(path, "application/json", request );
  int statusCode = http_client.responseStatusCode();
  String response = http_client.responseBody();

  Serial.print("[ETH] Status code: ");
  Serial.println(statusCode);
  Serial.print("[ETH] Response: ");
  Serial.println(response);
  
  return response;
}

void printWiFiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
}

}

void test_web3() {
  ethRequest("web3_clientVersion", "[]");  
  ethRequest("eth_accounts", "[]");  
}

void call_simple_insurance_payout() {
  ethRequest("eth_sendRawTransaction", "[\"" + call_contract_payout + "\"]");  
}
