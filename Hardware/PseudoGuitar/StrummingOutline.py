# for chords want to implement learning method where the model can learn frequently played chords

## Recording Live Video and extracting hand data(Up and Down strumming with velocity)
## Covert velocity to sound and also store info on strum direction

## Open CV captures frames from my computer camera and stores as an numpy array
## Can use mediapipleine to extract hand landmarks from the frames
## Down strum will be closed fist and upstrum will be a thumbs up --> store this info to determine if it is a strum or hand reset
## If boolean based off hand sign doesn't match direction of motion don't play sound.  --> just reset hand position
## Use velocity to determine volume of sound
##    For velocity use mid point between 9 and 13 and calculate velocity based off change in y position over time.
##       Have to figure out threshold distance to determine when to start and stop time measurement for velocity calculation
##       Hand direction will be based off negative or positive velocity
##       Need to filter out noise and shaking
##       Use a moving average
## Use y-distance between 4(thumb tip) and 5(index base) to deterime hand sign
##       determine in last frame and use that to determine if hand sign is valid for strum
##       Need to establish base distance for closed hand and threshold distance for thumbs up
## Is there a way to implement live feedback to determine minimum thresholds for each user?
##       Adaptive threshold tracking
## Also how do I automatically determine the initial hand position(resting position) for 1st strum
## Successful strum is accounted when:
##       1. displacement threshold is met
##               Gesture Stability --> require multiple frames of same direction motion to register(moving window)
##       2. hand sign matches direction of motion and valid direction
##       3. Minimum velocity threshold is met
##       
## If succesful strum:
##       1. Play sound with volume based off velocity
##             velocity should be time to cover distance of board not full strum distance
##       2. Reset current initial hand position
##             to location of final position used in velocity calculation
##       3. Store information on valid direction for next strum
## If not successful strum because of hand position:
##       1. Reset current initial hand position
##             to location of final position used in velocity calculation
##       2. Change valid direction for next strum
##       3. Do not play sound
## If not successful strum because of displacement or velocity threshold not met:
##       1. Do not reset current initial hand position
## For now just use an A chord for pitch. Will change this later
## Have to convert velocity to volume

## Parameters to optimize
##       1. Displacement threshold
##       2. Velocity threshold
##       3. Hand sign thresholds
##       4. Gesture stability window size
##       5. Volume scaling factor
##       6. Resting position determination method
##       7. shaking/noise threshold and filtering(moving average or other smoothing methods)
##       8. Camera position and angle
##       9. how to determine when strum starts from rest(this threshold)
##       10. how to determine when strum ends and cooldown after strum
##       11. Detection confidence threshold
##       12. Exit strategy
##       13. What to do when no hand is detected