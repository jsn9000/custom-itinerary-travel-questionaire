import PDFDocument from 'pdfkit';

interface QuestionnaireData {
  name: string;
  email: string;
  numberOfTravelers: string;
  children: string;
  specialOccasion: string;
  destination: string;
  continent: string;
  needAccommodation: string;
  hotelPriceRange: string;
  needCarRental: string;
  needFlightHelp: string;
  departureAirport: string;
  willingOtherAirport: string;
  flightDate: string;
  flexibleFlightDate: string;
  flightPreference: string;
  needActivitiesHelp: string;
  needFoodHelp: string;
  totalBudget: string;
  daysOnLand: string;
  travelDateFlexibility: string;
}

export async function generateQuestionnairePDF(data: QuestionnaireData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).text('Travel Questionnaire Submission', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }), { align: 'center' });
      doc.moveDown(2);

      // Helper function to add section
      const addSection = (title: string) => {
        doc.fontSize(16).fillColor('#333').text(title, { underline: true });
        doc.moveDown(0.5);
      };

      // Helper function to add question and answer
      const addQA = (question: string, answer: string) => {
        if (answer) {
          doc.fontSize(11).fillColor('#666').text(question, { continued: false });
          doc.fontSize(11).fillColor('#000').text(answer, { indent: 20 });
          doc.moveDown(0.5);
        }
      };

      // Traveler Information
      addSection('Traveler Information');
      addQA('1. Name:', data.name);
      addQA('2. Email:', data.email);
      addQA('3. Number of travelers:', data.numberOfTravelers);
      addQA('4. Children (with ages):', data.children || 'None specified');
      addQA('5. Special occasion:', data.specialOccasion || 'None specified');
      doc.moveDown(1);

      // Destination
      addSection('Destination');
      addQA('6. Destination in mind:', data.destination || 'No specific destination');
      addQA('7. Continent preference:', data.continent || 'Not specified');
      doc.moveDown(1);

      // Lodging & Car Rental
      addSection('Lodging & Car Rental');
      addQA('8. Need accommodation:', data.needAccommodation);
      addQA('9. Hotel nightly price range:', data.hotelPriceRange || 'Not specified');
      addQA('10. Need car rental:', data.needCarRental);
      doc.moveDown(1);

      // Flights
      addSection('Flights');
      addQA('11. Need help finding flight tickets:', data.needFlightHelp);
      addQA('12. Departure airport:', data.departureAirport || 'Not specified');
      addQA('13. Willing to fly from another airport:', data.willingOtherAirport || 'Not specified');
      addQA('14. Flight start date:', data.flightDate || 'Not specified');
      addQA('15. Flexible with flight dates:', data.flexibleFlightDate || 'Not specified');
      addQA('16. Flight preference:', data.flightPreference || 'Not specified');
      doc.moveDown(1);

      // Activities & Food
      addSection('Activities & Food');
      addQA('17. Need help finding activities:', data.needActivitiesHelp);
      addQA('18. Need help finding food spots:', data.needFoodHelp);
      doc.moveDown(1);

      // Budget & Timing
      addSection('Budget & Timing');
      addQA('19. Total budget (not including flights):', data.totalBudget || 'Not specified');
      addQA('20. Days on land:', data.daysOnLand);
      addQA('21. Travel date flexibility:', data.travelDateFlexibility || 'Not specified');

      // Footer
      doc.moveDown(2);
      doc.fontSize(8).fillColor('#999').text(
        'This document was automatically generated from the Mame Dee Travel World questionnaire submission.',
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
