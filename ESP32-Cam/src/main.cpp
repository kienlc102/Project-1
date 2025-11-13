#include "Arduino.h"

void setup() {
  Serial.begin(115200);
  Serial.println("ESP32-CAM Ready!");
}

void loop() {
  Serial.println("Hello from ESP32-CAM");
  delay(1000);
}
