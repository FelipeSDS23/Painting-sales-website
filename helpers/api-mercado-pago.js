async function gerar_link_de_pagamento(res, paintings) {

    const paintingsObjectsArray = paintings.map((painting) => {
        return {
            id: painting.id,
            title: painting.name,
            picture_url: `http://localhost:3000/img/paintings/${painting.image}`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: Number(painting.price),
        }
    })


	// Step 1: Import the parts of the module you want to use
	const { MercadoPagoConfig, Preference } = require("mercadopago");

	// Step 2: Initialize the client object
	const client = new MercadoPagoConfig({ accessToken: process.env.TOKEN_MERCADO_PAGO, options: { timeout: 5000, idempotencyKey: 'abc' } });

	// Step 3: Initialize the API object
	const preference = new Preference(client);

	// Step 4: Create the request object
	const body = {
		items: paintingsObjectsArray,
		back_urls: {
			success: 'http://localhost:3000',
			failure: 'http://localhost:3000',
			pending: 'http://localhost:3000',
		},
		auto_return: 'approved',
	};

	// Step 6: Make the request
	const response = await preference.create({ body })
		.then((response) => {
			// console.log(res)
			// console.log(response.init_point)
			res.redirect(`${response.init_point}`);
		}).catch((err) => {
			console.log(err);
		});
	
}

module.exports = gerar_link_de_pagamento;