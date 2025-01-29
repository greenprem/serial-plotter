import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card, Row, Col } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Vector3D({ position, rotation, color }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 2, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.2, 0.5, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function AccelerometerVisualization({ data }) {
  // Convert accelerometer values to rotation angles
  const xAngle = Math.atan2(data.x, Math.sqrt(data.y * data.y + data.z * data.z));
  const yAngle = Math.atan2(data.y, Math.sqrt(data.x * data.x + data.z * data.z));
  const zAngle = Math.atan2(Math.sqrt(data.x * data.x + data.y * data.y), data.z);

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* X axis - Red */}
      <Vector3D 
        position={[0, 0, 0]} 
        rotation={[0, 0, -xAngle]} 
        color="red" 
      />
      
      {/* Y axis - Green */}
      <Vector3D 
        position={[0, 0, 0]} 
        rotation={[0, yAngle, 0]} 
        color="green" 
      />
      
      {/* Z axis - Blue */}
      <Vector3D 
        position={[0, 0, 0]} 
        rotation={[zAngle, 0, 0]} 
        color="blue" 
      />

      {/* Coordinate system grid */}
      <gridHelper args={[10, 10]} />
      <axesHelper args={[5]} />
    </Canvas>
  );
}

function AccelerometerHistory({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="x" stroke="#ff0000" name="X-axis" />
      <Line type="monotone" dataKey="y" stroke="#00ff00" name="Y-axis" />
      <Line type="monotone" dataKey="z" stroke="#0000ff" name="Z-axis" />
    </LineChart>
  );
}

function Accelerometer({ sensorData }) {
  const historyRef = useRef([]);
  
  // Update history with new data
  const currentTime = new Date().toLocaleTimeString();
  historyRef.current = [
    ...historyRef.current.slice(-50),
    {
      timestamp: currentTime,
      x: sensorData.accelerometer.x,
      y: sensorData.accelerometer.y,
      z: sensorData.accelerometer.z
    }
  ];

  return (
    <div>
      <h1>Accelerometer Data</h1>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Current Values" className="custom-card">
            <p>X-axis: {sensorData.accelerometer.x.toFixed(2)} m/s²</p>
            <p>Y-axis: {sensorData.accelerometer.y.toFixed(2)} m/s²</p>
            <p>Z-axis: {sensorData.accelerometer.z.toFixed(2)} m/s²</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="3D Visualization" className="custom-card" style={{ height: '400px' }}>
            <AccelerometerVisualization data={sensorData.accelerometer} />
          </Card>
        </Col>
        <Col span={24}>
          <Card title="History" className="custom-card">
            <AccelerometerHistory data={historyRef.current} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Accelerometer;