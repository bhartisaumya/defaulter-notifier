// import dotenv from 'dotenv';
// dotenv.config();

// import http from 'http';

// const phoneNumberId = process.env.PHONE_NUMBER_ID;  // Your WhatsApp phone number ID
// const accessToken = process.env.ACCESS_TOKEN;       // Your access token
// const recipientPhone = '91XXXXXXXXXX';              // Recipient phone number in international format
// const message = 'Hello, this is a message from my WhatsApp Business account!';

// const sendMessage = async () => {
//   try {
//     const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
//     const response = await http.request(url, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         messaging_product: 'whatsapp',
//         to: recipientPhone,
//         text: { body: message },
//       }),
//     });
//     console.log('✅ Message sent:', response.data);
//   } catch (error) {
//     console.error('❌ Error sending message:', error.response?.data || error.message);
//   }
// };
    
// //     (
// //       url,
// //       {
// //         messaging_product: 'whatsapp',
// //         to: recipientPhone,
// //         text: { body: message },
// //       },
// //       {
// //         headers: {
// //           Authorization: `Bearer ${accessToken}`,
// //           'Content-Type': 'application/json',
// //         },
// //       }
// //     );
// //     console.log('✅ Message sent:', response.data);
// //   } catch (error) {
// //     console.error('❌ Error sending message:', error.response?.data || error.message);
// //   }
// // };

// // sendMessage();
