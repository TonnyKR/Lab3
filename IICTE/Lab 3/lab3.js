import * as THREE from '../../js/three/three.module.js';
import {ARButton} from '../../js/three/ARButton.js';


document.addEventListener("DOMContentLoaded", () => {
	//основна функція
	const initialize = async() => {
		// створення сцени
		let scene = new THREE.Scene();
			scene.position.set(2, -5, -25);
		
	    let camera = new THREE.PerspectiveCamera();

		let renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);
		
		//Задаємо кути
		var angle90 = Math.PI / 2;
		var angle30 = Math.PI / 6;
		
		// Створюємо площину
		var textureLoader = new THREE.TextureLoader();
		var Texture = textureLoader.load("hardwood2_roughness.jpg");
		var planeMaterial = new THREE.MeshBasicMaterial({map: Texture});
		var planeGeometry = new THREE.BoxGeometry(10, 10, 1);
		var plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.position.x = -1;
		plane.rotation.x = angle90;
		plane.rotation.y = -angle30;
		scene.add(plane);
		
		// Створюємо циліндр
		var geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
		var cylinder = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0x0000ff}));
		cylinder.rotation.x = angle90;
		cylinder.position.x = -3;
		cylinder.position.y = 3;
		scene.add(cylinder);
		
		// Функція для створення векторів
		function Vec(x, y, z, color) {
		  var direction = new THREE.Vector3(x, y, z);
		  var length = direction.length();
		  var normal = direction.normalize();
		  var vector = new THREE.ArrowHelper(normal, new THREE.Vector3(0, 0, 0), length*3, color);
		  return vector;
		}

		// Створюємо вектори
		cylinder.add(Vec(0, 0, 2, 0xff0000));
		cylinder.add(Vec(0, 0, -(2 * Math.cos(angle30)), 0x00ff00));
		cylinder.add(Vec(2 * Math.sin(Math.PI / 6), 0, 0, 0x00ffff));
		cylinder.add(Vec(0, 0, -(2 * Math.cos(angle30) - 2 * Math.sin(angle30)), 0xff00ff));
		
			
		function render() {
			if ((cylinder.position.x >= -3 && cylinder.position.x <= 3) && (cylinder.position.y >= -3 && cylinder.position.y <= 3))
			{
				cylinder.position.x += 0.001;
				cylinder.position.y -= 0.0006;
			}
			else
			{
				cylinder.position.x = -3;
				cylinder.position.y = 3;
			}
			
			renderer.render(scene, camera);
		}
		
		
		var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
				

		// повідомлення рушія Three.js про параметри використання WebXR
		renderer.xr.enabled = true;

		// перевірка запуску та завершення сесії WebXR
		renderer.xr.addEventListener("sessionstart", (evt) => {
			renderer.setAnimationLoop(() => {
				render();
			}); 
		});


		const arButton = ARButton.createButton(renderer, {
				optionalFeatures: ["dom-overlay"],
				domOverlay: {root: document.body},
			}
		);
		arButton.textContent = "Увійти до WebXR";
		document.body.appendChild(arButton);
	}
	
	

	initialize(); // розпочати роботу
});