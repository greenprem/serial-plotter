export async function listSerialPorts() {
    if (!navigator.serial) {
      throw new Error('Web Serial API not supported in this browser');
    }
  
    try {
      // Request port access
      const port = await navigator.serial.requestPort();
      return [port];
    } catch (error) {
      console.error('Error listing serial ports:', error);
      return [];
    }
  }
  
  export async function createSerialConnection(port) {
    try {
      await port.open({ baudRate: 9600 });
      return port;
    } catch (error) {
      console.error('Error opening serial port:', error);
      throw error;
    }
  }