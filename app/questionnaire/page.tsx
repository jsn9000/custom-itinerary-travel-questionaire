"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuestionnairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Traveler Information
    name: "",
    email: "",
    numberOfTravelers: "",
    children: "",
    specialOccasion: "",

    // Destination
    destination: "",
    continent: "",

    // Lodging & Car Rental
    needAccommodation: "",
    hotelPriceRange: "",
    needCarRental: "",

    // Flights
    needFlightHelp: "",
    departureAirport: "",
    willingOtherAirport: "",
    flightDate: "",
    flexibleFlightDate: "",
    flightPreference: "",

    // Activities & Food
    needActivitiesHelp: "",
    needFoodHelp: "",

    // Budget & Timing
    totalBudget: "",
    daysOnLand: "",
    travelDateFlexibility: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/submit-questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your questionnaire has been submitted successfully.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          numberOfTravelers: "",
          children: "",
          specialOccasion: "",
          destination: "",
          continent: "",
          needAccommodation: "",
          hotelPriceRange: "",
          needCarRental: "",
          needFlightHelp: "",
          departureAirport: "",
          willingOtherAirport: "",
          flightDate: "",
          flexibleFlightDate: "",
          flightPreference: "",
          needActivitiesHelp: "",
          needFoodHelp: "",
          totalBudget: "",
          daysOnLand: "",
          travelDateFlexibility: "",
        });
        setCurrentStep(1);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Failed to submit questionnaire. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: // Traveler Information
        return formData.name && formData.email && formData.numberOfTravelers;
      case 2: // Destination - no required fields
        return true;
      case 3: // Lodging & Car Rental
        return formData.needAccommodation && formData.needCarRental;
      case 4: // Flights
        return formData.needFlightHelp;
      case 5: // Activities & Food
        return formData.needActivitiesHelp && formData.needFoodHelp;
      case 6: // Budget & Timing
        return formData.daysOnLand;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-start">
            <img
              src="/mame-dee-header.png"
              alt="Mame Dee Travel World - Travel Concierge"
              className="h-32 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-semibold text-neutral-800">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-base font-medium text-neutral-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5">
            <div
              className="bg-neutral-900 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Traveler Information */}
          {currentStep === 1 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Traveler Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    1. Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    2. Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    3. How many people are traveling? <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.numberOfTravelers}
                    onChange={(e) => handleChange("numberOfTravelers", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    4. Any children? If so, include ages.
                  </label>
                  <Input
                    type="text"
                    value={formData.children}
                    onChange={(e) => handleChange("children", e.target.value)}
                    placeholder="e.g., 2 children: ages 5 and 8"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    5. Is this a special occasion?
                  </label>
                  <Input
                    type="text"
                    value={formData.specialOccasion}
                    onChange={(e) => handleChange("specialOccasion", e.target.value)}
                    placeholder="e.g., Anniversary, Birthday, Honeymoon"
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Destination */}
          {currentStep === 2 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Destination</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    6. Do you have a destination in mind?
                  </label>
                  <Input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => handleChange("destination", e.target.value)}
                    placeholder="e.g., Paris, Tokyo, Bali"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    7. If no place in mind, do you have a continent in mind?
                  </label>
                  <Select
                    value={formData.continent}
                    onValueChange={(value) => handleChange("continent", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a continent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="north-america">North America</SelectItem>
                      <SelectItem value="south-america">South America</SelectItem>
                      <SelectItem value="oceania">Oceania</SelectItem>
                      <SelectItem value="antarctica">Antarctica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Lodging & Car Rental */}
          {currentStep === 3 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Lodging & Car Rental</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    8. Do you need accommodation? <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.needAccommodation}
                    onValueChange={(value) => handleChange("needAccommodation", value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    9. Hotel nightly price range?
                  </label>
                  <Input
                    type="text"
                    value={formData.hotelPriceRange}
                    onChange={(e) => handleChange("hotelPriceRange", e.target.value)}
                    placeholder="e.g., $100-$200 per night"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    10. Will you need a car rental for your trip? <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.needCarRental}
                    onValueChange={(value) => handleChange("needCarRental", value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Step 4: Flights */}
          {currentStep === 4 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Flights</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    11. Do you need help finding flight tickets? <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.needFlightHelp}
                    onValueChange={(value) => handleChange("needFlightHelp", value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    12. What is the departure airport?
                  </label>
                  <Input
                    type="text"
                    value={formData.departureAirport}
                    onChange={(e) => handleChange("departureAirport", e.target.value)}
                    placeholder="e.g., JFK, LAX, ORD"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    13. Are you willing to fly out of another nearby airport for a cheaper price?
                  </label>
                  <Select
                    value={formData.willingOtherAirport}
                    onValueChange={(value) => handleChange("willingOtherAirport", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    14. What date do you want your flight to begin?
                  </label>
                  <Input
                    type="date"
                    value={formData.flightDate}
                    onChange={(e) => handleChange("flightDate", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    15. Are you okay if the flight leaves a day before or later if the price is cheaper?
                  </label>
                  <Select
                    value={formData.flexibleFlightDate}
                    onValueChange={(value) => handleChange("flexibleFlightDate", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    16. Do you want a nonstop flight, or are you okay with a layover if it makes the flight cheaper?
                  </label>
                  <Select
                    value={formData.flightPreference}
                    onValueChange={(value) => handleChange("flightPreference", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nonstop">Nonstop only</SelectItem>
                      <SelectItem value="layover-ok">Okay with layover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Step 5: Activities & Food */}
          {currentStep === 5 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Activities & Food</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    17. Do you need help finding activities? <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.needActivitiesHelp}
                    onValueChange={(value) => handleChange("needActivitiesHelp", value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    18. Do you need help finding food spots? <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.needFoodHelp}
                    onValueChange={(value) => handleChange("needFoodHelp", value)}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Step 6: Budget & Timing */}
          {currentStep === 6 && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-neutral-900">Budget & Timing</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    19. What is your total budget for your trip (not including flights)?
                  </label>
                  <Input
                    type="text"
                    value={formData.totalBudget}
                    onChange={(e) => handleChange("totalBudget", e.target.value)}
                    placeholder="e.g., $3,000"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    20. How many days do you want to be on land? <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.daysOnLand}
                    onChange={(e) => handleChange("daysOnLand", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-neutral-700">
                    21. Do you have a specific date in mind or a specific month? Or are you flexible?
                  </label>
                  <Textarea
                    value={formData.travelDateFlexibility}
                    onChange={(e) => handleChange("travelDateFlexibility", e.target.value)}
                    placeholder="e.g., Prefer June 2025, but flexible with dates"
                    className="w-full min-h-24"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Status Message */}
          {submitStatus.type && (
            <div
              className={`mt-6 p-4 rounded-lg text-center ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-8"
            >
              Previous
            </Button>

            <div className="text-sm text-neutral-500">
              Step {currentStep} of {totalSteps}
            </div>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-8"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !canProceed()}
                className="px-8"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
