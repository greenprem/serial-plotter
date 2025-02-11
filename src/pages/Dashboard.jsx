import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  CompassOutlined, 
  DashboardOutlined, 
  ThunderboltOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Custom Gauge Component (reused from Environment.jsx)
const GaugeChart = ({ value, min, max, unit, colors, theme }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const data = [
        { name: 'value', value: percentage },
        { name: 'empty', value: 100 - percentage }
    ];

    return (
        <ResponsiveContainer width="100%" height={150}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={0}
                    dataKey="value"
                >
                    <Cell fill={colors[Math.floor((percentage / 100) * (colors.length - 1))]} />
                    <Cell fill="#f0f0f0" />
                </Pie>
                <text
                    x="50%"
                    y="90%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '20px', fill: theme?.text || '#000' }}
                >
                    {value}{unit}
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};

// AQI Helper Functions
const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00';
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#99004c';
    return '#7e0023';
};

const getAQIStatus = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
};

function Dashboard({ sensorData, isDarkMode, theme }) {
  const cardStyle = {
    background: theme?.componentBackground || '#fff',
    color: theme?.text || '#000',
    border: `1px solid ${theme?.borderColor || '#f0f0f0'}`,
    height: '100%'
  };

  return (
    <div>
      <h1 style={{ color: theme?.text }}>System Overview</h1>
      <Row gutter={[16, 16]}>
        {/* GPS Section */}
        <Col xs={24} md={12}>
          <Card 
            title={<span style={{ color: theme?.text }}><CompassOutlined /> GPS Location</span>}
            style={cardStyle}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Latitude</span>}
                  value={sensorData.gps.latitude.toFixed(6)}
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Longitude</span>}
                  value={sensorData.gps.longitude.toFixed(6)}
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Motion Section */}
        <Col xs={24} md={12}>
          <Card 
            title={<span style={{ color: theme?.text }}><DashboardOutlined /> Motion Data</span>}
            style={cardStyle}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Accel X</span>}
                  value={sensorData.accelerometer.x.toFixed(2)}
                  suffix="m/s²"
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Accel Y</span>}
                  value={sensorData.accelerometer.y.toFixed(2)}
                  suffix="m/s²"
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Accel Z</span>}
                  value={sensorData.accelerometer.z.toFixed(2)}
                  suffix="m/s²"
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Gyro X</span>}
                  value={sensorData.gyro.x.toFixed(2)}
                  suffix="°/s"
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Gyro Y</span>}
                  value={sensorData.gyro.y.toFixed(2)}
                  suffix="°/s"
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title={<span style={{ color: theme?.textSecondary }}>Gyro Z</span>}
                  value={sensorData.gyro.z.toFixed(2)}
                  suffix="°/s"
                  valueStyle={{ color: theme?.text }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Environmental Data */}
        <Col xs={24}>
          <Card 
            title={<span style={{ color: theme?.text }}><EnvironmentOutlined /> Environmental Conditions</span>}
            style={cardStyle}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                  <Statistic
                    title={<span style={{ color: theme?.textSecondary }}>Temperature</span>}
                    value={sensorData.environment.temperature}
                    suffix="°C"
                    valueStyle={{ color: theme?.text }}
                  />
                  <GaugeChart
                    value={sensorData.environment.temperature}
                    min={-10}
                    max={50}
                    unit="°C"
                    colors={['#87CEEB', '#FF4500']}
                    theme={theme}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                  <Statistic
                    title={<span style={{ color: theme?.textSecondary }}>Humidity</span>}
                    value={sensorData.environment.humidity}
                    suffix="%"
                    valueStyle={{ color: theme?.text }}
                  />
                  <GaugeChart
                    value={sensorData.environment.humidity}
                    min={0}
                    max={100}
                    unit="%"
                    colors={['#87CEEB', '#4169E1']}
                    theme={theme}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                  <Statistic
                    title={<span style={{ color: theme?.textSecondary }}>Pressure</span>}
                    value={sensorData.environment.pressure}
                    suffix="hPa"
                    valueStyle={{ color: theme?.text }}
                  />
                  <GaugeChart
                    value={sensorData.environment.pressure}
                    min={900}
                    max={1100}
                    unit="hPa"
                    colors={['#90EE90', '#32CD32']}
                    theme={theme}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card style={cardStyle}>
                  <Statistic
                    title={<span style={{ color: theme?.textSecondary }}>Air Quality Index</span>}
                    value={sensorData.environment.aqi}
                    valueStyle={{ color: getAQIColor(sensorData.environment.aqi) }}
                  />
                  <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <h3 style={{ color: getAQIColor(sensorData.environment.aqi) }}>
                      {getAQIStatus(sensorData.environment.aqi)}
                    </h3>
                  </div>
                  <GaugeChart
                    value={sensorData.environment.aqi}
                    min={0}
                    max={500}
                    unit=""
                    colors={['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#99004c', '#7e0023']}
                    theme={theme}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;