import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Switch } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GpsMap from './pages/GpsMap';
import Accelerometer from './pages/Accelerometer';
import Environment from './pages/Environment';

const { Header, Sider, Content } = Layout;

// Add theme constants
const themes = {
  dark: {
    background: '#001529', // Bluish dark background
    componentBackground: '#162639', // Slightly lighter bluish dark for cards
    text: '#ffffff',
    textSecondary: '#a6a6a6',
    borderColor: '#303030',
  },
  light: {
    background: '#ffffff',
    componentBackground: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    borderColor: '#f0f0f0',
  }
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [port, setPort] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reader, setReader] = useState(null);

  const currentTheme = isDarkMode ? themes.dark : themes.light;

  const [sensorData, setSensorData] = useState({
    gps: { latitude: 0, longitude: 0 },
    accelerometer: { x: 0, y: 0, z: 0 },
    gyro: { x: 0, y: 0, z: 0 },
    environment: {
      temperature: 0,
      humidity: 0,
      pressure: 0,
      aqi: 0
    }
  });

  const connectToPort = async () => {
    try {
      if (!navigator.serial) {
        message.error('Web Serial API not supported in this browser');
        return;
      }

      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      
      setPort(selectedPort);
      setIsConnected(true);
      message.success('Connected successfully');

      startReading(selectedPort);
    } catch (error) {
      message.error('Failed to connect: ' + error.message);
    }
  };

  const processCompleteMessage = (completeMessage) => {
    try {
      // Remove 'start' and 'end' markers
      const dataString = completeMessage.replace('start', '').replace('end', '');
      const values = dataString.trim().split(',');
      
      if (values.length === 12) {
        setSensorData({
          gps: { 
            latitude: parseFloat(values[0]), 
            longitude: parseFloat(values[1])
          },
          accelerometer: {
            x: parseFloat(values[2]),
            y: parseFloat(values[3]),
            z: parseFloat(values[4])
          },
          gyro: {
            x: parseFloat(values[5]),
            y: parseFloat(values[6]),
            z: parseFloat(values[7])
          },
          environment: {
            temperature: parseFloat(values[8]),
            humidity: parseFloat(values[9]),
            pressure: parseFloat(values[10]),
            aqi: parseFloat(values[11])
          }
        });
      }
    } catch (error) {
      console.error('Error processing complete message:', error);
    }
  };

  const startReading = async (selectedPort) => {
    while (selectedPort.readable) {
      try {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = selectedPort.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        setReader(reader);

        let buffer = '';
        let isCollectingMessage = false;
        
        while (true) {
          const { value, done } = await reader.read();
          
          if (done) {
            reader.releaseLock();
            break;
          }

          // Add new data to buffer
          buffer += value;
          
          // Process complete messages from buffer
          while (true) {
            if (!isCollectingMessage) {
              const startIndex = buffer.indexOf('start');
              if (startIndex === -1) {
                // No start marker found, clear buffer and wait for next data
                buffer = '';
                break;
              }
              // Found start marker, remove everything before it
              buffer = buffer.slice(startIndex);
              isCollectingMessage = true;
            }

            const endIndex = buffer.indexOf('end');
            if (endIndex === -1) {
              // No end marker found yet, wait for more data
              break;
            }

            // We have a complete message
            const completeMessage = buffer.slice(0, endIndex + 3); // Include 'end'
            //message.success(completeMessage);
            processCompleteMessage(completeMessage);

            // Remove processed message from buffer
            buffer = buffer.slice(endIndex + 3);
            isCollectingMessage = false;
          }
        }
      } catch (error) {
        console.error('Error reading data:', error);
        // Add a small delay before retrying to prevent tight loop on error
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const handleDisconnect = async () => {
    if (reader) {
      await reader.cancel();
      reader.releaseLock();
      message.success('Reader cancelled');
    }
    if (port) {
      await port.close();
      message.success('Port closed');
    }
    setPort(null);
    setReader(null);
    setIsConnected(false);
    message.success('Disconnected');
  };

  const headerStyles = {
    padding: '0 16px',
    background: currentTheme.componentBackground,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: currentTheme.text,
    borderBottom: `1px solid ${currentTheme.borderColor}`,
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', background: currentTheme.background }}>
        <Header style={headerStyles}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button 
              type="primary"
              onClick={isConnected ? handleDisconnect : connectToPort}
            >
              {isConnected ? 'Disconnect' : 'Connect to Serial Port'}
            </Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Switch
              checked={isDarkMode}
              onChange={setIsDarkMode}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </div>
        </Header>
        
        <Layout>
          <Sider width={200} style={{ background: currentTheme.componentBackground }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['dashboard']}
              theme={isDarkMode ? 'dark' : 'light'}
              style={{ background: currentTheme.componentBackground }}
            >
              <Menu.Item key="dashboard">
                <Link to="/">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="gps">
                <Link to="/gps">GPS Map</Link>
              </Menu.Item>
              <Menu.Item key="accelerometer">
                <Link to="/accelerometer">Accelerometer</Link>
              </Menu.Item>
              <Menu.Item key="environment">
                <Link to="/environment">Environment</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          
          <Content style={{ 
            padding: '24px', 
            minHeight: 280,
            background: currentTheme.background,
            color: currentTheme.text 
          }}>
            <Routes>
              <Route path="/" element={<Dashboard sensorData={sensorData} isDarkMode={isDarkMode} theme={currentTheme} />} />
              <Route path="/gps" element={<GpsMap sensorData={sensorData} isDarkMode={isDarkMode} theme={currentTheme} />} />
              <Route path="/accelerometer" element={<Accelerometer sensorData={sensorData} isDarkMode={isDarkMode} theme={currentTheme} />} />
              <Route path="/environment" element={<Environment sensorData={sensorData} isDarkMode={isDarkMode} theme={currentTheme} />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;