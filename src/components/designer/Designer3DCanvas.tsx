
import React, { useRef, useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import * as THREE from 'three';
import { DesignObject, Door, Floor, KitchenItem, Wall, Window } from '../../data/interface';

interface RightPanelProps {
  isVisible: boolean;
  objects: DesignObject[];
  onToggle: () => void;
}

interface LightingConfig {
  ambientIntensity: number;
  ambientColor: string;
  directionalIntensity: number;
  directionalColor: string;
  directionalPosition: { x: number; y: number; z: number };
}


interface ComponentColors {
  walls: string;
  doors: string;
  windows: string;
  appliances: string;
  cabinets: string;
  furniture: string;
  floor: string;
}

interface FloorTypeConfig {
  name: string;
  icon: string;
  color: string;
  pattern: string;
}

const FLOOR_TYPES: { [key: string]: FloorTypeConfig } = {
  hardwood: {
    name: 'Hardwood',
    icon: '🪵',
    color: '#8B4513',
    pattern: 'linear-gradient(90deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)'
  },
  tile: {
    name: 'Ceramic Tile',
    icon: '⬜',
    color: '#F5F5DC',
    pattern: 'repeating-linear-gradient(45deg, #F5F5DC, #F5F5DC 10px, #E0E0E0 10px, #E0E0E0 20px)'
  },
  carpet: {
    name: 'Carpet',
    icon: '🧶',
    color: '#D2B48C',
    pattern: 'radial-gradient(circle, #D2B48C 30%, #C19A6B 70%)'
  },
  laminate: {
    name: 'Laminate',
    icon: '📏',
    color: '#DEB887',
    pattern: 'linear-gradient(0deg, #DEB887 0%, #F4A460 25%, #DEB887 50%, #F4A460 75%, #DEB887 100%)'
  },
  stone: {
    name: 'Natural Stone',
    icon: '🪨',
    color: '#696969',
    pattern: 'radial-gradient(ellipse, #696969 0%, #808080 30%, #696969 60%, #A9A9A9 100%)'
  },
  vinyl: {
    name: 'Vinyl',
    icon: '⬛',
    color: '#2F4F4F',
    pattern: 'linear-gradient(45deg, #2F4F4F 25%, #708090 25%, #708090 50%, #2F4F4F 50%, #2F4F4F 75%, #708090 75%)'
  }
};

export const Designer3DCanvas: React.FC<RightPanelProps> = ({
  isVisible,
  objects,
  onToggle
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationRef = useRef<number | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Lighting and color state
  const [lightingConfig, setLightingConfig] = useState<LightingConfig>({
    ambientIntensity: 0.8,
    ambientColor: '#404040',
    directionalIntensity: 0.6,
    directionalColor: '#ffffff',
    directionalPosition: { x: 5, y: 8, z: 3 }
  });

  const [componentColors, setComponentColors] = useState<ComponentColors>({
    walls: '#e2e8f0',
    doors: '#8B4513',
    windows: '#4A90E2',
    appliances: '#6b7280',
    cabinets: '#d97706',
    furniture: '#78716c',
    floor: '#f1f5f9'
  });

  const [activeTab, setActiveTab] = useState<'view' | 'lighting' | 'colors'>('view');

  // Initialize Three.js scene
  useEffect(() => {
    if (!isVisible || !mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera setup - positioned to show interior view
    const camera = new THREE.PerspectiveCamera(60, 350 / 250, 0.1, 100);
    camera.position.set(5, 6, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(350, 250);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup for interior view
    const ambientLight = new THREE.AmbientLight(
      parseInt(lightingConfig.ambientColor.replace('#', '0x')), 
      lightingConfig.ambientIntensity
    );
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const directionalLight = new THREE.DirectionalLight(
      parseInt(lightingConfig.directionalColor.replace('#', '0x')), 
      lightingConfig.directionalIntensity
    );
    directionalLight.position.set(
      lightingConfig.directionalPosition.x,
      lightingConfig.directionalPosition.y,
      lightingConfig.directionalPosition.z
    );
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // Interior floor - only inside walls
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: parseInt(componentColors.floor.replace('#', '0x')),
      transparent: true,
      opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Auto-rotate camera for interior view
    const animate = () => {
      if (cameraRef.current) {
        const time = Date.now() * 0.0003; // Slower rotation
        const radius = 6;
        cameraRef.current.position.x = Math.cos(time) * radius;
        cameraRef.current.position.z = Math.sin(time) * radius;
        cameraRef.current.position.y = 4; // Fixed height for interior view
        cameraRef.current.lookAt(0, 1, 0); // Look at counter height
      }
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isVisible]);

  // Update lighting when config changes
  useEffect(() => {
    if (!isVisible || !ambientLightRef.current || !directionalLightRef.current) return;

    // Update ambient light
    ambientLightRef.current.color.setHex(parseInt(lightingConfig.ambientColor.replace('#', '0x')));
    ambientLightRef.current.intensity = lightingConfig.ambientIntensity;

    // Update directional light
    directionalLightRef.current.color.setHex(parseInt(lightingConfig.directionalColor.replace('#', '0x')));
    directionalLightRef.current.intensity = lightingConfig.directionalIntensity;
    directionalLightRef.current.position.set(
      lightingConfig.directionalPosition.x,
      lightingConfig.directionalPosition.y,
      lightingConfig.directionalPosition.z
    );
  }, [lightingConfig, isVisible]);

  // Update 3D objects when design changes - interior only
  useEffect(() => {
    if (!sceneRef.current || !isVisible) return;

    // Remove existing design objects
    const objectsToRemove = sceneRef.current.children.filter(child => 
      child.userData.isDesignObject
    );
    objectsToRemove.forEach(obj => sceneRef.current!.remove(obj));

    // Add new 3D objects - focus on interior elements
    objects.forEach(obj => {
      let mesh: THREE.Object3D | null = null;
      
      switch (obj.type) {
        case 'wall':
          mesh = create3DWallInterior(obj as Wall);
          break;
        case 'door':
          mesh = create3DDoorInterior(obj as Door);
          break;
        case 'window':
          mesh = create3DWindowInterior(obj as Window);
          break;
        case 'floor':
          mesh = create3DFloorInterior(obj as Floor);
          break;
        case 'refrigerator':
        case 'stove':
        case 'dishwasher':
        case 'sink':
        case 'island':
        case 'upper-cabinet':
        case 'lower-cabinet':
        case 'kitchen-table':
        case 'bar-stool':
        case 'microwave':
        case 'pantry':
          mesh = create3DKitchenItemInterior(obj as KitchenItem);
          break;
      }
      
      if (mesh) {
        mesh.userData.isDesignObject = true;
        mesh.userData.objectId = obj.id;
        sceneRef.current!.add(mesh);
      }
    });
  }, [objects, isVisible, componentColors]);

  // Create interior-focused wall view
  const create3DWallInterior = (wall: Wall): THREE.Mesh => {
    const length = Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)) * 0.01;
    const height = (wall.height || 96) * 0.01;
    const thickness = wall.thickness * 0.01;
    
    const geometry = new THREE.BoxGeometry(length, height, thickness);
    const material = new THREE.MeshLambertMaterial({ 
      color: parseInt(componentColors.walls.replace('#', '0x')),
      transparent: true,
      opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    const centerX = ((wall.x1 + wall.x2) / 2) * 0.01;
    const centerY = ((wall.y1 + wall.y2) / 2) * 0.01;
    const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
    
    mesh.position.set(centerX, height / 2, centerY);
    mesh.rotation.y = angle;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  };

  // Create interior door view
  const create3DDoorInterior = (door: Door): THREE.Group => {
    const group = new THREE.Group();
    const width = door.width * 0.01;
    const height = (door.height || 84) * 0.01;
    
    // Door frame - more detailed for interior view
    const frameGeometry = new THREE.BoxGeometry(width, height, 0.08);
    const frameMaterial = new THREE.MeshLambertMaterial({ 
      color: parseInt(componentColors.doors.replace('#', '0x'))
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, height / 2, 0);
    frame.castShadow = true;
    group.add(frame);
    
    // Door handle
    const handleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const handleMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(width * 0.8, height * 0.5, 0.05);
    handle.castShadow = true;
    group.add(handle);
    
    group.position.set(door.x * 0.01, 0, door.y * 0.01);
    group.rotation.y = (door.rotation * Math.PI) / 180;
    
    return group;
  };

  // Create interior window view
  const create3DWindowInterior = (window: Window): THREE.Group => {
    const group = new THREE.Group();
    const width = window.width * 0.01;
    const height = (window.height || 36) * 0.01;
    
    // Window frame
    const frameGeometry = new THREE.BoxGeometry(width, height, 0.08);
    const frameMaterial = new THREE.MeshLambertMaterial({ 
      color: parseInt(componentColors.windows.replace('#', '0x'))
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, height / 2 + 0.24, 0);
    frame.castShadow = true;
    group.add(frame);
    
    // Window glass
    const glassGeometry = new THREE.PlaneGeometry(width * 0.9, height * 0.9);
    const glassMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x87CEEB, 
      transparent: true, 
      opacity: 0.3 
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, height / 2 + 0.24, 0.01);
    group.add(glass);
    
    group.position.set(window.x * 0.01, 0, window.y * 0.01);
    group.rotation.y = (window.rotation * Math.PI) / 180;
    
    return group;
  };

  // Create detailed kitchen items for interior view
  const create3DKitchenItemInterior = (item: KitchenItem): THREE.Mesh => {
    const width = item.width * 0.01;
    const height = item.height * 0.01;
    const depth = Math.min(width, height);
    
    let color: string;
    let itemHeight = 0.9;
    
    // Enhanced colors and details for interior view
    switch (item.type) {
      case 'refrigerator':
      case 'stove':
      case 'dishwasher':
      case 'sink':
      case 'microwave':
        color = componentColors.appliances;
        itemHeight = item.type === 'refrigerator' ? 1.8 : 0.9;
        break;
      case 'upper-cabinet':
      case 'lower-cabinet':
      case 'pantry':
        color = componentColors.cabinets;
        itemHeight = item.type === 'upper-cabinet' ? 0.7 : (item.type === 'pantry' ? 2.1 : 0.9);
        break;
      case 'kitchen-table':
      case 'bar-stool':
        color = componentColors.furniture;
        itemHeight = item.type === 'kitchen-table' ? 0.75 : 1.1;
        break;
      case 'island':
        color = componentColors.appliances;
        itemHeight = 0.9;
        break;
      default:
        color = componentColors.appliances;
        itemHeight = 0.9;
    }
    
    const geometry = new THREE.BoxGeometry(width, itemHeight, depth);
    const material = new THREE.MeshLambertMaterial({ 
      color: parseInt(color.replace('#', '0x'))
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(item.x * 0.01, itemHeight / 2, item.y * 0.01);
    mesh.rotation.y = (item.rotation * Math.PI) / 180;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  };

  // Create floor areas for interior view
  const create3DFloorInterior = (floor: Floor): THREE.Mesh => {
    const width = floor.width * 0.01;
    const depth = floor.height * 0.01;
    
    const geometry = new THREE.PlaneGeometry(width, depth);
    
    // Get floor material based on type
    let color = parseInt(componentColors.floor.replace('#', '0x'));
    if (floor.floorType && FLOOR_TYPES[floor.floorType]) {
      color = parseInt(FLOOR_TYPES[floor.floorType].color.replace('#', '0x'));
    }
    
    const material = new THREE.MeshLambertMaterial({ 
      color,
      transparent: true,
      opacity: 0.9
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(floor.x * 0.01, 0.01, floor.y * 0.01);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = (floor.rotation * Math.PI) / 180;
    mesh.receiveShadow = true;
    
    return mesh;
  };

  if (!isVisible) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-300 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Interior 3D View</h2>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Eye size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Interior kitchen layout view</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('view')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'view'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          View
        </button>
        {/* <button
          onClick={() => setActiveTab('lighting')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'lighting'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Lighting
        </button> */}
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'colors'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Colors
        </button>
      </div>
      
      {/* 3D Viewport */}
      <div className="p-4">
        <div 
          ref={mountRef}
          className="border border-gray-300 rounded-lg overflow-hidden bg-gradient-to-b from-slate-50 to-white"
          style={{ width: '350px', height: '250px' }}
        />
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <p className="text-center">🔄 Auto-rotating interior view</p>
          <p className="text-center">Shows walls and kitchen layout only</p>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'view' && (
        <>
          {/* Legend */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Interior Elements</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: componentColors.cabinets }}></div>
                <span className="text-sm text-gray-600">Cabinets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: componentColors.appliances }}></div>
                <span className="text-sm text-gray-600">Appliances</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: componentColors.walls }}></div>
                <span className="text-sm text-gray-600">Interior Walls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: componentColors.doors }}></div>
                <span className="text-sm text-gray-600">Doors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: componentColors.windows }}></div>
                <span className="text-sm text-gray-600">Windows</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: componentColors.furniture }}></div>
                <span className="text-sm text-gray-600">Furniture</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: componentColors.floor }}></div>
                <span className="text-sm text-gray-600">Floor Areas</span>
              </div>
            </div>
          </div>
          
          {/* Design Stats */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Kitchen Stats</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-medium">{objects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Walls:</span>
                <span className="font-medium">{objects.filter(obj => obj.type === 'wall').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Appliances:</span>
                <span className="font-medium">
                  {objects.filter(obj => ['refrigerator', 'stove', 'dishwasher', 'microwave'].includes(obj.type)).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cabinets:</span>
                <span className="font-medium">
                  {objects.filter(obj => ['upper-cabinet', 'lower-cabinet', 'pantry'].includes(obj.type)).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Furniture:</span>
                <span className="font-medium">
                  {objects.filter(obj => ['kitchen-table', 'bar-stool', 'island'].includes(obj.type)).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Floor Areas:</span>
                <span className="font-medium">
                  {objects.filter(obj => obj.type === 'floor').length}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* {activeTab === 'lighting' && (
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Lighting Controls</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Ambient Light</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightingConfig.ambientColor}
                onChange={(e) => setLightingConfig(prev => ({ ...prev, ambientColor: e.target.value }))}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={lightingConfig.ambientIntensity}
                onChange={(e) => setLightingConfig(prev => ({ ...prev, ambientIntensity: parseFloat(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 min-w-12">
                {lightingConfig.ambientIntensity.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Directional Light</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightingConfig.directionalColor}
                onChange={(e) => setLightingConfig(prev => ({ ...prev, directionalColor: e.target.value }))}
                className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={lightingConfig.directionalIntensity}
                onChange={(e) => setLightingConfig(prev => ({ ...prev, directionalIntensity: parseFloat(e.target.value) }))}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 min-w-12">
                {lightingConfig.directionalIntensity.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Light Position</label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-gray-500">X</label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={lightingConfig.directionalPosition.x}
                  onChange={(e) => setLightingConfig(prev => ({ 
                    ...prev, 
                    directionalPosition: { ...prev.directionalPosition, x: parseFloat(e.target.value) }
                  }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Y</label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="0.5"
                  value={lightingConfig.directionalPosition.y}
                  onChange={(e) => setLightingConfig(prev => ({ 
                    ...prev, 
                    directionalPosition: { ...prev.directionalPosition, y: parseFloat(e.target.value) }
                  }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Z</label>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={lightingConfig.directionalPosition.z}
                  onChange={(e) => setLightingConfig(prev => ({ 
                    ...prev, 
                    directionalPosition: { ...prev.directionalPosition, z: parseFloat(e.target.value) }
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Lighting Presets</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLightingConfig({
                  ambientIntensity: 0.8,
                  ambientColor: '#404040',
                  directionalIntensity: 0.6,
                  directionalColor: '#ffffff',
                  directionalPosition: { x: 5, y: 8, z: 3 }
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                🌅 Day
              </button>
              <button
                onClick={() => setLightingConfig({
                  ambientIntensity: 0.3,
                  ambientColor: '#2d3748',
                  directionalIntensity: 0.4,
                  directionalColor: '#ffd700',
                  directionalPosition: { x: 2, y: 5, z: 2 }
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                🌙 Night
              </button>
              <button
                onClick={() => setLightingConfig({
                  ambientIntensity: 1.2,
                  ambientColor: '#f7fafc',
                  directionalIntensity: 0.8,
                  directionalColor: '#ffffff',
                  directionalPosition: { x: 0, y: 10, z: 0 }
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                💡 Bright
              </button>
              <button
                onClick={() => setLightingConfig({
                  ambientIntensity: 0.5,
                  ambientColor: '#ff7f00',
                  directionalIntensity: 0.7,
                  directionalColor: '#ff4500',
                  directionalPosition: { x: -5, y: 6, z: 5 }
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                🔥 Warm
              </button>
            </div>
          </div>
        </div>
      )} */}

      {activeTab === 'colors' && (
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Component Colors</h3>
          
          {/* Color Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Walls</label>
              <input
                type="color"
                value={componentColors.walls}
                onChange={(e) => setComponentColors(prev => ({ ...prev, walls: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Doors</label>
              <input
                type="color"
                value={componentColors.doors}
                onChange={(e) => setComponentColors(prev => ({ ...prev, doors: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Windows</label>
              <input
                type="color"
                value={componentColors.windows}
                onChange={(e) => setComponentColors(prev => ({ ...prev, windows: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Appliances</label>
              <input
                type="color"
                value={componentColors.appliances}
                onChange={(e) => setComponentColors(prev => ({ ...prev, appliances: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Cabinets</label>
              <input
                type="color"
                value={componentColors.cabinets}
                onChange={(e) => setComponentColors(prev => ({ ...prev, cabinets: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Furniture</label>
              <input
                type="color"
                value={componentColors.furniture}
                onChange={(e) => setComponentColors(prev => ({ ...prev, furniture: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Floor</label>
              <input
                type="color"
                value={componentColors.floor}
                onChange={(e) => setComponentColors(prev => ({ ...prev, floor: e.target.value }))}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Color Presets</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setComponentColors({
                  walls: '#e2e8f0',
                  doors: '#8B4513',
                  windows: '#4A90E2',
                  appliances: '#6b7280',
                  cabinets: '#d97706',
                  furniture: '#78716c',
                  floor: '#f1f5f9'
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                🏠 Default
              </button>
              <button
                onClick={() => setComponentColors({
                  walls: '#f8fafc',
                  doors: '#065f46',
                  windows: '#059669',
                  appliances: '#374151',
                  cabinets: '#047857',
                  furniture: '#6b7280',
                  floor: '#ecfdf5'
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                🌿 Modern
              </button>
              <button
                onClick={() => setComponentColors({
                  walls: '#fef3c7',
                  doors: '#92400e',
                  windows: '#d97706',
                  appliances: '#451a03',
                  cabinets: '#a16207',
                  furniture: '#78716c',
                  floor: '#fef7cd'
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                🏛️ Classic
              </button>
              <button
                onClick={() => setComponentColors({
                  walls: '#1f2937',
                  doors: '#374151',
                  windows: '#4b5563',
                  appliances: '#111827',
                  cabinets: '#6b7280',
                  furniture: '#9ca3af',
                  floor: '#374151'
                })}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};