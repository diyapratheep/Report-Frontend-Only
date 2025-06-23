import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button';
import SingleSelectDropdown from '../components/ui/SingleSelectDropdown';
import MultiSelectDropdown from '../components/ui/MultiSelectDropdown';
import Notification from '../components/Notification';

const DownloadPage = () => {
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
                    setErOptions([]);
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
                    setErOptions([]);
                })
                .catch(err => console.error('Error fetching deliverables', err));
        }
    }, [conversionName]);

    useEffect(() => {
        if (accountName && conversionName && deliverableType) {
            axios.get('http://localhost:5004/api/lookup/exception-reports', {
                params: {
                    accountId: accountName,
                    conversionId: conversionName,
                    deliverableTypeId: deliverableType
                }
            })
                .then(res => {
                    const mapped = res.data.filter(er=>er.exceptionReportMasterID != null).map(er => ({
                        id: er.exceptionReportMasterID,
                        name: er.exceptionName,
                        exceptionReportID: er.exceptionReportID
                    }));
                    setErOptions(mapped);
                    setSelectedERs([]);
                })
                .catch(err => {
                    console.error('Error fetching exception reports', err);
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

    const handleDownload = () => {
        setIsLoading(true);
        setNotification({ message: '', type: '' });

        
        const selectedERObjects = erOptions.filter(er => selectedERs.includes(er.id));

       
        const exceptionReportIDs = selectedERObjects.map(er => er.exceptionReportID);

        const payload = {
            accountID: accountName,
            conversionID: conversionName,
            deliverableTypeID: deliverableType,
            exceptionIDs: selectedERs,               // used for file names
            exceptionReportIDs: exceptionReportIDs   // used for DB audit logging
        };

        axios.post('http://localhost:5004/api/report/download', payload, {
            responseType: 'blob'
        })
            .then(response => {
                const contentType = response.headers['content-type'];
                const disposition = response.headers['content-disposition'];
                const filename = disposition?.split('filename=')[1]?.replace(/["']/g, '') || 'selected_reports.zip';

                const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                setNotification({ message: 'Reports downloaded successfully!', type: 'success' });
            })
            .catch(error => {
                console.error('Error downloading reports:', error);
                if (error.response && error.response.data instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = function () {
                        const errMsg = JSON.parse(reader.result).message || 'Failed to download reports.';
                        setNotification({ message: errMsg, type: 'error' });
                    };
                    reader.readAsText(error.response.data);
                } else {
                    setNotification({ message: error.message || 'Download failed.', type: 'error' });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    return (
        <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
            <header className="mb-10 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                    <span className="text-primaryBlue">Download </span>
                    <span className="text-primaryGreen">Reports</span>
                </h1>
            </header>

            <div className="max-w-2xl mx-auto w-full mb-10">
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

                <div className="mb-6 md:mb-8">
                    <label className="block text-lg md:text-xl font-medium text-black mb-2">
                        Select ERs
                    </label>
                    <MultiSelectDropdown
                        options={erOptions || []}
                        selectedValues={selectedERs}
                        onToggle={handleERToggle}
                        placeholder="Select ERs for download"
                    />
                </div>

                <div className="flex justify-center mt-10 md:mt-12">
                    <Button
                        onClick={handleDownload}
                        className="h-12 px-8 bg-buttonGreen text-textMuted rounded-full hover:bg-buttonGreenHover font-medium transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Downloading...
                            </span>
                        ) : (
                            "Download Selected"
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

DownloadPage.displayName = "DownloadPage";
export default DownloadPage;
