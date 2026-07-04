const taxSwitch = document.getElementById("taxSwitch");
const prices = document.querySelectorAll(".listing-price");

taxSwitch.addEventListener("change", () => {

    prices.forEach(price => {

        const originalPrice = Number(price.dataset.price);

        if(taxSwitch.checked){
            const total = Math.round(originalPrice * 1.18);

            price.innerHTML = `&#8377; ${total.toLocaleString("en-IN")}`;
        }
        else{
            price.innerHTML = `&#8377; ${originalPrice.toLocaleString("en-IN")}`;
        }

    });

});
