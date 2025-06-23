import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Button from '../components/ui/Button';
import SingleSelectDropdown from '../components/ui/SingleSelectDropdown';
import MultiSelectDropdown from '../components/ui/MultiSelectDropdown';
import Notification from '../components/Notification';

const GeneratePage = () => {
    const [accountName, setAccountName] = useState("");
    const [conversionName, setConversionName] = useState("");
    const [deliverableType, setDeliverableType] = useState("");
    const [selectedERs, setSelectedERs] = useState([]);

    const [accountOptions, setAccountOptions] = useState([]);
    const [conversionOptions, setConversionOptions] = useState([]);
    const [deliverableTypeOptions, setDeliverableTypeOptions] = useState([]);
    const [erOptions, setErOptions] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        axios.get('http://localhost:5004/api/lookup/accounts')
            .then(res => {
                const mapped = res.data.map(a => ({ id: a.accountID, name: a.accountName }));
                setAccountOptions(mapped);
            })
            .catch(err => console.error('Error fetching accounts', err));
    }, []);

 
    useEffect(() => {
        if (accountName) {
            axios.get(`http://localhost:5004/api/lookup/accounts/${accountName}/conversions`)
                .then(res => {
                    const mapped = res.data.map(c => ({ id: c.conversionID, name: c.conversionName }));
                    setConversionOptions(mapped);
                    setConversionName("");
                    setDeliverableType("");
                    setDeliverableTypeOptions([]);
                    setSelectedERs([]);
                })
                .catch(err => console.error('Error fetching conversions', err));
        }
    }, [accountName]);

    
    useEffect(() => {
        if (conversionName) {
            axios.get(`http://localhost:5004/api/lookup/conversions/${conversionName}/deliverables`)
                .then(res => {
                    const mapped = res.data.map(d => ({ id: d.deliverableTypeID, name: d.deliverableTypeName }));
                    setDeliverableTypeOptions(mapped);
                    setDeliverableType("");  
                    setSelectedERs([]);
                })
                .catch(err => console.error('Error fetching deliverables', err));
        }
    }, [conversionName]);

  
    useEffect(() => {
        if (accountName && conversionName && deliverableType) {
            axios.get('http://localhost:5004/api/lookup/exception-masters')
                .then(res => {
                    const mapped = res.data.map(er => ({
                        id: er.exceptionReportMasterID,
                        name: er.exceptionName
                    }));

                    setErOptions(mapped);   
                 
                })
                .catch(err => {
                    console.error('Error fetching Exception Masters', err);
                    setErOptions([]);
                });
        }
    }, [accountName, conversionName, deliverableType]);


    const handleERToggle = (optionId) => {
        setSelectedERs(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    const handleGenerate = () => {
        setIsLoading(true);
        setNotification({ message: '', type: '' });

        const payload = {
            accountID: accountName,
            conversionID: conversionName,
            deliverableTypeID: deliverableType,
            exceptionIDs: selectedERs
        };

        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        axios.post('http://localhost:5004/api/report/generate', payload)
            .then(response => {
                console.log('Report generation success:', response.data);
                setNotification({ message: 'Reports generated successfully!', type: 'success' });
            })
            .catch(error => {
                console.error('Error generating report:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to generate reports.';
                setNotification({ message: errorMessage, type: 'error' });
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
            <header className="mb-10 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                    <span className="text-primaryBlue">Exceptional Report </span>
                    <span className="text-primaryGreen">Generator</span>
                </h1>
            </header>

            <div className="max-w-2xl mx-auto w-full">
         
                <div className="mb-6 md:mb-8">
                    <label htmlFor="accountName" className="block text-lg font-medium text-black mb-2">
                        Account Name
                    </label>
                    <SingleSelectDropdown
                        id="accountName"
                        selectedValue={accountName}
                        onValueChange={setAccountName}
                        placeholder="Select Account"
                        options={accountOptions}
                    />
                </div>

         
                <div className="mb-6 md:mb-8">
                    <label htmlFor="conversionName" className="block text-lg font-medium text-black mb-2">
                        Conversion Name
                    </label>
                    <SingleSelectDropdown
                        id="conversionName"
                        selectedValue={conversionName}
                        onValueChange={setConversionName}
                        placeholder="Select Conversion"
                        options={conversionOptions}
                    />
                </div>

                <div className="mb-6 md:mb-8">
                    <label htmlFor="deliverableType" className="block text-lg font-medium text-black mb-2">
                        Deliverable Type
                    </label>
                    <SingleSelectDropdown
                        id="deliverableType"
                        selectedValue={deliverableType}
                        onValueChange={setDeliverableType}
                        placeholder="Select Deliverable"
                        options={deliverableTypeOptions}
                    />
                </div>

              
                <div className="mb-6 md:mb-8">
                    <label className="block text-lg font-medium text-black mb-2">
                        Select ERs
                    </label>
                    <MultiSelectDropdown
                        options={erOptions}
                        selectedValues={selectedERs}
                        onToggle={handleERToggle}
                        placeholder="Select ERs"
                    />
                </div>

             
                <div className="flex justify-center mt-10 md:mt-12">
                    <Button
                        onClick={handleGenerate}
                        className="h-12 px-8 bg-buttonGreen text-textMuted rounded-full hover:bg-buttonGreenHover font-medium transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Generating...
                            </span>
                        ) : (
                            "Generate"
                        )}
                    </Button>
                </div>
            </div>

            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
        </main>
    );
};

GeneratePage.displayName = "GeneratePage";
export default GeneratePage;
