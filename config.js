// API Configuration
// Change this based on your environment

const APIConfig = {
    // For local development (API running on localhost:3000)
    DEV_URL: 'http://localhost:3000',
    
    // For production (Render or other hosting)
    PROD_URL: 'https://tool-api-3.onrender.com',

    // SET THIS TO true to use PROD_URL even when running locally
    USE_PROD_API_LOCALLY: true, 
    
    // Determine which URL to use based on hostname
    get API_URL() {
        if (this.USE_PROD_API_LOCALLY) {
            return this.PROD_URL;
        }

        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // Check if we are in a production environment
        const isProdHost = hostname.includes('onrender.com') || hostname.includes('github.io');
        
        // Local detection
        const isLocalHost = ['', 'localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname);
        const isPrivateIP = hostname.startsWith('192.168.') || 
                            hostname.startsWith('10.') || 
                            (hostname.startsWith('172.') && parseInt(hostname.split('.')[1]) >= 16 && parseInt(hostname.split('.')[1]) <= 31);
        const isFileProtocol = protocol === 'file:';
        const isHttpLocal = protocol === 'http:' && (isLocalHost || isPrivateIP);

        if (isProdHost) {
            return this.PROD_URL;
        }

        if (isLocalHost || isFileProtocol || isHttpLocal || isPrivateIP) {
            return this.DEV_URL;
        }

        return this.PROD_URL;
    }
};

// Make it globally available
window.APIConfig = APIConfig;
