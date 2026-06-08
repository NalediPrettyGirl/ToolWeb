// API Configuration
const APIConfig = {
    DEV_URL: 'http://localhost:3000',
    PROD_URL: 'https://tool-api-ppe7.onrender.com',
    USE_PROD_API_LOCALLY: true,
    get API_URL() {
        if (this.USE_PROD_API_LOCALLY) {
            return this.PROD_URL;
        }
        // Use local API if running on localhost or opening files locally, otherwise use production API
        // Use localhost for testing, or production URL for live
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // If testing on local network, use that IP, otherwise use production
        if (hostname === '[IP_ADDRESS]') return 'http://[IP_ADDRESS]';
        if (hostname === 'localhost') return this.DEV_URL;
        
        return this.PROD_URL;
    }
};

window.APIConfig = APIConfig;
