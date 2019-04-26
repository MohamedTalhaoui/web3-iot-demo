#include "secrets.h"

#include "web3.h"
#include "DHT.h"

#define DHTPIN 2     // what pin we're connected to
// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11 
#define DHTTYPE DHT22   // DHT 22  (AM2302)
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

DHT dht(DHTPIN, DHTTYPE);

void setup() {

  dht.begin();
  pre_checks();
  connect_to_wifi();

  test_web3();
  call_simple_insurance_payout();
}

void loop() {
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
      call_simple_insurance_payout();
      // wait 60 seconds for cooling down
      delay(60000);
    }
  }
}
