# Chapter 1: 기본 3D Scene과 큐브 만들기

이 챕터에서는 Three.js를 사용하기 위한 가장 기본적인 환경을 설정하고, 화면에 3D 큐브 하나를 띄우고 회전시켜본다.

**🚀 Demo:** [https://sgho0915.github.io/threejs-learn/01-basic-scene/](https://sgho0915.github.io/threejs-learn/01-basic-scene/)

-----

## 개요

  * Three.js 프로젝트의 기본 파일 구조 이해
  * `Scene`, `Camera`, `Renderer`의 3대 요소 설정
  * `Geometry`와 `Material`을 조합한 `Mesh` 객체를 만들고 씬에 추가
  * `requestAnimationFrame`을 이용한 애니메이션 루프 구현

-----

## 1\. Three.js를 위한 준비물

Three.js는 JavaScript 라이브러리이므로, 웹 개발의 가장 기본적인 3요소에 대한 이해가 필요하지만, Three.js를 학습하는 과정에서 함께 습득하는 것을 목표

  * **지식**: HTML, CSS, JavaScript 기초
  * **도구**: VS Code
  * **VSCode Extension**: 로컬 환경에서 구동 테스트 시 Live Server 설치 후 index.html 우클릭 -> Open With Live Server 선택    

-----

## 2\. 프로젝트 파일 구성

| 파일명 | 역할 | 비유 |
| :--- | :--- | :--- |
| **`index.html`** | 웹페이지의 뼈대 구성. 3D 그래픽이 그려질 `<canvas>`를 배치하고 JS 파일을 불러옴. | 뼈대 |
| **`style.css`** | 웹페이지의 디자인 담당. `<canvas>`를 화면에 꽉 채우는 등의 스타일 정의. | 옷 |
| **`main.js`** | Three.js 로직을 작성하는 핵심 파일. 씬을 만들고 객체를 움직이는 등의 모든 동작을 구현. | 뇌 |

-----

## 3\. 코드 분석

### `index.html` - 뼈대 세우기

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Three.js 큐브</title>
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
    <!-- Three.js가 렌더링할 Canvas -->
    <canvas class="testCanvas"></canvas>

    <!-- Scene, Cube, Camera 조작 등 작성된 main.js 실행 -->
    <!-- import 구문 사용하려면 type="module" 속성 추가 -->
    <script type="module" src="main.js"></script>
</body>
</html>
```

`<body>` 태그 안에는 3D 그래픽이 그려질 도화지인 `<canvas>`와 실제 로직이 담긴 `main.js`를 불러오는 `<script>` 태그가 위치한다. `<head>` 안의 `importmap`은 `main.js`가 `import * as THREE from 'three'` 코드를 에러 없이 실행할 수 있도록 도와주는 역할을 한다.

----

### `style.css` - 디자인 입히기

```css
/* 모든 요소에 대한 전역적인 기본 설정 */
* {
    margin: 0;
    padding: 0;
}

/* testCanvas에 대한 개별 설정 */

/* position : 브라우저 웹페이지에서 요소의 배치 방식을 결정하는 속성
- static(기본값) : HTML 코드에 작성된 순서 그대로, 다른 요소와의 흐름에 맞춰 자연스럽게 배치됨. top, left 같은 위치 속성이 적용되지 않음
- relative : static 상태의 원래 위치를 기준으로 top, left 값만큼 상대적으로 이동. 요소가 이동해도 원래 있던 공간은 그대로 차지함
- absolute : 가장 가까운 position 속성을 가진 부모 요소를 기준으로 위치 결정. 그런 부모가 없다면 웹페이지 최상단(body)이 기준이 됨. (Unity Rect Transform Anchor와 비슷하게 부모 좌표계에 따라 움직임)
- fixed :  부모 요소와 상관 없이 무조건 브라우저 화면(ViewPort)을 기준으로 위치가 고정됨. 스크롤을 내려도 항상 같은 자리에 보임. (Unity Canvas의 Screen Space- Overlay랑 비슷)
- sticky : 평소에는 relative 처럼 동작하다가 스크롤 시 정해진 위치에 닿으면 fixed 처럼 고정되는 하이브리드 속성.(ex:스크롤 내려도 상단에 붙어있는 메뉴바) */

/* outline : 요소의 테두리 바깥쪽에 그려지는 선
- none : 외곽선 표시 안함
- solid : 실선으로 표시 (ex: outline: 2px solid blue;)
- dotted : 점선으로 표시
- dashed : 짧은 선이 이어진 형태로 표시 */

/* display : 레이아웃, 정렬
- 요소가 화면에 어떻게 보여지고 다른 요소와 어떻게 상호작용할지 결정(block, inline, flex) */

/* width, height : 요소 너비, 높이 지정 */

/* margin, padding : 요소 바깥 여백, 안쪽 여백 설정 */

/* background-color : 요소 배경 색상 지정 */

/* border : 요소 테두리 설정 (ex: border: 1px solid black;) */

/* font-size : 글자 크기 조절 */

.testCanvas {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
}
```

`*` 선택자로 모든 기본 여백을 제거해 브라우저 간 차이를 없애고, `.testCanvas`를 `position: fixed`로 설정해 화면 전체를 덮는 배경처럼 만들어준다.

----

### `main.js` - 생명 불어넣기

```javascript
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
```

코드는 Scene, Mesh, Camera, Renderer, Animation Loop 의 5가지 단계로 구성되어 있다. 각 단계는 3D 그래픽을 렌더링하기 위한 필수적인 과정이며, 주석에 각 코드의 역할을 상세히 기록했다.
