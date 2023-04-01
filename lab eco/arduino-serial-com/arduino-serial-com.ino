// C++ code
//reservamos que pin vamos a utilzar. Ponemos el numero del pin que se quiere configurar, el numero que esta escrito en la tarjeta Arduino.
int pin_photoresistor = 0;
int var_photoresistor = 0;

void setup(){
  Serial.begin(9600);
}

void loop(){
  var_photoresistor = analogRead(pin_photoresistor);

//aqui imprimimos en la consola de Arduino IDE
  Serial.print("Nivel de luz de la habitación= ");
  Serial.println(var_photoresistor);
  delay (2000);
}
