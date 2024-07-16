import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import logo from './logo.svg';
import React, { useState, useEffect, useRef } from 'react';
import './App.css';


function App() {

  //Form data
  const [formData, setFormData] = useState({
    mobileNumber: '',
    dialingCode: '+92',
    emailAddress: '',
    pinType: 1,
    title: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    accountId: '',
  });

  //Card data
  const [cardData, setCardData] = useState({
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
  });


  //variables
  const [pinSent, setPinSent] = useState(false); // to check wether the pin is sent or not
  const [pinVerified, setPinVerified] = useState(false); // to check if pin is verified or not

  const [pinCode, setPinCode] = useState(['', '', '', '', '']); // For taking five digits as input

  //Card Input
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps, getCardImageProps } = usePaymentInputs();

  const [cardError, setCardError] = useState('')

  const [serverResponse, setServerResponse] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [error, setError] = useState('');

  //Visa Instrument
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCVC] = useState('');
  const [cardNum, setCardNum] = useState('');



  


// for taking expiry date as input 
const handleExpiryDateChange = (e) => {
  setExpiryDate(e.target.value);
};  
// for taking cvc as input 
const handleCvcChange = (e) => {
  setCVC(e.target.value);
};  
// for taking cvc as input 
const handleCardNum = (e) => {
  let value = e.target.value.replace(/\s+/g, '');
    if (/^\d*$/.test(value)) {
      setCardNum(value);
    }
}; 




// for taking input 
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


// for focus
const handleInputFocus = (e) => {
  setCardData((prevCardData) => ({
    ...prevCardData,
    focus: e.target.name,
  }));
};  

 
// for taking card details as input
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

  setCardData((prevCardData) => ({
    ...prevCardData,
    [name]: value,  
  }));

};






// for taking PIN as input
  const handlePinCodeChange = (e,index) => {
    const newPinCode = [...pinCode]; // copy the PIN code 
    newPinCode[index] = e.target.value; // storing the value at that particular index

    setPinCode(newPinCode); // storing pin code

    //Focusing on the next input box
    if (e.target.value && index < 4) {
      document.getElementById(`pin-${index + 1}`).focus();
    }

    if(newPinCode.every(digit => digit !== '')){
      verifyPin(newPinCode.join(''))
    }

  };





  // SEND PIN CODE

  const sendPin = async () => {
    try {
      const response = await fetch('Api for Sending Pin Code', {
        method: 'POST',
        headers: {
          'x-api-key': 'key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        setPinSent(true);
        setError('');
      } else {
        throw new Error('Failed to send PIN. Status: ' + response.status);
      }
    } catch (error) {
      console.error('Error sending PIN:', error);
      setError('Error sending PIN: ' + error.message);
    }
  };



  // VERIFY PIN CODE


  const verifyPin = async (pin) => {
    try {
      const verifyResponse = await fetch('Api for verifying Pin', {
        method: 'POST',
        headers: {
          'x-api-key': 'key',
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({
          dialingCode: formData.dialingCode,
          mobileNumber: formData.mobileNumber,
          email: formData.emailAddress,
          pinCode: pin,
        }),
      });

      if (verifyResponse.status === 200) {
        setPinVerified(true);
      } else {
        throw new Error('Failed to verify PIN. Status: ' + verifyResponse.status);
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
    }
  };


  // Visa Instrument

  const sendVisaInstrument = async (accountId) => {
    try {

      if (!expiryDate) {
        console.log('Expiry date is undefined. Please enter a valid expiry date.')
        console.log(expiryDate);
        setCardError('Expiry date is undefined. Please enter a valid expiry date.');
        return;
      }

      if (!cvc) {
        console.log('cvc is undefined. Please enter a valid cvc.')
        console.log(cvc);
        setCardError('cvc is undefined. Please enter a valid cvc.');
        return;
      }

      if (!cardNum) {
        console.log('card no is undefined. Please enter a valid card no.')
        console.log(cardNum);
        setCardError('card no is undefined. Please enter a valid card no.');
        return;
      }

      console.log(expiryDate);

      //console.log(expiryDate.slice(0,2));
      //console.log(expiryDate.slice(4,6));

      const [cardMonth, cardYear] = expiryDate.split('/').map(str => str.trim());;

      console.log(cardMonth);
      console.log(cardYear);
      console.log(cvc);
      console.log(cardNum);

      
      
      

      

      const visaInstrumentResponse = await fetch('Api for Adding Visa Direct Instrument', {
        method: 'POST',
        headers: {
          'x-api-key': 'Key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: accountId,
          title: formData.title,
          visaDirectCard: {
            cardNumber: cardNum,
            title: formData.title,
            firstName: formData.firstName,
            lastName: formData.lastName,
            cardMonth: cardMonth, // Assuming MM/YY format
            cardYear: cardYear, // Assuming MM/YY format
            cvv: cvc,
            addressLine1: formData.address,
            addressLine2: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipcode,
            phoneNumber: formData.mobileNumber,
          }
        }),
      });

      if (visaInstrumentResponse.status === 200) {
        const visaData = await visaInstrumentResponse.json();
        console.log('Visa Instrument Data:', visaData);
        alert('Visa instrument sent successfully!');
      } else {
        const errorData = await visaInstrumentResponse.json();
        console.log('Server response : ', errorData);
        throw new Error('Failed to send visa instrument. ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error sending visa instrument:', error);
      setCardError(error.message);
    }
  };



  // SEND CARD DETAILS

  const handleCardSubmit = async (e) => {
    e.preventDefault();


    try {
      const cardResponse = await fetch('Api for Adding Account', {
        method: 'POST',
        headers: {
          'x-api-key': 'key',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          dialingCode: formData.dialingCode,
          mobileNumber: formData.mobileNumber,
          email: formData.emailAddress,
        }),
      });

      if (cardResponse.status === 200) {
        const responseData = await cardResponse.json();
        const accountId = responseData.data;
        console.log('Account ID:', accountId);

        setFormData({
          ...formData,
          accountId: accountId,
        });

        await sendVisaInstrument(accountId);
        alert('Card details sent successfully!');
      } else {
        alert('Card details Failed');
        const responseData = await cardResponse.json();
        console.log('Server Response:', responseData);
        const errorData = await cardResponse.json();
        setCardError('Failed to send card details: ' + errorData.message);
        throw new Error('Failed to send card details. Status: ' + cardResponse.status);
      }


      const responseData = await cardResponse.json();
      console.log('Server Response:', responseData);
      setServerResponse(responseData);


    } catch (error) {
      console.error('Error sending card details:', error);
    }



    
  };


  useEffect(() => {
    const isFormValid =
      formData.mobileNumber.length === 10 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress);
    if (isFormValid && !pinSent) {
      sendPin();
    }
  }, [formData]);



  return (
    <div className="container">

      <div className="left-side"> 

        {/*-------------------------------------------FORM---------------------------------- */}
        <form onSubmit={handleCardSubmit} className="form">

          <div className='form-group'>
            <input 
              type="text"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              placeholder='Email'
              required
            />

            <div className='form-group'>

              <div className='mobile-inputs'>

                
                <select
                  name="dialingCode"
                  value={formData.dialingCode}
                  onChange={handleChange}
                  required
                  >

                  <option value="+92">+92</option>
                  <option value="+1">+1</option>

                </select>

                {/* <input
                  type="text"
                  name="dialingCode"
                  value={formData.dialingCode}
                  onChange={handleChange}
                  required
                /> */}
                
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  minLength="10"
                  maxLength="10"
                  placeholder='Phone'
                  required
                />


              </div>

            </div>
          
          </div>

          {pinSent && (
            <div className='form-group'>

              <label>PIN Code:</label>

              {/*--------To display PIN Code input field---------*/}

              <div className='pin-inputs'>
                {
                  pinCode.map((digit,index) => (

                    <input
                      key={index}
                      id={`pin-${index}`}
                      type="text"
                      value={digit}
                      onChange={ (e) => handlePinCodeChange(e,index) }
                      maxLength="1"
                      className='pin-input'
                      required
                    />

                  ))
                }
              </div>
              
            </div>
          )}
          {pinVerified && (

            <div>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder='Title'
                className='form-group'
                required
              />

              <div className='row'>

                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder='First Name'
                  className='form-group'
                  required
                />

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='Last Name'
                  className='form-group'
                  required
                />

              </div>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder='Address'
                className='form-group'
                required
              />

              <div className='row'>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder='City'
                  className='form-group'
                  required
                />

                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder='State'
                  className='form-group'
                  required
                />

              </div>

              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder='Zip Code'
                className='form-group'
                required
              />

              <PaymentInputsWrapper {...meta}>

                <svg {...getCardImageProps({ images })} />

                <input {...getCardNumberProps({ placeholder: 'Card number', onChange: handleCardNum})}
                />

                <input {...getExpiryDateProps({ placeholder: 'MM/YY', onChange: handleExpiryDateChange})}
                />

                <input {...getCVCProps({ placeholder: 'CVC', onChange: handleCvcChange})}
                />

              </PaymentInputsWrapper>

            </div>

          )
            
          }



          {pinVerified && (

            <div className='button-container'>
              <button type="submit"> Send Card Details </button>
            </div>

          )}

        

          

          

        </form>


        {/* 
        {cardError && <div className="error-box"><span className="error-message">{cardError}</span></div>}
          */}
        

        

      </div>

      <div className="right-side">

        <img src={logo} className="App-logo" alt="logo"/>

      </div>



    </div>

    

    
  );
}

export default App;

