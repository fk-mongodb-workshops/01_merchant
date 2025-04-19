import moment from "moment";

const customerToStoryFn = customerObj => {
    let ret = `This is story about me. My name is ${customerObj.profile.name}. `;
    ret = ret + `My total spent until this present is as follow, total amount ${customerObj.to_date.total_spent} Rupiah and ${customerObj.to_date.total_litres} litres. `;
    ret = ret + `My average spent is as follow, amount ${customerObj.to_date.average_spent} Rupiah and ${customerObj.to_date.average_litres} litres. `;
    ret = ret + `I mostly visited this gas station ${customerObj.to_date.most_spbu}. `;
    ret = ret + `I mostly purchased this product ${customerObj.to_date.most_product}. `;
    ret = ret + `My last refueled amount is ${customerObj.last_refuel.total_spent} Rupiah and ${customerObj.last_refuel.total_litres} litres, at this fuel station ${customerObj.last_refuel.spbu}, on ${moment(customerObj.last_refuel.date, "YYYY-MM-DD HH:mm").format("DD-MMM-YYYY HH:mm")}, this product ${customerObj.last_refuel.product}. `;
    ret = ret + `The following is my most recent refueling activities: `;
    for (let i = 0; i < customerObj.refuels.length; i++) {
        const r = customerObj.refuels[i];
        ret = ret + `On ${moment(r.date, "YYYY-MM-DD HH:mm").format("DD-MMM-YYYY HH:mm")} at this fuel station ${r.spbu}, refueled ${r.litres} litres of this product ${r.product} as much as ${r.amount}, `;
    }
    return ret;
}

const salesToStoryFn = salesObj => {
    let ret = `Refuel happened on ${moment(salesObj.date).format("DD-MMM-YYYY HH:mm")} at this station (or SPBU) ${salesObj.station} and this region ${salesObj.region}, as much as ${salesObj.litre} litres of this product ${salesObj.product} and costed ${salesObj.amount} rupiah. `
    return ret;
}

export { customerToStoryFn as customerToStory, salesToStoryFn as salesToStory };