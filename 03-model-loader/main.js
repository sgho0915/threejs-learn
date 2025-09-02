import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // 마우스로 씬을 회전, 확대/축소, 이동할 수 있게 해주는 컨트롤러
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';  // GLTF 모델을 불러오기 위한 GLTFLoader import

// 1단계 : 기본구성(렌더러, 씬, 카메라, 조명 등)
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement); 
// document.body: 현재 웹페이지의 <body> 태그
// renderer.domElement: 렌더러가 그림을 그리는 <canvas> HTML 요소
// Three.js가 그린 canvas를 웹페이지 <body> 태그에 추가

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xefefef);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const controls = new OrbitControls(camera, renderer.domElement);    // (조작 대상, 마우스 이벤트 감지 영역)
controls.enableDamping = true;  // 부드러운 감속 효과 활성화, animate 루프에서 controls.update() 필요

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({color: 0xeeeeee})
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);


// 2단계 : GLTF 로더 생성 및 모델 불러오기
const gltfLoader = new GLTFLoader();

//.load(모델 경로, 로드 완료 시 실행될 콜백 함수)
// 모델 로딩은 네트워크를 통해 파일을 받는 비동기 작업이므로,
// 로드가 완료된 후 실행될 콜백 함수 안에서 후속 처리를 해야 한다.
gltfLoader.load(
    './models/scene.gltf',  // 로드할 모델 파일의 경로
    gltf => {
        // 로드 완료 시 gltf 객체 전달
        // 실제 모델 데이터는 gltf.scene에 들어있음
        const model = gltf.scene;

        // 모델 크기, 위치 조절
        model.scale.set(0.25, 0.25, 0.25);   // 모델의 X, Y, Z축 방향의 크기(Scale)를 설정
        model.position.y = 0;   // 바닥에 맞춤

        // 씬에 모델 추가
        scene.add(model);

        console.log('모델 로드 완료', gltf);    // 로드된 gltf 객체의 내부 구조를 직접 확인하고 디버깅하기 위해서 인자 추가
    },
    undefined,  // 로딩 진행률 콜백 (사용안함)
    error => {
        // 로드 중 에러 발생 시 실행
        console.error('모델 로드 중 에러 발생', error);
    }
);


// 3단계 : 애니메이션 루프
function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();