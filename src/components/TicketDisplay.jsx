import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TicketDisplay = ({ ticket }) => {
  const ticketRef = useRef();

  const downloadPDF = () => {
    const input = ticketRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ticket_${ticket.pnr}.pdf`);
    });
  };

  return (
    <div>
      <div
        ref={ticketRef}
        style={{
          width: 595,
          minHeight: 842,
          padding: 20,
          fontFamily: 'Arial, sans-serif',
          fontSize: 12,
          color: '#000',
          backgroundColor: '#fff',
          border: '1px solid #000',
          boxSizing: 'border-box',
          margin: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>Indian Railways</div>
            <div>Azadi ka Amrit Mahotsav</div>
          </div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 14 }}>
            Electronic Reservation Slip (ERS) - Normal User
          </div>
          <div>
            <div style={{ height: 50, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>IRCTC</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div><strong>Booked from</strong></div>
            <div>{ticket.from}</div>
            <div>Start Date* {new Date(ticket.date).toLocaleDateString()}</div>
            <div>PNR <span style={{ color: '#007bff' }}>{ticket.pnr}</span></div>
            <div>Quota GENERAL (GN)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div><strong>Boarding At</strong></div>
            <div>{ticket.from}</div>
            <div>Departure* 09:50 {new Date(ticket.date).toLocaleDateString()}</div>
            <div>Train No./Name 19401/ADI LUCKNOW EX</div>
            <div>Distance 980 KM</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div><strong>To</strong></div>
            <div>{ticket.to}</div>
            <div>Arrival* 03:47 {new Date(new Date(ticket.date).getTime() + 24*60*60*1000).toLocaleDateString()}</div>
            <div>Class SLEEPER CLASS (SL)</div>
            <div>Booking Date {new Date().toLocaleString()}</div>
          </div>
        </div>

        <div>
          <strong>Passenger Details</strong>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #000', padding: 4 }}>#</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Name</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Age</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Gender</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Booking Status</th>
                <th style={{ border: '1px solid #000', padding: 4 }}>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {ticket.passengers.map((p, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #000', padding: 4 }}>{i + 1}</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>{p.name}</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>{p.age}</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>{p.gender}</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>PQWL/{112 + i}</td>
                  <td style={{ border: '1px solid #000', padding: 4 }}>PQWL/{79 + i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 10 }}>
          <div>Transaction ID: 100004399916431</div>
          <div>IR recovers only 57% of cost of travel on an average.</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Payment Details</strong>
          <div>Ticket Fare ₹ {ticket.totalCost.toFixed(2)}</div>
          <div>IRCTC Convenience Fee (Incl. of GST) ₹ 11.80</div>
          <div>Total Fare (all inclusive) ₹ {(ticket.totalCost + 11.80).toFixed(2)}</div>
          <div>PG Charges as applicable (Additional)</div>
        </div>

        <div style={{ marginTop: 10, fontSize: 10 }}>
          <div>IRCTC Convenience Fee is charged per e-ticket irrespective of number of passengers on the ticket.</div>
          <div>* The printed Departure and Arrival Times are liable to change. Please Check correct departure, arrival from Railway Station Enquiry or Dial 139 or SMS RAIL to 139.</div>
          <div>This ticket is booked on a personal User ID, its sale/purchase is an offence u/s143 of the Railways Act,1989.</div>
          <div>Prescribed original ID proof is required while travelling along with SMS/ VRM/ ERS otherwise will be treated as without ticket and penalized as per Railway Rules.</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Indian Railways GST Details:</strong>
          <div>Invoice Number: PS23860742881011</div>
          <div>Address: Indian Railways New Delhi</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Supplier Information:</strong>
          <div>SAC Code: 996421</div>
          <div>GSTIN: 07AAAGM0289C1ZL</div>
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Recipient Information:</strong>
          <div>GSTIN: NA</div>
          <div>Name: NA</div>
          <div>Address:</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={downloadPDF} style={{
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
        }}>
          Download Ticket PDF
        </button>
      </div>
    </div>
  );
};

export default TicketDisplay;
