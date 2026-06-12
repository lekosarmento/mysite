"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

extend({ UnrealBloomPass, ShaderPass });

const CFG = {
    nodes: 100,
    particles: 1000, 
    radius: 2.8,
    synapseCount: 12,
};

const palette = [
    new THREE.Color('#00D4FF'), // Cyan
    new THREE.Color('#E0E0E0'), // White
    new THREE.Color('#8B5CF6'), // Purple
    new THREE.Color('#FF6B35')  // Amber
];

const cinematicShader = {
    uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        enableCA: { value: 1.0 },
        isDark: { value: 1.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float enableCA;
        uniform float isDark;
        varying vec2 vUv;
        
        float random(vec2 p) { return fract(sin(dot(p.xy, vec2(12.9898,78.233))) * 43758.5453); }
        
        void main() {
            vec2 distVec = vUv - 0.5;
            float dist = length(distVec);
            
            float caAmount = smoothstep(0.2, 0.8, dist) * 0.004 * enableCA;
            float r = texture2D(tDiffuse, vUv + distVec * caAmount).r;
            float g = texture2D(tDiffuse, vUv).g;
            float b = texture2D(tDiffuse, vUv - distVec * caAmount).b;
            vec3 color = vec3(r, g, b);
            
            float scanline = sin(vUv.y * 800.0 - time * 4.0) * 0.02;
            color += scanline * color;
            
            float noise = (random(vUv + time) - 0.5) * 0.03;
            color += noise;
            
            float vignette = 1.0 - smoothstep(0.5, 1.4, dist);
            if (isDark < 0.5) {
                vignette = 1.0 - smoothstep(0.8, 1.5, dist) * 0.15;
            }
            color *= vignette;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
};

export function SceneGraph() {
  const { mouse, scene, size, camera, gl } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const shaderPassRef = useRef<any>(null);
  const bloomPassRef = useRef<any>(null);
  
  const targetView = useRef(new THREE.Vector2(0, 0));
  const hitPoint = useRef(new THREE.Vector3(999, 999, 999));
  const pulsePoint = useRef(new THREE.Vector3(999, 999, 999));
  const pulseTime = useRef(-999);
  
  const [scrollY, setScrollY] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Sync theme dynamically
  useEffect(() => {
    const checkTheme = () => {
      const hasDark = document.documentElement.classList.contains("dark");
      setIsDark(hasDark);
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    
    return () => observer.disconnect();
  }, []);

  // Force WebGL clear alpha and color for transparency in light mode
  useEffect(() => {
    if (gl) {
      if (!isDark) {
        gl.setClearColor(0x000000, 0);
      } else {
        gl.setClearColor(0x0a0a0a, 1);
      }
    }
  }, [isDark, gl]);

  // Nodes Data
  const { positions, colors, sizes, phases, nodeVels, originalNodes, edgeIndices, activeEdgesMap } = useMemo(() => {
    const pos = new Float32Array(CFG.nodes * 3);
    const col = new Float32Array(CFG.nodes * 3);
    const siz = new Float32Array(CFG.nodes);
    const pha = new Float32Array(CFG.nodes);
    const vels = [];
    const orig = [];
    
    for (let i = 0; i < CFG.nodes; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / CFG.nodes);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const x = CFG.radius * Math.sin(phi) * Math.cos(theta);
        const y = CFG.radius * Math.sin(phi) * Math.sin(theta);
        const z = CFG.radius * Math.cos(phi);
        
        pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
        orig.push(new THREE.Vector3(x, y, z));
        
        vels.push(new THREE.Vector3(
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.005,
            (Math.random() - 0.5) * 0.005
        ));

        const r = Math.random();
        let c = palette[0];
        if (r > 0.6 && r <= 0.85) c = palette[1];
        else if (r > 0.85 && r <= 0.95) c = palette[2];
        else if (r > 0.95) c = palette[3];
        
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
        siz[i] = Math.random() > 0.85 ? 12.0 : 5.0;
        pha[i] = Math.random() * Math.PI * 2;
    }
    
    const edges = [];
    const edgeMap = [];
    for (let i = 0; i < CFG.nodes; i++) {
        for (let j = i + 1; j < CFG.nodes; j++) {
            if (orig[i].distanceTo(orig[j]) < 1.4) {
                edges.push(i, j);
                edgeMap.push({ s: i, t: j });
            }
        }
    }
    
    return { 
      positions: pos, colors: col, sizes: siz, phases: pha, 
      nodeVels: vels, originalNodes: orig, 
      edgeIndices: new Uint16Array(edges), activeEdgesMap: edgeMap 
    };
  }, []);

  // Particles Data
  const { pPos, pSizes } = useMemo(() => {
      const pos = new Float32Array(CFG.particles * 3);
      const siz = new Float32Array(CFG.particles);
      for(let i=0; i < CFG.particles; i++) {
          pos[i*3] = (Math.random() - 0.5) * 25;
          pos[i*3+1] = (Math.random() - 0.5) * 25;
          pos[i*3+2] = (Math.random() - 0.5) * 15;
          siz[i] = Math.random() * 2.0 + 0.5;
      }
      return { pPos: pos, pSizes: siz };
  }, []);

  // Synapses state (mutable to avoid re-rendering)
  const synapses = useRef(Array.from({ length: CFG.synapseCount }, () => ({
      active: false, progress: 0, speed: 0, startIdx: 0, endIdx: 0,
      startPos: new THREE.Vector3(), endPos: new THREE.Vector3(),
      meshRef: null as THREE.Mesh | null
  })));

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click Interactivity
  const handlePointerDown = (e: any) => {
      if(!groupRef.current) return;
      
      const hit = e.point.clone();
      groupRef.current.worldToLocal(hit);
      pulsePoint.current.copy(hit);
      
      pulseTime.current = -1; // Flag to capture clock time
      
      const nearestNodes: number[] = [];
      const pts = nodesRef.current?.geometry.attributes.position.array;
      if(pts) {
          for(let i=0; i<CFG.nodes; i++) {
              if(hit.distanceTo(new THREE.Vector3(pts[i*3], pts[i*3+1], pts[i*3+2])) < 1.0) {
                  nearestNodes.push(i);
              }
          }
      }
      
      let sFired = 0;
      synapses.current.forEach(s => {
          if(!s.active && sFired < 4 && nearestNodes.length > 0) {
              const randomNode = nearestNodes[Math.floor(Math.random() * nearestNodes.length)];
              const connectedEdges = activeEdgesMap.filter(ed => ed.s === randomNode || ed.t === randomNode);
              if(connectedEdges.length > 0) {
                  const edge = connectedEdges[Math.floor(Math.random() * connectedEdges.length)];
                  s.active = true;
                  s.startIdx = edge.t === randomNode ? edge.t : edge.s;
                  s.endIdx = edge.t === randomNode ? edge.s : edge.t;
                  s.progress = 0;
                  s.speed = 2.0 + Math.random();
                  if(s.meshRef) {
                      s.meshRef.visible = true;
                      (s.meshRef.material as THREE.MeshBasicMaterial).color.setHex(isDark ? 0xFFFFFF : 0x007CA3);
                  }
                  sFired++;
              }
          }
      });
  };

  const handlePointerMove = (e: any) => {
      if(!groupRef.current) return;
      // Proximity effect only active if window width > 768 (Desktop)
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        const hitLocal = e.point.clone();
        groupRef.current.worldToLocal(hitLocal);
        hitPoint.current.lerp(hitLocal, 0.15);
      }
  };
  
  const handlePointerOut = () => {
      hitPoint.current.lerp(new THREE.Vector3(999, 999, 999), 0.05);
  };

  useFrame((state, delta) => {
      const time = state.clock.elapsedTime;
      
      if(pulseTime.current === -1) pulseTime.current = time; 
      
      if(nodesRef.current) {
          const mat = nodesRef.current.material as THREE.ShaderMaterial;
          mat.uniforms.time.value = time;
          mat.uniforms.isDark.value = isDark ? 1.0 : 0.0;
          mat.uniforms.hitPoint.value.copy(hitPoint.current);
          mat.uniforms.pulsePoint.value.copy(pulsePoint.current);
          mat.uniforms.pulseTime.value = pulseTime.current === -999 ? -999 : pulseTime.current;
      }
      if(edgesRef.current) {
          const mat = edgesRef.current.material as THREE.ShaderMaterial;
          mat.uniforms.hitPoint.value.copy(hitPoint.current);
          mat.uniforms.isDark.value = isDark ? 1.0 : 0.0;
      }
      if(particlesRef.current) {
          const mat = particlesRef.current.material as THREE.ShaderMaterial;
          mat.uniforms.time.value = time;
          mat.uniforms.isDark.value = isDark ? 1.0 : 0.0;
      }
      if(shaderPassRef.current) {
          shaderPassRef.current.uniforms.time.value = time;
          shaderPassRef.current.uniforms.isDark.value = isDark ? 1.0 : 0.0;
      }

      // Parallax & Scroll (Responsive base positions)
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const scrollFactor = Math.min(scrollY / (typeof window !== 'undefined' ? window.innerHeight : 800), 1.0);
      
      targetView.current.x += (mouse.x - targetView.current.x) * 0.02;
      targetView.current.y += (mouse.y - targetView.current.y) * 0.02;
      
      state.camera.position.x = targetView.current.x * 0.8;
      state.camera.position.y = targetView.current.y * 0.8;
      state.camera.lookAt(scene.position);

      if(groupRef.current) {
          groupRef.current.position.set(isMobile ? 0 : 3.5, isMobile ? 3 : 0, -scrollFactor * 6.0);
          groupRef.current.rotation.y += delta * 0.04 + (scrollFactor * 0.05);
          groupRef.current.rotation.z += delta * 0.01;
      }

      if(bloomPassRef.current) {
          bloomPassRef.current.strength = isDark ? (1.6 + scrollFactor * 1.5) : 0.4;
      }

      // Drift computation (Same buffer for nodes and edges)
      if(nodesRef.current) {
          const pts = nodesRef.current.geometry.attributes.position.array as Float32Array;
          for(let i=0; i<CFG.nodes; i++) {
              let v = nodeVels[i];
              let vx = pts[i*3] + v.x;
              let vy = pts[i*3+1] + v.y;
              let vz = pts[i*3+2] + v.z;
              
              const vec = new THREE.Vector3(vx,vy,vz).normalize().multiplyScalar(CFG.radius);
              pts[i*3] = vec.x; pts[i*3+1] = vec.y; pts[i*3+2] = vec.z;
              
              v.applyAxisAngle(new THREE.Vector3(Math.random(),Math.random(),Math.random()).normalize(), (Math.random()-0.5)*0.1);
          }
          nodesRef.current.geometry.attributes.position.needsUpdate = true;
          
          // Synapse wandering
          if(Math.random() < 0.10 && activeEdgesMap.length > 0) {
              const s = synapses.current.find(sy => !sy.active);
              if(s) {
                  const e = activeEdgesMap[Math.floor(Math.random() * activeEdgesMap.length)];
                  s.active = true; s.startIdx = e.s; s.endIdx = e.t;
                  s.progress = 0; s.speed = 0.5 + Math.random() * 1.5;
                  if(s.meshRef) {
                      s.meshRef.visible = true;
                      s.meshRef.scale.set(1.0, 1.0, 1.0);
                      (s.meshRef.material as THREE.MeshBasicMaterial).color.setHex(isDark ? 0xFF6B35 : 0xEA580C);
                  }
              }
          }
          
          synapses.current.forEach(s => {
              if(s.active) {
                  s.progress += delta * s.speed;
                  if(s.progress >= 1.0) {
                      s.active = false; 
                      if(s.meshRef) s.meshRef.visible = false;
                  } else {
                      s.startPos.set(pts[s.startIdx*3], pts[s.startIdx*3+1], pts[s.startIdx*3+2]);
                      s.endPos.set(pts[s.endIdx*3], pts[s.endIdx*3+1], pts[s.endIdx*3+2]);
                      if(s.meshRef) {
                          s.meshRef.position.lerpVectors(s.startPos, s.endPos, s.progress);
                          const sc = Math.sin(s.progress * Math.PI) * 1.5;
                          s.meshRef.scale.set(sc, sc, sc);
                      }
                  }
              }
          });
      }
  });

  return (
    <>
      <fogExp2 attach="fog" args={[isDark ? "#0a0a0a" : "#fafafa", 0.04]} />
      
      {isDark && (
        <Effects disableGamma>
          {/* @ts-ignore */}
          <unrealBloomPass ref={bloomPassRef} args={[new THREE.Vector2(size.width, size.height), 1.6, 0.5, 0.1]} />
          {/* @ts-ignore */}
          <shaderPass ref={shaderPassRef} args={[cinematicShader]} />
        </Effects>
      )}

      {/* Invisible Collider Sphere for Mouse Events */}
      <mesh 
        position={[typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : 3.5, typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 0, 0]} 
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        visible={false}
      >
          <sphereGeometry args={[CFG.radius, 16, 16]} />
          <meshBasicMaterial />
      </mesh>

      <group ref={groupRef}>
        <points ref={nodesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
            <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
          </bufferGeometry>
          <shaderMaterial 
            transparent
            depthWrite={false}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
            uniforms={{
                time: { value: 0 },
                isDark: { value: 1.0 },
                hitPoint: { value: new THREE.Vector3(999,999,999) },
                pulsePoint: { value: new THREE.Vector3(999,999,999) },
                pulseTime: { value: -999 }
            }}
            vertexShader={`
                attribute float size;
                attribute vec3 color;
                attribute float phase;
                varying vec3 vColor;
                varying float vAlpha;
                uniform float time;
                uniform float isDark;
                uniform vec3 hitPoint;
                uniform vec3 pulsePoint;
                uniform float pulseTime;
                
                void main() {
                    vColor = color;
                    float breathe = 0.7 + 0.3 * sin(time * 1.2 + phase);
                    float distToHit = distance(position, hitPoint);
                    float proximity = 1.0 - smoothstep(0.0, 1.2, distToHit);
                    
                    float distToPulse = distance(position, pulsePoint);
                    float timeSincePulse = time - pulseTime;
                    float ripple = 0.0;
                    if(timeSincePulse > 0.0 && timeSincePulse < 1.5) {
                        float wavePos = timeSincePulse * 4.0; 
                        float ring = 1.0 - abs(distToPulse - wavePos);
                        ripple = smoothstep(0.0, 1.0, ring) * 1.5;
                    }
                    
                    vAlpha = 0.4 + 0.4 * breathe + proximity * 1.0 + ripple;
                    float finalSize = size * (1.0 + breathe * 0.2 + proximity * 1.0 + ripple);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = finalSize * (8.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `}
            fragmentShader={`
                varying vec3 vColor;
                varying float vAlpha;
                uniform float isDark;
                void main() {
                    vec2 xy = gl_PointCoord.xy - vec2(0.5);
                    float ll = length(xy);
                    if(ll > 0.5) discard;
                    
                    vec3 finalColor = vColor;
                    if (isDark < 0.5) {
                        if (vColor.r < 0.1 && vColor.g > 0.8) {
                            finalColor = vec3(0.0, 0.49, 0.64);
                        } else if (vColor.r > 0.9 && vColor.g < 0.5) {
                            finalColor = vec3(0.8, 0.3, 0.1);
                        } else if (vColor.r > 0.5 && vColor.g < 0.4 && vColor.b > 0.8) {
                            finalColor = vec3(0.48, 0.24, 0.8);
                        } else {
                            finalColor = vec3(0.2, 0.2, 0.2);
                        }
                    }
                    
                    float alphaMultiplier = isDark < 0.5 ? 2.5 : 1.5;
                    gl_FragColor = vec4(finalColor, smoothstep(0.4, 0.05, ll) * vAlpha * alphaMultiplier);
                }
            `}
          />
        </points>

        <lineSegments ref={edgesRef}>
          <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[positions, 3]} />
              <bufferAttribute attach="index" args={[edgeIndices, 1]} />
          </bufferGeometry>
          <shaderMaterial
              transparent
              depthWrite={false}
              blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
              uniforms={{ 
                  hitPoint: { value: new THREE.Vector3(999,999,999) },
                  isDark: { value: 1.0 }
              }}
              vertexShader={`
                  uniform vec3 hitPoint;
                  uniform float isDark;
                  varying float vAlpha;
                  void main() {
                      float dist = distance(position, hitPoint);
                      float baseAlpha = isDark < 0.5 ? 0.35 : 0.25;
                      vAlpha = baseAlpha + (1.0 - smoothstep(0.0, 1.5, dist)) * 0.45; 
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
              `}
              fragmentShader={`
                  varying float vAlpha;
                  uniform float isDark;
                  void main() { 
                      if (isDark < 0.5) {
                          gl_FragColor = vec4(0.0, 0.49, 0.64, vAlpha * 1.5); 
                      } else {
                          gl_FragColor = vec4(0.0, 0.83, 1.0, vAlpha); 
                      }
                  }
              `}
          />
        </lineSegments>

        {synapses.current.map((s, i) => (
            <mesh key={i} visible={false} ref={(el) => { if(el) s.meshRef = el }}>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial color={0xff6b35} transparent depthWrite={false} blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending} />
            </mesh>
        ))}
      </group>

      <points ref={particlesRef}>
          <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pPos, 3]} />
              <bufferAttribute attach="attributes-size" args={[pSizes, 1]} />
          </bufferGeometry>
          <shaderMaterial 
            transparent
            depthWrite={false}
            blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
            uniforms={{ 
                time: { value: 0 },
                isDark: { value: 1.0 }
            }}
            vertexShader={`
                attribute float size;
                uniform float time;
                uniform float isDark;
                varying float vAlpha;
                void main() {
                    vec3 pos = position;
                    pos.x += sin(time * 0.15 + position.y) * 0.5;
                    pos.y += cos(time * 0.1 + position.x) * 0.5;
                    pos.z += sin(time * 0.2 + position.z) * 0.3;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (6.0 / -mvPosition.z);
                    vAlpha = smoothstep(-15.0, -10.0, mvPosition.z) * smoothstep(0.0, -2.0, mvPosition.z) * (isDark < 0.5 ? 0.75 : 0.4);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `}
            fragmentShader={`
                varying float vAlpha;
                uniform float isDark;
                void main() {
                    vec2 xy = gl_PointCoord.xy - vec2(0.5);
                    if(length(xy) > 0.5) discard;
                    if (isDark < 0.5) {
                        gl_FragColor = vec4(0.0, 0.49, 0.64, vAlpha); 
                    } else {
                        gl_FragColor = vec4(0.1, 0.18, 0.25, vAlpha); 
                    }
                }
            `}
          />
      </points>
    </>
  );
}
