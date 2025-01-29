import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

function Dashboard({ sensorData }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="GPS">
            <Statistic title="Latitude" value={sensorData.gps.latitude} />
            <Statistic title="Longitude" value={sensorData.gps.longitude} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Accelerometer">
            <Statistic title="X" value={sensorData.accelerometer.x} />
            <Statistic title="Y" value={sensorData.accelerometer.y} />
            <Statistic title="Z" value={sensorData.accelerometer.z} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Environment">
            <Statistic title="Temperature" value={sensorData.environment.temperature} suffix="°C" />
            <Statistic title="Humidity" value={sensorData.environment.humidity} suffix="%" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;