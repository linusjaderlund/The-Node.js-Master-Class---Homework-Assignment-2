(function(app) {
  const bindFormPost = (forms) => {
    for (const form of forms) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const payload = app.form.parse(form);

        app.xhr('delete', form.action, payload, (status) => {
          if (status !== 200) {
            return;
          }

          const row = form.parentNode.parentNode;
          row.parentNode.removeChild(row);
        });
      });
    }
  };

  const renderList = (products) => {
    let html = '';
    const el = document.getElementsByClassName('js-list-table')[0];

    // clearing element if rerendering
    el.innerHTML = '';

    for (const product of products) {
      html += `
        <tr class="list-table__row">
          <td class="list-table__column">${product.product}</td>
          <td class="list-table__column">${product.ingredients}</td>
          <td class="list-table__column list-table__column--right">
            ${product.amount}
          </td>
          <td class="list-table__column list-table__column--right">
            &dollar;${(product.amount * product.price.USD).toFixed(2)}
          </td>
          <td class="list-table__column list-table__column--right">
            <form action="api/cart">
              <button type="submit" class="[ js-add-cart ]">Remove</button>
              <input name="product" value="${product.product}" type="hidden" />
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
    app.xhr('GET', 'api/cart', null, (status, products) => {
      if (status === 200 && products) {
        renderList(products);
      }
    });

    app.form.subscribe('payment', (form, payload) => {
      app.xhr(form.method, form.action, payload, (status) => {
        console.log('Payment status: ', status);

        if (status === 200) {
          app.xhr('delete', 'api/cart', null, () => {
            console.log('Cart delete status: ', status);

            if (status === 200) {
              window.location.href = '';
            }
          });
        }
      });
    });
  };

  init();
}(window.app = window.app || {}));
