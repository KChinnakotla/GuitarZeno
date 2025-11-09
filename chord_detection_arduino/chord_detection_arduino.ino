#define Index 5
#define Middle 21
#define Ring 19
#define Pinky 18
#define Thumb 23

void setup() {
  Serial.begin(115200);

  // Set all chord pins as input
  pinMode(Index, INPUT);
  pinMode(Middle, INPUT);
  pinMode(Ring, INPUT);
  pinMode(Pinky, INPUT);

}

void loop() {
  bool indexTouched = digitalRead(Index);
  bool middleTouched = digitalRead(Middle);
  bool ringTouched = digitalRead(Ring);
  bool pinkyTouched = digitalRead(Pinky);
  bool thumbTouched = digitalRead(Thumb);

  if (indexTouched && !middleTouched && !ringTouched && !pinkyTouched && !thumbTouched)
    Serial.println("C_major");
else if (indexTouched && !middleTouched && !ringTouched && !pinkyTouched && thumbTouched)
    Serial.println("C_minor");

else if (!indexTouched && middleTouched && !ringTouched && !pinkyTouched && !thumbTouched)
    Serial.println("G_major");
else if (!indexTouched && middleTouched && !ringTouched && !pinkyTouched && thumbTouched)
    Serial.println("G_minor");

else if (!indexTouched && !middleTouched && ringTouched && !pinkyTouched && !thumbTouched)
    Serial.println("D_major");
else if (!indexTouched && !middleTouched && ringTouched && !pinkyTouched && thumbTouched)
    Serial.println("D_minor");

else if (!indexTouched && !middleTouched && !ringTouched && pinkyTouched && !thumbTouched)
    Serial.println("A_major");
else if (!indexTouched && !middleTouched && !ringTouched && pinkyTouched && thumbTouched)
    Serial.println("A_minor");

else if (indexTouched && middleTouched && !ringTouched && !pinkyTouched && !thumbTouched)
    Serial.println("E_major");
else if (indexTouched && middleTouched && !ringTouched && !pinkyTouched && thumbTouched)
    Serial.println("E_minor");

else if (!indexTouched && middleTouched && ringTouched && !pinkyTouched && !thumbTouched)
    Serial.println("F_major");
else if (!indexTouched && middleTouched && ringTouched && !pinkyTouched && thumbTouched)
    Serial.println("F_minor");

else if (!indexTouched && !middleTouched && ringTouched && pinkyTouched && !thumbTouched)
    Serial.println("Bb_major");
else if (!indexTouched && !middleTouched && ringTouched && pinkyTouched && thumbTouched)
    Serial.println("Bb_minor");
else
    Serial.println("None");


  delay(200); 
}
