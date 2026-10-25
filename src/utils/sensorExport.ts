import { SensorData, RobotState } from '../data/mockData';
import { ExtendedHistoryPoint } from '../components/views/SensorsView';

export interface ExportDataOptions {
  fileNamePrefix?: string;
  history: ExtendedHistoryPoint[];
  sensor: SensorData;
  robot: RobotState;
}

/**
 * Generates and downloads a styled Microsoft Excel XML Spreadsheet (.xls)
 * Compatible with MS Excel, Office 365, Google Sheets, LibreOffice, and Numbers.
 */
export function exportSensorsToExcel({
  fileNamePrefix = 'FireBot_Sensor_Telemetry',
  history,
  sensor,
  robot,
}: ExportDataOptions) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const nowFormatted = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  // Calculate summary metrics
  const temps = history.map(h => h.temperature);
  const hums = history.map(h => h.humidity);
  const gases = history.map(h => h.gas);
  const dists = history.map(h => h.distance);

  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : sensor.temperature.toFixed(1);
  const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : sensor.temperature.toFixed(1);
  const minTemp = temps.length ? Math.min(...temps).toFixed(1) : sensor.temperature.toFixed(1);

  const avgHum = hums.length ? Math.round(hums.reduce((a, b) => a + b, 0) / hums.length) : sensor.humidity;
  const avgGas = gases.length ? Math.round(gases.reduce((a, b) => a + b, 0) / gases.length) : sensor.gas;
  const maxGas = gases.length ? Math.max(...gases) : sensor.gas;

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>FireBot Sensor Telemetry Report</Title>
  <Subject>Autonomous Firefighting Robot Environmental Telemetry</Subject>
  <Author>FireBot Autonomous Control Center</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Segoe UI" ss:Size="16" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#64748B"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="HeaderRow">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2563EB" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#1D4ED8"/>
   </Borders>
  </Style>
  <Style ss:ID="HeaderSecondary">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0D9488" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="DataCell">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#334155"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCellNumber">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#334155"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0.0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCellInteger">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#334155"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="AlertDanger">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#991B1B"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FECACA"/>
   </Borders>
  </Style>
  <Style ss:ID="AlertSafe">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#065F46"/>
   <Interior ss:Color="#D1FAE5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#A7F3D0"/>
   </Borders>
  </Style>
  <Style ss:ID="AlertWarning">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#92400E"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#FDE68A"/>
   </Borders>
  </Style>
  <Style ss:ID="KpiLabel">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#475569"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="KpiValue">
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>

 <!-- WORKSHEET 1: TIME SERIES TELEMETRY DATA -->
 <Worksheet ss:Name="Sensor Telemetry Records">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="60"/>
   <Column ss:Width="110"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="130"/>
   <Column ss:Width="130"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="110"/>

   <!-- Title Row -->
   <Row ss:Height="30">
    <Cell ss:MergeAcross="8" ss:StyleID="Title">
     <Data ss:Type="String">FIREBOT AUTONOMOUS ROBOT - ENVIRONMENTAL SENSOR LOGS</Data>
    </Cell>
   </Row>

   <!-- Metadata Row -->
   <Row ss:Height="18">
    <Cell ss:MergeAcross="8" ss:StyleID="SubTitle">
     <Data ss:Type="String">Generated: ${nowFormatted} | Robot Status: ${robot.battery}% LiFePO4 Battery | Mode: Autonomous Navigation | Channel: ThingSpeak #2768924</Data>
    </Cell>
   </Row>
   <Row ss:Height="10"/>

   <!-- Table Header Row -->
   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Index</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Timestamp</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Temperature (°C)</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Humidity (%)</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Gas (MQ-2 ppm)</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Distance (HC-SR04 cm)</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">IR Flame Detected</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Battery (%)</Data></Cell>
    <Cell ss:StyleID="HeaderRow"><Data ss:Type="String">Hazard Status</Data></Cell>
   </Row>

   <!-- Data Rows -->
   ${history
     .map((p, i) => {
       const isFlame = p.flame > 0.5;
       const isGasAlert = p.gas > 300;
       const isTempAlert = p.temperature > 50;
       const isDistWarning = p.distance < 30;

       let statusText = 'NORMAL';
       let statusStyle = 'AlertSafe';

       if (isFlame) {
         statusText = 'FIRE DETECTED';
         statusStyle = 'AlertDanger';
       } else if (isGasAlert || isTempAlert) {
         statusText = isGasAlert ? 'GAS HAZARD' : 'OVERHEAT';
         statusStyle = 'AlertDanger';
       } else if (isDistWarning) {
         statusText = 'OBSTACLE NEAR';
         statusStyle = 'AlertWarning';
       }

       return `
   <Row ss:Height="19">
    <Cell ss:StyleID="DataCell"><Data ss:Type="Number">${i + 1}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(p.time)}</Data></Cell>
    <Cell ss:StyleID="DataCellNumber"><Data ss:Type="Number">${p.temperature}</Data></Cell>
    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">${p.humidity}</Data></Cell>
    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">${p.gas}</Data></Cell>
    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">${p.distance}</Data></Cell>
    <Cell ss:StyleID="${isFlame ? 'AlertDanger' : 'DataCell'}"><Data ss:Type="String">${isFlame ? 'YES - FLAME' : 'NO'}</Data></Cell>
    <Cell ss:StyleID="DataCellInteger"><Data ss:Type="Number">${p.battery ?? robot.battery}</Data></Cell>
    <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${statusText}</Data></Cell>
   </Row>`;
     })
     .join('')}
  </Table>
 </Worksheet>

 <!-- WORKSHEET 2: SENSOR SUMMARY & KPI METRICS -->
 <Worksheet ss:Name="Sensor Summary & Array">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="200"/>
   <Column ss:Width="110"/>
   <Column ss:Width="80"/>
   <Column ss:Width="120"/>
   <Column ss:Width="130"/>
   <Column ss:Width="180"/>

   <Row ss:Height="28">
    <Cell ss:MergeAcross="5" ss:StyleID="Title">
     <Data ss:Type="String">ONBOARD SENSOR ARRAY SUMMARY & CALIBRATION MATRIX</Data>
    </Cell>
   </Row>
   <Row ss:Height="10"/>

   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderSecondary"><Data ss:Type="String">Sensor Component</Data></Cell>
    <Cell ss:StyleID="HeaderSecondary"><Data ss:Type="String">Current Value</Data></Cell>
    <Cell ss:StyleID="HeaderSecondary"><Data ss:Type="String">Unit</Data></Cell>
    <Cell ss:StyleID="HeaderSecondary"><Data ss:Type="String">Health Status</Data></Cell>
    <Cell ss:StyleID="HeaderSecondary"><Data ss:Type="String">Safe Threshold</Data></Cell>
    <Cell ss:StyleID="HeaderSecondary"><Data ss:Type="String">Operational Assessment</Data></Cell>
   </Row>

   <Row ss:Height="20">
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">DHT11 / LM35 Temperature Sensor</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${sensor.temperature}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">°C</Data></Cell>
    <Cell ss:StyleID="${sensor.temperature > 40 ? 'AlertWarning' : 'AlertSafe'}"><Data ss:Type="String">${sensor.temperature > 40 ? 'ELEVATED' : 'NOMINAL'}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&lt; 50.0 °C</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Min: ${minTemp}°C | Avg: ${avgTemp}°C | Max: ${maxTemp}°C</Data></Cell>
   </Row>

   <Row ss:Height="20">
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">DHT11 Relative Humidity Sensor</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${sensor.humidity}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">%</Data></Cell>
    <Cell ss:StyleID="AlertSafe"><Data ss:Type="String">OPTIMAL</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">20% - 85%</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Average Humidity: ${avgHum}%</Data></Cell>
   </Row>

   <Row ss:Height="20">
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">MQ-2 Combustible Gas Sensor</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${sensor.gas}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">ppm</Data></Cell>
    <Cell ss:StyleID="${sensor.gas > 300 ? 'AlertDanger' : 'AlertSafe'}"><Data ss:Type="String">${sensor.gas > 300 ? 'HAZARD' : 'SAFE'}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&lt; 300 ppm</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Avg: ${avgGas} ppm | Peak: ${maxGas} ppm</Data></Cell>
   </Row>

   <Row ss:Height="20">
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">HC-SR04 Ultrasonic Distance Sensor</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${sensor.distance}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">cm</Data></Cell>
    <Cell ss:StyleID="${sensor.distance < 30 ? 'AlertWarning' : 'AlertSafe'}"><Data ss:Type="String">${sensor.distance < 30 ? 'OBSTACLE' : 'CLEAR'}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&gt; 30 cm</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Autonomous collision avoidance active</Data></Cell>
   </Row>

   <Row ss:Height="20">
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">IR Flame Detection Module (5-Way)</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="String">${sensor.irFlame ? 'DETECTED' : 'CLEAR'}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Binary</Data></Cell>
    <Cell ss:StyleID="${sensor.irFlame ? 'AlertDanger' : 'AlertSafe'}"><Data ss:Type="String">${sensor.irFlame ? 'FIRE ALARM' : 'NORMAL'}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Zero Flame State</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${sensor.irFlame ? 'Auto Water Cannon Triggered' : 'Continuous 360° IR scan'}</Data></Cell>
   </Row>

   <Row ss:Height="20">
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">LiFePO4 Power System</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">${robot.battery}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">%</Data></Cell>
    <Cell ss:StyleID="${robot.battery < 20 ? 'AlertWarning' : 'AlertSafe'}"><Data ss:Type="String">${robot.battery < 20 ? 'LOW BATTERY' : 'NOMINAL'}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&gt; 20%</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">12.4V pack voltage, approx 4.2h runtime</Data></Cell>
   </Row>

   <Row ss:Height="20">
    <Cell ss:StyleID="KpiLabel"><Data ss:Type="String">Water Cannon Reservoir Tank</Data></Cell>
    <Cell ss:StyleID="KpiValue"><Data ss:Type="Number">82</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">%</Data></Cell>
    <Cell ss:StyleID="AlertSafe"><Data ss:Type="String">READY</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">&gt; 25%</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">Submersible 12V high-pressure pump primed</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileNamePrefix}_${timestamp}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a clean UTF-8 CSV with BOM for universal spreadsheet compatibility.
 */
export function exportSensorsToCSV({
  fileNamePrefix = 'FireBot_Sensor_Telemetry',
  history,
  sensor,
  robot,
}: ExportDataOptions) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  const headers = [
    'Index',
    'Timestamp',
    'Temperature_C',
    'Humidity_Percent',
    'Combustible_Gas_MQ2_ppm',
    'Distance_HCSR04_cm',
    'Flame_Detected',
    'Battery_Percent',
    'Hazard_Alert_Level',
  ];

  const rows = history.map((p, idx) => {
    const isFlame = p.flame > 0.5;
    const isGasAlert = p.gas > 300;
    const isTempAlert = p.temperature > 50;

    let alertLevel = 'NORMAL';
    if (isFlame) alertLevel = 'FIRE_ALERT';
    else if (isGasAlert) alertLevel = 'GAS_HAZARD';
    else if (isTempAlert) alertLevel = 'TEMPERATURE_CRITICAL';
    else if (p.distance < 30) alertLevel = 'OBSTACLE_NEAR';

    return [
      idx + 1,
      `"${p.time}"`,
      p.temperature.toFixed(1),
      p.humidity,
      p.gas,
      p.distance,
      isFlame ? '1' : '0',
      p.battery ?? robot.battery,
      `"${alertLevel}"`,
    ].join(',');
  });

  // UTF-8 BOM (\uFEFF) ensures Excel opens special characters correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileNamePrefix}_${timestamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a valid standard binary PDF file (%PDF-1.4) directly in the browser and triggers download.
 */
export function exportSensorsToPDFFile({
  fileNamePrefix = 'FireBot_Sensor_Report',
  history,
  sensor,
  robot,
}: ExportDataOptions) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('en-US');

  // Summary calculations
  const temps = history.map(h => h.temperature);
  const hums = history.map(h => h.humidity);
  const gases = history.map(h => h.gas);
  const dists = history.map(h => h.distance);

  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : sensor.temperature.toFixed(1);
  const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : sensor.temperature.toFixed(1);
  const minTemp = temps.length ? Math.min(...temps).toFixed(1) : sensor.temperature.toFixed(1);
  const avgHum = hums.length ? Math.round(hums.reduce((a, b) => a + b, 0) / hums.length) : sensor.humidity;
  const avgGas = gases.length ? Math.round(gases.reduce((a, b) => a + b, 0) / gases.length) : sensor.gas;
  const maxGas = gases.length ? Math.max(...gases) : sensor.gas;

  // Build PDF stream
  const lines: string[] = [];
  lines.push('%PDF-1.4');
  lines.push('%âãÏÓ');

  // We will construct objects
  let objCount = 0;
  const offsets: number[] = [];

  function addObj(content: string) {
    objCount++;
    offsets.push(lines.join('\n').length + 1);
    lines.push(`${objCount} 0 obj`);
    lines.push(content);
    lines.push('endobj');
    return objCount;
  }

  // Generate stream commands for visual report
  let stream = '';

  // Background Header Banner (Dark Navy / Blue gradient-like box)
  stream += 'q\n';
  stream += '0.07 0.15 0.32 rg\n'; // Navy background
  stream += '0 750 595.28 92 re f\n';

  // Accent line
  stream += '0.14 0.54 0.98 rg\n'; // Bright blue
  stream += '0 746 595.28 4 re f\n';

  // Header Title Text
  stream += 'BT\n';
  stream += '/F1 18 Tf\n';
  stream += '1 1 1 rg\n'; // White text
  stream += '40 802 Td (FIREBOT AUTONOMOUS EMERGENCY RESPONSE SYSTEM) Tj\n';
  stream += 'ET\n';

  // Subtitle
  stream += 'BT\n';
  stream += '/F2 10 Tf\n';
  stream += '0.75 0.85 1 rg\n';
  stream += '40 782 Td (Real-Time Sensor Telemetry & Environmental Diagnostics Report) Tj\n';
  stream += 'ET\n';

  // Date and Metadata on right
  stream += 'BT\n';
  stream += '/F2 9 Tf\n';
  stream += '0.75 0.85 1 rg\n';
  stream += `410 802 Td (Date: ${dateStr}) Tj\n`;
  stream += `410 788 Td (Time: ${timeStr}) Tj\n`;
  stream += `410 774 Td (Robot Battery: ${robot.battery}% | Online) Tj\n`;
  stream += 'ET\n';

  // Section 1: Executive KPI Summary Box
  stream += '0.94 0.96 0.99 rg\n'; // Light blue-grey background
  stream += '40 655 515 72 re f\n';
  stream += '0.80 0.86 0.94 RG\n'; // Border
  stream += '1 w 40 655 515 72 re S\n';

  // KPI Headers
  stream += 'BT\n';
  stream += '/F1 9 Tf 0.3 0.4 0.5 rg\n';
  stream += '55 708 Td (TEMPERATURE) Tj\n';
  stream += '130 0 Td (HUMIDITY) Tj\n';
  stream += '125 0 Td (COMBUSTIBLE GAS) Tj\n';
  stream += '125 0 Td (IR FLAME SENSOR) Tj\n';
  stream += 'ET\n';

  // KPI Values
  stream += 'BT\n';
  stream += '/F1 14 Tf 0.08 0.12 0.2 rg\n';
  stream += `55 688 Td (${sensor.temperature.toFixed(1)} C) Tj\n`;
  stream += `130 0 Td (${sensor.humidity} %) Tj\n`;
  stream += `125 0 Td (${sensor.gas} ppm) Tj\n`;
  stream += `125 0 Td (${sensor.irFlame ? 'FIRE DETECTED' : 'CLEAR (SAFE)'}) Tj\n`;
  stream += 'ET\n';

  // KPI Details / Min-Max
  stream += 'BT\n';
  stream += '/F2 8 Tf 0.4 0.5 0.6 rg\n';
  stream += `55 668 Td (Min: ${minTemp}C | Max: ${maxTemp}C) Tj\n`;
  stream += `130 0 Td (Avg: ${avgHum}%) Tj\n`;
  stream += `125 0 Td (Peak: ${maxGas} ppm) Tj\n`;
  stream += `125 0 Td (Status: ${sensor.irFlame ? 'ACTIVE ALARM' : 'Nominal Scan'}) Tj\n`;
  stream += 'ET\n';

  // Section 2: Table Title
  stream += 'BT\n';
  stream += '/F1 11 Tf 0.1 0.15 0.25 rg\n';
  stream += '40 635 Td (RECENT HIGH-FREQUENCY TELEMETRY LOGS) Tj\n';
  stream += 'ET\n';

  // Table Header Background
  stream += '0.14 0.38 0.78 rg\n'; // Blue table header
  stream += '40 610 515 18 re f\n';

  // Table Column Headers Text
  stream += 'BT\n';
  stream += '/F1 8 Tf 1 1 1 rg\n';
  stream += '45 616 Td (Time) Tj\n';
  stream += '60 0 Td (Temp (C)) Tj\n';
  stream += '70 0 Td (Humidity) Tj\n';
  stream += '70 0 Td (Gas (ppm)) Tj\n';
  stream += '75 0 Td (Distance) Tj\n';
  stream += '65 0 Td (Flame) Tj\n';
  stream += '60 0 Td (Battery) Tj\n';
  stream += '60 0 Td (Safety Status) Tj\n';
  stream += 'ET\n';

  // Table Data Rows (display last 22 points to fit perfectly on A4 page)
  const displayPoints = history.slice(-22);
  let yPos = 594;

  displayPoints.forEach((p, idx) => {
    // Alternating row background
    if (idx % 2 === 1) {
      stream += '0.96 0.97 0.99 rg\n';
      stream += `40 ${yPos - 3} 515 15 re f\n`;
    }

    // Border line below
    stream += '0.88 0.91 0.95 RG\n0.5 w\n';
    stream += `40 ${yPos - 3} m 555 ${yPos - 3} l S\n`;

    const isFlame = p.flame > 0.5;
    const isGasAlert = p.gas > 300;
    const isTempAlert = p.temperature > 50;

    let statusText = 'NORMAL';
    if (isFlame) statusText = 'FIRE ALERT';
    else if (isGasAlert) statusText = 'GAS HAZARD';
    else if (isTempAlert) statusText = 'OVERHEAT';
    else if (p.distance < 30) statusText = 'OBSTACLE';

    stream += 'BT\n';
    stream += '/F2 8 Tf\n';

    if (isFlame || isGasAlert || isTempAlert) {
      stream += '0.8 0.1 0.1 rg\n'; // Red for alert
    } else {
      stream += '0.2 0.25 0.3 rg\n';
    }

    stream += `45 ${yPos} Td (${escapePdfText(p.time)}) Tj\n`;
    stream += `60 0 Td (${p.temperature.toFixed(1)}) Tj\n`;
    stream += `70 0 Td (${p.humidity}%) Tj\n`;
    stream += `70 0 Td (${p.gas} ppm) Tj\n`;
    stream += `75 0 Td (${p.distance} cm) Tj\n`;
    stream += `65 0 Td (${isFlame ? 'DETECTED' : 'CLEAR'}) Tj\n`;
    stream += `60 0 Td (${p.battery ?? robot.battery}%) Tj\n`;
    stream += `60 0 Td (${statusText}) Tj\n`;
    stream += 'ET\n';

    yPos -= 16;
  });

  // Footer banner
  stream += '0.9 0.92 0.95 RG\n1 w\n';
  stream += '40 50 m 555 50 l S\n';

  stream += 'BT\n';
  stream += '/F2 8 Tf 0.5 0.55 0.6 rg\n';
  stream += '40 38 Td (FireBot Control Center - Telemetry Export System | ThingSpeak Channel #2768924 | Confidential) Tj\n';
  stream += '475 38 Td (Page 1 of 1) Tj\n';
  stream += 'ET\n';

  stream += 'Q\n';

  // Construct PDF Objects
  const contentObjId = 4;
  const pageObjId = 3;
  const pagesObjId = 2;
  const catalogObjId = 1;
  const fontBoldObjId = 5;
  const fontRegularObjId = 6;

  // 1: Catalog
  addObj(`<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`);

  // 2: Pages
  addObj(`<< /Type /Pages /Kids [${pageObjId} 0 R] /Count 1 >>`);

  // 3: Page (A4 is 595.28 x 841.89 points)
  addObj(
    `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 595.28 841.89] /Contents ${contentObjId} 0 R /Resources << /Font << /F1 ${fontBoldObjId} 0 R /F2 ${fontRegularObjId} 0 R >> >> >>`
  );

  // 4: Stream content
  addObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);

  // 5: Font Bold (Helvetica-Bold standard 14 font)
  addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);

  // 6: Font Regular (Helvetica standard 14 font)
  addObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);

  // xref table
  const startXref = lines.join('\n').length + 1;
  lines.push('xref');
  lines.push(`0 ${objCount + 1}`);
  lines.push('0000000000 65535 f ');
  for (let i = 0; i < offsets.length; i++) {
    lines.push(offsets[i].toString().padStart(10, '0') + ' 00000 n ');
  }

  // trailer
  lines.push('trailer');
  lines.push(`<< /Size ${objCount + 1} /Root ${catalogObjId} 0 R >>`);
  lines.push('startxref');
  lines.push(`${startXref}`);
  lines.push('%%EOF');

  const pdfBinary = lines.join('\n');
  const blob = new Blob([pdfBinary], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileNamePrefix}_${timestamp}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens a dedicated printable, high-resolution FireBot Report document
 * in a popup window with full color styles and automatically invokes the browser's
 * native Print dialog (allowing the user to "Save as PDF" or print with charts).
 */
export function openPrintablePdfReport({
  history,
  sensor,
  robot,
}: ExportDataOptions) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please allow popups to open the PDF Print Preview.');
    return;
  }

  const nowFormatted = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const temps = history.map(h => h.temperature);
  const hums = history.map(h => h.humidity);
  const gases = history.map(h => h.gas);
  const dists = history.map(h => h.distance);

  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : sensor.temperature.toFixed(1);
  const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : sensor.temperature.toFixed(1);
  const minTemp = temps.length ? Math.min(...temps).toFixed(1) : sensor.temperature.toFixed(1);
  const avgHum = hums.length ? Math.round(hums.reduce((a, b) => a + b, 0) / hums.length) : sensor.humidity;
  const avgGas = gases.length ? Math.round(gases.reduce((a, b) => a + b, 0) / gases.length) : sensor.gas;
  const maxGas = gases.length ? Math.max(...gases) : sensor.gas;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FireBot Sensor Telemetry Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 24px;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.4;
    }
    .header-banner {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: #ffffff;
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .header-title h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header-title p {
      margin: 4px 0 0 0;
      font-size: 11px;
      opacity: 0.9;
    }
    .header-meta {
      text-align: right;
      font-size: 11px;
      line-height: 1.5;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      background: #10b981;
      color: #ffffff;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 10px;
      padding: 12px 14px;
    }
    .kpi-title {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .kpi-val {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      font-family: monospace;
    }
    .kpi-sub {
      font-size: 10px;
      color: #64748b;
      margin-top: 4px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 11px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      text-align: left;
      padding: 8px 10px;
      border-bottom: 2px solid #cbd5e1;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
    }
    td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
    }
    .badge-danger {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fca5a5;
    }
    .badge-safe {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #6ee7b7;
    }
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }
    .print-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      padding: 12px;
      background: #f1f5f9;
      border-radius: 8px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #1e293b;
    }
    @media print {
      .print-actions {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="btn btn-secondary" onclick="window.close()">Close Window</button>
  </div>

  <div class="header-banner">
    <div class="header-title">
      <h1>FIREBOT AUTONOMOUS TELEMETRY REPORT</h1>
      <p>Indoor Navigation & Environmental Fire-Protection Robot System</p>
    </div>
    <div class="header-meta">
      <div><strong>Report Date:</strong> ${nowFormatted}</div>
      <div><strong>System Status:</strong> <span class="status-badge">ONLINE & OPERATIONAL</span></div>
      <div><strong>Battery:</strong> ${robot.battery}% LiFePO4 (12.4V)</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Ambient Temperature</div>
      <div class="kpi-val">${sensor.temperature.toFixed(1)}°C</div>
      <div class="kpi-sub">Min: ${minTemp}°C | Max: ${maxTemp}°C</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Relative Humidity</div>
      <div class="kpi-val">${sensor.humidity}%</div>
      <div class="kpi-sub">Mean: ${avgHum}% | Air Quality: Clean</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">MQ-2 Combustible Gas</div>
      <div class="kpi-val">${sensor.gas} <span style="font-size:12px">ppm</span></div>
      <div class="kpi-sub">Threshold: 300 ppm | Peak: ${maxGas} ppm</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">IR Flame Detector</div>
      <div class="kpi-val" style="color:${sensor.irFlame ? '#dc2626' : '#10b981'}">
        ${sensor.irFlame ? 'FIRE DETECTED' : 'CLEAR'}
      </div>
      <div class="kpi-sub">${sensor.irFlame ? 'Water Cannon Primed' : 'Normal Optical Scan'}</div>
    </div>
  </div>

  <div class="section-title">Telemetry Time-Series Observation Records</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Timestamp</th>
        <th>Temperature</th>
        <th>Humidity</th>
        <th>Combustible Gas</th>
        <th>Obstacle Dist</th>
        <th>IR Flame</th>
        <th>Battery</th>
        <th>Hazard State</th>
      </tr>
    </thead>
    <tbody>
      ${history
        .map((p, i) => {
          const isFlame = p.flame > 0.5;
          const isGasAlert = p.gas > 300;
          const isTempAlert = p.temperature > 50;
          let statusBadge = '<span class="badge badge-safe">NOMINAL</span>';
          if (isFlame) statusBadge = '<span class="badge badge-danger">FIRE DETECTED</span>';
          else if (isGasAlert) statusBadge = '<span class="badge badge-danger">GAS LEAK</span>';
          else if (isTempAlert) statusBadge = '<span class="badge badge-warning">HIGH TEMP</span>';
          else if (p.distance < 30) statusBadge = '<span class="badge badge-warning">OBSTACLE</span>';

          return `<tr>
            <td>${i + 1}</td>
            <td style="font-family:monospace;font-weight:600">${escapeXml(p.time)}</td>
            <td style="font-family:monospace">${p.temperature.toFixed(1)}°C</td>
            <td style="font-family:monospace">${p.humidity}%</td>
            <td style="font-family:monospace">${p.gas} ppm</td>
            <td style="font-family:monospace">${p.distance} cm</td>
            <td>${isFlame ? '<strong style="color:#dc2626">YES</strong>' : 'No'}</td>
            <td style="font-family:monospace">${p.battery ?? robot.battery}%</td>
            <td>${statusBadge}</td>
          </tr>`;
        })
        .join('')}
    </tbody>
  </table>

  <div class="section-title">Robot Subsystem Diagnostics & Calibration Matrix</div>
  <table>
    <thead>
      <tr>
        <th>Sensor / Actuator</th>
        <th>Channel / Port</th>
        <th>Current Readout</th>
        <th>Health Status</th>
        <th>Operational Limit</th>
        <th>Diagnostic Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>DHT11 Thermal Sensor</strong></td>
        <td>GPIO 4 / I2C</td>
        <td>${sensor.temperature.toFixed(1)}°C</td>
        <td><span class="badge badge-safe">OPTIMAL</span></td>
        <td>&lt; 50°C Safe Ceiling</td>
        <td>Calibrated offset 0.0°C; responsiveness nominal</td>
      </tr>
      <tr>
        <td><strong>MQ-2 Smoke/Gas Sensor</strong></td>
        <td>Analog A0 / ADC</td>
        <td>${sensor.gas} ppm</td>
        <td><span class="badge ${sensor.gas > 300 ? 'badge-danger' : 'badge-safe'}">${sensor.gas > 300 ? 'ELEVATED' : 'SAFE'}</span></td>
        <td>&lt; 300 ppm Warning</td>
        <td>Target sensitivity: LPG, Smoke, Methane, Butane</td>
      </tr>
      <tr>
        <td><strong>HC-SR04 Ultrasonic</strong></td>
        <td>Trigger 12, Echo 14</td>
        <td>${sensor.distance} cm</td>
        <td><span class="badge ${sensor.distance < 30 ? 'badge-warning' : 'badge-safe'}">${sensor.distance < 30 ? 'NEAR OBSTACLE' : 'CLEAR PATH'}</span></td>
        <td>&gt; 30 cm Safe Buffer</td>
        <td>Field of view 30°, refresh rate 25Hz</td>
      </tr>
      <tr>
        <td><strong>5-Channel IR Flame Array</strong></td>
        <td>Digital D5-D9</td>
        <td>${sensor.irFlame ? 'ACTIVE (1.0)' : 'INACTIVE (0.0)'}</td>
        <td><span class="badge ${sensor.irFlame ? 'badge-danger' : 'badge-safe'}">${sensor.irFlame ? 'FIRE HAZARD' : 'SECURE'}</span></td>
        <td>Zero Trigger Count</td>
        <td>360° coverage; auto-locks water cannon servo</td>
      </tr>
      <tr>
        <td><strong>Water Tank Level Sensor</strong></td>
        <td>Analog A1</td>
        <td>82% (Full)</td>
        <td><span class="badge badge-safe">READY</span></td>
        <td>&gt; 25% Reserve</td>
        <td>High-pressure DC pump primed and pressurized</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top:30px;padding-top:15px;border-top:1px solid #cbd5e1;display:flex;justify-content:space-between;color:#64748b;font-size:10px">
    <div>FireBot Autonomous Emergency Response Platform • Cloud Channel #2768924</div>
    <div>Report Generated Automatically • Page 1 of 1</div>
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

/**
 * Generates and downloads an Excel spreadsheet (.xls) of system event logs.
 */
export function exportLogsToExcel(logs: Array<{ id: string; time: string | Date; severity: string; event: string }>) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const nowFormatted = new Date().toLocaleString();

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Segoe UI" ss:Size="15" ss:Bold="1" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="Sub">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Italic="1" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2563EB" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Cell">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#334155"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SeverityCrit">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#991B1B"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SeverityWarn">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#92400E"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SeverityInfo">
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#1E40AF"/>
   <Interior ss:Color="#DBEAFE" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Activity Logs">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="50"/>
   <Column ss:Width="160"/>
   <Column ss:Width="120"/>
   <Column ss:Width="500"/>

   <Row ss:Height="26">
    <Cell ss:MergeAcross="3" ss:StyleID="Title"><Data ss:Type="String">FIREBOT CONTROL CENTER - SYSTEM & ACTIVITY AUDIT LOG</Data></Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="3" ss:StyleID="Sub"><Data ss:Type="String">Generated: ${nowFormatted} | Total Records: ${logs.length}</Data></Cell>
   </Row>
   <Row ss:Height="10"/>

   <Row ss:Height="22">
    <Cell ss:StyleID="Header"><Data ss:Type="String">#</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Timestamp</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Severity</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Event Description</Data></Cell>
   </Row>

   ${logs
     .map((l, i) => {
       const timeStr = l.time instanceof Date ? l.time.toLocaleTimeString() : String(l.time);
       const style = l.severity === 'critical' ? 'SeverityCrit' : l.severity === 'warning' ? 'SeverityWarn' : 'SeverityInfo';
       return `
   <Row ss:Height="19">
    <Cell ss:StyleID="Cell"><Data ss:Type="Number">${i + 1}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${escapeXml(timeStr)}</Data></Cell>
    <Cell ss:StyleID="${style}"><Data ss:Type="String">${escapeXml(l.severity.toUpperCase())}</Data></Cell>
    <Cell ss:StyleID="Cell"><Data ss:Type="String">${escapeXml(l.event)}</Data></Cell>
   </Row>`;
     })
     .join('')}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FireBot_Activity_Logs_${timestamp}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens printable PDF report of system activity logs.
 */
export function openPrintableLogsPdf(logs: Array<{ id: string; time: string | Date; severity: string; event: string }>) {
  const printWindow = window.open('', '_blank', 'width=900,height=900');
  if (!printWindow) {
    alert('Please allow popups to open the PDF Print Preview.');
    return;
  }

  const nowFormatted = new Date().toLocaleString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FireBot Activity Logs Report</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 20px; color: #1e293b; font-size: 11px; }
    .header { background: #1e3a8a; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 18px; }
    .header p { margin: 4px 0 0; opacity: 0.8; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f1f5f9; text-align: left; padding: 8px 10px; border-bottom: 2px solid #cbd5e1; font-size: 10px; text-transform: uppercase; }
    td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) td { background: #f8fafc; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 9px; }
    .badge-critical { background: #fee2e2; color: #b91c1c; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .print-actions { margin-bottom: 16px; display: flex; gap: 10px; }
    .btn { padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; border: none; font-size: 11px; }
    .btn-p { background: #2563eb; color: white; }
    @media print { .print-actions { display: none !important; } }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="btn btn-p" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <div class="header">
    <h1>FireBot Autonomous Operations - Activity Audit Logs</h1>
    <p>Generated: ${nowFormatted} | Total Events: ${logs.length}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:40px">#</th>
        <th style="width:140px">Timestamp</th>
        <th style="width:100px">Severity</th>
        <th>Event Description</th>
      </tr>
    </thead>
    <tbody>
      ${logs
        .map((l, i) => {
          const timeStr = l.time instanceof Date ? l.time.toLocaleTimeString() : String(l.time);
          const badgeClass = l.severity === 'critical' ? 'badge-critical' : l.severity === 'warning' ? 'badge-warning' : 'badge-info';
          return `<tr>
            <td>${i + 1}</td>
            <td style="font-family:monospace">${escapeXml(timeStr)}</td>
            <td><span class="badge ${badgeClass}">${escapeXml(l.severity.toUpperCase())}</span></td>
            <td>${escapeXml(l.event)}</td>
          </tr>`;
        })
        .join('')}
    </tbody>
  </table>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

