/*
 * KITCHEN DESIGNER WITH ADVANCED 3D SYSTEM
 * 
 * REQUIRED DEPENDENCIES:
 * npm install @react-three/fiber @react-three/drei three
 * 
 * Features:
 * - Professional 2D design tools
 * - Advanced 3D visualization with Kitchen3D system
 * - Material selection for cabinets and floors
 * - Interactive hover effects
 * - Automatic room scaling
 * - U-shaped wall display for kitchens
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Trash2, Download, Move, Home, Square, Minus, ZoomIn, ZoomOut, RotateCcw, ChevronRight, ChevronDown, Grid3X3, Box, X, Eye } from 'lucide-react';

// Kitchen3D System Imports
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ORIGINAL INTERFACES
interface Point {
  x: number;
  y: number;
}

interface BaseObject {
  id: string;
  type: string;
}

interface Wall extends BaseObject {
  type: 'wall';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  height: number;
}

interface Door extends BaseObject {
  type: 'door';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  doorType: 'swing-right' | 'swing-left';
}

interface Window extends BaseObject {
  type: 'window';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface Floor extends BaseObject {
  type: 'floor';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  floorType: 'hardwood' | 'tile' | 'carpet' | 'laminate' | 'stone' | 'vinyl';
}

interface KitchenItem extends BaseObject {
  type: 'refrigerator' | 'stove' | 'dishwasher' | 'sink' | 'island' | 'upper-cabinet' | 'lower-cabinet' | 'kitchen-table' | 'bar-stool' | 'microwave' | 'pantry';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

type DesignObject = Wall | Door | Window | KitchenItem | Floor;

interface DragStart {
  x: number;
  y: number;
  objectId: string;
}

interface CurrentLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DesignData {
  objects: DesignObject[];
  zoom: number;
  pan: Point;
  backgroundColor: string;
  timestamp: string;
  version: string;
}

interface FeetInches {
  feet: number;
  inches: number;
  totalInches: number;
}

type SelectedTool = 'select' | 'wall' | 'door' | 'window';

interface KitchenItemConfig {
  name: string;
  icon: string;
  color: string;
  defaultWidth: number;
  defaultHeight: number;
  category: string;
}

interface UpdateableProperties {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  thickness?: number;
  doorType?: 'swing-right' | 'swing-left';
}

// KITCHEN3D TYPES
interface KitchenLayout {
  room: {
    width: number;
    height: number;
    depth: number;
  };
  cabinets: Cabinet[];
  appliances: Appliance[];
  countertops: Countertop[];
}

interface Cabinet {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  type: 'upper' | 'lower' | 'pantry';
  doors: number;
  handles: 'hidden' | 'visible';
}

interface Appliance {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  type: 'refrigerator' | 'stove' | 'dishwasher' | 'sink' | 'microwave' | 'island';
  color: string;
}

interface Countertop {
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number };
  material: 'granite' | 'marble' | 'quartz' | 'wood' | 'laminate';
}

// ORIGINAL DATA
const PIXELS_PER_FOOT: number = 12;
const PIXELS_PER_INCH: number = 1;

const feetToPixels = (feet: number, inches: number = 0): number => {
  return (feet * 12 + inches) * PIXELS_PER_INCH;
};

const kitchenItems: { [key: string]: KitchenItemConfig } = {
  refrigerator: {
    name: "Refrigerator",
    icon: "🧊",
    color: "#E5E7EB",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  stove: {
    name: "Stove",
    icon: "🔥",
    color: "#374151",
    defaultWidth: feetToPixels(2, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  dishwasher: {
    name: "Dishwasher",
    icon: "🍽️",
    color: "#6B7280",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  microwave: {
    name: "Microwave",
    icon: "📱",
    color: "#9CA3AF",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(1, 0),
    category: "appliances",
  },
  sink: {
    name: "Kitchen Sink",
    icon: "🚿",
    color: "#D1D5DB",
    defaultWidth: feetToPixels(2, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "fixtures",
  },
  island: {
    name: "Kitchen Island",
    icon: "🏝️",
    color: "#F3F4F6",
    defaultWidth: feetToPixels(4, 0),
    defaultHeight: feetToPixels(2, 6),
    category: "fixtures",
  },
  "upper-cabinet": {
    name: "Upper Cabinet",
    icon: "📦",
    color: "#D97706",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },
  "lower-cabinet": {
    name: "Lower Cabinet",
    icon: "🗄️",
    color: "#B45309",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  pantry: {
    name: "Pantry",
    icon: "🥫",
    color: "#92400E",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "kitchen-table": {
    name: "Kitchen Table",
    icon: "🍽️",
    color: "#78716C",
    defaultWidth: feetToPixels(5, 0),
    defaultHeight: feetToPixels(3, 0),
    category: "furniture",
  },
  "bar-stool": {
    name: "Bar Stool",
    icon: "🪑",
    color: "#57534E",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(1, 6),
    category: "furniture",
  },
};

// KITCHEN3D COMPONENTS
const Kitchen3DCabinet: React.FC<{
  cabinet: Cabinet;
  material: string;
  onHover?: (item: { name: string; type: string; material?: string } | null) => void;
}> = ({ cabinet, material, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { position, size, type } = cabinet;
  
  const getMaterialColor = (material: string) => {
    switch (material) {
      case 'wood': return '#8B4513';
      case 'white': return '#FFFFFF';
      case 'gray': return '#808080';
      case 'black': return '#2C2C2C';
      default: return '#8B4513';
    }
  };
  
  const color = getMaterialColor(material);
  const hoverColor = isHovered ? '#6B4513' : color;
  
  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover?.({
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Cabinet`,
      type: 'Cabinet',
      material: material.charAt(0).toUpperCase() + material.slice(1)
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };
  
  return (
    <group>
      {/* FIXED: Position from corner (0,0) instead of center */}
      <mesh
        position={[position.x + size.width / 2, position.y + size.height / 2, position.z + size.depth / 2]}
        castShadow
        receiveShadow
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[size.width, size.height, size.depth]} />
        <meshLambertMaterial color={hoverColor} />
      </mesh>
      
      {cabinet.doors > 0 && (
        <group>
          {Array.from({ length: cabinet.doors }).map((_, doorIndex) => {
            const doorWidth = size.width / cabinet.doors;
            const doorX = position.x + doorIndex * doorWidth + doorWidth / 2;
            
            return (
              <mesh
                key={doorIndex}
                position={[doorX, position.y + size.height / 2, position.z + size.depth + 0.02]}
                castShadow
              >
                <boxGeometry args={[doorWidth - 0.05, size.height - 0.1, 0.04]} />
                <meshLambertMaterial color={hoverColor} />
              </mesh>
            );
          })}
        </group>
      )}

      {cabinet.handles !== 'hidden' && cabinet.doors > 0 && (
        <group>
          {Array.from({ length: cabinet.doors }).map((_, handleIndex) => {
            const doorWidth = size.width / cabinet.doors;
            const handleX = position.x + handleIndex * doorWidth + doorWidth * 0.8;
            
            return (
              <mesh
                key={handleIndex}
                position={[handleX, position.y + size.height / 2, position.z + size.depth + 0.06]}
                castShadow
              >
                <cylinderGeometry args={[0.01, 0.01, 0.15]} />
                <meshLambertMaterial color="#C0C0C0" />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
};

const Kitchen3DAppliance: React.FC<{
  appliance: Appliance;
  onHover?: (item: { name: string; type: string; material?: string } | null) => void;
}> = ({ appliance, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { position, size, type, color } = appliance;
  
  const getApplianceColor = (type: string, baseColor: string) => {
    switch (type) {
      case 'refrigerator': return baseColor || '#E5E5E5';
      case 'stove': return baseColor || '#2C2C2C';
      case 'dishwasher': return baseColor || '#4A4A4A';
      case 'microwave': return baseColor || '#1A1A1A';
      case 'sink': return baseColor || '#C0C0C0';
      case 'island': return baseColor || '#E6D2B7';
      default: return baseColor || '#808080';
    }
  };
  
  const applianceColor = getApplianceColor(type, color);
  const hoverColor = isHovered ? '#6A6A6A' : applianceColor;
  
  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover?.({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type: 'Appliance'
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };
  
  return (
    <group>
      {/* FIXED: Position from corner (0,0) instead of center */}
      <mesh
        position={[position.x + size.width / 2, position.y + size.height / 2, position.z + size.depth / 2]}
        castShadow
        receiveShadow
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[size.width, size.height, size.depth]} />
        <meshLambertMaterial color={hoverColor} transparent={isHovered} opacity={isHovered ? 0.9 : 1} />
      </mesh>
      
      {/* Add special details for doors (brown) and windows (blue/glass) */}
      {color === '#8B4513' && (
        <mesh
          position={[position.x + size.width / 2, position.y + size.height / 2, position.z + size.depth / 2 + 0.1]}
          castShadow
        >
          <planeGeometry args={[size.width * 0.8, size.height * 0.8]} />
          <meshLambertMaterial color="#A0522D" />
        </mesh>
      )}
      
      {color === '#E6F3FF' && (
        <mesh
          position={[position.x + size.width / 2, position.y + size.height / 2, position.z + size.depth / 2 + 0.1]}
          castShadow
        >
          <planeGeometry args={[size.width * 0.9, size.height * 0.9]} />
          <meshLambertMaterial color="#B0E0FF" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

const Kitchen3DCountertop: React.FC<{
  countertop: Countertop;
  onHover?: (item: { name: string; type: string; material?: string } | null) => void;
}> = ({ countertop, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { position, size, material } = countertop;
  
  const getMaterialColor = (material: string) => {
    switch (material) {
      case 'granite': return '#4A4A4A';
      case 'marble': return '#F5F5DC';
      case 'quartz': return '#E8E8E8';
      case 'wood': return '#CD853F';
      case 'laminate': return '#D3D3D3';
      default: return '#4A4A4A';
    }
  };
  
  const color = getMaterialColor(material);
  const hoverColor = isHovered ? '#6A6A6A' : color;
  
  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover?.({
      name: 'Countertop',
      type: 'Countertop',
      material: material.charAt(0).toUpperCase() + material.slice(1)
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };
  
  return (
    <group>
      {/* FIXED: Position from corner (0,0) instead of center */}
      <mesh
        position={[position.x + size.width / 2, position.y + size.height / 2, position.z + size.depth / 2]}
        castShadow
        receiveShadow
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[size.width, size.height, size.depth]} />
        <meshLambertMaterial color={hoverColor} transparent={isHovered} opacity={isHovered ? 0.9 : 1} />
      </mesh>
      
      {material === 'granite' && (
        <group>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                position.x + Math.random() * size.width,
                position.y + size.height + 0.01,
                position.z + Math.random() * size.depth
              ]}
              castShadow
            >
              <sphereGeometry args={[0.02]} />
              <meshLambertMaterial color="#2A2A2A" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

const Kitchen3DScene: React.FC<{
  layout: KitchenLayout;
  selectedMaterial: string;
  floorColor: string;
  onItemHover?: (item: { name: string; type: string; material?: string } | null) => void;
}> = ({ layout, selectedMaterial, floorColor, onItemHover }) => {
  const { room, cabinets, appliances, countertops } = layout;
  
  return (
    <group>
      {/* Floor - FIXED: Position at (0,0) corner, not center */}
      <mesh position={[room.width / 2, -0.01, room.depth / 2]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.width, room.depth]} />
        <meshLambertMaterial color={floorColor} />
      </mesh>
      
      {/* Walls - FIXED: 3 walls positioned from room corner */}
      <group>
        {/* Back wall (at z=0) */}
        <mesh position={[room.width / 2, room.height / 2, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[room.width, room.height]} />
          <meshLambertMaterial color="#f8fafc" />
        </mesh>
        
        {/* Left wall (at x=0) */}
        <mesh position={[0, room.height / 2, room.depth / 2]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[room.depth, room.height]} />
          <meshLambertMaterial color="#f8fafc" />
        </mesh>
        
        {/* Right wall (at x=room.width) */}
        <mesh position={[room.width, room.height / 2, room.depth / 2]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[room.depth, room.height]} />
          <meshLambertMaterial color="#f8fafc" />
        </mesh>
        
        {/* OPTIONAL: Front partial walls for realistic kitchen opening */}
        {room.width > 8 && (
          <>
            {/* Left front partial wall */}
            <mesh position={[room.width * 0.2, room.height / 2, room.depth]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[room.width * 0.4, room.height]} />
              <meshLambertMaterial color="#f8fafc" />
            </mesh>
            
            {/* Right front partial wall */}
            <mesh position={[room.width * 0.8, room.height / 2, room.depth]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[room.width * 0.4, room.height]} />
              <meshLambertMaterial color="#f8fafc" />
            </mesh>
          </>
        )}
      </group>
      
      {/* Cabinets */}
      {cabinets.map((cabinet, index) => (
        <Kitchen3DCabinet
          key={`cabinet-${index}`}
          cabinet={cabinet}
          material={selectedMaterial}
          onHover={onItemHover}
        />
      ))}
      
      {/* Appliances */}
      {appliances.map((appliance, index) => (
        <Kitchen3DAppliance
          key={`appliance-${index}`}
          appliance={appliance}
          onHover={onItemHover}
        />
      ))}
      
      {/* Countertops */}
      {countertops.map((countertop, index) => (
        <Kitchen3DCountertop
          key={`countertop-${index}`}
          countertop={countertop}
          onHover={onItemHover}
        />
      ))}
    </group>
  );
};

const Kitchen3DViewer: React.FC<{
  kitchenLayout: KitchenLayout;
  selectedMaterial: string;
  floorColor: string;
  onItemHover?: (item: { name: string; type: string; material?: string } | null) => void;
  className?: string;
}> = ({ kitchenLayout, selectedMaterial, floorColor, onItemHover, className = "w-full h-full" }) => {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [8, 6, 8], fov: 60 }}
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        <React.Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[0, 5, 0]} intensity={0.3} />
          
          {/* Environment for better lighting */}
          <Environment preset="apartment" />
          
          {/* Grid */}
          <Grid
            position={[0, 0, 0]}
            args={[20, 20]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#e2e8f0"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#cbd5e1"
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />
          
          {/* Kitchen Scene */}
          <Kitchen3DScene 
            layout={kitchenLayout} 
            selectedMaterial={selectedMaterial}
            floorColor={floorColor}
            onItemHover={onItemHover}
          />
          
          {/* Controls - FIXED: Target the center of the room */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={20}
            target={[kitchenLayout.room.width / 2, 1, kitchenLayout.room.depth / 2]}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

// FIXED 3D VIEWER COMPONENT
const ThreeDViewer: React.FC<{
  objects: DesignObject[];
  selectedId: string | null;
  onObjectSelect: (id: string) => void;
}> = ({ objects, selectedId, onObjectSelect }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  
  const controlsRef = useRef({
    isRotating: false,
    previousMousePosition: { x: 0, y: 0 },
    spherical: new THREE.Spherical(20, Math.PI / 3, Math.PI / 4),
    target: new THREE.Vector3(0, 2, 0)
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f2f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 1000);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 20, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Floor - MUCH LARGER ADAPTIVE SIZE BASED ON ROOM
    const wallObjects = objects.filter(obj => obj.type === 'wall');
    let roomSize = 80;
    
    if (wallObjects.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      wallObjects.forEach(obj => {
        const wall = obj as Wall;
        minX = Math.min(minX, wall.x1, wall.x2);
        maxX = Math.max(maxX, wall.x1, wall.x2);
        minY = Math.min(minY, wall.y1, wall.y2);
        maxY = Math.max(maxY, wall.y1, wall.y2);
      });
      
      if (isFinite(minX) && isFinite(maxX) && isFinite(minY) && isFinite(maxY)) {
        const roomWidth = (maxX - minX) / 12;
        const roomHeight = (maxY - minY) / 12;
        const maxDimension = Math.max(roomWidth, roomHeight);
        roomSize = Math.max(80, maxDimension * 6);
      }
    }
    
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xd4b896 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid
    const gridHelper = new THREE.GridHelper(roomSize, Math.max(40, roomSize / 2), 0x888888, 0x888888);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    const updateCameraPosition = () => {
      const controls = controlsRef.current;
      const position = new THREE.Vector3();
      position.setFromSpherical(controls.spherical);
      position.add(controls.target);
      camera.position.copy(position);
      camera.lookAt(controls.target);
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        mouseRef.current.set(x, y);
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        
        const intersects = raycasterRef.current.intersectObjects(scene.children, true);
        
        for (const intersect of intersects) {
          let obj = intersect.object;
          while (obj && !obj.userData.objectId) {
            obj = obj.parent as THREE.Object3D;
          }
          if (obj && obj.userData.objectId) {
            onObjectSelect(obj.userData.objectId);
            return;
          }
        }
        
        controlsRef.current.isRotating = true;
        controlsRef.current.previousMousePosition = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!controlsRef.current.isRotating) return;

      const deltaX = event.clientX - controlsRef.current.previousMousePosition.x;
      const deltaY = event.clientY - controlsRef.current.previousMousePosition.y;

      controlsRef.current.spherical.theta -= deltaX * 0.01;
      controlsRef.current.spherical.phi = Math.max(
        0.1, 
        Math.min(Math.PI - 0.1, controlsRef.current.spherical.phi + deltaY * 0.01)
      );

      updateCameraPosition();
      controlsRef.current.previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      controlsRef.current.isRotating = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      controlsRef.current.spherical.radius = Math.max(
        5, 
        Math.min(50, controlsRef.current.spherical.radius + event.deltaY * 0.01)
      );
      updateCameraPosition();
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    updateCameraPosition();
    mountRef.current.appendChild(renderer.domElement);

    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        requestAnimationFrame(animate);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('mouseup', handleMouseUp);
        renderer.domElement.removeEventListener('wheel', handleWheel);
      }
      
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [onObjectSelect]);

  // Update 3D objects
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const currentObjects = objectsRef.current;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    const wallObjects = objects.filter(obj => obj.type === 'wall');
    
    if (wallObjects.length > 0) {
      wallObjects.forEach(obj => {
        const wall = obj as Wall;
        minX = Math.min(minX, wall.x1, wall.x2);
        maxX = Math.max(maxX, wall.x1, wall.x2);
        minY = Math.min(minY, wall.y1, wall.y2);
        maxY = Math.max(maxY, wall.y1, wall.y2);
      });
    }

    const centerX = isFinite(minX) && isFinite(maxX) ? (minX + maxX) / 2 : 0;
    const centerY = isFinite(minY) && isFinite(maxY) ? (minY + maxY) / 2 : 0;
    
    const roomWidth = isFinite(maxX) && isFinite(minX) ? (maxX - minX) / 12 : 10;
    const roomHeight = isFinite(maxY) && isFinite(minY) ? (maxY - minY) / 12 : 10;
    const maxRoomDimension = Math.max(roomWidth, roomHeight);
    
    const adaptiveDistance = Math.max(20, maxRoomDimension * 1.5);
    controlsRef.current.spherical.radius = adaptiveDistance;

    // Remove old objects
    currentObjects.forEach((mesh, id) => {
      if (!objects.find(obj => obj.id === id)) {
        scene.remove(mesh);
        currentObjects.delete(id);
      }
    });

    const objectsFor3D = objects.filter(obj => {
      if (obj.type === 'wall') {
        const wall = obj as Wall;
        return !(Math.abs(wall.y1 - maxY) < 1 && Math.abs(wall.y2 - maxY) < 1);
      }
      return true;
    });

    objectsFor3D.forEach(obj => {
      const existingMesh = currentObjects.get(obj.id);
      
      if (existingMesh) {
        existingMesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const material = Array.isArray(child.material) ? child.material[0] : child.material;
            if (material instanceof THREE.MeshPhongMaterial) {
              material.emissive.setHex(obj.id === selectedId ? 0x444444 : 0x000000);
            }
          }
        });
      } else {
        const mesh = createObjectMesh(obj, centerX, centerY);
        if (mesh) {
          mesh.userData.objectId = obj.id;
          scene.add(mesh);
          currentObjects.set(obj.id, mesh);
        }
      }
    });
    const appliances: Appliance[] = [];
    const roomMinX = isFinite(minX) ? minX / 12 : 0;
    const roomMinY = isFinite(minY) ? minY / 12 : 0;

    // FIXED: Add doors and windows to 3D scene
    objects.forEach(obj => {
      if (obj.type === 'door') {
        const door = obj as Door;
        const x = (door.x / 12) - roomMinX;
        const z = (door.y / 12) - roomMinY;
        const width = door.width / 12;
        
        appliances.push({
          position: { x: x, y: 0, z: z },
          size: { width: width, height: 7, depth: 0.2 },
          type: 'sink', // Use sink type as placeholder for door
          color: '#8B4513'
        });
      }
      
      if (obj.type === 'window') {
        const window = obj as Window;
        const x = (window.x / 12) - roomMinX;
        const z = (window.y / 12) - roomMinY;
        const width = window.width / 12;
        
        appliances.push({
          position: { x: x, y: 3, z: z }, // Windows at wall height
          size: { width: width, height: 3, depth: 0.1 },
          type: 'microwave', // Use microwave type as placeholder for window
          color: '#E6F3FF'
        });
      }
    });
  }, [objects, selectedId]);

  const createObjectMesh = (obj: DesignObject, centerX: number, centerY: number): THREE.Object3D | null => {
    const scale = 1 / 12;

    switch (obj.type) {
      case 'wall':
        const wall = obj as Wall;
        const length = Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2)) * scale;
        const height = 1.2;
        const thickness = wall.thickness * scale * 2;
        
        const geometry = new THREE.BoxGeometry(length, height, thickness);
        const material = new THREE.MeshPhongMaterial({ color: 0xf5f5f5 });
        const mesh = new THREE.Mesh(geometry, material);
        
        const wallCenterX = (wall.x1 + wall.x2) / 2;
        const wallCenterY = (wall.y1 + wall.y2) / 2;
        const angle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
        
        mesh.position.set((wallCenterX - centerX) * scale, height / 2, (wallCenterY - centerY) * scale);
        mesh.rotation.y = angle;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        return mesh;

      case 'door':
        const door = obj as Door;
        const group = new THREE.Group();
        const width = door.width * scale;
        const doorHeight = 1.0;
        
        const frameGeometry = new THREE.BoxGeometry(width, doorHeight, 0.08);
        const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, doorHeight / 2, 0);
        frame.castShadow = true;
        group.add(frame);
        
        group.position.set((door.x - centerX) * scale, 0, (door.y - centerY) * scale);
        group.rotation.y = (door.rotation || 0) * Math.PI / 180;
        
        return group;

      case 'window':
        const window = obj as Window;
        const windowGroup = new THREE.Group();
        const windowWidth = window.width * scale;
        const windowHeight = 0.4;
        const windowBottomHeight = 0.3;
        
        const windowFrameGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, 0.1);
        const windowFrameMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
        windowFrame.position.set(0, windowBottomHeight + windowHeight / 2, 0);
        windowFrame.castShadow = true;
        windowGroup.add(windowFrame);
        
        windowGroup.position.set((window.x - centerX) * scale, 0, (window.y - centerY) * scale);
        windowGroup.rotation.y = (window.rotation || 0) * Math.PI / 180;
        
        return windowGroup;

      default:
        if (obj.type in kitchenItems) {
          const item = obj as KitchenItem;
          const itemWidth = item.width * scale;
          const itemDepth = item.height * scale;
          let itemHeight = 0.75;
          let color = 0xcccccc;

          switch (item.type) {
            case 'refrigerator':
              itemHeight = 1.8;
              color = 0xF0F0F0;
              break;
            case 'stove':
              itemHeight = 0.9;
              color = 0x2C2C2C;
              break;
            case 'upper-cabinet':
              itemHeight = 0.7;
              color = 0xD2B48C;
              break;
            case 'lower-cabinet':
              itemHeight = 0.9;
              color = 0xD2B48C;
              break;
            default:
              const config = kitchenItems[item.type];
              if (config) {
                color = parseInt(config.color.replace('#', '0x'));
              }
          }

          const itemGeometry = new THREE.BoxGeometry(itemWidth, itemHeight, itemDepth);
          const itemMaterial = new THREE.MeshPhongMaterial({ color, shininess: 30 });
          const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);

          itemMesh.position.set(
            (item.x - centerX) * scale,
            itemHeight / 2,
            (item.y - centerY) * scale
          );
          itemMesh.rotation.y = (item.rotation || 0) * Math.PI / 180;
          itemMesh.castShadow = true;
          itemMesh.receiveShadow = true;

          return itemMesh;
        }
        return null;
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-50 to-white">
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="text-sm font-semibold mb-2 text-gray-800">3D Controls</div>
        <div className="text-xs space-y-1 text-gray-600">
          <div>🖱️ Left click + drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>👆 Click objects to select</div>
        </div>
      </div>

      {selectedId && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="text-sm font-semibold text-gray-800">
            Selected: {objects.find(obj => obj.id === selectedId)?.type}
          </div>
        </div>
      )}
    </div>
  );
};

// ORIGINAL KITCHEN SIDE PANEL
const KitchenSidePanel: React.FC<{
  isVisible: boolean;
  kitchenItems: { [key: string]: KitchenItemConfig };
  expandedCategories: { [key: string]: boolean };
  onToggleCategory: (category: string) => void;
  onAddKitchenItem: (itemType: string) => void;
}> = ({ isVisible, kitchenItems, expandedCategories, onToggleCategory, onAddKitchenItem }) => {
  const categories = {
    appliances: 'Kitchen Appliances',
    fixtures: 'Kitchen Fixtures',
    cabinets: 'Cabinets & Storage',
    furniture: 'Kitchen Furniture'
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 bg-white border-r border-gray-300 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Kitchen Items</h2>
        <p className="text-sm text-gray-600 mt-1">Click items to add to your design</p>
      </div>
      
      <div className="p-2">
        {Object.entries(categories).map(([categoryKey, categoryName]) => (
          <div key={categoryKey} className="mb-2">
            <button
              onClick={() => onToggleCategory(categoryKey)}
              className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded transition-colors"
            >
              <span className="font-medium text-gray-700">{categoryName}</span>
              {expandedCategories[categoryKey] ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>
            
            {expandedCategories[categoryKey] && (
              <div className="ml-4 space-y-1">
                {Object.entries(kitchenItems)
                  .filter(([, config]) => config.category === categoryKey)
                  .map(([itemKey, config]) => (
                    <button
                      key={itemKey}
                      onClick={() => onAddKitchenItem(itemKey)}
                      className="w-full flex items-center gap-2 p-2 text-left hover:bg-gray-100 rounded text-sm transition-colors"
                      title={`Add ${config.name} to your kitchen design`}
                    >
                      <span className="text-lg">{config.icon}</span>
                      <span className="text-gray-700">{config.name}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200 mt-4">
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Tip:</strong> Use Select tool to move items</p>
          <p>📏 Select items to adjust dimensions</p>
          <p>🔄 Rotate items in 45° increments</p>
        </div>
      </div>
    </div>
  );
};

// UPDATED RIGHT PANEL - KITCHEN3D SYSTEM
const Designer3DCanvas: React.FC<{
  isVisible: boolean;
  objects: DesignObject[];
  onToggle: () => void;
}> = ({ isVisible, objects, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'materials'>('view');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('wood');
  const [floorColor, setFloorColor] = useState<string>('#d4b896');
  const [hoveredItem, setHoveredItem] = useState<{ name: string; type: string; material?: string } | null>(null);

  // Convert DesignObjects to KitchenLayout
  const convertToKitchenLayout = useCallback((objects: DesignObject[]): KitchenLayout => {
    const wallObjects = objects.filter(obj => obj.type === 'wall') as Wall[];
    let roomWidth = 12, roomDepth = 10, roomHeight = 8;
    let roomMinX = 0, roomMinY = 0;
    
    if (wallObjects.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      wallObjects.forEach(wall => {
        minX = Math.min(minX, wall.x1, wall.x2);
        maxX = Math.max(maxX, wall.x1, wall.x2);
        minY = Math.min(minY, wall.y1, wall.y2);
        maxY = Math.max(maxY, wall.y1, wall.y2);
      });
      
      if (isFinite(minX) && isFinite(maxX) && isFinite(minY) && isFinite(maxY)) {
        roomWidth = (maxX - minX) / 12; // Convert pixels to feet
        roomDepth = (maxY - minY) / 12; // Convert pixels to feet
        roomMinX = minX / 12; // Store room origin
        roomMinY = minY / 12;
        roomHeight = 8;
      }
    }

    const cabinets: Cabinet[] = [];
    const appliances: Appliance[] = [];
    const countertops: Countertop[] = [];
    
    objects.forEach(obj => {
      if (obj.type in kitchenItems) {
        const item = obj as KitchenItem;
        const config = kitchenItems[item.type];
        
        // FIXED: Convert to room-relative coordinates (0,0 = room corner, not center)
        const x = (item.x / 12) - roomMinX; // Item position relative to room corner
        const z = (item.y / 12) - roomMinY; // Item position relative to room corner  
        const width = item.width / 12;
        const depth = item.height / 12;
        
        if (['upper-cabinet', 'lower-cabinet', 'pantry'].includes(item.type)) {
          cabinets.push({
            position: { 
              x: x, 
              y: item.type === 'upper-cabinet' ? 4 : 0, 
              z: z 
            },
            size: { 
              width: width, 
              height: item.type === 'upper-cabinet' ? 2 : 3, 
              depth: depth 
            },
            type: item.type === 'upper-cabinet' ? 'upper' : item.type === 'pantry' ? 'pantry' : 'lower',
            doors: Math.max(1, Math.floor(width / 2)),
            handles: 'visible'
          });
          
          if (item.type === 'lower-cabinet') {
            countertops.push({
              position: { x: x, y: 3, z: z },
              size: { width: width, height: 0.1, depth: depth },
              material: 'granite'
            });
          }
        } else {
          let height = 3;
          switch (item.type) {
            case 'refrigerator': height = 6; break;
            case 'stove': height = 3; break;
            case 'dishwasher': height = 3; break;
            case 'microwave': height = 1.5; break;
            case 'sink': height = 3; break;
            case 'island': height = 3; break;
          }
          
          appliances.push({
            position: { x: x, y: 0, z: z },
            size: { width: width, height: height, depth: depth },
            type: item.type as Appliance['type'],
            color: config.color
          });
          
          if (item.type === 'island') {
            countertops.push({
              position: { x: x, y: height, z: z },
              size: { width: width, height: 0.1, depth: depth },
              material: 'granite'
            });
          }
        }
      }
    });

    return {
      room: { 
        width: Math.max(12, roomWidth), 
        height: roomHeight, 
        depth: Math.max(10, roomDepth) 
      },
      cabinets,
      appliances,
      countertops
    };
  }, []);

  const kitchenLayout = convertToKitchenLayout(objects);

  const handleItemHover = (item: { name: string; type: string; material?: string } | null) => {
    setHoveredItem(item);
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 bg-white border-l border-gray-300 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Kitchen 3D View</h2>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Eye size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Advanced kitchen visualization</p>
      </div>

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
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'materials'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Materials
        </button>
      </div>
      
      <div className="p-4">
        <div 
          className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50"
          style={{ width: '280px', height: '200px' }}
        >
          <Kitchen3DViewer
            kitchenLayout={kitchenLayout}
            selectedMaterial={selectedMaterial}
            floorColor={floorColor}
            onItemHover={handleItemHover}
            className="w-full h-full"
          />
        </div>
        
        {hoveredItem && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <div className="font-medium text-blue-800">{hoveredItem.name}</div>
            {hoveredItem.material && (
              <div className="text-blue-600">Material: {hoveredItem.material}</div>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <p className="text-center">🖱️ Drag to rotate camera</p>
          <p className="text-center">Scroll to zoom in/out</p>
        </div>
      </div>

      {activeTab === 'view' && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Kitchen Stats</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Room Size:</span>
              <span className="font-medium text-blue-600">
                {kitchenLayout.room.width.toFixed(1)}' × {kitchenLayout.room.depth.toFixed(1)}'
              </span>
            </div>
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
                {objects.filter(obj => ['refrigerator', 'stove', 'dishwasher', 'microwave', 'sink', 'island'].includes(obj.type)).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Cabinets:</span>
              <span className="font-medium">
                {objects.filter(obj => ['upper-cabinet', 'lower-cabinet', 'pantry'].includes(obj.type)).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Doors & Windows:</span>
              <span className="font-medium">
                {objects.filter(obj => ['door', 'window'].includes(obj.type)).length}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs font-medium text-green-800 mb-1">💡 Positioning Tips:</div>
            <div className="text-xs text-green-700 space-y-1">
              <div>• Items are placed inside the room walls</div>
              <div>• Drag items in 2D view to reposition</div>
              <div>• Doors & windows appear on wall edges</div>
              <div>• Use Select tool to move and resize</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Materials & Colors</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Cabinet Material</label>
              <div className="grid grid-cols-2 gap-2">
                {['wood', 'white', 'gray', 'black'].map(material => (
                  <button
                    key={material}
                    onClick={() => setSelectedMaterial(material)}
                    className={`p-2 rounded text-xs font-medium transition-colors ${
                      selectedMaterial === material
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {material.charAt(0).toUpperCase() + material.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Floor Color</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Oak', color: '#d4b896' },
                  { name: 'Walnut', color: '#8B4513' },
                  { name: 'Maple', color: '#DEB887' },
                  { name: 'Cherry', color: '#CD853F' },
                  { name: 'Tile', color: '#F5F5DC' },
                  { name: 'Stone', color: '#A0A0A0' }
                ].map(({ name, color }) => (
                  <button
                    key={name}
                    onClick={() => setFloorColor(color)}
                    className={`p-2 rounded text-xs font-medium transition-colors ${
                      floorColor === color
                        ? 'ring-2 ring-blue-500'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <span className={color === '#F5F5DC' ? 'text-gray-800' : 'text-white'}>
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// MAIN COMPONENT
const ArchitecturalDesigner: React.FC = () => {
  const [objects, setObjects] = useState<DesignObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<SelectedTool>('select');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<CurrentLine | null>(null);
  const [dragStart, setDragStart] = useState<DragStart | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Point | null>(null);
  const [showKitchenPanel, setShowKitchenPanel] = useState<boolean>(true);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [is3DView, setIs3DView] = useState<boolean>(false);
  const [wallCreationMode, setWallCreationMode] = useState<'draw' | 'custom'>('custom');
  const [wallWidth, setWallWidth] = useState<number>(12);
  const [wallHeight, setWallHeight] = useState<number>(10);
  const [wallThickness, setWallThickness] = useState<number>(0.5);

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    appliances: true,
    fixtures: true,
    cabinets: true,
    furniture: true
  });

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateId = (): string => Math.random().toString(36).substr(2, 9);

  const pixelsToFeet = (pixels: number): FeetInches => {
    const totalInches = pixels / PIXELS_PER_INCH;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches, totalInches };
  };

  const toggle3DView = (): void => {
    setIs3DView(!is3DView);
  };

  const formatFeetInches = (pixels: number): string => {
    const { feet, inches } = pixelsToFeet(pixels);
    if (feet === 0) return `${inches}"`;
    if (inches === 0) return `${feet}'`;
    return `${feet}' ${inches}"`;
  };

  const toggleRightPanel = (): void => {
    setShowRightPanel(!showRightPanel);
  };

  const screenToWorld = (screenX: number, screenY: number): Point => {
    return {
      x: (screenX - pan.x) / zoom,
      y: (screenY - pan.y) / zoom
    };
  };

  const updateObject = (id: string, updates: UpdateableProperties): void => {
    setObjects(prev => prev.map(obj =>
      obj.id === id ? { ...obj, ...updates } as DesignObject : obj
    ));
  };

  const addDoor = useCallback((): void => {
    const centerX = (400 - pan.x) / zoom;
    const centerY = (300 - pan.y) / zoom;

    const newDoor: Door = {
      id: generateId(),
      type: 'door',
      x: centerX,
      y: centerY,
      width: feetToPixels(3, 0),
      height: feetToPixels(7, 0),
      rotation: 0,
      doorType: 'swing-right'
    };

    setObjects(prev => [...prev, newDoor]);
    setSelectedId(newDoor.id);
  }, [pan.x, pan.y, zoom]);

  const addWindow = useCallback((): void => {
    const centerX = (400 - pan.x) / zoom;
    const centerY = (300 - pan.y) / zoom;

    const newWindow: Window = {
      id: generateId(),
      type: 'window',
      x: centerX,
      y: centerY,
      width: feetToPixels(4, 0),
      height: feetToPixels(3, 0),
      rotation: 0
    };

    setObjects(prev => [...prev, newWindow]);
    setSelectedId(newWindow.id);
  }, [pan.x, pan.y, zoom]);

  const addKitchenItem = useCallback((itemType: string | number): void => {
    const centerX = (400 - pan.x) / zoom;
    const centerY = (300 - pan.y) / zoom;
    const config = kitchenItems[itemType as string];

    if (!config) return;

    const newItem: KitchenItem = {
      id: generateId(),
      type: itemType as KitchenItem['type'],
      x: centerX,
      y: centerY,
      width: config.defaultWidth,
      height: config.defaultHeight,
      rotation: 0
    };

    setObjects(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  }, [pan.x, pan.y, zoom]);

  const deleteSelected = (): void => {
    if (selectedId) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedId));
      setSelectedId(null);
    }
  };

  const clearCanvas = (): void => {
    setObjects([]);
    setSelectedId(null);
  };

  const toggleCategory = (category: string): void => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>): void => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));

    const zoomRatio = newZoom / zoom;
    setPan(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomRatio,
      y: mouseY - (mouseY - prev.y) * zoomRatio
    }));

    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);

    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: screenX - pan.x, y: screenY - pan.y });
      return;
    }

    if (selectedTool === 'wall') {
      setIsDrawing(true);
      setStartPoint(worldPos);
      setCurrentLine({ x1: worldPos.x, y1: worldPos.y, x2: worldPos.x, y2: worldPos.y });
    } else if (selectedTool === 'select') {
      setSelectedId(null);
    }
  };

  const handleObjectMouseDown = (e: React.MouseEvent, objectId: string): void => {
    e.stopPropagation();
    if (selectedTool === 'select' && svgRef.current) {
      setSelectedId(objectId);
      const rect = svgRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPos = screenToWorld(screenX, screenY);
      const obj = objects.find(o => o.id === objectId);
      if (obj && obj.type !== 'wall') {
        const positionedObj = obj as Door | Window | KitchenItem;
        setDragStart({
          x: worldPos.x - positionedObj.x,
          y: worldPos.y - positionedObj.y,
          objectId
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);

    if (isPanning && panStart) {
      setPan({
        x: screenX - panStart.x,
        y: screenY - panStart.y
      });
      return;
    }

    if (selectedTool === 'wall' && isDrawing && startPoint) {
      setCurrentLine({ x1: startPoint.x, y1: startPoint.y, x2: worldPos.x, y2: worldPos.y });
    } else if (dragStart && selectedTool === 'select') {
      const obj = objects.find(o => o.id === dragStart.objectId);
      if (obj && obj.type !== 'wall') {
        updateObject(dragStart.objectId, {
          x: worldPos.x - dragStart.x,
          y: worldPos.y - dragStart.y
        });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      return;
    }

    if (selectedTool === 'wall' && isDrawing && currentLine) {
      const newWall: Wall = {
        id: generateId(),
        type: 'wall',
        x1: currentLine.x1,
        y1: currentLine.y1,
        x2: currentLine.x2,
        y2: currentLine.y2,
        thickness: feetToPixels(0, 6),
        height: feetToPixels(8, 0)
      };
      setObjects(prev => [...prev, newWall]);
      setSelectedId(newWall.id);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentLine(null);
    setDragStart(null);
  };

  const resetView = (): void => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = (): void => {
    setZoom(prev => Math.min(5, prev * 1.2));
  };

  const zoomOut = (): void => {
    setZoom(prev => Math.max(0.1, prev / 1.2));
  };

  const exportAsImage = (): void => {
    if (!svgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const svgString = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'floor-plan.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const saveAsJSON = (): void => {
    const designData: DesignData = {
      objects,
      zoom,
      pan,
      backgroundColor,
      timestamp: new Date().toISOString(),
      version: '2.0'
    };

    const jsonString = JSON.stringify(designData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = 'floor-plan.json';
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const loadFromJSON = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const designData: DesignData = JSON.parse(result);

          if (designData.objects) {
            setObjects(designData.objects);
            setSelectedId(null);

            if (designData.zoom) setZoom(designData.zoom);
            if (designData.pan) setPan(designData.pan);
            if (designData.backgroundColor) setBackgroundColor(designData.backgroundColor);
          }
        }
      } catch (error) {
        alert('Error loading file: Invalid JSON format');
      }
    };
    reader.readAsText(file);

    event.target.value = '';
  };

  const getSelectedObject = (): DesignObject | undefined => {
    return selectedId ? objects.find(obj => obj.id === selectedId) : undefined;
  };

  const handle3DObjectSelect = (id: string): void => {
    setSelectedId(id);
  };

  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const renderObject = (obj: DesignObject): JSX.Element | null => {
    const isSelected = obj.id === selectedId;
    const selectionStyle = isSelected ? { stroke: '#007bff', strokeWidth: 2 / zoom, strokeDasharray: `${5 / zoom},${5 / zoom}` } : {};

    switch (obj.type) {
      case 'wall':
        const wallLengthPixels = Math.sqrt(
          Math.pow(obj.x2 - obj.x1, 2) + Math.pow(obj.y2 - obj.y1, 2)
        );

        const wallLengthFormatted = formatFeetInches(wallLengthPixels);
        const wallThicknessFormatted = formatFeetInches(obj.thickness);

        const midX = (obj.x1 + obj.x2) / 2;
        const midY = (obj.y1 + obj.y2) / 2;

        const wallAngle = Math.atan2(obj.y2 - obj.y1, obj.x2 - obj.x1);
        const perpAngle = wallAngle + Math.PI / 2;
        const textOffset = 20 / zoom;
        const textX = midX + Math.cos(perpAngle) * textOffset;
        const textY = midY + Math.sin(perpAngle) * textOffset;

        return (
          <g key={obj.id}>
            <line
              x1={obj.x1}
              y1={obj.y1}
              x2={obj.x2}
              y2={obj.y2}
              stroke="#333"
              strokeWidth={obj.thickness / zoom}
              strokeLinecap="round"
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              style={{ cursor: selectedTool === 'select' ? 'move' : 'default' }}
            />
            {isSelected && (
              <line
                x1={obj.x1}
                y1={obj.y1}
                x2={obj.x2}
                y2={obj.y2}
                stroke="#007bff"
                strokeWidth={(obj.thickness + 4) / zoom}
                strokeDasharray={`${5 / zoom},${5 / zoom}`}
                opacity={0.5}
                style={{ pointerEvents: 'none' }}
              />
            )}

            <text
              x={textX}
              y={textY}
              fontSize={12 / zoom}
              fill="#666"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ pointerEvents: 'none' }}
              transform={`rotate(${wallAngle * 180 / Math.PI}, ${textX}, ${textY})`}
            >
              L: {wallLengthFormatted} | T: {wallThicknessFormatted}
            </text>
          </g>
        );

      case 'door':
        const doorArcRadius = obj.width;
        const doorScale = 1 / zoom;

        return (
          <g key={obj.id} transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}) scale(${doorScale})`}>
            <rect
              x={0}
              y={0}
              width={obj.width}
              height={feetToPixels(0, 6)}
              fill="#8B4513"
              stroke="#654321"
              strokeWidth={1}
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              style={{ cursor: selectedTool === 'select' ? 'move' : 'default' }}
            />

            <path
              d={`M ${obj.doorType === 'swing-right' ? 0 : obj.width} ${feetToPixels(0, 3)} 
                  A ${doorArcRadius} ${doorArcRadius} 0 0 ${obj.doorType === 'swing-right' ? 1 : 0} 
                  ${obj.doorType === 'swing-right' ? doorArcRadius : obj.width - doorArcRadius} ${feetToPixels(0, 3) + doorArcRadius}`}
              fill="none"
              stroke="#666"
              strokeWidth={1}
              strokeDasharray="3,3"
              style={{ pointerEvents: 'none' }}
            />

            <line
              x1={obj.doorType === 'swing-right' ? 0 : obj.width}
              y1={feetToPixels(0, 3)}
              x2={obj.doorType === 'swing-right' ? obj.width * 0.7 : obj.width * 0.3}
              y2={feetToPixels(0, 3) + obj.width * 0.7}
              stroke="#8B4513"
              strokeWidth={2}
              style={{ pointerEvents: 'none' }}
            />

            {isSelected && (
              <rect
                x={-2}
                y={-2}
                width={obj.width + 4}
                height={feetToPixels(0, 6) + 4}
                fill="none"
                {...selectionStyle}
                style={{ pointerEvents: 'none' }}
                transform={`scale(${zoom})`}
              />
            )}
          </g>
        );

      case 'window':
        const windowScale = 1 / zoom;

        return (
          <g key={obj.id} transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}) scale(${windowScale})`}>
            <rect
              x={0}
              y={0}
              width={obj.width}
              height={feetToPixels(0, 6)}
              fill="#E6F3FF"
              stroke="#4A90E2"
              strokeWidth={2}
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              style={{ cursor: selectedTool === 'select' ? 'move' : 'default' }}
            />

            <line
              x1={obj.width / 2}
              y1={0}
              x2={obj.width / 2}
              y2={feetToPixels(0, 6)}
              stroke="#4A90E2"
              strokeWidth={1}
              style={{ pointerEvents: 'none' }}
            />

            <line
              x1={0}
              y1={feetToPixels(0, 3)}
              x2={obj.width}
              y2={feetToPixels(0, 3)}
              stroke="#4A90E2"
              strokeWidth={1}
              style={{ pointerEvents: 'none' }}
            />

            {isSelected && (
              <rect
                x={-2}
                y={-2}
                width={obj.width + 4}
                height={feetToPixels(0, 6) + 4}
                fill="none"
                {...selectionStyle}
                style={{ pointerEvents: 'none' }}
                transform={`scale(${zoom})`}
              />
            )}
          </g>
        );

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
        const kitchenScale = 1 / zoom;
        const config = kitchenItems[obj.type];

        return (
          <g key={obj.id} transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}) scale(${kitchenScale})`}>
            <rect
              x={0}
              y={0}
              width={obj.width}
              height={obj.height}
              fill={config.color}
              stroke="#333"
              strokeWidth={1}
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              style={{ cursor: selectedTool === 'select' ? 'move' : 'default' }}
            />

            <text
              x={obj.width / 2}
              y={obj.height / 2}
              fontSize={Math.min(obj.width, obj.height) / 4}
              fill="#333"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ pointerEvents: 'none' }}
            >
              {config.icon}
            </text>

            <text
              x={obj.width / 2}
              y={obj.height / 2 + Math.min(obj.width, obj.height) / 8}
              fontSize={Math.min(obj.width, obj.height) / 8}
              fill="#333"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ pointerEvents: 'none' }}
            >
              {config.name}
            </text>

            {isSelected && (
              <rect
                x={-2}
                y={-2}
                width={obj.width + 4}
                height={obj.height + 4}
                fill="none"
                {...selectionStyle}
                style={{ pointerEvents: 'none' }}
                transform={`scale(${zoom})`}
              />
            )}
          </g>
        );

      default:
        return null;
    }
  };

  const handleWallSubmit = () => {
    const canvasWidth = containerRef.current?.offsetWidth || 800;
    const canvasHeight = containerRef.current?.offsetHeight || 600;
    const centerX = (canvasWidth / 2 - pan.x) / zoom;
    const centerY = (canvasHeight / 2 - pan.y) / zoom;

    const roomWidth = feetToPixels(wallWidth);
    const roomHeight = feetToPixels(wallHeight);
    const thickness = feetToPixels(wallThickness);

    const left = centerX - roomWidth / 2;
    const right = centerX + roomWidth / 2;
    const top = centerY - roomHeight / 2;
    const bottom = centerY + roomHeight / 2;

    const newWalls: Wall[] = [
      {
        id: generateId(),
        type: 'wall',
        x1: left, y1: top,
        x2: right, y2: top,
        thickness: thickness,
        height: feetToPixels(wallHeight)
      },
      {
        id: generateId(),
        type: 'wall',
        x1: right, y1: top,
        x2: right, y2: bottom,
        thickness: thickness,
        height: feetToPixels(wallHeight)
      },
      {
        id: generateId(),
        type: 'wall',
        x1: right, y1: bottom,
        x2: left, y2: bottom,
        thickness: thickness,
        height: feetToPixels(wallHeight)
      },
      {
        id: generateId(),
        type: 'wall',
        x1: left, y1: bottom,
        x2: left, y2: top,
        thickness: thickness,
        height: feetToPixels(wallHeight)
      }
    ];

    setObjects(prev => [...prev, ...newWalls]);
    setSelectedId(newWalls[0].id);
    setSelectedTool('select');
  };

  const render3DCanvas = () => (
    <div className="border-2 border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden" style={{ width: '800px', height: '600px' }}>
      <ThreeDViewer
        objects={objects}
        selectedId={selectedId}
        onObjectSelect={handle3DObjectSelect}
      />
    </div>
  );

  const render2DCanvas = (): JSX.Element => (
    <div
      ref={containerRef}
      className="border-2 border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden"
      style={{ width: '800px', height: '600px' }}
    >
      <svg
        ref={svgRef}
        width="800"
        height="600"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`${selectedTool === 'wall' ? 'cursor-crosshair' : 'cursor-default'} ${isPanning ? 'cursor-move' : ''}`}
        style={{ userSelect: 'none' }}
      >
        <defs>
          <pattern
            id="grid"
            width={PIXELS_PER_FOOT * zoom}
            height={PIXELS_PER_FOOT * zoom}
            patternUnits="userSpaceOnUse"
            x={pan.x % (PIXELS_PER_FOOT * zoom)}
            y={pan.y % (PIXELS_PER_FOOT * zoom)}
          >
            <path
              d={`M ${PIXELS_PER_FOOT * zoom} 0 L 0 0 0 ${PIXELS_PER_FOOT * zoom}`}
              fill="none"
              stroke="#f0f0f0"
              strokeWidth={1}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {objects.map(renderObject)}
          {selectedTool === 'wall' && currentLine && (
            <line
              x1={currentLine.x1}
              y1={currentLine.y1}
              x2={currentLine.x2}
              y2={currentLine.y2}
              stroke="#666"
              strokeWidth={8 / zoom}
              strokeDasharray={`${5 / zoom},${5 / zoom}`}
              opacity={0.7}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </g>
      </svg>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <KitchenSidePanel
        isVisible={showKitchenPanel}
        kitchenItems={kitchenItems}
        expandedCategories={expandedCategories}
        onToggleCategory={toggleCategory}
        onAddKitchenItem={addKitchenItem}
      />

      <div className="flex-1 flex flex-col">
        <div className="p-6 pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Professional Kitchen & Floor Plan Designer</h1>
          <p className="text-gray-600 mt-2">Design complete kitchen layouts with professional architectural tools</p>
        </div>

        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow-md">
            <button
              onClick={() => setShowKitchenPanel(!showKitchenPanel)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              {showKitchenPanel ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              Kitchen Items
            </button>
            <button
              onClick={toggle3DView}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${is3DView
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
            >
              {is3DView ? <Grid3X3 size={16} /> : <Box size={16} />}
              {is3DView ? 'View in 2D' : 'View in 3D'}
            </button>

            <button
              onClick={() => setSelectedTool('select')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${selectedTool === 'select'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <Move size={16} />
              Select
            </button>

            <button
              onClick={() => setSelectedTool('wall')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${selectedTool === 'wall'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <Minus size={16} />
              Wall
            </button>

            <button
              onClick={addDoor}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
            >
              <Square size={16} />
              Door
            </button>

            <button
              onClick={addWindow}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
            >
              <Home size={16} />
              Window
            </button>

            <div className="flex items-center gap-1 ml-4 border-l pl-4">
              <button
                onClick={zoomIn}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
              >
                <ZoomIn size={16} />
              </button>

              <span className="px-2 py-1 bg-gray-100 rounded text-sm min-w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={zoomOut}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
              >
                <ZoomOut size={16} />
              </button>

              <button
                onClick={resetView}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 ml-4 border-l pl-4">
              <input
                type="file"
                accept=".json"
                onChange={loadFromJSON}
                className="hidden"
                id="json-upload"
              />
              <label
                htmlFor="json-upload"
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors cursor-pointer"
              >
                📁 Load JSON
              </label>

              <button
                onClick={saveAsJSON}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                💾 Save JSON
              </button>

              <button
                onClick={exportAsImage}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                <Download size={16} />
                Export PNG
              </button>
            </div>

            <button
              onClick={deleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              disabled={!selectedId}
            >
              <Trash2 size={16} />
              Delete
            </button>

            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center px-6 pb-6">
          <div className="flex-1 flex justify-center items-center px-6 pb-6">
            {is3DView ? render3DCanvas() : render2DCanvas()}
          </div>
        </div>
      </div>

      <Designer3DCanvas
        isVisible={showRightPanel}
        objects={objects}
        onToggle={toggleRightPanel}
      />

      {selectedId && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-white rounded-lg shadow-lg border border-gray-300">
          <h3 className="text-lg font-semibold mb-2">Selected Object Properties</h3>
          <div className="flex gap-4 items-center flex-wrap">
            {(() => {
              const selectedObj = getSelectedObject();
              if (!selectedObj) return null;

              if (selectedObj.type === 'wall') {
                return (
                  <>
                    <label className="flex items-center gap-2">
                      Wall Thickness:
                      <input
                        type="range"
                        min={feetToPixels(0, 2)}
                        max={feetToPixels(1, 0)}
                        step="1"
                        value={selectedObj.thickness}
                        onChange={(e) => updateObject(selectedId, { thickness: parseInt(e.target.value) })}
                        className="w-32"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.thickness)}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Wall Height:
                      <input
                        type="range"
                        min={feetToPixels(6, 0)}
                        max={feetToPixels(12, 0)}
                        step="6"
                        value={selectedObj.height || feetToPixels(8, 0)}
                        onChange={(e) => updateObject(selectedId, { height: parseInt(e.target.value) })}
                        className="w-32"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.height || feetToPixels(8, 0))}
                      </span>
                    </label>
                  </>
                );
              }

              if (selectedObj.type === 'door') {
                return (
                  <>
                    <label className="flex items-center gap-2">
                      Door Type:
                      <select
                        value={selectedObj.doorType}
                        onChange={(e) => updateObject(selectedId, { doorType: e.target.value as 'swing-right' | 'swing-left' })}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="swing-right">Swing Right</option>
                        <option value="swing-left">Swing Left</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-2">
                      Width:
                      <input
                        type="range"
                        min={feetToPixels(2, 0)}
                        max={feetToPixels(5, 0)}
                        step="3"
                        value={selectedObj.width}
                        onChange={(e) => updateObject(selectedId, { width: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.width)}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Rotation:
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="45"
                        value={selectedObj.rotation}
                        onChange={(e) => updateObject(selectedId, { rotation: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm">{selectedObj.rotation}°</span>
                    </label>
                  </>
                );
              }

              if (selectedObj.type === 'window') {
                return (
                  <>
                    <label className="flex items-center gap-2">
                      Width:
                      <input
                        type="range"
                        min={feetToPixels(1, 0)}
                        max={feetToPixels(8, 0)}
                        step="6"
                        value={selectedObj.width}
                        onChange={(e) => updateObject(selectedId, { width: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.width)}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Height:
                      <input
                        type="range"
                        min={feetToPixels(1, 0)}
                        max={feetToPixels(6, 0)}
                        step="3"
                        value={selectedObj.height || feetToPixels(3, 0)}
                        onChange={(e) => updateObject(selectedId, { height: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.height || feetToPixels(3, 0))}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Rotation:
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="45"
                        value={selectedObj.rotation}
                        onChange={(e) => updateObject(selectedId, { rotation: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm">{selectedObj.rotation}°</span>
                    </label>
                  </>
                );
              }

              if (selectedObj.type in kitchenItems) {
                return (
                  <>
                    <label className="flex items-center gap-2">
                      Width:
                      <input
                        type="range"
                        min={feetToPixels(1, 0)}
                        max={feetToPixels(8, 0)}
                        step="6"
                        value={selectedObj.width}
                        onChange={(e) => updateObject(selectedId, { width: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.width)}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Height:
                      <input
                        type="range"
                        min={feetToPixels(1, 0)}
                        max={feetToPixels(6, 0)}
                        step="3"
                        value={selectedObj.height}
                        onChange={(e) => updateObject(selectedId, { height: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.height)}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Rotation:
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="45"
                        value={selectedObj.rotation}
                        onChange={(e) => updateObject(selectedId, { rotation: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm">{selectedObj.rotation}°</span>
                    </label>
                  </>
                );
              }

              return null;
            })()}
          </div>
        </div>
      )}

      {selectedTool === 'wall' && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl border-2 border-blue-200 p-4 min-w-96 z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold text-gray-800">🏗️ Wall Creation Tool</div>
            <button
              onClick={() => setSelectedTool('select')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Close panel"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setWallCreationMode('draw');
                setIsDrawing(false);
                setCurrentLine(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-colors ${wallCreationMode === 'draw'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              ✏️ Free Draw Mode
            </button>
            <button
              onClick={() => {
                setWallCreationMode('custom');
                setIsDrawing(false);
                setCurrentLine(null);
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-colors ${wallCreationMode === 'custom'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              🏠 Room Builder
            </button>
          </div>

          {wallCreationMode === 'custom' ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Room Width (ft)</label>
                  <input
                    type="number"
                    value={wallWidth}
                    onChange={(e) => setWallWidth(Math.max(4, parseFloat(e.target.value) || 12))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="4"
                    max="40"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Room Height (ft)</label>
                  <input
                    type="number"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(Math.max(4, parseFloat(e.target.value) || 10))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="4"
                    max="40"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Wall Thickness (ft)</label>
                  <input
                    type="number"
                    value={wallThickness}
                    onChange={(e) => setWallThickness(Math.max(0.25, parseFloat(e.target.value) || 0.5))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0.25"
                    max="1"
                    step="0.25"
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 mb-2">Common Kitchen Sizes:</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setWallWidth(8); setWallHeight(8); }}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    8' × 8' Small
                  </button>
                  <button
                    onClick={() => { setWallWidth(10); setWallHeight(8); }}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    10' × 8' Compact
                  </button>
                  <button
                    onClick={() => { setWallWidth(12); setWallHeight(10); }}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    12' × 10' Kitchen
                  </button>
                  <button
                    onClick={() => { setWallWidth(14); setWallHeight(12); }}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    14' × 12' Large
                  </button>
                  <button
                    onClick={() => { setWallWidth(16); setWallHeight(14); }}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    16' × 14' XL
                  </button>
                  <button
                    onClick={() => { setWallWidth(20); setWallHeight(16); }}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    20' × 16' XXL
                  </button>
                </div>
              </div>

              <div className="mb-4 bg-gray-50 p-3 rounded-lg border">
                <div className="text-xs font-medium text-gray-700 mb-2">Room Layout Preview:</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Room Dimensions:</span>
                    <span className="font-medium">{wallWidth}' × {wallHeight}'</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wall Thickness:</span>
                    <span className="font-medium">{wallThickness}' ({wallThickness * 12}")</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wall Height:</span>
                    <span className="font-medium">{wallHeight}' ({wallHeight * 12}")</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="font-medium">Floor Area:</span>
                    <span className="font-medium text-blue-600">{(wallWidth * wallHeight).toFixed(1)} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">2D View:</span>
                    <span className="font-medium text-green-600">4 walls (complete)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 font-medium">3D View:</span>
                    <span className="font-medium text-blue-600">3 walls (U-shaped)</span>
                  </div>
                  <div className="text-xs text-amber-600 mt-2 italic">
                    ⚠️ 3D view opens front for kitchen access
                  </div>
                </div>
              </div>

              <button
                onClick={handleWallSubmit}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium shadow-sm flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95"
              >
                <span className="text-lg">🏠</span>
                <span>Create Room ({wallWidth}' × {wallHeight}')</span>
              </button>

              <div className="text-xs text-blue-600 text-center mt-2 space-x-3">
                <span>Press <kbd className="px-1.5 py-0.5 bg-blue-100 rounded text-xs font-mono">Enter</kbd> to create</span>
                <span>Press <kbd className="px-1.5 py-0.5 bg-blue-100 rounded text-xs font-mono">Esc</kbd> to close</span>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ArchitecturalDesigner;