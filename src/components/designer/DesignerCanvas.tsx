import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import Stats from 'stats.js';
import { motion } from 'framer-motion';
import {
  Maximize2,
  Move,
  RotateCw,
  Scale,
  Grid,
  Eye,
  EyeOff,
  Sun,
  Camera,
  Layers,
  Download,
  Upload,
  Settings,
  Trash2
} from 'lucide-react';

interface DesignerCanvasProps {
  onObjectSelect?: (object: THREE.Object3D | null) => void;
  selectedTool?: 'select' | 'move' | 'rotate' | 'scale';
  showGrid?: boolean;
  showStats?: boolean;
}

const DesignerCanvas: React.FC<DesignerCanvasProps> = ({
  onObjectSelect,
  selectedTool = 'select',
  showGrid = true,
  showStats = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const statsRef = useRef<Stats | null>(null);
  const rafRef = useRef<number | null>(null);
  
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');
  const [renderSettings, setRenderSettings] = useState({
    shadows: true,
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    exposure: 1.0
  });

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
      antialias: renderSettings.antialias,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = renderSettings.shadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = renderSettings.toneMapping;
    renderer.toneMappingExposure = renderSettings.exposure;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.minDistance = 2;
    orbitControls.maxDistance = 50;
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControlsRef.current = orbitControls;

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
    });
    scene.add(transformControls as any);
    transformControlsRef.current = transformControls;

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

    // Load HDR environment
    loadEnvironment(scene, renderer);

    // Stats
    if (showStats) {
      const stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '10px';
      stats.dom.style.left = '10px';
      mountRef.current.appendChild(stats.dom);
      statsRef.current = stats;
    }

    // Raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.name !== 'grid' && object.name !== 'floor' && object.name !== 'wall') {
          selectObject(object);
        }
      } else {
        selectObject(null);
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      
      orbitControls.update();
      
      if (statsRef.current) {
        statsRef.current.update();
      }
      
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
      renderer.domElement.removeEventListener('click', handleClick);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      if (statsRef.current && mountRef.current) {
        mountRef.current.removeChild(statsRef.current.dom);
      }
      
      renderer.dispose();
    };
  }, []);

  // Update transform controls mode
  useEffect(() => {
    if (!transformControlsRef.current) return;

    switch (selectedTool) {
      case 'move':
        transformControlsRef.current.setMode('translate');
        break;
      case 'rotate':
        transformControlsRef.current.setMode('rotate');
        break;
      case 'scale':
        transformControlsRef.current.setMode('scale');
        break;
      default:
        transformControlsRef.current.detach();
    }
  }, [selectedTool]);

  // Setup lighting
  const setupLighting = (scene: THREE.Scene) => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light (sun)
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

    // Add light helper
    const helper = new THREE.DirectionalLightHelper(directionalLight, 1);
    helper.visible = false;
    helper.name = 'lightHelper';
    scene.add(helper);
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

    // Floor
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

  // Load HDR environment
  const loadEnvironment = async (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      '/assets/hdri/studio_small_08_2k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
      },
      undefined,
      (error) => {
        console.error('Error loading HDR:', error);
      }
    );
  };

  // Select object
  const selectObject = (object: THREE.Object3D | null) => {
    setSelectedObject(object);
    
    if (transformControlsRef.current) {
      if (object && selectedTool !== 'select') {
        transformControlsRef.current.attach(object);
      } else {
        transformControlsRef.current.detach();
      }
    }
    
    if (onObjectSelect) {
      onObjectSelect(object);
    }
  };

  // Add cabinet to scene
  const addCabinet = (type: string) => {
    if (!sceneRef.current) return;

    const geometry = new THREE.BoxGeometry(1, 2, 0.6);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.7,
      metalness: 0.1
    });
    
    const cabinet = new THREE.Mesh(geometry, material);
    cabinet.position.set(0, 1, 0);
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    cabinet.name = `cabinet_${Date.now()}`;
    
    sceneRef.current.add(cabinet);
    selectObject(cabinet);
  };

  // Export scene
  const exportScene = () => {
    if (!sceneRef.current) return;
    
    // Simple JSON export of scene data
    const sceneData = {
      objects: sceneRef.current.children.map(obj => ({
        name: obj.name,
        position: obj.position,
        rotation: obj.rotation,
        scale: obj.scale
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

  // Rest of the component remains the same...
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
    if (!cameraRef.current || !orbitControlsRef.current) return;
    
    setViewMode(mode);
    
    switch (mode) {
      case 'top':
        cameraRef.current.position.set(0, 10, 0);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      case 'front':
        cameraRef.current.position.set(0, 0, 10);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      case 'side':
        cameraRef.current.position.set(10, 0, 0);
        cameraRef.current.lookAt(0, 0, 0);
        break;
      case 'perspective':
      default:
        cameraRef.current.position.set(5, 5, 5);
        cameraRef.current.lookAt(0, 0, 0);
    }
    
    orbitControlsRef.current.update();
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Toolbar */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2">
        <button
          onClick={() => changeView('perspective')}
          className={`p-2 rounded hover:bg-gray-100 ${viewMode === 'perspective' ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Perspective View"
        >
          <Camera className="h-5 w-5" />
        </button>
        <button
          onClick={() => changeView('top')}
          className={`p-2 rounded hover:bg-gray-100 ${viewMode === 'top' ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Top View"
        >
          <Layers className="h-5 w-5" />
        </button>
        <button
          onClick={() => changeView('front')}
          className={`p-2 rounded hover:bg-gray-100 ${viewMode === 'front' ? 'bg-blue-100 text-blue-600' : ''}`}
          title="Front View"
        >
          <Grid className="h-5 w-5" />
        </button>
        <div className="border-t pt-2">
          <button
            onClick={takeScreenshot}
            className="p-2 rounded hover:bg-gray-100"
            title="Take Screenshot"
          >
            <Camera className="h-5 w-5" />
          </button>
          <button
            onClick={exportScene}
            className="p-2 rounded hover:bg-gray-100"
            title="Export Scene"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Object Actions */}
      {selectedObject && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4"
        >
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Selected: {selectedObject.name}
            </span>
            <button
              onClick={deleteSelectedObject}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              title="Delete Object"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DesignerCanvas;