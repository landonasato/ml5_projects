let video;
let poseNet;
var poses = [];

var poseSet = [];

function setup() {
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
    confiGrab();
    locCordData();
  });
  // Hide the video element, and just show the canvas
  video.hide();

  
}

function modelReady() {
  select("#status").html("");
  console.log("Model Loaded, Ready.")
}

function draw() {
  image(video, 0, 0, width, height);


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

function confiGrab() {
    // console.log(poses[0].pose);
    noseOutput = poses[0].pose.keypoints[0].score;
    leftEyeOutput = poses[0].pose.keypoints[1].score;
    // console.log(leftEyeOutput);
    rightEyeOutput = poses[0].pose.keypoints[2].score;
    document.getElementById("noseConf").innerHTML = "Nose Confidence Value : " + noseOutput;

}


function locCordData() {
  var noseCoordinateX = poses[0].pose.keypoints[0].position.x;
  var noseCoordinateY = poses[0].pose.keypoints[0].position.y;
  document.getElementById("noseCoords").innerHTML = "Nose Coordinates (Face Average): " + noseCoordinateX + " , " + noseCoordinateY; 
}