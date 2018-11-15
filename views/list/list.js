(function(app) {
  const renderList = (products) => {
    let html = '';
    const el = document.getElementsByClassName('js-list-table')[0];

    for (const product of products) {
      html += `
        <tr class="list-table__row">
          <td class="list-table__column">${product.product}</td>
          <td class="list-table__column">${product.ingredients}</td>
          <td class="list-table__column list-table__column--right">&dollar;${product.price.USD}</td>
          <td class="list-table__column list-table__column--right">
            <button class="[ js-add-cart ]">Add to cart</button>
          </td>
        </tr>
      `;
    }

    el.innerHTML = html;''
  }

  const init = () => {
    app.xhr('GET', 'api/product', null, (status, products) => {
      console.log(status, products);

      if (status === 200 && products) {
        renderList(products);
      }
    });
  };

  init();
}(window.app = window.app || {}));
