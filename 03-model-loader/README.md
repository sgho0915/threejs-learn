# Chapter 3: 3D 모델 불러오기 (GLTF Loader)

Three.js 씬에 외부 3D 모델을 불러오는 방법을 학습한다. 웹 3D의 표준 포맷인 **GLTF**에 대해 이해하고, \*\*`GLTFLoader`\*\*를 사용하여 모델을 씬에 배치하는 것을 목표로 한다.

**🚀 Live Demo:** [https://sgho0915.github.io/threejs-learn/03-model-loader/](https://sgho0915.github.io/threejs-learn/03-model-loader/)

-----

## **개요**

  * 웹 3D 표준 모델 포맷인 GLTF(.gltf, .glb)의 특징
  * `GLTFLoader`를 사용해 3D 모델 비동기적 로드
  * 로드된 모델의 `scale`, `position`, `rotation` 등 Transform 속성 제어

-----

## **1. GLTF: "3D계의 JPEG"**

과거에는 다양한 3D 포맷이 사용되었지만, 현재 웹 환경에서는 GLTF(GL Transmission Format)가 표준으로 자리 잡았다. GLTF는 3D 모델의 구조, 재질, 텍스처, 애니메이션 등 모든 정보를 효율적으로 담을 수 있도록 설계되어 '3D를 위한 JPEG'라고도 불린다.

  * **`.gltf`**: 모델의 구조 정보가 담긴 JSON 파일과 3D 데이터(`.bin`), 텍스처(이미지 폴더)가 분리된 형태.
  * **`.glb`**: 위의 모든 정보를 하나의 바이너리 파일로 압축한 형태. 파일 하나로 관리할 수 있어 웹에서 더 선호된다.

| 구분 | **glTF** | **GLB** |
| :--- | :--- | :--- |
| **파일 구조** | 여러 파일로 분리 (`.gltf` + `.bin` + 텍스처 등) | 모든 데이터를 포함하는 단일 바이너리 파일 |
| **기반 형식** | JSON (텍스트 기반) | 바이너리 |
| **가독성** | 높음 (JSON 파일 직접 확인 및 수정 가능) | 낮음 (직접 수정 거의 불가능) |
| **웹 로딩 속도** | 상대적으로 느림 (여러 파일 요청 필요) | **빠름** (단일 파일 요청) |
| **파일 관리** | 복잡할 수 있음 (여러 파일 관리) | **간편함** (단일 파일 관리) |
| **주요 사용처** | 개발, 디버깅, 3D 모델 데이터 수정 단계 | **웹 배포, 실시간 렌더링, 최종 애플리케이션 적용** |

이번 챕터에서는 Sketchfab에서 다운로드한 턱시도 고양이 모델(`scene.gltf`)을 사용했다.

-----

## **2. `GLTFLoader` 사용하기**

Three.js에서 외부 모델을 불러오기 위해서는 해당 포맷에 맞는 '로더(Loader)'가 필요하다. GLTF 파일을 위해서는 `GLTFLoader`를 사용한다.

### **주요 코드**

```javascript
// main.js

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 1. GLTFLoader 인스턴스 생성
const gltfLoader = new GLTFLoader();

// 2. 모델 로드
// 모델 로딩은 네트워크를 통해 파일을 받는 비동기 작업이므로,
// 로드가 완료된 후 실행될 콜백 함수 안에서 후속 처리를 해야 한다.
gltfLoader.load(
    './models/Fox.glb', // 모델 파일 경로
    
    // 로드 성공 시 실행되는 콜백 함수
    (gltf) => {
        // gltf.scene에 실제 모델 객체가 담겨 있다.
        const model = gltf.scene;
        
        // 모델의 Transform 조절
        model.scale.set(0.02, 0.02, 0.02);
        model.position.y = 0;
        
        // 씬에 모델 추가
        scene.add(model);
    },
    
    // 로드 진행률 콜백 (선택 사항)
    undefined,
    
    // 로드 실패 시 실행되는 콜백 함수
    (error) => {
        console.error('모델 로드 중 에러 발생', error);
    }
);
```

### **핵심 개념**

  * **비동기 로딩**: `gltfLoader.load()` 함수는 파일의 위치가 로컬, 원격인 것과 관계 없이 파일을 읽고 처리하는 작업(I/O)은 메인 스레드를 멈추게 할 가능성이 있는 무거운 작업이므로 비동기 방식으로 처리해 코드는 다음 줄로 바로 넘어간다. 실제 모델을 다루는 코드는 로딩이 완료된 후 실행되는 콜백 함수(화살표 함수 `gltf => { ... }`) 내부에 작성해야 한다.
  * **`gltf.scene`**: 로더가 반환하는 `gltf` 객체에는 애니메이션, 카메라 등 다양한 정보가 포함될 수 있다. 이 중에서 실제로 씬에 추가해야 하는 3D 객체는 `gltf.scene` 프로퍼티에 담겨 있다.

-----

## **3. 전체 코드**

### **`index.html`**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>03-model-loader</title>
    <link rel="stylesheet" href="style.css">
    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.138.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.138.0/examples/jsm/"
            }
        }
    </script>
</head>
<body>
    </body>
</html>
```

### **`main.js`**

```javascript
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
        model.scale.set(1, 1, 1);   // 모델의 X, Y, Z축 방향의 크기(Scale)를 설정
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
```

*`style.css`는 이전 챕터와 동일*