
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import SingleSelectDropdown from '../components/ui/SingleSelectDropdown'; // Using the custom single select dropdown
import MultiSelectDropdown from '../components/ui/MultiSelectDropdown';
import Notification from '../components/Notification';
import axios from 'axios'; // Importing axios for making HTTP requests
// Import data options for the dropdowns
import { accountOptions, conversionOptions, deliverableTypeOptions, erOptions } from '../data/appOptions';

const GeneratePage = () => {
    // State variables to store the selected values for each form field
    const [accountName, setAccountName] = useState("");
    const [conversionName, setConversionName] = useState("");
    const [deliverableType, setDeliverableType] = useState("");
    const [selectedERs, setSelectedERs] = useState([]); // Stores an array of selected ER IDs

    // State for loading indicator on the button
    const [isLoading, setIsLoading] = useState(false);
    // State for showing dynamic notifications
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Handler function to toggle the selection of an ER option in the MultiSelectDropdown
    const handleERToggle = (optionId) => {
        setSelectedERs(prev => {
            // If the option is already selected, remove it
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId);
            } else {
                // Otherwise, add it to the selected options
                return [...prev, optionId];
            }
        });
    };

 
    const handleGenerate = () => {
        setIsLoading(true); // Show loading indicator
        setNotification({ message: '', type: '' }); // Clear any previous notifications

        // Construct the JSON payload with only the IDs, as required by the backend
        const payload = {
            accountID: accountName,
            conversionID: conversionName,
            deliverableTypeID: deliverableType,
            exceptionIDs: selectedERs
        };

        // Log the payload to the console to show what would be sent to the backend
        console.log("JSON payload for Generate Report:", JSON.stringify(payload, null, 2));

        
        axios.post('http://localhost:5004/api/report/generate', payload) 
            .then(response => {
                // Axios wraps the response in an object, the actual data is in response.data
                console.log('Report generation success response:', response.data);
                setNotification({ message: 'Reports generated successfully!', type: 'success' });
                // You might want to handle the 'response.data' here, e.g., show a link to the report
            })
            .catch(error => {
                // Axios catches both network errors and non-2xx HTTP responses here
                console.error('Error generating report:', error);
                // Access error message based on Axios error structure
                const errorMessage = error.response?.data?.message || error.message || 'Failed to generate reports.';
                setNotification({ message: errorMessage, type: 'error' });
            })
            .finally(() => {
                // This runs regardless of success or failure
                setIsLoading(false); // Hide loading indicator
            });

        // Removed the setTimeout simulation as we are now making a real API call
    };
    return (
        <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
            {/* Page Header */}
            <header className="mb-10 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                    <span className="text-primaryBlue">Exceptional Report </span>
                    <span className="text-primaryGreen">Generator</span>
                </h1>
            </header>

            {/* Form Content - Centered with a maximum width to maintain readability on large screens */}
            {/* Changed max-w-md to max-w-2xl for wider content area */}
            <div className="max-w-2xl mx-auto w-full">
                {/* Account Name Dropdown */}
                <div className="mb-6 md:mb-8">
                    <label htmlFor="accountName" className="block text-lg md:text-xl font-medium text-black mb-2">
                        Account Name
                    </label>
                    <SingleSelectDropdown
                        id="accountName"
                        selectedValue={accountName} // The currently selected ID
                        onValueChange={setAccountName} // Callback to update state with the new ID
                        placeholder="Enter your account name"
                        options={accountOptions} // Data for the dropdown
                    />
                </div>

                {/* Conversion Name Dropdown */}
                <div className="mb-6 md:mb-8">
                    <label htmlFor="conversionName" className="block text-lg md:text-xl font-medium text-black mb-2">
                        Conversion Name
                    </label>
                    <SingleSelectDropdown
                        id="conversionName"
                        selectedValue={conversionName}
                        onValueChange={setConversionName}
                        placeholder="Enter your conversion name"
                        options={conversionOptions}
                    />
                </div>

                {/* Deliverable Type Dropdown */}
                <div className="mb-6 md:mb-8">
                    <label htmlFor="deliverableType" className="block text-lg md:text-xl font-medium text-black mb-2">
                        Deliverable Type
                    </label>
                    <SingleSelectDropdown
                        id="deliverableType"
                        selectedValue={deliverableType}
                        onValueChange={setDeliverableType}
                        placeholder="Select deliverable type"
                        options={deliverableTypeOptions}
                    />
                </div>

                {/* Select ERs Multi-select Dropdown */}
                <div className="mb-6 md:mb-8">
                    <label className="block text-lg md:text-xl font-medium text-black mb-2">
                        Select ERs
                    </label>
                    <MultiSelectDropdown
                        options={erOptions}
                        selectedValues={selectedERs} // Array of selected ER IDs
                        onToggle={handleERToggle} // Callback to add/remove ER IDs
                        placeholder="Select ERs"
                    />
                </div>

                {/* Generate Button */}
                <div className="flex justify-center mt-10 md:mt-12">
                    <Button
                        onClick={handleGenerate}
                        // Applying the specific green background, text color, and oval shape
                        className="h-12 px-8 bg-buttonGreen text-textMuted rounded-full hover:bg-buttonGreenHover font-medium transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
                        disabled={isLoading} // Disable button when loading
                    >
                        {isLoading ? (
                            // Display spinner and "Generating..." text when loading
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            // Default button text
                            "Generate"
                        )}
                    </Button>
                </div>
            </div>

            {/* Notification component for feedback messages */}
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })} // Callback to dismiss notification
            />
        </main>
    );
};

GeneratePage.displayName = "GeneratePage";

export default GeneratePage;
