import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import {
  Move,
  RotateCw,
  Scale,
  Camera,
  Layers,
  Download,
  Trash2,
  Box,
  Square,
  Home,
  Package,
  Droplet,
  Palette,
  Ruler,
  Magnet
} from 'lucide-react';

interface DesignerCanvasProps {
  onObjectSelect?: (object: THREE.Object3D | null) => void;
  selectedTool?: 'select' | 'move' | 'rotate' | 'scale';
  showGrid?: boolean;
}

const DesignerCanvas: React.FC<DesignerCanvasProps> = ({
  onObjectSelect,
  selectedTool: selectedToolProp = 'select',
  showGrid = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef = useRef<number | null>(null);
  
  // Mouse controls state
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, button: 0 });
  const cameraControlsRef = useRef({
    theta: 45,
    phi: 45,
    radius: 10,
    target: new THREE.Vector3(0, 0, 0)
  });

  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'rotate' | 'scale'>(selectedToolProp);
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(0.1);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialKey | string>('wood');
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const measurementLinesRef = useRef<THREE.Group | null>(null);
  const outlineRef = useRef<THREE.LineSegments | null>(null);
  const transformHelperRef = useRef<THREE.Group | null>(null);

  // Material presets
  type MaterialKey = 'wood' | 'white' | 'black' | 'marble' | 'steel';
  
  const materials: Record<MaterialKey, THREE.MeshStandardMaterial> = {
    wood: new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.7,
      metalness: 0.1
    }),
    white: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1
    }),
    black: new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.6,
      metalness: 0.2
    }),
    marble: new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.3,
      metalness: 0.4
    }),
    steel: new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      roughness: 0.3,
      metalness: 0.9
    })
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(0xf0f0f0, 10, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    setupLighting(scene);

    // Grid
    if (showGrid) {
      const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
      gridHelper.name = 'grid';
      scene.add(gridHelper);
    }

    // Room walls
    createRoom(scene);

    // Setup environment
    setupEnvironment(scene, renderer);

    // Measurement lines group
    const measurementGroup = new THREE.Group();
    measurementGroup.name = 'measurements';
    scene.add(measurementGroup);
    measurementLinesRef.current = measurementGroup;

    // Transform helper group
    const transformHelper = new THREE.Group();
    transformHelper.name = 'transformHelper';
    scene.add(transformHelper);
    transformHelperRef.current = transformHelper;

    // Outline for selected object
    const outlineGeometry = new THREE.BoxGeometry(1, 1, 1);
    const outlineMaterial = new THREE.LineBasicMaterial({ color: 0x0080ff, linewidth: 2 });
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(outlineGeometry),
      outlineMaterial
    );
    outline.visible = false;
    scene.add(outline);
    outlineRef.current = outline;

    // Mouse controls
    const handleMouseDown = (event: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.button = event.button;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseRef.current.isDown) return;

      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;

      if (mouseRef.current.button === 2) { // Right click - rotate camera
        cameraControlsRef.current.theta -= deltaX * 0.5;
        cameraControlsRef.current.phi = Math.max(10, Math.min(80, cameraControlsRef.current.phi - deltaY * 0.5));
        updateCamera();
      } else if (mouseRef.current.button === 1) { // Middle click - pan
        const panSpeed = 0.01;
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        camera.getWorldDirection(new THREE.Vector3()).normalize();
        right.crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize();
        up.crossVectors(camera.getWorldDirection(new THREE.Vector3()), right).normalize();
        
        cameraControlsRef.current.target.add(right.multiplyScalar(-deltaX * panSpeed * cameraControlsRef.current.radius));
        cameraControlsRef.current.target.add(up.multiplyScalar(deltaY * panSpeed * cameraControlsRef.current.radius));
        updateCamera();
      }

      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraControlsRef.current.radius = Math.max(2, Math.min(50, cameraControlsRef.current.radius + event.deltaY * 0.01));
      updateCamera();
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const updateCamera = () => {
      if (!cameraRef.current) return;
      
      const theta = THREE.MathUtils.degToRad(cameraControlsRef.current.theta);
      const phi = THREE.MathUtils.degToRad(cameraControlsRef.current.phi);
      
      cameraRef.current.position.x = cameraControlsRef.current.target.x + cameraControlsRef.current.radius * Math.sin(phi) * Math.cos(theta);
      cameraRef.current.position.y = cameraControlsRef.current.target.y + cameraControlsRef.current.radius * Math.cos(phi);
      cameraRef.current.position.z = cameraControlsRef.current.target.z + cameraControlsRef.current.radius * Math.sin(phi) * Math.sin(theta);
      
      cameraRef.current.lookAt(cameraControlsRef.current.target);
    };

    // Raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current || event.button !== 0 || isDragging) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.name !== 'grid' && object.name !== 'floor' && object.name !== 'wall' && object.name !== 'room') {
          selectObject(object);
        }
      } else {
        selectObject(null);
      }
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });
    renderer.domElement.addEventListener('contextmenu', handleContextMenu);
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      renderer.domElement.removeEventListener('contextmenu', handleContextMenu);
      renderer.domElement.removeEventListener('click', handleClick);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  // Handle object transformation
  useEffect(() => {
    if (!selectedObject || !selectedTool || selectedTool === 'select') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedObject) return;

      const moveSpeed = snapToGrid ? gridSize : 0.1;
      const rotateSpeed = snapToGrid ? Math.PI / 12 : Math.PI / 36;

      switch (selectedTool) {
        case 'move':
          switch (event.key) {
            case 'ArrowUp':
              selectedObject.position.z -= moveSpeed;
              break;
            case 'ArrowDown':
              selectedObject.position.z += moveSpeed;
              break;
            case 'ArrowLeft':
              selectedObject.position.x -= moveSpeed;
              break;
            case 'ArrowRight':
              selectedObject.position.x += moveSpeed;
              break;
            case 'PageUp':
              selectedObject.position.y += moveSpeed;
              break;
            case 'PageDown':
              selectedObject.position.y -= moveSpeed;
              break;
          }
          break;
        case 'rotate':
          switch (event.key) {
            case 'ArrowLeft':
              selectedObject.rotation.y += rotateSpeed;
              break;
            case 'ArrowRight':
              selectedObject.rotation.y -= rotateSpeed;
              break;
          }
          break;
        case 'scale':
          const scaleSpeed = 0.1;
          switch (event.key) {
            case 'ArrowUp':
              selectedObject.scale.multiplyScalar(1 + scaleSpeed);
              break;
            case 'ArrowDown':
              selectedObject.scale.multiplyScalar(1 - scaleSpeed);
              break;
          }
          break;
      }

      updateOutline();
      updateMeasurements();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, selectedTool, snapToGrid]);

  // Setup lighting
  const setupLighting = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 0.5, 10);
    pointLight1.position.set(-5, 5, -5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 10);
    pointLight2.position.set(5, 5, -5);
    scene.add(pointLight2);
  };

  // Create room
  const createRoom = (scene: THREE.Scene) => {
    const roomGeometry = new THREE.BoxGeometry(20, 8, 20);
    const roomMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      roughness: 0.8,
      metalness: 0.1
    });
    
    const room = new THREE.Mesh(roomGeometry, roomMaterial);
    room.position.y = 4;
    room.receiveShadow = true;
    room.name = 'room';
    scene.add(room);

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.name = 'floor';
    scene.add(floor);
  };

  // Setup environment
  const setupEnvironment = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const gradientTexture = new THREE.DataTexture(
      new Uint8Array([
        255, 255, 255, 255,
        240, 240, 240, 255,
        220, 220, 220, 255,
        200, 200, 200, 255
      ]),
      2, 2
    );
    gradientTexture.magFilter = THREE.LinearFilter;
    gradientTexture.needsUpdate = true;
    
    const renderTarget = pmremGenerator.fromEquirectangular(gradientTexture);
    scene.environment = renderTarget.texture;
    
    gradientTexture.dispose();
    pmremGenerator.dispose();
  };

  // Update outline
  const updateOutline = () => {
    if (!outlineRef.current || !selectedObject) return;
    
    if (selectedObject instanceof THREE.Mesh) {
      outlineRef.current.geometry.dispose();
      outlineRef.current.geometry = new THREE.EdgesGeometry(selectedObject.geometry);
      outlineRef.current.position.copy(selectedObject.position);
      outlineRef.current.rotation.copy(selectedObject.rotation);
      outlineRef.current.scale.copy(selectedObject.scale);
      outlineRef.current.visible = true;
    }
  };

  // Select object
  const selectObject = (object: THREE.Object3D | null) => {
    setSelectedObject(object);
    
    if (outlineRef.current) {
      if (object) {
        updateOutline();
      } else {
        outlineRef.current.visible = false;
      }
    }
    
    if (onObjectSelect) {
      onObjectSelect(object);
    }
    
    updateMeasurements();
  };

  // Add cabinet
  const addCabinet = (type: 'base' | 'wall' | 'tall') => {
    if (!sceneRef.current) return;

    let geometry;
    let position;
    
    switch (type) {
      case 'base':
        geometry = new THREE.BoxGeometry(0.6, 0.9, 0.6);
        position = new THREE.Vector3(0, 0.45, 0);
        break;
      case 'wall':
        geometry = new THREE.BoxGeometry(0.6, 0.7, 0.3);
        position = new THREE.Vector3(0, 2, 0);
        break;
      case 'tall':
        geometry = new THREE.BoxGeometry(0.6, 2.1, 0.6);
        position = new THREE.Vector3(0, 1.05, 0);
        break;
      default:
        geometry = new THREE.BoxGeometry(0.6, 0.9, 0.6);
        position = new THREE.Vector3(0, 0.45, 0);
    }

    const material = materials[selectedMaterial as MaterialKey].clone();

    const cabinet = new THREE.Mesh(geometry, material);
    cabinet.position.copy(position);
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    cabinet.name = `${type}_cabinet_${Date.now()}`;
    cabinet.userData = { type: 'cabinet', subtype: type };
    
    sceneRef.current.add(cabinet);
    selectObject(cabinet);
  };

  // Add countertop
  const addCountertop = () => {
    if (!sceneRef.current) return;

    const geometry = new THREE.BoxGeometry(2, 0.04, 0.6);
    const material = materials[(selectedMaterial === 'wood' ? 'marble' : selectedMaterial) as MaterialKey].clone();
    
    const countertop = new THREE.Mesh(geometry, material);
    countertop.position.set(0, 0.92, 0);
    countertop.castShadow = true;
    countertop.receiveShadow = true;
    countertop.name = `countertop_${Date.now()}`;
    countertop.userData = { type: 'countertop' };
    
    sceneRef.current.add(countertop);
    selectObject(countertop);
  };

  // Add appliance
  const addAppliance = (type: 'fridge' | 'oven' | 'dishwasher' | 'sink') => {
    if (!sceneRef.current) return;

    let geometry;
    let position;
    let material;
    
    switch (type) {
      case 'fridge':
        geometry = new THREE.BoxGeometry(0.7, 1.8, 0.65);
        position = new THREE.Vector3(0, 0.9, 0);
        material = materials.steel.clone();
        break;
      case 'oven':
        geometry = new THREE.BoxGeometry(0.6, 0.6, 0.55);
        position = new THREE.Vector3(0, 0.3, 0);
        material = materials.black.clone();
        break;
      case 'dishwasher':
        geometry = new THREE.BoxGeometry(0.6, 0.85, 0.55);
        position = new THREE.Vector3(0, 0.425, 0);
        material = materials.steel.clone();
        break;
      case 'sink':
        geometry = new THREE.BoxGeometry(0.8, 0.2, 0.5);
        position = new THREE.Vector3(0, 0.8, 0);
        material = materials.steel.clone();
        break;
    }
    
    const appliance = new THREE.Mesh(geometry!, material!);
    appliance.position.copy(position!);
    appliance.castShadow = true;
    appliance.receiveShadow = true;
    appliance.name = `${type}_${Date.now()}`;
    appliance.userData = { type: 'appliance', subtype: type };
    
    sceneRef.current.add(appliance);
    selectObject(appliance);
  };

  // Update measurements
  const updateMeasurements = () => {
    if (!measurementLinesRef.current || !sceneRef.current) return;
    
    measurementLinesRef.current.clear();
    
    if (!showMeasurements || !selectedObject) return;
    
    if (selectedObject instanceof THREE.Mesh && selectedObject.geometry instanceof THREE.BoxGeometry) {
      const box = new THREE.Box3().setFromObject(selectedObject);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      // Create measurement text (simplified visualization)
      const widthText = `${(size.x * 100).toFixed(0)}cm`;
      const depthText = `${(size.z * 100).toFixed(0)}cm`;
      const heightText = `${(size.y * 100).toFixed(0)}cm`;
      
      console.log(`Dimensions: ${widthText} x ${depthText} x ${heightText}`);
    }
  };

  // Export scene
  const exportScene = () => {
    if (!sceneRef.current) return;
    
    const sceneData = {
      objects: sceneRef.current.children
        .filter(obj => !['grid', 'floor', 'room', 'measurements', 'transformHelper'].includes(obj.name))
        .map(obj => ({
          name: obj.name,
          type: obj.type,
          position: obj.position.toArray(),
          rotation: obj.rotation.toArray(),
          scale: obj.scale.toArray(),
          userData: obj.userData
        }))
    };
    
    const blob = new Blob([JSON.stringify(sceneData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kitchen-design.json';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  // Take screenshot
  const takeScreenshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'kitchen-design.png';
    a.click();
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!selectedObject || !sceneRef.current) return;
    
    sceneRef.current.remove(selectedObject);
    selectObject(null);
  };

  // Change view
  const changeView = (mode: 'perspective' | 'top' | 'front' | 'side') => {
    if (!cameraRef.current) return;
    
    setViewMode(mode);
    
    switch (mode) {
      case 'top':
        cameraControlsRef.current.theta = 0;
        cameraControlsRef.current.phi = 0.1;
        break;
      case 'front':
        cameraControlsRef.current.theta = 0;
        cameraControlsRef.current.phi = 90;
        break;
      case 'side':
        cameraControlsRef.current.theta = 90;
        cameraControlsRef.current.phi = 90;
        break;
      case 'perspective':
      default:
        cameraControlsRef.current.theta = 45;
        cameraControlsRef.current.phi = 45;
    }
    
    const theta = THREE.MathUtils.degToRad(cameraControlsRef.current.theta);
    const phi = THREE.MathUtils.degToRad(cameraControlsRef.current.phi);
    
    cameraRef.current.position.x = cameraControlsRef.current.target.x + cameraControlsRef.current.radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.y = cameraControlsRef.current.target.y + cameraControlsRef.current.radius * Math.cos(phi);
    cameraRef.current.position.z = cameraControlsRef.current.target.z + cameraControlsRef.current.radius * Math.sin(phi) * Math.sin(theta);
    
    cameraRef.current.lookAt(cameraControlsRef.current.target);
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Controls Help */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <div className="font-semibold mb-1">Controls:</div>
        <div>Right Click + Drag: Rotate View</div>
        <div>Middle Click + Drag: Pan View</div>
        <div>Scroll: Zoom In/Out</div>
        {selectedObject && selectedTool !== 'select' && (
          <>
            <div className="mt-2 font-semibold">Transform:</div>
            <div>Arrow Keys: Move/Rotate</div>
            <div>Page Up/Down: Move Vertically</div>
          </>
        )}
      </div>
      
      {/* Toolbar */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2">
        <button
          onClick={() => changeView('perspective')}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${viewMode === 'perspective' ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Perspective View"
        >
          <Camera className="h-5 w-5" />
        </button>
        <button
          onClick={() => changeView('top')}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${viewMode === 'top' ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Top View"
        >
          <Layers className="h-5 w-5" />
        </button>
        <button
          onClick={() => changeView('front')}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${viewMode === 'front' ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Front View"
        >
          <Square className="h-5 w-5" />
        </button>
        <div className="border-t pt-2">
          <button
            onClick={takeScreenshot}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Take Screenshot"
          >
            <Camera className="h-5 w-5" />
          </button>
          <button
            onClick={exportScene}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Export Scene"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Add Furniture Toolbar */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Material Selector */}
        <div className="mb-4 pb-4 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Palette className="h-4 w-4 mr-1" />
            Material
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {Object.keys(materials).map((mat) => (
              <button
                key={mat}
                onClick={() => setSelectedMaterial(mat)}
                className={`px-2 py-1 text-xs rounded capitalize transition-colors ${
                  selectedMaterial === mat
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Cabinets */}
        <div className="mb-4 pb-4 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Cabinets</h3>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => addCabinet('base')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              <Box className="h-4 w-4" />
              <span className="text-sm">Base Cabinet</span>
            </button>
            <button
              onClick={() => addCabinet('wall')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              <Square className="h-4 w-4" />
              <span className="text-sm">Wall Cabinet</span>
            </button>
            <button
              onClick={() => addCabinet('tall')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">Tall Cabinet</span>
            </button>
          </div>
        </div>

        {/* Countertops & Surfaces */}
        <div className="mb-4 pb-4 border-b">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Surfaces</h3>
          <button
            onClick={addCountertop}
            className="w-full flex items-center space-x-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded transition-colors"
          >
            <Package className="h-4 w-4" />
            <span className="text-sm">Countertop</span>
          </button>
        </div>

        {/* Appliances */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Appliances</h3>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => addAppliance('fridge')}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors"
            >
              <Box className="h-4 w-4" />
              <span className="text-sm">Refrigerator</span>
            </button>
            <button
              onClick={() => addAppliance('oven')}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors"
            >
              <Box className="h-4 w-4" />
              <span className="text-sm">Oven</span>
            </button>
            <button
              onClick={() => addAppliance('dishwasher')}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors"
            >
              <Square className="h-4 w-4" />
              <span className="text-sm">Dishwasher</span>
            </button>
            <button
              onClick={() => addAppliance('sink')}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded transition-colors"
            >
              <Droplet className="h-4 w-4" />
              <span className="text-sm">Sink</span>
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="pt-4 border-t">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
              className="rounded text-blue-600"
            />
            <Magnet className="h-4 w-4" />
            <span className="text-sm">Snap to Grid</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={showMeasurements}
              onChange={(e) => setShowMeasurements(e.target.checked)}
              className="rounded text-blue-600"
            />
            <Ruler className="h-4 w-4" />
            <span className="text-sm">Show Measurements</span>
          </label>
        </div>
      </div>
      
      {/* Object Actions */}
      {selectedObject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Selected: {selectedObject.name}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedTool('move')}
                className={`p-2 rounded transition-colors ${selectedTool === 'move' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Move"
              >
                <Move className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedTool('rotate')}
                className={`p-2 rounded transition-colors ${selectedTool === 'rotate' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedTool('scale')}
                className={`p-2 rounded transition-colors ${selectedTool === 'scale' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Scale"
              >
                <Scale className="h-4 w-4" />
              </button>
              <button
                onClick={deleteSelectedObject}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete Object"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {showMeasurements && selectedObject instanceof THREE.Mesh && (
            <div className="mt-2 text-xs text-gray-600">
              Dimensions: Check console for measurements
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DesignerCanvas;