import React, { useState, useRef, useEffect } from 'react';
import headphone from './assets/cougar_headphone.png'
import './App.css';

function App() {
  const clientId = ''
  const [paidFor, setPaidFor] = useState(false)
  const [loaded, setLoaded] = useState(false)

  let paypalRef = useRef()

  const product = {
    price: 100.00,
    description: 'headphone',
    img: headphone
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://www.paypal.com/sdk/js?client-id=' + clientId
    script.addEventListener('load', () => setLoaded(true))
    document.body.appendChild(script)

    if (loaded) {
      setTimeout(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: product.description,
                    amount: {
                      currency_code: 'USD',
                      value: product.price,
                    }
                  }
                ]
              })
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture()

              setPaidFor(true)

              console.log(order)
            }
          }).render(paypalRef)
      })
    }
  })

  return paidFor ? (<div>
    <h1>Congrats</h1>
  </div>) : (
      <div>
        <h1>{product.description} for USD {product.price}</h1>
        <img src={headphone} />
        <div ref={v => (paypalRef = v)}></div>
      </div>
    )
}

export default App;
