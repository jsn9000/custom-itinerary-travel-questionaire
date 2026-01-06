interface QuestionnaireData {
  name: string;
  email: string;
  phoneNumber: string;
  referralSource: string;
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

export async function generateQuestionnaireText(data: QuestionnaireData): Promise<Buffer> {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const textContent = `
TRAVEL QUESTIONNAIRE SUBMISSION
================================

Submitted: ${date}

TRAVELER INFORMATION
--------------------
1. Name: ${data.name}
2. Email: ${data.email}
3. Phone number: ${data.phoneNumber}
4. How they heard about us: ${data.referralSource}
5. Number of travelers: ${data.numberOfTravelers}
6. Children (with ages): ${data.children || 'None specified'}
7. Special occasion: ${data.specialOccasion || 'None specified'}

DESTINATION
-----------
8. Destination in mind: ${data.destination || 'No specific destination'}
9. Continent preference: ${data.continent || 'Not specified'}

LODGING & CAR RENTAL
--------------------
10. Need accommodation: ${data.needAccommodation}
11. Hotel nightly price range: ${data.hotelPriceRange || 'Not specified'}
12. Need car rental: ${data.needCarRental}

FLIGHTS
-------
13. Need help finding flight tickets: ${data.needFlightHelp}
14. Departure airport: ${data.departureAirport || 'Not specified'}
15. Willing to fly from another airport: ${data.willingOtherAirport || 'Not specified'}
16. Flight start date: ${data.flightDate || 'Not specified'}
17. Flexible with flight dates: ${data.flexibleFlightDate || 'Not specified'}
18. Flight preference: ${data.flightPreference || 'Not specified'}

ACTIVITIES & FOOD
-----------------
19. Need help finding activities: ${data.needActivitiesHelp}
20. Need help finding food spots: ${data.needFoodHelp}

BUDGET & TIMING
---------------
21. Total budget (not including flights): ${data.totalBudget || 'Not specified'}
22. Days on land: ${data.daysOnLand}
23. Travel date flexibility: ${data.travelDateFlexibility || 'Not specified'}

---
This document was automatically generated from the Mame Dee Travel World questionnaire submission.
`;

  return Buffer.from(textContent, 'utf-8');
}
