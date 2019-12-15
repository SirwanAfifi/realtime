const getData = () => {
    var productList = [];
    for (let i = 0; i < 10; i++) {
        productList.push({ Id: i + 1, Title: `Product ${i + 1}`, Price: Math.floor(Math.random() * 100000) + 5000 });
    }
    return productList;
}

module.exports = getData;