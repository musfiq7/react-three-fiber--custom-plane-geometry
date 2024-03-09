import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { BufferAttribute } from "three";
import './App.css';

const vertexShader =`
uniform float uTime;
uniform float uRadius;
varying vec2 vUv;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js

//rotate along with y-axis
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}
//rotate along with z-axis
mat3 rotation3dZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, -s, 0.0,
    s, c,  0.0,
    0.0, 0.0, 1.0
  );
}

//rotate along with x-axis
mat3 rotation3dX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}



//translate along with x-axis
mat3 translation3dX(float distance) {
  return mat3(
    1.0, 0.0, distance,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
  );
}


//translate along with y-axis
mat3 translation3dY(float distance) {
  return mat3(
    1.0, 0.0, 0.0,
    0.0, 1.0, distance,
    0.0, 0.0, 1.0
  );
}
//translate along with z-axis
mat3 translation3dZ(float distance) {
  return mat3(
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, distance, 1.0
  );
}




void main() {
  vUv = uv;
  // float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
   //vec3 particlePosition = position  * rotation3dY(uTime * 0.3);
   //vec3 particlePosition = position + uTime *0.3;
   //vec3 particlePosition = position  * translation3dX(uTime * 0.3);
   //vec3 particlePosition = position  * translation3dY(uTime * 0.3);
   //vec3 particlePosition = position  * translation3dZ(uTime * 0.3);
   //vec3 particlePosition = position  * rotation3dZ(uTime * 0.3);
   //vec3 particlePosition = position  * rotation3dX(uTime * 0.3);

  //vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  modelPosition.y += sin(modelPosition.x * 4.0 + uTime * 2.0) * 0.2;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
   gl_PointSize = 5.0;
}


`;
const fragmentShader =`
uniform float myParam;
varying vec2 vUv;
uniform float uTime;
vec3 colorA = vec3(0.008,0.895,0.940);
vec3 colorB = vec3(0.129,0.299,1.000);

void main() {
  vec4 pixel = gl_FragCoord;
  vec2 normalizedPixel = gl_FragCoord.xy/500.0;
  vec3 color = mix(colorA, colorB, normalizedPixel.x);

  gl_FragColor = vec4(sin(pixel.x *0.02 + myParam ),sin(pixel.y *0.02 + myParam ),sin(pixel.z *0.02 + myParam ),1.0);
  //gl_FragColor = vec4(0.34, 0.53, 0.96, 1.0);
  //gl_FragColor = vec4(sin(vUv.x + uTime * 0.2) ,cos(vUv.y + uTime * 0.2), tan(vUv.y + uTime  ), 1.0);
  //gl_FragColor = vec4(vUv,0.5,1.0);
}


`;

// const positions = new Float32Array([
//   1, 0, 0,
//   0, 1, 0,
//   -1, 0, 0,
//   0, -1, 0
// ])
const positions = new Float32Array([
1,0,0,
0,1,0,
-1,0,0,
0,-1,0, 

])

// const normals = new Float32Array([
//   0, 0, 1,
//   0, 0, 1,
//   0, 0, 1,
//   0, 0, 1,
// ])
const normals = new Float32Array([
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
])

const colors = new Float32Array([
  0, 1, 1, 1,
  1, 0, 1, 1,
  1, 1, 0, 1,
  1, 1, 1, 1,
])

// const indices = new Uint16Array([
//   0, 1, 3,
//   2, 3, 1,

// ])
const indices = new Uint16Array([
  0, 1, 3,
  2, 3, 1,
   
])



const CustomGeometryParticles = ({ count = 10000}) => {
  //const { count } = props;
  const radius = 2;

  

  const ref = useRef();

  const points_data = useMemo(() => {
    //const p = new Array(count).fill(0).map((v) => (0.5 - Math.random()) * 20);
    const p = new Array(count).fill(0).map((v) => (0.5 - Math.random()) * 3);
    return new BufferAttribute(new Float32Array(p), 3);
    
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    uRadius: {
      value: radius
    },
    myParam : { value:1.0}
  }), [])

  useFrame((state) => {
    const { clock } = state;

    // points.current.material.uniforms.uTime.value = clock.elapsedTime;
    // ref.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh>
    <bufferGeometry>
        <bufferAttribute
            attach='attributes-position'
            array={positions}
            count={positions.length / 3}
            itemSize={3}
        />
        <bufferAttribute
            attach='attributes-color'
            array={colors}
            count={colors.length / 3}
            itemSize={3}
        />
        <bufferAttribute
            attach='attributes-normal'
            array={normals}
            count={normals.length / 3}
            itemSize={3}
        />
        <bufferAttribute
            attach="index"
            array={indices}
            count={indices.length}
            itemSize={1}
        />
    </bufferGeometry>
    <meshStandardMaterial
         vertexColors
        side={THREE.DoubleSide}
    />
</mesh>

  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0,5], fov:55 }}>
      <ambientLight intensity={0.5} />
      {/* <CustomGeometryParticles count={4000} /> */}
      <CustomGeometryParticles count={10000} />
      <OrbitControls />
    </Canvas>
  );
};


export default Scene;
