import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // 마우스로 씬을 회전, 확대/축소, 이동할 수 있게 해주는 컨트롤러
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm'; // UI 라이브러리


// GUI 컨트롤 패널 생성
const gui = new GUI;


// 1단계 : Scene 구성
const scene = new THREE.Scene();                  

// cube & plane 추가
const geometry = new THREE.BoxGeometry(1, 1, 1);    
const material = new THREE.MeshStandardMaterial({      // PBR(물리 기반 렌더링)을 지원하는 표준 재질. 금 속성, 거칠기 등을 표현할 수 있고 조명이 반드시 필요함
    roughness: 0.5,     // 표면 거칠기
    metalness: 0.5      // 금속성
 }); 
const cube = new THREE.Mesh(geometry, material);   
cube.castShadow = true;                             // 큐브가 그림자를 만들도록 설정
scene.add(cube); 

const planeGeometry = new THREE.PlaneGeometry(10,10);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;    // 바닥처럼 보이도록 90도 눕힘
plane.position.y = -1;
plane.receiveShadow = true;     // 바닥이 그림자를 받도록 설정
scene.add(plane);


// 2단계 : 조명 생성
// AmbientLight (씬 전체에 은은하게 깔리는 환경광. 그림자를 만들지 않음)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);     // 색상, 강도
scene.add(ambientLight);

// DirectionalLight (태양광 처럼 한 방향으로 내리 쬐는 빛. 그림자를 만들 수 있음)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(3,4,5);   // 빛의 위치
directionalLight.castShadow = true;     // directionalLight가 그림자를 만들도록 설정
directionalLight.shadow.mapSize.width = 1024;   // 그림자 맵 해상도 가로 설정(기본값은 512)
directionalLight.shadow.mapSize.height = 1024;  // 그림자 맵 해상도 세로 설정(기본값은 512)
scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1); // DirectionalLight의 위치와 방향을 시각적으로 보여주는 헬퍼
scene.add(directionalLightHelper);

// PointLight (전구처럼 한 점에서 사방으로 퍼져나가는 빛. Unity의 PointLight와 동일)
const pointLight = new THREE.PointLight(0xffcc00, 10);
pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;
pointLight.visible = false; // 처음엔 보이지 않게 설정
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
pointLightHelper.visible = false; // 처음엔 보이지 않게 설정
scene.add(pointLightHelper);

// SpotLight (손전등처럼 원뿔 형태로 특정 방향을 비추는 빛. Unity의 SpotLight와 동일)
const spotLight = new THREE.SpotLight(0x00ffff, 100, 10, Math.PI * 0.1, 0.2, 1);
spotLight.position.set(0, 4, 3);
spotLight.castShadow = true;
spotLight.visible = false;
scene.add(spotLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
spotLightHelper.visible = false;
scene.add(spotLightHelper);
scene.add(spotLight.target);    // SpotLight는 빛이 향하는 타겟도 씬에 추가해야 헬퍼가 제대로 보임


// 3단계 : GUI 구성
// 조명 선택을 위한 객체
const lightParams = {lightType: "Directional"};

// 각 조명별 GUI 설정을 담을 폴더 생성
const directionalLightFolder = gui.addFolder('Directional Light');
const pointLightFolder = gui.addFolder('Point Light');
const spotLightFolder = gui.addFolder('Spot Light');
pointLightFolder.close();   // 처음엔 닫아둠
spotLightFolder.close();    // 처음엔 닫아둠

// Directional Light 컨트롤
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('빛 강도');
directionalLightFolder.add(directionalLight.position, 'x').min(-10).max(10).step(0.01).name('빛 X위치');
directionalLightFolder.add(directionalLight.position, 'y').min(-10).max(10).step(0.01).name('빛 Y위치');
directionalLightFolder.add(directionalLight.position, 'z').min(-10).max(10).step(0.01).name('빛 Z위치');

// Point Light 컨트롤
pointLightFolder.add(pointLight, 'intensity').min(0).max(10).step(0.01).name('빛 강도');
pointLightFolder.add(pointLight, 'distance').min(0).max(10).step(0.01).name('거리 (Distance)');
pointLightFolder.add(pointLight, 'decay').min(0).max(5).step(0.01).name('감쇠율 (Decay)');
pointLightFolder.add(pointLight.position, 'x').min(-10).max(10).step(0.01).name('빛 X위치');
pointLightFolder.add(pointLight.position, 'y').min(-10).max(10).step(0.01).name('빛 Y위치');
pointLightFolder.add(pointLight.position, 'z').min(-10).max(10).step(0.01).name('빛 Z위치');

// Spot Light 컨트롤
spotLightFolder.add(spotLight, 'intensity').min(0).max(10).step(0.01).name('빛 강도');
spotLightFolder.add(spotLight, 'distance').min(0).max(20).step(0.1).name('거리 (Distance)');
spotLightFolder.add(spotLight, 'decay').min(0).max(5).step(0.01).name('감쇠율 (Decay)');
spotLightFolder.add(spotLight, 'angle').min(0).max(Math.PI / 4).step(0.01).name('조사 범위')
spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01).name('빛 가장자리 부드러움');
spotLightFolder.add(spotLight.position, 'x').min(-10).max(10).step(0.01).name('빛 X위치');
spotLightFolder.add(spotLight.position, 'y').min(-10).max(10).step(0.01).name('빛 Y위치');
spotLightFolder.add(spotLight.position, 'z').min(-10).max(10).step(0.01).name('빛 Z위치');
spotLightFolder.add(spotLight.target.position, 'x').min(-10).max(10).step(0.01).name('타겟 X');
spotLightFolder.add(spotLight.target.position, 'y').min(-10).max(10).step(0.01).name('타겟 Y');
spotLightFolder.add(spotLight.target.position, 'z').min(-10).max(10).step(0.01).name('타겟 Z');

// 공통 컨트롤
gui.addColor(material, 'color').name('큐브 색상');
gui.add(material, 'metalness').min(0).max(1).step(0.01).name('금속성');
gui.add(material, 'roughness').min(0).max(1).step(0.01).name('거칠기');

// 조명 타입 선택 드롭다운 메뉴
gui.add(lightParams, 'lightType', ['Directional', 'Point', 'Spot']).name('조명 종류')
.onChange(value =>{
    // 모든 조명 끔
    directionalLight.visible = false;
    directionalLightHelper.visible = false;
    pointLight.visible = false;
    pointLightHelper.visible = false;
    spotLight.visible = false;
    spotLightHelper.visible = false;

    // 모든 조명 GUI 폴더를 닫음
    directionalLightFolder.close();
    pointLightFolder.close();
    spotLightFolder.close();

    // 선택한 조명과 GUI 폴더만 활성화
    if (value === 'Directional') {
            directionalLight.visible = true;
            directionalLightHelper.visible = true;
            directionalLightFolder.open();
        } else if (value === 'Point') {
            pointLight.visible = true;
            pointLightHelper.visible = true;
            pointLightFolder.open();
        } else if (value === 'Spot') {
            spotLight.visible = true;
            spotLightHelper.visible = true;
            spotLightFolder.open();
        }
})


// 4단계 : 카메라, 렌더러, 애니메이션 루프
// 화면 크기를 가져옴
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera 설정
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); 
camera.position.z = 5;     
scene.add(camera);         

// 렌더러 준비
const canvas = document.querySelector('.testCanvas');  
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({      
    canvas: canvas,
    antialias: true    
});
renderer.setSize(sizes.width, sizes.height); 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;      // 그림자 계산 과정을 활성화, 설정 안하면 그림자 렌더링 안됨
renderer.shadowMap.type = THREE.PCFSoftShadowMap;   // 그림자 맵 타입을 설정해 외곽선을 부드럽게 만듬

// 애니메이션 루프(매 프레임 수행)
function animate() {   
    requestAnimationFrame(animate); 

    controls.update();    
    directionalLightHelper.update();
    pointLightHelper.update();
    spotLightHelper.update();

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera); 
}

animate();