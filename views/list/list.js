(function(app) {
  const bindFormPost = (forms) => {
    for (const form of forms) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const payload = app.form.parse(form);

        app.xhr('put', form.action, payload, (status) => {
          if (status !== 404) {
            return;
          }

          // cart might not exist so need to create one
          app.xhr('post', form.action, null, (status) => {
            if (status !== 200) {
              return;
            }

            // one cart is created we can try to post again
            app.xhr('put', form.action, payload);
          });
        });
      });
    }
  };

  const renderList = (products) => {
    let html = '';
    const el = document.getElementsByClassName('js-list-table')[0];

    for (const product of products) {
      html += `
        <tr class="list-table__row">
          <td class="list-table__column">${product.product}</td>
          <td class="list-table__column">${product.ingredients}</td>
          <td class="list-table__column list-table__column--right">
            &dollar;${product.price.USD}
          </td>
          <td class="list-table__column list-table__column--right">
            <form action="api/cart">
              <button type="submit" class="[ js-add-cart ]">Add to cart</button>
              <input name="product" value="${product.product}" type="hidden" />
              <input name="amount" value="1" type="hidden" />
            </form>
          </td>
        </tr>
      `;
    }

    el.innerHTML = html;

    // event binding
    bindFormPost(el.getElementsByTagName('form'));
  };

  const init = () => {
    app.xhr('GET', 'api/product', null, (status, products) => {
      if (status === 200 && products) {
        renderList(products);
      }
    });
  };

  init();
}(window.app = window.app || {}));
