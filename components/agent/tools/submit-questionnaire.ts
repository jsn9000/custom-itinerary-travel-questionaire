import { tool } from 'ai';
import { z } from 'zod';

export const submitQuestionnaire = tool({
  description: 'Submit the completed travel questionnaire with all gathered information. Only call this when you have collected all required information from the client.',
  inputSchema: z.object({
    // Traveler Information (required)
    name: z.string().describe('Client full name'),
    email: z.string().email().describe('Client email address'),
    numberOfTravelers: z.string().describe('Number of people traveling'),

    // Optional traveler details
    children: z.string().optional().describe('Children information with ages if applicable'),
    specialOccasion: z.string().optional().describe('Special occasion like anniversary, birthday, honeymoon'),

    // Destination
    destination: z.string().optional().describe('Specific destination they have in mind'),
    continent: z.string().optional().describe('Continent preference if no specific destination'),

    // Lodging & Car Rental (required)
    needAccommodation: z.string().describe('Whether they need accommodation (yes/no)'),
    hotelPriceRange: z.string().optional().describe('Hotel nightly price range'),
    needCarRental: z.string().describe('Whether they need car rental (yes/no)'),

    // Flights (required needFlightHelp)
    needFlightHelp: z.string().describe('Whether they need help finding flights (yes/no)'),
    departureAirport: z.string().optional().describe('Departure airport code'),
    willingOtherAirport: z.string().optional().describe('Willing to use nearby airport for cheaper price (yes/no)'),
    flightDate: z.string().optional().describe('Preferred flight departure date'),
    flexibleFlightDate: z.string().optional().describe('Flexible with date +/- 1 day for cheaper price (yes/no)'),
    flightPreference: z.string().optional().describe('nonstop or layover-ok'),

    // Activities & Food (required)
    needActivitiesHelp: z.string().describe('Whether they need help finding activities (yes/no)'),
    needFoodHelp: z.string().describe('Whether they need help finding food spots (yes/no)'),

    // Budget & Timing (required daysOnLand)
    totalBudget: z.string().optional().describe('Total budget for trip not including flights'),
    daysOnLand: z.string().describe('Number of days they want to be on land'),
    travelDateFlexibility: z.string().optional().describe('Specific dates, months, or flexible'),
  }),
  execute: async (data) => {
    console.log('🔧 submitQuestionnaire tool called with data:', {
      name: data.name,
      email: data.email,
      numberOfTravelers: data.numberOfTravelers,
    });

    try {
      // Call the same API endpoint that the form uses
      // Determine the base URL based on environment
      let baseUrl: string;
      if (process.env.NEXT_PUBLIC_API_URL) {
        baseUrl = process.env.NEXT_PUBLIC_API_URL;
      } else if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else {
        // In development, try to detect the port from environment or use 3001
        const port = process.env.PORT || '3001';
        baseUrl = `http://localhost:${port}`;
      }

      const response = await fetch(`${baseUrl}/api/submit-questionnaire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('✅ Questionnaire submitted successfully');
        return {
          success: true,
          message: 'Questionnaire submitted successfully! The client will be contacted soon.',
        };
      } else {
        console.error('❌ Questionnaire submission failed:', result.error);
        return {
          success: false,
          message: `Failed to submit questionnaire: ${result.error}`,
        };
      }
    } catch (error) {
      console.error('💥 Error submitting questionnaire:', error);
      return {
        success: false,
        message: 'An error occurred while submitting the questionnaire. Please try again.',
      };
    }
  },
});
