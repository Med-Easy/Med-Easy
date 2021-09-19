import './CustomerCard.scss'
import React from 'react'

export default function CustomerCard({
    order
}) {
    console.log('card', order.declineReason);
    return (
        <div className='customer-card-box'>
            <div>Medicine: {order.name}</div>
            <div>Customer Name: {order.customer}</div>
            <div>Customer Address: {order.address}</div>
            <div>Distance: {order.distance}</div>
            <div>Customer Contact: {order.phone}</div>
            <div>Order date: {order.date}</div>
            {
                order.confirmed===false && order.declineReason !== "" ? (
                    <div>Reason: {order.declineReason}</div>
                ) : ''
            }
        </div>
    )
}
