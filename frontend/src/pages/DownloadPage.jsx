
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import SingleSelectDropdown from '../components/ui/SingleSelectDropdown'; // Using the custom single select dropdown
import MultiSelectDropdown from '../components/ui/MultiSelectDropdown';
import Notification from '../components/Notification';
import axios from 'axios'; 
// Import data options for the dropdowns
import { accountOptions, conversionOptions, deliverableTypeOptions, erOptions } from '../data/appOptions';

const DownloadPage = () => {
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

    // Handler function for the "Download Selected" button click
    const handleDownload = () => {
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
        console.log("JSON payload for Download Report:", JSON.stringify(payload, null, 2));

        
        axios.post('http://localhost:5004/api/report/download', payload, {
            responseType: 'blob' // Important: Tell Axios to expect a binary response (like a file)
        })
            .then(response => {
                // Axios wraps the response, the actual blob is in response.data
                console.log('Report download success response:', response);

                // Logic to trigger file download from the browser
                // Check if the content-type indicates a file (e.g., application/zip, application/pdf)
                const contentType = response.headers['content-type'];
                const filename = response.headers['content-disposition']
                    ? response.headers['content-disposition'].split('filename=')[1]
                    : 'selected_reports.zip'; // Fallback filename

                // Create a temporary URL for the blob
                const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
                const a = document.createElement('a'); // Create a temporary anchor element
                a.href = url; // Set its href to the blob URL
                a.download = filename; // Suggest a filename for the download
                document.body.appendChild(a); // Append to body (necessary for Firefox)
                a.click(); // Programmatically click the anchor to trigger download
                a.remove(); // Clean up the temporary anchor element
                window.URL.revokeObjectURL(url); // Release the object URL

                setNotification({ message: 'All selected reports downloaded successfully!', type: 'success' });
            })
            .catch(error => {
                // Axios catches both network errors and non-2xx HTTP responses here
                console.error('Error downloading reports:', error);
                // If the error response has data (e.g., JSON error from backend), try to parse it
                if (error.response && error.response.data instanceof Blob) {
                    // If the error response is a blob (e.g., server sent an error message as text/plain)
                    const reader = new FileReader();
                    reader.onload = function () {
                        const errorMessage = JSON.parse(reader.result).message || 'Failed to download reports due to server error.';
                        setNotification({ message: errorMessage, type: 'error' });
                    };
                    reader.readAsText(error.response.data);
                } else {
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to download reports. Please try again.';
                    setNotification({ message: errorMessage, type: 'error' });
                }
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
                    <span className="text-primaryBlue">Download </span>
                    <span className="text-primaryGreen">Reports</span>
                </h1>
            </header>

            {/* Form Content - Same structure and styling as the Generate page */}
            {/* max-w-2xl allows it to be wider than default Tailwind 'md' */}
            <div className="max-w-2xl mx-auto w-full mb-10">
                {/* Account Name Dropdown */}
                <div className="mb-6 md:mb-8">
                    <label htmlFor="downloadAccountName" className="block text-lg md:text-xl font-medium text-black mb-2">
                        Account Name
                    </label>
                    <SingleSelectDropdown
                        id="downloadAccountName"
                        selectedValue={accountName}
                        onValueChange={setAccountName}
                        placeholder="Select account for download"
                        options={accountOptions}
                    />
                </div>

                {/* Conversion Name Dropdown */}
                <div className="mb-6 md:mb-8">
                    <label htmlFor="downloadConversionName" className="block text-lg md:text-xl font-medium text-black mb-2">
                        Conversion Name
                    </label>
                    <SingleSelectDropdown
                        id="downloadConversionName"
                        selectedValue={conversionName}
                        onValueChange={setConversionName}
                        placeholder="Select conversion for download"
                        options={conversionOptions}
                    />
                </div>

                {/* Deliverable Type Dropdown */}
                <div className="mb-6 md:mb-8">
                    <label htmlFor="downloadDeliverableType" className="block text-lg md:text-xl font-medium text-black mb-2">
                        Deliverable Type
                    </label>
                    <SingleSelectDropdown
                        id="downloadDeliverableType"
                        selectedValue={deliverableType}
                        onValueChange={setDeliverableType}
                        placeholder="Select deliverable type for download"
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
                        selectedValues={selectedERs}
                        onToggle={handleERToggle}
                        placeholder="Select ERs for download"
                    />
                </div>

                {/* Download Button */}
                <div className="flex justify-center mt-10 md:mt-12">
                    <Button
                        onClick={handleDownload}
                        className="h-12 px-8 bg-buttonGreen text-textMuted rounded-full hover:bg-buttonGreenHover font-medium transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Downloading...
                            </span>
                        ) : (
                            "Download Selected"
                        )}
                    </Button>
                </div>
            </div>

            {/* Notification component for feedback messages */}
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
        </main>
    );
};

DownloadPage.displayName = "DownloadPage";

export default DownloadPage;
