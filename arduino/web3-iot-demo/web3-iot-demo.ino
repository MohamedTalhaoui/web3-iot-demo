#include "secrets.h"

#include <SPI.h>
#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include "DHT.h"
#include <Web3.h>
#include <string>

// what pin we're connected to
#define DHTPIN 2
// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11 
#define DHTTYPE DHT22   // DHT 22  (AM2302)
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

const char ssid[] = SECRET_SSID;    // Network SSID (name)
const char pass[] = SECRET_PASS;    // Network password (use for WPA, or use as key for WEP)
char INFURA_HOST[] = "rinkeby.infura.io";  // server address
int port = 443;
String INFURA_TOKEN = SECRET_INFURA_TOKEN;
const char PRIVATE_KEY[] = SECRET_ADMIN_PK; 
const string CONTRACT_ADDRESS = SECRET_CONTRACT_ADDR; 
int status = WL_IDLE_STATUS;

DHT dht(DHTPIN, DHTTYPE);

WiFiSSLClient wifi_client;
HttpClient http_client = HttpClient(wifi_client, INFURA_HOST, port);
Web3 web3 = Web3(&http_client, INFURA_TOKEN , &CONTRACT_ADDRESS, PRIVATE_KEY);

void initWifi() {
  
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

void setup() {

  dht.begin();
  pre_checks();
  initWifi();
  web3.printInfo();
  //call_simple_insurance_payout();
  web3.eth_send_example();
}
void loop() {
}

void loopback() {
  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // check if returns are valid, if they are NaN (not a number) then something went wrong!
  if (isnan(t) || isnan(h)) 
  {
      Serial.println("Failed to read from DHT");
  } 
  else 
  {
    Serial.print("Temperature: "); 
    Serial.print(t);
    Serial.println(" *C");
    if(t>27) {
      Serial.println("Calling smart contract ..."); 
      web3.call_simple_insurance_payout();
      // wait 60 seconds for cooling down
      delay(60000);
    }
  }
}
