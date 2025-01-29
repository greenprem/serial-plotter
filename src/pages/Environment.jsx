import React, { useRef } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import {
    AreaChartOutlined,
    DashboardOutlined,
    CloudOutlined,
    AlertOutlined
} from '@ant-design/icons';

// Custom Gauge Component
const GaugeChart = ({ value, min, max, unit, colors }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const data = [
        { name: 'value', value: percentage },
        { name: 'empty', value: 100 - percentage }
    ];

    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
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
                    style={{ fontSize: '24px', fontWeight: 'bold' }}
                >
                    {value}{unit}
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};

// AQI Color Scale
const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#00e400'; // Good
    if (aqi <= 100) return '#ffff00'; // Moderate
    if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000'; // Unhealthy
    if (aqi <= 300) return '#99004c'; // Very Unhealthy
    return '#7e0023'; // Hazardous
};

const getAQIStatus = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
};

function Environment({ sensorData }) {
    const historyRef = useRef([]);
    
    // Update history with new data
    const currentTime = new Date().toLocaleTimeString();
    historyRef.current = [
        ...historyRef.current.slice(-30),
        {
            timestamp: currentTime,
            temperature: sensorData.environment.temperature,
            humidity: sensorData.environment.humidity,
            pressure: sensorData.environment.pressure,
            aqi: sensorData.environment.aqi
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '24px' }}>Environmental Monitoring</h1>
            
            {/* Current Readings Section */}
            <Row gutter={[16, 16]}>
                {/* Temperature Card */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Temperature"
                            value={sensorData.environment.temperature}
                            suffix="°C"
                            prefix={<AreaChartOutlined />}
                        />
                        <GaugeChart
                            value={sensorData.environment.temperature}
                            min={-10}
                            max={50}
                            unit="°C"
                            colors={['#87CEEB', '#FF4500']}
                        />
                    </Card>
                </Col>

                {/* Humidity Card */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Humidity"
                            value={sensorData.environment.humidity}
                            suffix="%"
                            prefix={<CloudOutlined />}
                        />
                        <GaugeChart
                            value={sensorData.environment.humidity}
                            min={0}
                            max={100}
                            unit="%"
                            colors={['#87CEEB', '#4169E1']}
                        />
                    </Card>
                </Col>

                {/* Pressure Card */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pressure"
                            value={sensorData.environment.pressure}
                            suffix="hPa"
                            prefix={<DashboardOutlined />}
                        />
                        <GaugeChart
                            value={sensorData.environment.pressure}
                            min={900}
                            max={1100}
                            unit="hPa"
                            colors={['#90EE90', '#32CD32']}
                        />
                    </Card>
                </Col>

                {/* AQI Card */}
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Air Quality Index"
                            value={sensorData.environment.aqi}
                            prefix={<AlertOutlined />}
                            valueStyle={{ color: getAQIColor(sensorData.environment.aqi) }}
                        />
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <h3 style={{ 
                                color: getAQIColor(sensorData.environment.aqi),
                                margin: '10px 0'
                            }}>
                                {getAQIStatus(sensorData.environment.aqi)}
                            </h3>
                        </div>
                        <GaugeChart
                            value={sensorData.environment.aqi}
                            min={0}
                            max={500}
                            unit=""
                            colors={['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#99004c', '#7e0023']}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Historical Data Section */}
            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                {/* Temperature & Humidity Chart */}
                <Col xs={24} lg={12}>
                    <Card title="Temperature & Humidity History">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={historyRef.current}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis yAxisId="temp" domain={[-10, 50]} />
                                <YAxis yAxisId="humidity" orientation="right" domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="temp"
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="#FF4500"
                                    name="Temperature (°C)"
                                />
                                <Line
                                    yAxisId="humidity"
                                    type="monotone"
                                    dataKey="humidity"
                                    stroke="#4169E1"
                                    name="Humidity (%)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Pressure & AQI Chart */}
                <Col xs={24} lg={12}>
                    <Card title="Pressure & Air Quality History">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={historyRef.current}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="timestamp" />
                                <YAxis yAxisId="pressure" domain={[900, 1100]} />
                                <YAxis yAxisId="aqi" orientation="right" domain={[0, 500]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="pressure"
                                    type="monotone"
                                    dataKey="pressure"
                                    stroke="#32CD32"
                                    name="Pressure (hPa)"
                                />
                                <Line
                                    yAxisId="aqi"
                                    type="monotone"
                                    dataKey="aqi"
                                    stroke="#ff7e00"
                                    name="AQI"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Environment;