window.viewDetails = function (element) {
    console.log("Entró a viewDetails");

    const id = Number(element.dataset.id);

    window.location.href = `/product-detail/index.html?id=${id}`;
};
