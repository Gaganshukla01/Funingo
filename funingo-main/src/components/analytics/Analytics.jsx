import React from 'react';
import RestaurantSales from './RestaurantSales';
import TicketCounter from './TicketCounter';
import PartySales from './PartySales';

const Analytics = () => {
    return (
            <div className="analytics">
             <div style={{display:"flex", flexDirection:"row"}}>
                 <RestaurantSales/>
                 <TicketCounter/>
             </div>

                <PartySales/>
            </div>
    );
};

export default Analytics;