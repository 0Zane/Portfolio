//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'eye';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `assets/3D/desk.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 5;
//Raise the camera slightly so the view is a bit higher above the model
camera.position.y = objToRender === "dino" ? 3:1 ;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff,3 ); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 2);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}
// 1. Définis des variables pour stocker la cible (la souris) et la position actuelle
let targetRotationX = 0;
let targetRotationY = 0;
const slowingFactor = 0.05; // Plus ce chiffre est petit (ex: 0.01), plus c'est lent/fluide

function animate() {
  requestAnimationFrame(animate);

  if (object && objToRender === "eye") {
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;

// Calcul du décalage (-1 à 1)
const offsetX = (mouseX - centerX) / centerX; 
const offsetY = (mouseY - centerY) / centerY; 

// targetY reste identique pour l'axe horizontal
const targetY = -1.5 + offsetX * 0.6; 

// MODIFICATION ICI :
// On change la valeur de base (le premier chiffre). 
// En Three.js, une rotation X positive fait pencher l'objet vers l'avant (vers le bas).
const targetX = 0.2 + offsetY * 0.35; // J'ai remplacé -0.2 par 0.5
    // 2. L'astuce : On ne change pas brutalement la rotation.
    // On avance de seulement 5% (slowingFactor) vers la cible à chaque frame.
    object.rotation.y += (targetY - object.rotation.y) * slowingFactor;
    object.rotation.x += (targetX - object.rotation.x) * slowingFactor;
  }

  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();