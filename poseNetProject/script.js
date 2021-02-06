// Local Variables
let video;
let song;
let poseNet;
var poses = [];
var pepeTime;

// Global Variables
var poseSet = [];


// Game internal timer init
var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

function intTimer() {
  console.time(pepeTime);
}

function setup() {
  //Load song for beatmap
  song = loadSound('assets/mapMusic.mp3');
  createCanvas(1280, 960);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    poses = results;
    // console.log(results[0].pose.keypoints[0]);
    // confiGrab();
    // locCordData();
    wristData();
  });
  // Hide the video element, and just show the canvas
  video.hide();
}


// Start / Stop game on Canvas-area interaction
function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
    print("Stopping");
    } else {
      song.play();
      print("Starting");
      // intTimer();
    }
}

function modelReady() {
  select("#status").html("");
  console.log("Model Loaded, Ready.")
}

function draw() {
  image(video, 0, 0, width, height);
  // console.timeLog(pepeTime);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(0, 255, 255);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
      if (keypoint == 0 ) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0];
      const partB = skeleton[j][1];
      stroke(0, 255, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


function displayValues() {
  loop();
}

//Grab and display confidence values for the listed keypoints
function confiGrab() {
    noseOutput = poses[0].pose.keypoints[0].score;
    leftEyeOutput = poses[0].pose.keypoints[1].score;
    // console.log(leftEyeOutput);
    rightEyeOutput = poses[0].pose.keypoints[2].score;
    document.getElementById("noseConf").innerHTML = "Nose Confidence Value : " + noseOutput;

}

function wristData() {
  //Display Left & Right wrist coordinates
    // console.log(poses[0].pose);
  var leftWristX = poses[0].pose.keypoints[9].position.x;
  var leftWristY = poses[0].pose.keypoints[9].position.y;

  // var rightWristX = poses[0].pose.keypoints[]
  var rightWristX = poses[0].pose.keypoints[10].position.x;
  var rightWristY = poses[0].pose.keypoints[10].position.y;

  document.getElementById("leftWristCoords").innerHTML = "Left Wrist: " + leftWristX + " , " + leftWristY;
  document.getElementById("rightWristCoords").innerHTML = "Right Wrist: " + rightWristX + " , " + leftWristY;
}

//Grab and display coordinate values for the listed keypoints
function locCordData() {
  var noseCoordinateX = poses[0].pose.keypoints[0].position.x;
  var noseCoordinateY = poses[0].pose.keypoints[0].position.y;
  document.getElementById("noseCoords").innerHTML = "Nose Coordinates (Face Average): " + noseCoordinateX + " , " + noseCoordinateY; 
}