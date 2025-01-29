import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

function Dashboard({ sensorData }) {
  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="GPS" className="custom-card">
            <Statistic className="dashboard-statistic" title="Latitude" value={sensorData.gps.latitude} />
            <Statistic className="dashboard-statistic" title="Longitude" value={sensorData.gps.longitude} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Accelerometer" className="custom-card">
            <Statistic className="dashboard-statistic" title="X" value={sensorData.accelerometer.x} />
            <Statistic className="dashboard-statistic" title="Y" value={sensorData.accelerometer.y} />
            <Statistic className="dashboard-statistic" title="Z" value={sensorData.accelerometer.z} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Environment" className="custom-card">
            <Statistic className="dashboard-statistic" title="Temperature" value={sensorData.environment.temperature} suffix="°C" />
            <Statistic className="dashboard-statistic" title="Humidity" value={sensorData.environment.humidity} suffix="%" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;