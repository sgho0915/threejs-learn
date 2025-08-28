# Chapter 2: 조명, 그림자, 인터랙티브 컨트롤

이 챕터에서는 Chapter 1에서 만든 기본 씬에 더해 Three.js 조명들의 특성을 이해하고, 그림자를 구현한다.
lil-gui 라이브러리를 이용해 씬의 조명 파라미터를 실시간으로 조작해 조명 속성들의 효과를 확인한다.

**🚀 Demo:** [https://sgho0915.github.io/threejs-learn/02-lights-shadow-control/](https://sgho0915.github.io/threejs-learn/02-lights-shadow-control/)

-----

## 개요

  * `AmbientLight`, `DirectionalLight`, `PointLight`, `SpotLight`의 특성
  * Three.js에서 그림자를 구현하기 위한 요소
  * `lil-gui`를 사용한 조명, 재질 파라미터 제어 UI
  * `Helper` 객체를 이용한 조명 디버깅 시각화

-----

## 1\. 조명(Lights)

`MeshStandardMaterial`과 같은 PBR(물리 기반 렌더링) 재질은 반드시 조명이 있어야 제대로 렌더링된다.

| 조명 종류 | 특징 | 비유 | 주 사용처 |
| :--- | :--- | :--- | :--- |
| **`AmbientLight`** | 씬 전체에 균일한 빛을 더하는 환경광. 그림자를 만들지 않음 | Environment Lighting | 물체의 가장 어두운 부분을 살짝 밝혀주는 용도 |
| **`DirectionalLight`** | 태양광처럼 한 방향으로 내리쬐는 평행광. 그림자를 만듦. | Directional Light | 야외 전역 조명 |
| **`PointLight`** | 전구처럼 한 점에서 사방으로 퍼지는 빛. 그림자를 만듦. | Point Light | 촛불, 실내등 |
| **`SpotLight`** | 손전등처럼 원뿔 형태로 특정 지점을 비추는 빛. 그림자를 만듦. | Spot Light | 무대 조명 |

### 코드 구현

```JavaScript
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
```

----

## 2\.  그림자 (Shadows)
Three.js에서 그림자를 구현하려면 아래 조건을 만족해야 한다.

1.  **렌더러 설정**: 렌더러에게 그림자 계산을 하도록 마스터 스위치를 켠다.
```JavaScript
renderer.shadowMap.enabled = true;
```

2.  **빛 설정**: 그림자를 생성할 빛 객체에 castShadow 속성을 활성화한다.
```JavaScript
directionalLight.castShadow = true;
```

3.  **그림자를 만드는 객체 설정**: 그림자를 드리울 Mesh 객체에 castShadow 속성을 활성화한다.
```JavaScript
cube.castShadow = true;
```

4.  **그림자를 받는 객체 설정**: 그림자가 그려질 Mesh 객체(바닥 등)에 receiveShadow 속성을 활성화한다.
```JavaScript
plane.receiveShadow = true;
```

### 그림자 품질 개선
기본 그림자는 해상도가 낮거나 경계선이 날카로울 수 있어 아래 속성으로 품질을 개선할 수 있다.

* `light.shadow.mapSize`: 그림자를 그리는 데 사용하는 텍스처의 해상도를 높여 선명하게 만든다. (예: 1024x1024)
* `renderer.shadowMap.type`: 그림자의 외곽선을 부드럽게 처리한다. (THREE.PCFSoftShadowMap)

-----

## 3\. GUI 컨트롤 (lil-gui)

`lil-gui`는 Three.js 프로젝트에서 변수를 실시간으로 조작하는 UI를 쉽게 만들 수 있도록 도와주는 라이브러리입니다. 이를 통해 씬을 '디지털 실험실'처럼 활용할 수 있습니다.

### \#\#\# GUI 기본 사용법

1.  **생성**: `new GUI()`로 컨트롤 패널 객체를 생성합니다.
2.  **컨트롤 추가**: `.add(객체, '속성명')` 메소드로 UI 컨트롤을 추가합니다. 체이닝 방식으로 `.min()`, `.max()`, `.step()`, `.name()` 등의 옵션을 설정할 수 있습니다.
3.  **폴더 및 드롭다운**: `.addFolder()`로 컨트롤들을 그룹화하고, `.add()`에 배열을 넘겨주어 선택 메뉴를 만들 수 있습니다.

### \#\#\# 코드 구현

```javascript
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm';
const gui = new GUI();

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
```

-----

##  추가 사항

추후 다양한 오브젝트를 추가해 조명 관련 심화된 내용을 다뤄볼 예정이다.

  * **텍스처 (Textures)**: 단색 재질이 아닌 이미지 텍스처(`map`, `normalMap` 등)를 적용해 객체에 디테일과 현실감을 부여
  * **환경 맵 (Environment Map)**: HDRI 이미지를 씬의 배경과 환경광으로 사용해 객체 표면에 사실적인 반사 효과를 구현
  * **라이트 베이킹 (Light Baking)**: 정적인 씬에서 빛과 그림자 정보를 미리 텍스처에 구워내 실시간 렌더링 부하를 줄이고 성능을 최적화
  * **후처리 효과 (Post-processing)**: 렌더링된 결과물에 블룸(Bloom), 심도(Depth of Field) 등 추가적인 시각 효과를 적용해 최종 이미지의 완성도를 높임

코드는 Scene, Mesh, Camera, Renderer, Animation Loop 의 5가지 단계로 구성되어 있다. 각 단계는 3D 그래픽을 렌더링하기 위한 필수적인 과정이며, 주석에 각 코드의 역할을 상세히 기록했다.
