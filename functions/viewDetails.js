window.viewDetails = function (element) {
    console.log("entro");
    const id = Number(element.dataset.id);
    const name = element.dataset.name;
    const pricing = Number(element.dataset.pricing);
    const category = element.dataset.category;
    const description = element.dataset.description;
    const origen = element.dataset.origen;
    const picture = element.dataset.picture;
    const sales_format = element.dataset.sales_format;
    const discount = Number(element.dataset.discount);
    const price_discount = Number(element.dataset.price_discount);
    const rating = Number(element.dataset.rating);
    const country = element.dataset.country;
    const stock = element.dataset.stock === 'true';

    const product = {
        id: id,
        name: name,
        pricing: pricing,
        category: category,
        description: description,
        origen: origen,
        picture: picture,
        sales_format: sales_format,
        discount: discount,
        price_discount: price_discount,
        rating: rating,
        country: country,
        stock: stock,
        quantity: 1
    };
    localStorage.setItem("currenProduct", JSON.stringify(product));
    window.location.href = "../product-detail/index.html";
}