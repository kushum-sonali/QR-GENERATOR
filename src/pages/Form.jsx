import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'text') {
      setText(value);
    }
  };
  
  const generateQRCode = async () => {
    try {
      const response = await fetch("https://qr-backend-generator.vercel.app/generate-qrcode", {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setQrCode(data.data);
      console.log(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Function to download the QR code
  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Function to share the QR code on WhatsApp
  const shareOnWhatsApp = () => {
    if (qrCode) {
      // Convert Base64 data to a blob URL
      const blob = dataURItoBlob(qrCode);
      const blobUrl = URL.createObjectURL(blob);

      // Create a message with the URL for WhatsApp
      const message = `Check out this QR code: ${blobUrl}`;

      // WhatsApp URL scheme to open the app with a pre-filled message
      const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      window.open(whatsappURL, '_blank');
    }
  };

  // Helper function to convert Base64 data to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-purple-600 to-indigo-900 text-white font-serif p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-800 h-auto w-full max-w-[700px] flex flex-col justify-center items-center gap-6 rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-4xl font-bold text-white mb-6">QR Code Generator</h1>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col justify-center items-center gap-8 w-full p-6 bg-gray-700 bg-opacity-80 border border-indigo-700 rounded-2xl shadow-xl"
        >
          <Label className="text-lg mb-2">Enter the URL to Generate a QR Code</Label>
          <Input
            className="p-4 w-full max-w-[500px] rounded-md text-black text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg"
            placeholder="Enter your URL here"
            name="text"
            value={text}
            onChange={handleChange}
          />

          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-white font-semibold text-lg p-3 px-10 rounded-full shadow-lg hover:shadow-2xl"
              onClick={generateQRCode}
            >
              Generate QR Code
            </Button>
          </motion.div>

          {qrCode && (
            <div className="mt-8 flex flex-col items-center">
              <h2 className="text-xl font-bold text-white mb-4">QR Code</h2>
              <img src={qrCode} alt="QR Code" className="mb-4 border border-white rounded-lg" />
              
              <div className="flex gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-500 transition-all duration-300 text-white font-semibold text-lg p-2 rounded-lg shadow-md hover:shadow-lg"
                  onClick={downloadQRCode}
                >
                  Download QR Code
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white font-semibold text-lg p-2 rounded-lg shadow-md hover:shadow-lg"
                  onClick={shareOnWhatsApp}
                >
                  Share on WhatsApp
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
