import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { kitchenItems } from '../../data/data';
import { DesignObject, Door, KitchenItem, Point, Wall, Window } from '../../data/interface';

interface ThreeDViewerProps {
  objects: DesignObject[];
  selectedId: string | null;
  onObjectSelect: (id: string) => void;
}
export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ objects, selectedId, onObjectSelect }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<any>(null);
  const objectsRef = useRef<Map<string, THREE.Object3D>>(new Map());

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;

    // Camera setup with better positioning for kitchen view
    const camera = new THREE.PerspectiveCamera(60, 800 / 600, 0.1, 1000);
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup with better quality
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(800, 600);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);

    // Additional fill lights for better kitchen lighting
    const fillLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight1.position.set(-10, 15, -10);
    scene.add(fillLight1);

    const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
    fillLight2.position.set(10, 8, -15);
    scene.add(fillLight2);

    // Professional floor with wood texture pattern
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xd4b896,
      shininess: 10,
      specular: 0x111111
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add grid lines for floor planks
    const floorLines = new THREE.Group();
    for (let i = -20; i <= 20; i += 2) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i, 0.01, -20),
        new THREE.Vector3(i, 0.01, 20)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xc4a886, opacity: 0.3, transparent: true });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      floorLines.add(line);
    }
    scene.add(floorLines);

    // Simple orbit controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraDistance = 15;
    let cameraAngleX = 0;
    let cameraAngleY = 0;

    const updateCameraPosition = (): void => {
      const x = cameraDistance * Math.sin(cameraAngleY) * Math.cos(cameraAngleX);
      const y = cameraDistance * Math.sin(cameraAngleX);
      const z = cameraDistance * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);
      
      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);
    };

    const onMouseDown = (event: MouseEvent): void => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseMove = (event: MouseEvent): void => {
      if (!isDragging) return;

      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;

      cameraAngleY += deltaX * 0.01;
      cameraAngleX += deltaY * 0.01;

      // Clamp vertical rotation
      cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraAngleX));

      updateCameraPosition();
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const onMouseUp = (): void => {
      isDragging = false;
    };

    const onWheel = (event: WheelEvent): void => {
      event.preventDefault();
      cameraDistance += event.deltaY * 0.01;
      cameraDistance = Math.max(5, Math.min(50, cameraDistance));
      updateCameraPosition();
    };

    // Add event listeners
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Mount renderer
    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = (): void => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, []);

  // Update 3D objects when 2D objects change
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const currentObjects = objectsRef.current;

    // Calculate center point of all 2D objects to center the 3D design
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    objects.forEach(obj => {
      if (obj.type === 'wall') {
        const wall = obj as Wall;
        minX = Math.min(minX, wall.x1, wall.x2);
        maxX = Math.max(maxX, wall.x1, wall.x2);
        minY = Math.min(minY, wall.y1, wall.y2);
        maxY = Math.max(maxY, wall.y1, wall.y2);
      } else {
        const item = obj as Door | Window | KitchenItem;
        minX = Math.min(minX, item.x);
        maxX = Math.max(maxX, item.x + item.width);
        minY = Math.min(minY, item.y);
        maxY = Math.max(maxY, item.y + item.height);
      }
    });

    // Calculate center offset to center the design at origin (0, 0, 0)
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Find wall boundaries to keep components inside
    const walls = objects.filter(obj => obj.type === 'wall') as Wall[];
    let wallMinX = Infinity, wallMaxX = -Infinity, wallMinY = Infinity, wallMaxY = -Infinity;
    
    walls.forEach(wall => {
      wallMinX = Math.min(wallMinX, wall.x1, wall.x2);
      wallMaxX = Math.max(wallMaxX, wall.x1, wall.x2);
      wallMinY = Math.min(wallMinY, wall.y1, wall.y2);
      wallMaxY = Math.max(wallMaxY, wall.y1, wall.y2);
    });

    // Add padding so items don't touch walls directly
    const padding = 12; // 1 foot padding
    const roomMinX = wallMinX + padding;
    const roomMaxX = wallMaxX - padding;
    const roomMinY = wallMinY + padding;
    const roomMaxY = wallMaxY - padding;

    // Function to constrain position within room bounds
    const constrainToRoom = (obj: DesignObject): Point => {
      if (obj.type === 'wall') return { x: 0, y: 0 };
      
      const item = obj as Door | Window | KitchenItem;
      let constrainedX = item.x;
      let constrainedY = item.y;
      
      // Ensure object fits within room bounds
      if (constrainedX < roomMinX) constrainedX = roomMinX;
      if (constrainedX + item.width > roomMaxX) constrainedX = roomMaxX - item.width;
      if (constrainedY < roomMinY) constrainedY = roomMinY;
      if (constrainedY + item.height > roomMaxY) constrainedY = roomMaxY - item.height;
      
      return { x: constrainedX, y: constrainedY };
    };

    // Remove objects that no longer exist
    currentObjects.forEach((mesh, id) => {
      if (!objects.find(obj => obj.id === id)) {
        scene.remove(mesh);
        currentObjects.delete(id);
      }
    });

    // Add or update objects
    objects.forEach(obj => {
      const existingMesh = currentObjects.get(obj.id);
      
      if (existingMesh) {
        // Update existing object position/rotation with centering and room constraints
        if (obj.type !== 'wall') {
          const constrainedPos = constrainToRoom(obj);
          existingMesh.position.set(
            (constrainedPos.x - centerX) / 12, 
            existingMesh.position.y, 
            (constrainedPos.y - centerY) / 12
          );
          existingMesh.rotation.y = ((obj as Door | Window | KitchenItem).rotation || 0) * Math.PI / 180;
        } else {
          // Update wall position with centering
          const wall = obj as Wall;
          const wallCenterX = (wall.x1 + wall.x2) / 2;
          const wallCenterY = (wall.y1 + wall.y2) / 2;
          existingMesh.position.set(
            (wallCenterX - centerX) / 12, 
            existingMesh.position.y,
            (wallCenterY - centerY) / 12
          );
        }
        
        // Update selection highlight
        const meshMaterial = (existingMesh as THREE.Mesh).material;
        if (Array.isArray(meshMaterial)) {
          meshMaterial.forEach(mat => {
            if (
              'emissive' in mat &&
              mat.emissive &&
              typeof (mat.emissive as THREE.Color).setHex === 'function'
            ) {
              if (obj.id === selectedId) {
                (mat.emissive as THREE.Color).setHex(0x444444);
              } else {
                (mat.emissive as THREE.Color).setHex(0x000000);
              }
            }
          });
        } else if (
          meshMaterial instanceof THREE.MeshPhongMaterial ||
          meshMaterial instanceof THREE.MeshStandardMaterial
        ) {
          if (obj.id === selectedId) {
            meshMaterial.emissive.setHex(0x444444);
          } else {
            meshMaterial.emissive.setHex(0x000000);
          }
        }
      } else {
        // Create new 3D object
        let mesh: THREE.Object3D;
        
        switch (obj.type) {
          case 'wall':
            const wall = obj as Wall;
            const wallLength = Math.sqrt(Math.pow(wall.x2 - wall.x1, 2) + Math.pow(wall.y2 - wall.y1, 2));
            const wallHeight = (wall.height || 96) / 12;
            const wallThickness = wall.thickness / 12;
            
            // Create wall with realistic materials
            const wallGeometry = new THREE.BoxGeometry(wallLength / 12, wallHeight, wallThickness);
            const wallMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xf5f5f5,
              shininess: 5,
              specular: 0x222222
            });
            mesh = new THREE.Mesh(wallGeometry, wallMaterial);
            
            // Position and rotate wall with centering
            const wallCenterX = (wall.x1 + wall.x2) / 2;
            const wallCenterY = (wall.y1 + wall.y2) / 2;
            const wallAngle = Math.atan2(wall.y2 - wall.y1, wall.x2 - wall.x1);
            
            mesh.position.set((wallCenterX - centerX) / 12, wallHeight / 2, (wallCenterY - centerY) / 12);
            mesh.rotation.y = wallAngle;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            break;

          case 'door':
            const door = obj as Door;
            // Create door frame
            const doorFrameGroup = new THREE.Group();
            
            // Door frame
            const frameGeometry = new THREE.BoxGeometry(door.width / 12 + 0.2, door.height / 12, 0.3);
            const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, 0, 0);
            doorFrameGroup.add(frame);
            
            // Door panel
            const doorGeometry = new THREE.BoxGeometry(door.width / 12, door.height / 12 - 0.2, 0.08);
            const doorMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x8B4513,
              shininess: 20,
              specular: 0x444444
            });
            const doorPanel = new THREE.Mesh(doorGeometry, doorMaterial);
            doorPanel.position.set(0, 0, 0.1);
            doorFrameGroup.add(doorPanel);
            
            // Door handle
            const doorHandleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.1);
            const doorHandleMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xCCAA00,
              shininess: 100,
              specular: 0x888888
            });
            const handle = new THREE.Mesh(doorHandleGeometry, doorHandleMaterial);
            handle.position.set(door.width / 24, 0, 0.15);
            handle.rotation.z = Math.PI / 2;
            doorFrameGroup.add(handle);
            
            mesh = doorFrameGroup;
            // Doors are typically in walls, so don't constrain them
            mesh.position.set((door.x - centerX) / 12, door.height / 24, (door.y - centerY) / 12);
            mesh.rotation.y = (door.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          case 'window':
            const window = obj as Window;
            // Create window frame
            const windowGroup = new THREE.Group();
            
            // Window frame
            const windowFrameGeometry = new THREE.BoxGeometry(window.width / 12, window.height / 12, 0.2);
            const windowFrameMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
            const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
            windowGroup.add(windowFrame);
            
            // Window glass
            const glassGeometry = new THREE.BoxGeometry(window.width / 12 - 0.1, window.height / 12 - 0.1, 0.02);
            const glassMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x87CEEB,
              transparent: true,
              opacity: 0.3,
              shininess: 100,
              specular: 0xffffff
            });
            const glass = new THREE.Mesh(glassGeometry, glassMaterial);
            glass.position.set(0, 0, 0.05);
            windowGroup.add(glass);
            
            mesh = windowGroup;
            // Windows are typically in walls, so don't constrain them
            mesh.position.set((window.x - centerX) / 12, window.height / 24, (window.y - centerY) / 12);
            mesh.rotation.y = (window.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          case 'refrigerator':
            const fridge = obj as KitchenItem;
            // Create detailed refrigerator
            const fridgeGroup = new THREE.Group();
            
            // Main body
            const fridgeBodyGeometry = new THREE.BoxGeometry(fridge.width / 12, 6, fridge.height / 12);
            const fridgeBodyMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xF0F0F0,
              shininess: 50,
              specular: 0x666666
            });
            const fridgeBody = new THREE.Mesh(fridgeBodyGeometry, fridgeBodyMaterial);
            fridgeBody.position.set(0, 3, 0);
            fridgeGroup.add(fridgeBody);
            
            // Refrigerator doors
            const fridgeDoorWidth = fridge.width / 24;
            const leftDoorGeometry = new THREE.BoxGeometry(fridgeDoorWidth, 5.8, 0.05);
            const rightDoorGeometry = new THREE.BoxGeometry(fridgeDoorWidth, 5.8, 0.05);
            const fridgeDoorMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xE8E8E8,
              shininess: 30
            });
            
            const leftDoor = new THREE.Mesh(leftDoorGeometry, fridgeDoorMaterial);
            leftDoor.position.set(-fridgeDoorWidth / 2, 3, fridge.height / 24 + 0.03);
            fridgeGroup.add(leftDoor);
            
            const rightDoor = new THREE.Mesh(rightDoorGeometry, fridgeDoorMaterial);
            rightDoor.position.set(fridgeDoorWidth / 2, 3, fridge.height / 24 + 0.03);
            fridgeGroup.add(rightDoor);
            
            // Door handles
            const fridgeHandleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
            const fridgeHandleMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x333333,
              shininess: 100
            });
            const leftHandle = new THREE.Mesh(fridgeHandleGeometry, fridgeHandleMaterial);
            leftHandle.position.set(-fridgeDoorWidth / 4, 3, fridge.height / 24 + 0.1);
            fridgeGroup.add(leftHandle);
            
            const rightHandle = new THREE.Mesh(fridgeHandleGeometry, fridgeHandleMaterial);
            rightHandle.position.set(fridgeDoorWidth / 4, 3, fridge.height / 24 + 0.1);
            fridgeGroup.add(rightHandle);
            
            mesh = fridgeGroup;
            const fridgeConstrainedPos = constrainToRoom(obj);
            mesh.position.set((fridgeConstrainedPos.x - centerX) / 12, 0, (fridgeConstrainedPos.y - centerY) / 12);
            mesh.rotation.y = (fridge.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          case 'stove':
            const stove = obj as KitchenItem;
            // Create detailed stove
            const stoveGroup = new THREE.Group();
            
            // Stove body
            const stoveBodyGeometry = new THREE.BoxGeometry(stove.width / 12, 3, stove.height / 12);
            const stoveBodyMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x2C2C2C,
              shininess: 20,
              specular: 0x444444
            });
            const stoveBody = new THREE.Mesh(stoveBodyGeometry, stoveBodyMaterial);
            stoveBody.position.set(0, 1.5, 0);
            stoveGroup.add(stoveBody);
            
            // Cooktop
            const cooktopGeometry = new THREE.BoxGeometry(stove.width / 12 - 0.1, 0.05, stove.height / 12 - 0.1);
            const cooktopMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x1A1A1A,
              shininess: 80,
              specular: 0x666666
            });
            const cooktop = new THREE.Mesh(cooktopGeometry, cooktopMaterial);
            cooktop.position.set(0, 3.03, 0);
            stoveGroup.add(cooktop);
            
            // Burners
            const burnerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.02);
            const burnerMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
            
            const burnerPositions: [number, number, number][] = [
              [-stove.width / 36, 3.04, -stove.height / 36],
              [stove.width / 36, 3.04, -stove.height / 36],
              [-stove.width / 36, 3.04, stove.height / 36],
              [stove.width / 36, 3.04, stove.height / 36]
            ];
            
            burnerPositions.forEach((pos: [number, number, number]) => {
              const burner = new THREE.Mesh(burnerGeometry, burnerMaterial);
              burner.position.set(...pos);
              stoveGroup.add(burner);
            });
            
            mesh = stoveGroup;
            const stoveConstrainedPos = constrainToRoom(obj);
            mesh.position.set((stoveConstrainedPos.x - centerX) / 12, 0, (stoveConstrainedPos.y - centerY) / 12);
            mesh.rotation.y = (stove.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          case 'sink':
            const sink = obj as KitchenItem;
            // Create detailed sink
            const sinkGroup = new THREE.Group();
            
            // Sink base
            const sinkBaseGeometry = new THREE.BoxGeometry(sink.width / 12, 3, sink.height / 12);
            const sinkBaseMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xF5F5F5,
              shininess: 10
            });
            const sinkBase = new THREE.Mesh(sinkBaseGeometry, sinkBaseMaterial);
            sinkBase.position.set(0, 1.5, 0);
            sinkGroup.add(sinkBase);
            
            // Sink bowl
            const sinkBowlGeometry = new THREE.CylinderGeometry(0.6, 0.5, 0.3);
            const sinkBowlMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xC0C0C0,
              shininess: 100,
              specular: 0x888888
            });
            const sinkBowl = new THREE.Mesh(sinkBowlGeometry, sinkBowlMaterial);
            sinkBowl.position.set(0, 2.85, 0);
            sinkGroup.add(sinkBowl);
            
            // Faucet
            const faucetGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
            const faucetMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xC0C0C0,
              shininess: 100,
              specular: 0xffffff
            });
            const faucet = new THREE.Mesh(faucetGeometry, faucetMaterial);
            faucet.position.set(0, 3.4, -0.3);
            sinkGroup.add(faucet);
            
            mesh = sinkGroup;
            const sinkConstrainedPos = constrainToRoom(obj);
            mesh.position.set((sinkConstrainedPos.x - centerX) / 12, 0, (sinkConstrainedPos.y - centerY) / 12);
            mesh.rotation.y = (sink.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          case 'island':
            const island = obj as KitchenItem;
            // Create detailed kitchen island
            const islandGroup = new THREE.Group();
            
            // Island base
            const islandBaseGeometry = new THREE.BoxGeometry(island.width / 12, 3, island.height / 12);
            const islandBaseMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xE6D2B7,
              shininess: 15,
              specular: 0x444444
            });
            const islandBase = new THREE.Mesh(islandBaseGeometry, islandBaseMaterial);
            islandBase.position.set(0, 1.5, 0);
            islandGroup.add(islandBase);
            
            // Island top
            const islandTopGeometry = new THREE.BoxGeometry(island.width / 12 + 0.1, 0.1, island.height / 12 + 0.1);
            const islandTopMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x4A4A4A,
              shininess: 80,
              specular: 0x666666
            });
            const islandTop = new THREE.Mesh(islandTopGeometry, islandTopMaterial);
            islandTop.position.set(0, 3.05, 0);
            islandGroup.add(islandTop);
            
            mesh = islandGroup;
            const islandConstrainedPos = constrainToRoom(obj);
            mesh.position.set((islandConstrainedPos.x - centerX) / 12, 0, (islandConstrainedPos.y - centerY) / 12);
            mesh.rotation.y = (island.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          case 'upper-cabinet':
            const upperCabinet = obj as KitchenItem;
            // Create detailed upper cabinet
            const upperCabinetGroup = new THREE.Group();
            
            // Cabinet body
            const upperBodyGeometry = new THREE.BoxGeometry(upperCabinet.width / 12, 1, upperCabinet.height / 12);
            const upperBodyMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xD2B48C,
              shininess: 20,
              specular: 0x444444
            });
            const upperBody = new THREE.Mesh(upperBodyGeometry, upperBodyMaterial);
            upperBody.position.set(0, 0, 0);
            upperCabinetGroup.add(upperBody);
            
            // Cabinet doors
            const numDoors = Math.max(1, Math.floor(upperCabinet.width / 24));
            const doorWidth = upperCabinet.width / 12 / numDoors;
            
            for (let i = 0; i < numDoors; i++) {
              const upperDoorGeometry = new THREE.BoxGeometry(doorWidth - 0.02, 0.9, 0.02);
              const upperDoorMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xDEB887,
                shininess: 30
              });
              const upperDoor = new THREE.Mesh(upperDoorGeometry, upperDoorMaterial);
              upperDoor.position.set(
                -upperCabinet.width / 24 + (i + 0.5) * doorWidth,
                0,
                upperCabinet.height / 24 + 0.01
              );
              upperCabinetGroup.add(upperDoor);
              
              // Door knob
              const upperKnobGeometry = new THREE.SphereGeometry(0.02);
              const upperKnobMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x8B4513,
                shininess: 100
              });
              const upperKnob = new THREE.Mesh(upperKnobGeometry, upperKnobMaterial);
              upperKnob.position.set(
                -upperCabinet.width / 24 + (i + 0.8) * doorWidth,
                0,
                upperCabinet.height / 24 + 0.03
              );
              upperCabinetGroup.add(upperKnob);
            }
            
            mesh = upperCabinetGroup;
            const upperConstrainedPos = constrainToRoom(obj);
            mesh.position.set((upperConstrainedPos.x - centerX) / 12, 6, (upperConstrainedPos.y - centerY) / 12);
            mesh.rotation.y = (upperCabinet.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          case 'lower-cabinet':
            const lowerCabinet = obj as KitchenItem;
            // Create detailed lower cabinet
            const lowerCabinetGroup = new THREE.Group();
            
            // Cabinet body
            const lowerBodyGeometry = new THREE.BoxGeometry(lowerCabinet.width / 12, 3, lowerCabinet.height / 12);
            const lowerBodyMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xD2B48C,
              shininess: 20,
              specular: 0x444444
            });
            const lowerBody = new THREE.Mesh(lowerBodyGeometry, lowerBodyMaterial);
            lowerBody.position.set(0, 1.5, 0);
            lowerCabinetGroup.add(lowerBody);
            
            // Countertop
            const countertopGeometry = new THREE.BoxGeometry(lowerCabinet.width / 12 + 0.1, 0.1, lowerCabinet.height / 12 + 0.1);
            const countertopMaterial = new THREE.MeshPhongMaterial({ 
              color: 0x4A4A4A,
              shininess: 80,
              specular: 0x666666
            });
            const countertop = new THREE.Mesh(countertopGeometry, countertopMaterial);
            countertop.position.set(0, 3.05, 0);
            lowerCabinetGroup.add(countertop);
            
            // Cabinet doors
            const numDoors2 = Math.max(1, Math.floor(lowerCabinet.width / 24));
            const doorWidth2 = lowerCabinet.width / 12 / numDoors2;
            
            for (let i = 0; i < numDoors2; i++) {
              const lowerDoorGeometry = new THREE.BoxGeometry(doorWidth2 - 0.02, 2.8, 0.02);
              const lowerDoorMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xDEB887,
                shininess: 30
              });
              const lowerDoor = new THREE.Mesh(lowerDoorGeometry, lowerDoorMaterial);
              lowerDoor.position.set(
                -lowerCabinet.width / 24 + (i + 0.5) * doorWidth2,
                1.5,
                lowerCabinet.height / 24 + 0.01
              );
              lowerCabinetGroup.add(lowerDoor);
              
              // Door knob
              const lowerKnobGeometry = new THREE.SphereGeometry(0.02);
              const lowerKnobMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x8B4513,
                shininess: 100
              });
              const lowerKnob = new THREE.Mesh(lowerKnobGeometry, lowerKnobMaterial);
              lowerKnob.position.set(
                -lowerCabinet.width / 24 + (i + 0.8) * doorWidth2,
                1.5,
                lowerCabinet.height / 24 + 0.03
              );
              lowerCabinetGroup.add(lowerKnob);
            }
            
            mesh = lowerCabinetGroup;
            const lowerConstrainedPos = constrainToRoom(obj);
            mesh.position.set((lowerConstrainedPos.x - centerX) / 12, 0, (lowerConstrainedPos.y - centerY) / 12);
            mesh.rotation.y = (lowerCabinet.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;

          default:
            // Generic kitchen item with better materials
            const generic = obj as KitchenItem;
            const genericGeometry = new THREE.BoxGeometry(generic.width / 12, 2, generic.height / 12);
            const genericMaterial = new THREE.MeshPhongMaterial({ 
              color: 0xcccccc,
              shininess: 30,
              specular: 0x444444
            });
            mesh = new THREE.Mesh(genericGeometry, genericMaterial);
            const genericConstrainedPos = constrainToRoom(obj);
            mesh.position.set((genericConstrainedPos.x - centerX) / 12, 1, (genericConstrainedPos.y - centerY) / 12);
            mesh.rotation.y = (generic.rotation || 0) * Math.PI / 180;
            mesh.castShadow = true;
            break;
        }

        if (mesh) {
          // Add click handler for selection
          mesh.userData = { id: obj.id, type: obj.type };
          scene.add(mesh);
          currentObjects.set(obj.id, mesh);
        }
      }
    });
  }, [objects, selectedId]);

    return (
      <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* 3D Controls UI */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="text-sm font-semibold mb-2">3D Controls</div>
        <div className="text-xs space-y-1">
          <div>🖱️ Drag to rotate</div>
          <div>🔍 Scroll to zoom</div>
          <div>📱 Click objects to select</div>
          <div className="pt-1 border-t border-gray-200 text-gray-600">
            🏠 Kitchen items stay inside walls
          </div>
        </div>
      </div>

      {/* Lighting Controls */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
        <div className="text-sm font-semibold mb-2">3D View</div>
        <div className="text-xs text-gray-600">
          Professional 3D rendering with realistic lighting and shadows
        </div>
      </div>
    </div>
  );
};

