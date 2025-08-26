// THREE : using UnityEngine; 과 동일한 의미. 내부에 Scene, Vector3, Quaternion, Mesh 등이 담겨있음
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.138.0/examples/jsm/controls/OrbitControls.js'; // OrbitControl을 사용하기 위함

// 1단계 : Scene 구성
const scene = new THREE.Scene();                    // 3D 가상 월드 생성 (Unity New Scene과 동일)

// cube 추가
const geometry = new THREE.BoxGeometry(1, 1, 1);    // 물체의 모양정보를 정의 (Unity MeshFilter 컴포넌트의 Mesh 개념)
const material = new THREE.MeshBasicMaterial({      // 물체의 표면 재질 정의. Basic은 빛의 영향을 받지 않는 단순 재질 (Unity Unlit 셰이더와 비슷)
    color: 0x6699FF,    // 파란색 계열
    roughness: 0.5,     // 표면 거칠기
    metalness: 0.5      // 금속성
 }); 
const cube = new THREE.Mesh(geometry, material);    // 모양 정보와 재질을 합쳐 완전한 3D 객체를 만듬. (Unity MeshFilter와 MeshRenderer 컴포넌트를 가진 GameObject 개념)
scene.add(cube);                                    // 만들어진 객체를 Scene에 추가 (Unity Hierarchy에 올리는 것과 비슷)

// plane 추가
const planeGeometry = new THREE.PlaneGeometry(10,10);
const planeMatrial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
const plane = new THREE.Mesh(planeGeometry, planeMatrial);
plane.rotation.x = -Math.PI / 2;    // 바닥처럼 보이도록 90도 눕힘
plane.position.y = -1;
scene.add(plane);

// 화면 크기를 가져옴
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


// 2단계 : Camera 설정
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); // 원근감이 있는 카메라 생성 (Unity Perspective Camera와 비슷)
camera.position.z = 5;      // 카메라를 뒤로 3만큼 이동
scene.add(camera);          // 카메라를 Scene에 추가


// 3단계 : 렌더러 준비
const canvas = document.querySelector('.testCanvas');   // HTML에서 씬을 구성할 canvas 요소를 찾아옴 (Unity C# 스크립트에서 public 변수를 inspector에 할당하는 것과 비슷)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({      // WebGL 기술을 사용해 3D 그래픽을 그려주는 렌더러를 생성
    canvas: canvas,
    antialias: true     // 티어링 현상을 부드럽게 처리
});
renderer.setSize(sizes.width, sizes.height);    // 렌더링 해상도 설정(Unity GameView의 해상도 설정과 비슷)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// 4단계 : 애니메이션 루프(매 프레임 수행)
function animate() {    // 반복적으로 실행될 로직을 담는 함수(예약어 아님)

    // 프레임 업데이트에 setInterval을 사용하지 않고 requestAnimationFrame을 사용하는 이유는 다른 탭 이동, 브라우저 최소화 상태에서는 requestAnimationFrame 실행 횟수를 자동으로 줄이거나 멈춰 최적화와 효율성을 챙김
    // requestAnimationFrame은 브라우저 실제 렌더링 주기와 동기화 되어있음. 따라서 모니터 주사율에 가장 이상적으로 맞춰 티어링 현상 없이 부드러운 애니메이션 보장
    requestAnimationFrame(animate);     // animate 함수의 모든 코드를 실행한 뒤, 브라우저가 다음 화면을 그리기 직전 최적의 타이밍에 animate 함수를 다시 호출할 것을 예약하는 함수

    controls.update();      // OrbitControls의 감속 효과를 사용하려면 매 프레임 업데이트 필요

    // 큐브를 회전시킵니다.
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);     // 현재 scene의 상태를 camera의 시점에서 실제로 화면에 그림 (Unity 한 프레임의 모든 Update 끝난 후 화면이 갱신되는 과정)
}

animate(); // 애니메이션 시작



// 기타 THREE 요소

// 재질과 조명
// MeshStandardMaterial : PBR(물리 기반 렌더링)을 지원하는 표준 재질. 금 속성, 거칠기 등을 표현할 수 있고 조명이 반드시 필요함
// AmbientLight : 씬 전체에 은은하게 깔리는 환경광. 그림자를 만들지 않음
// DirectionalLight : 태양광 처럼 한 방향으로 내리 쬐는 빛. 그림자를 만들 수 있음

// 사용자 입력
// OrbitControls : 마우스로 씬을 회전, 확대/축소, 이동할 수 있게 해주는 컨트롤러

// 에셋 로딩
// GLTFLoader : .gltf 또는 .glb 형식의 3D 모델 파일을 불러오는 로더

// 수학/좌표
// THREE.Vector3 : 3차원 벡터(x,y,z)를 다루는 클래스. 위치, 방향, 크기 등을 표현