import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

const Earth = ({ onSelectCountry }) => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  
  // Load textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsedTime / 10;
    cloudsRef.current.rotation.y = elapsedTime / 8;
  });

  const handleClick = (e) => {
    e.stopPropagation();
    // Simplified country selection for demo
    // In a real app, we'd use lat/long or a GeoJSON mesh
    const destinations = ['France', 'Japan', 'Italy', 'Iceland', 'India'];
    const randomCountry = destinations[Math.floor(Math.random() * destinations.length)];
    onSelectCountry(randomCountry);
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2.5} />
      
      {/* Clouds Layer */}
      <mesh ref={cloudsRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Earth Body */}
      <mesh ref={earthRef} onClick={handleClick}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>

      {/* Atmosphere Glow Effect */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color="#4F9CF9"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  );
};

const Globe = ({ onSelectCountry }) => {
  return (
    <div style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} />
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade={true} />
        <React.Suspense fallback={<Html center>Loading Universe...</Html>}>
          <Earth onSelectCountry={onSelectCountry} />
        </React.Suspense>
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={3} 
          maxDistance={10}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Globe;
