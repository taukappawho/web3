// api/pinata.js
import axios from 'axios';
import FormData from 'form-data';

const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzZGViMThjZi1hMzFiLTRjYmQtOGNhYS02NzNlNzdmY2Q4YjkiLCJlbWFpbCI6ImRveWFsLmJ5cm9uQHlhaG9vLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyMGNhZTU0MWMzMDJlYTc1ZjdjZiIsInNjb3BlZEtleVNlY3JldCI6ImVlZTMxMWE1ZDhmNDc4YTk2MjJlMmFhMjBmZDgyYWE5N2YxZWE2NzZjMmU1NWU4NWRiMmYzMTc5MzExMTU1YzUiLCJpYXQiOjE3MTUxNDY0MjZ9.K-RUcAswxdKOxYXzRO5O-cDHzo7lH3Ls0SUeeedJE3c"

export const pinFileToIPFS = async (fileData) => {
    const formData = new FormData();
    
    formData.append('file', fileData);
    
    const pinataMetadata = JSON.stringify({
        name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${JWT}`
            }
        });
        console.log(res.data);
        return res.data.IpfsHash
    } catch (error) {
        console.log(error);
    }
};