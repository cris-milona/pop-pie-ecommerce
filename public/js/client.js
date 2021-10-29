//variables
const heroBtn = document.querySelector('[data-hero-btn]');
const signInBtn = document.querySelector('[data-signin-btn]');
const signUpBtn = document.querySelector('[data-signup-btn]');

const logoutBtn = document.querySelector('[data-navbar-user-logout]');
//homepage section slide-box
const slideboxes = document.querySelectorAll('[data-favorites-slidebox]');
const nextImg = document.querySelector('[data-favorites-next]');
const previousImg = document.querySelector('[data-favorites-previous]');
const dots = document.querySelectorAll('[data-favorites-dot]');
//product image to see product card
const productImages = document.querySelectorAll('[data-img-product-id]');
//all buttons to add to cart
const addToCartBtns = document.querySelectorAll('[data-btn-product-id]');
//choose quantity and size from product card
const cardInputQuantity = document.querySelector('[name="card-quantity"]');
const cardInputPriceLarge = document.getElementById('card-sizeL');
const cardInputPriceSmall = document.getElementById('card-sizeS');
//buttons to see next and previous page of products
const nextProductsBtn = document.querySelector('[data-pagination-next]');
const previousProductsBtn = document.querySelector(
  '[data-pagination-previous]'
);
//delete button in the cart
const cartDeleteBtns = document.querySelectorAll('[data-cart-delete]');
//divs for each product in the cart
const itemstoDelete = document.querySelectorAll('[data-cart-item]');
//links in navbar and in product categories
const categoryLinks = document.querySelectorAll('[data-category-link]');
const navLinks = document.querySelectorAll('[data-nav-link]');
//cart calculations
const pricesArray = document.querySelectorAll('[data-cart-product-price]');
const quantitiesArray = document.querySelectorAll('[name=cart-quantity]');
const productSums = document.querySelectorAll('[data-cart-product-sum]');
const cartSubtotal = document.querySelector('[data-cart-checkout-subtotal]');
const cartTaxes = document.querySelector('[data-cart-checkout-taxes]');
const cartTotal = document.querySelector('[data-cart-checkout-total]');
//remove btns (admin panel)
const adminRemoveBtns = document.querySelectorAll('[data-admin-remove-btn-id]');
//edit btns(admin panel)
const adminEditBtns = document.querySelectorAll('[data-admin-edit-btn-id]');
//all a tags of the hole website
const anchorTags = document.querySelectorAll('a');

//hero buttton
if (heroBtn) {
  heroBtn.addEventListener('click', async () => {
    await axios.get('/products?page=1');
    window.location.href = '/products?page=1';
  });
}

//signin-signup buttons
if (signInBtn) {
  signInBtn.addEventListener('click', async () => {
    await axios.get('/signin');
    window.location.href = '/signin';
  });
}

if (signUpBtn) {
  signUpBtn.addEventListener('click', async () => {
    await axios.get('/signup');
    window.location.href = '/signup';
  });
}

//user logout button
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await axios.post('/logout');
    window.location.href = '/signin';
  });
}

// Favorites section slideshow
let count = 1;
const showNextImg = () => {
  if (count > slideboxes.length - 1) {
    count = 0;
  }
  for (i = 0; i < slideboxes.length; i++) {
    if (i !== count) {
      slideboxes[i].style.opacity = 0;
      dots[i].style.backgroundColor = '#b28c6a';
    } else {
      slideboxes[i].style.opacity = 1;
      dots[i].style.backgroundColor = '#493323';
    }
  }
  count++;
};

const showPreviousImg = () => {
  if (count > slideboxes.length + 1 || count < 2) {
    count = 5;
  }
  for (i = 0; i < slideboxes.length; i++) {
    if (i !== count - 2) {
      slideboxes[i].style.opacity = 0;
      dots[i].style.backgroundColor = '#b28c6a';
    } else {
      slideboxes[i].style.opacity = 1;
      dots[i].style.backgroundColor = '#493323';
    }
  }
  count--;
};

const showImg = (e) => {
  for (i = 0; i < dots.length; i++) {
    if (i !== parseInt(e.target.dataset.favoritesDot) - 1) {
      slideboxes[i].style.opacity = 0;
      dots[i].style.backgroundColor = '#b28c6a';
    } else {
      slideboxes[i].style.opacity = 1;
      dots[i].style.backgroundColor = '#493323';
    }
  }
  count = parseInt(e.target.dataset.favoritesDot);
};

if (nextImg || previousImg) {
  nextImg.addEventListener('click', showNextImg);
  previousImg.addEventListener('click', showPreviousImg);
}

if (dots) {
  dots.forEach((dot) => {
    dot.addEventListener('click', showImg);
  });
}

//click image to see product card
if (productImages.length > 0) {
  productImages.forEach((productImage) => {
    productImage.addEventListener('click', async () => {
      const id = productImage.dataset.imgProductId;
      await axios.get(`/products/${id}`);
      window.location.href = `/products/${id}`;
    });
  });
}

//add product to the cart(products page)
if (addToCartBtns.length > 0) {
  addToCartBtns.forEach((addToCartBtn) => {
    addToCartBtn.addEventListener('click', async () => {
      const id = addToCartBtn.dataset.btnProductId;
      if (!cardInputPriceLarge && !cardInputPriceSmall) {
        await axios.post('/products/cart', { id });
      } else {
        let price;
        if (cardInputPriceLarge.checked) {
          price = cardInputPriceLarge.value;
        } else {
          price = cardInputPriceSmall.value;
        }
        let quantity = cardInputQuantity.value;
        await axios.post('/products/cart', { id, price, quantity });
      }

      //change that refactor/////////////////
      alert('product added to cart');
    });
  });
}

//see next and previous page in products lists
const fetchNextPage = () => {
  const url = window.location.href;
  const urlWithoutLastChar = url.slice(0, -1);
  const newPageNumber = (parseInt(url.charAt(url.length - 1)) + 1).toString();
  const newUrl = urlWithoutLastChar + newPageNumber;
  window.location.href = newUrl;
};

const fetchPreviousPage = () => {
  const url = window.location.href;
  const urlWithoutLastChar = url.slice(0, -1);
  const newPageNumber = (parseInt(url.charAt(url.length - 1)) - 1).toString();
  const newUrl = urlWithoutLastChar + newPageNumber;
  window.location.href = newUrl;
};

if (nextProductsBtn) {
  nextProductsBtn.addEventListener('click', fetchNextPage);
}
if (previousProductsBtn) {
  previousProductsBtn.addEventListener('click', fetchPreviousPage);
}

//delete a product from the cart
if (cartDeleteBtns.length > 0) {
  cartDeleteBtns.forEach((cartDeleteBtn) => {
    cartDeleteBtn.addEventListener('click', async () => {
      const idToDelete = cartDeleteBtn.dataset.cartDelete;
      await axios.delete('/products/cart', { data: { id: idToDelete } });
      document.querySelector(`[data-cart-item="${idToDelete}"]`).remove();
      window.location.href = '/cart';
    });
  });
}

//focus on the navbar according to the page we are currently viewing
const activePage = window.location.pathname;
navLinks.forEach((link) => {
  if (link.href.includes(`${activePage}`) && activePage === '/') {
    navLinks[0].classList.add('active');
  } else if (link.href.includes(`${activePage}`)) {
    link.classList.add('active');
  }
});

//focus on product's categories navbar
const activeCategory = window.location.search.split('&')[0].split('=')[1];
categoryLinks.forEach((link) => {
  switch (activeCategory) {
    case 'fruit':
      categoryLinks[1].classList.add('active');
      break;
    case 'sweet':
      categoryLinks[2].classList.add('active');
      break;
    case 'savory':
      categoryLinks[3].classList.add('active');
      break;
    case 'vegan':
      categoryLinks[4].classList.add('active');
      break;
    default:
      categoryLinks[0].classList.add('active');
      break;
  }
});

//cart calucations
if (
  pricesArray.length > 0 &&
  quantitiesArray.length > 0 &&
  productSums.length > 0
) {
  calculateProductSum();

  quantitiesArray.forEach((quantityNum) => {
    quantityNum.addEventListener('change', calculateProductSum);
  });
}

function calculateProductSum() {
  pricesArray.forEach((price, i) => {
    productSums[i].innerText = `$ ${
      price.dataset.cartProductPrice * quantitiesArray[i].value
    }`;
    productSums[i].dataset.cartProductSum =
      price.dataset.cartProductPrice * quantitiesArray[i].value;
  });
  calculateCartTotals();
}

function calculateCartTotals() {
  let total = 0;
  productSums.forEach((productSum) => {
    total = total + Number(productSum.dataset.cartProductSum);
    console.log(total);
  });
  cartTotal.innerText = `$ ${total}`;
  let subtotal = parseFloat(total / 1.24).toFixed(2);
  let taxes = parseFloat(total - subtotal).toFixed(2);

  cartSubtotal.innerText = `$ ${subtotal}`;
  cartTaxes.innerText = `$ ${taxes}`;
}

//delete product from the database(admin panel)
if (adminRemoveBtns.length > 0) {
  adminRemoveBtns.forEach((adminRemoveBtn) => {
    adminRemoveBtn.addEventListener('click', async () => {
      const idToRemove = adminRemoveBtn.dataset.adminRemoveBtnId;
      await axios.delete('/admin/product/remove', {
        data: { id: idToRemove },
      });
      window.location.href = '/admin/panel';
    });
  });
}

//edit product from admin panel
if (adminEditBtns.length > 0) {
  adminEditBtns.forEach((adminEditBtn) => {
    adminEditBtn.addEventListener('click', async () => {
      const idToEdit = adminEditBtn.dataset.adminEditBtnId;
      window.location.href = `/admin/edit/${idToEdit}`;
    });
  });
}

//apply focus class on link focus
if (anchorTags) {
  anchorTags.forEach((anchor) => {
    anchor.addEventListener('keydown', function (e) {
      if (e.key == 'Tab') {
        anchor.classList.add('focuslink');
      } else {
        anchor.classList.remove('focuslink');
      }
    });
  });
}
