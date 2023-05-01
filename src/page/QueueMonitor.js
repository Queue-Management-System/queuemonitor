import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import './queueMonitor.scss';

const QueueMonitor = () => {
  const [patients, setPatients] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://gs1ksa.org:3001/api/listOfAllTikects");
        const data = await response.json();
        
        setPatients(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Update date every second
  useEffect(() => {
    const intervalId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const leftColumnPatients = patients.filter(patient => patient.status === 0);

  let rightColumnPatient = patients.find(patient => patient.status === 1);

  if (!rightColumnPatient) {
    rightColumnPatient = {
      ticket: <h1>Please <span style={{ color: 'purple' }}>Wait</span></h1>,
      name: ""
    };
  }

  return (
    <Container fluid className="queue-monitor">
      <Row>
        <Col xs={3}>
          <ListGroup className='patients'>
            {leftColumnPatients.slice(0, 4).map(patient => (
              <div key={patient.id} className="patient-item">
                <h2>{patient.ticket}</h2>
                <h6>{patient.name}</h6>
              </div>
            ))}
          </ListGroup>
        </Col>
        <Col xs={9}>
          <div className="current-time">
            <div className='dateTime'>
              <p>Date: {date.toLocaleDateString()}</p>
              <p>Time: {date.toLocaleTimeString()}</p>
            </div>
          </div>
          <div key={rightColumnPatient.ticket} className="patient-details">
            <h1>{rightColumnPatient.ticket}</h1>
            <h5>{rightColumnPatient.name}</h5>
            {rightColumnPatient.status === 1 && <p>Please proceed to <span style={{ color: 'purple' }}>TRIAGE</span></p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default QueueMonitor;
