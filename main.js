import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RingBufferGeometry } from 'three';

// planet object
class planet {
  constructor(speed, radius, orbitRadius, rotation, mesh) {
    this.speed = speed;
    this.radius = radius;
    this.orbitRadius = orbitRadius;
    this.rotation = rotation;
    this.mesh = mesh;
  }
}

// initializing scene and camera
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 4000 );

// renderer boilerplate
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 60, 120);


// initializing planet objects

let planetArr = [];

// sun
const sun = new planet(0, 80, 0, .01*(1/27), 
  new THREE.Mesh(
    new THREE.SphereGeometry( 40, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('sun.jpg') } )
  )
);
scene.add(sun.mesh);

// earth
const earth = new planet(.0001, 2, sun.radius+92.96, .01,
  new THREE.Mesh(
    new THREE.SphereGeometry( 2, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('earth.jpg') } )
  )
);
earth.mesh.position.setX(earth.orbitRadius);
scene.add(earth.mesh);

// mercury
const mercury = new planet(earth.speed*(1/.241), earth.radius*(2/5), sun.radius+35.98, earth.rotation*(1/59),
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*(2/5), 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('mercury.jpg') } ),
  )
);
mercury.mesh.position.setX(mercury.orbitRadius);
scene.add(mercury.mesh);

// venus
const venus = new planet(earth.speed*(1/.616), earth.radius*.949, sun.radius+67.24, earth.rotation*(1/117),
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*.949, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('venus.jpg') } ),
  )
);
venus.mesh.position.setX(venus.orbitRadius);
scene.add(venus.mesh);

// mars
const mars = new planet(earth.speed*(1/1.88), earth.radius*.532, sun.radius+141.6*.75, earth.rotation*(1/1.026),
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*.532, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('mars.jpg') } ),
  )
);
mars.mesh.position.setX(mars.orbitRadius);
scene.add(mars.mesh);

// jupiter
const jupiter = new planet(earth.speed*(1/12), earth.radius*11, sun.radius+483.8*.3, earth.rotation*2.4,
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*11, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('jupiter.jpg') } ),
  )
);
jupiter.mesh.position.setX(jupiter.orbitRadius);
scene.add(jupiter.mesh);

// saturn
const saturn = new planet(earth.speed*(1/29), earth.radius*9.45, sun.radius+890.8*.3, earth.rotation*2.24,
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*9.45, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('saturn.jpg') } ),
  )
);
saturn.mesh.position.setX(saturn.orbitRadius);
scene.add(saturn.mesh);
// ring
const ringsTexture = new THREE.TextureLoader().load('rings.jpg');
ringsTexture.repeat.set(.5, .5);
ringsTexture.offset.set(.2, .2);
const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(saturn.radius + 4, saturn.radius + 8, 50, 50),
  new THREE.MeshBasicMaterial( { map: ringsTexture, side: THREE.DoubleSide } )
);
saturnRing.rotateX(-Math.PI/2.5);
saturn.mesh.add(saturnRing);

// uranus
const uranus = new planet(earth.speed*(1/84), earth.radius*4.007, sun.radius+1784*.3, earth.rotation*1.39,
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*4.007, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('uranus.jpg') } ),
  )
);
uranus.mesh.position.setX(uranus.orbitRadius);
scene.add(uranus.mesh);

// neptune
const neptune = new planet(earth.speed*(1/65), earth.radius*3.883, sun.radius+2793*.3, earth.rotation*1.49,
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*3.883, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('neptune.jpg') } ),
  )
);
neptune.mesh.position.setX(neptune.orbitRadius);
scene.add(neptune.mesh);

// pluto
const pluto = new planet(earth.speed*(1/248), earth.radius*.186*10, sun.radius+3700*.3, earth.rotation*(1/6.4),
  new THREE.Mesh(
    new THREE.SphereGeometry( earth.radius*.186*10, 100, 100 ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('pluto.jpg') } ),
  )
);
pluto.mesh.position.setX(pluto.orbitRadius);
scene.add(pluto.mesh);

planetArr.push(
  mercury, venus, earth, mars, 
  jupiter, saturn, uranus, neptune, 
  pluto, sun
)

// draw orbits
for (let i = 0; i < planetArr.length; i += 1) {
  drawOrbit(planetArr[i]);
}


const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set( 0, 0, 0 );
scene.add(pointLight);

// lighting
// const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add( ambientLight );

// grid helper
// const gridHelper = new THREE.GridHelper( 300, 30 );
// scene.add( gridHelper );

// orbit controls
let controls = new OrbitControls( camera, renderer.domElement );

// textures and texture mapping
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

let raycaster, mouseVector;
let pivot = sun.object;
renderer.domElement.addEventListener('click', raycast, false);
window.addEventListener('resize', onWindowResize, false );

window.addEventListener('keypress', function(event) {
  if (event.key === 'e') {
    console.log(1);
    pivot = earth.object;
    console.log(pivot);
  }
});

// raycast function
function raycast(event) {
  event.preventDefault();
  //1. sets the mouse position with a coordinate system where the center
  //   of the screen is the origin
  mouseVector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, .5 );

  //2. set the picking ray from the camera position and mouse coordinates
  raycaster = new THREE.Raycaster();
  raycaster.setFromCamera( mouseVector, camera );

  //3. compute intersections
  let intersects = raycaster.intersectObjects( scene.children );
  if (intersects.length > 0 && intersects[0].object.type == 'Mesh') {
    pivot = intersects[0].object;
    console.log(pivot);
    camera.position.x = pivot.position.x + 60;
    camera.position.y = pivot.position.y + 60;
    camera.position.z = pivot.position.z + 60;
  } else {
    pivot = null
  }
}

// draw orbit function
function drawOrbit(planet) {
  let pts = new THREE.Path().absarc(0, 0, planet.orbitRadius, 0, Math.PI * 2).getPoints(90);
  let g = new THREE.BufferGeometry().setFromPoints(pts);
  let m = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.2 } );
  let l = new THREE.Line(g, m)
  l.rotateX(Math.PI/2);
  scene.add(l);
}

// rotate function
function rotatePlanet(planet) {
  planet.mesh.rotation.y += planet.rotation;
}

// orbit function
let date;
function orbit(planet) {
  date = Date.now() * planet.speed;
  planet.mesh.position.set(
    Math.cos(date) * planet.orbitRadius,
    0,
    -Math.sin(date) * planet.orbitRadius
  );
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize (window.innerWidth, window.innerHeight);
}


// animate shit
function animate() {
    requestAnimationFrame( animate );
    
    // planet rotation

    // planet orbit
    for (let i = 0; i < planetArr.length; i += 1) {
      rotatePlanet(planetArr[i]);
      orbit(planetArr[i]);
    }
    // orbit controls
    if (pivot != null) {
      // camera.position.x = pivot.position.x + (3 * pivot.geometry.boundingSphere.radius) * Math.cos(pivot.position.x * date);
      // camera.position.z = pivot.position.z + (3 * pivot.geometry.boundingSphere.radius) * Math.sin(pivot.position.z * date);
      controls.target = pivot.position;
    }
    // controls.target.copy(pivot.position);
    // console.log(pivot.position);
    controls.update();

    renderer.render( scene, camera );
}

animate()