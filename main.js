let addButton=document.querySelectorAll('.add_car');
let shoppingnumber=document.querySelector('.shoppingnumber');
let products=[
  {
    name: "guitar",
    price: 3000,
    tag: "guitar",
    incart: 0, 
  },
  {
    name: "piano",
    price: 25000,
    tag: "piano",
    incart: 0, 
  },
  {
    name: "ukulele",
    price: 900,
    tag: "ukulele",
    incart: 0, 
  },
  {
    name: "drums",
    price: 45000,
    tag: "drums",
    incart: 0, 
  },
  {
    name: "speaker",
    price: 1600,
    tag: "speaker",
    incart: 0, 
  },
  {
    name: "bass",
    price: 4200,
    tag: "bass",
    incart: 0, 
  },
];

for(let i=0;i<addButton.length;i++){
  addButton[i].addEventListener("click",()=>{
    // console.log(products[i]);
    cartNumber();
    cartItems(products[i]);
  })
};

// 畫面更新
function updateCartNumber(){
  let productNumber=localStorage.getItem('productNumber');
  shoppingnumber.textContent=productNumber;
}

// 資料及購物車畫面總數量
// 判斷裡面有沒有數量，如果沒有初始化是1，如果有則加1
function cartNumber(action){
  let productNumber=localStorage.getItem('productNumber');
  productNumber=parseInt(productNumber);
  // console.log(typeof(productNumber));
  if(action=='decrease'){
    localStorage.setItem('productNumber',productNumber=productNumber-1);
    shoppingnumber.textContent=productNumber;
  }else if(productNumber){
    // productNumber=parseInt(productNumber);
    localStorage.setItem('productNumber',productNumber+=1);
    shoppingnumber.textContent=productNumber;
  }else{
    localStorage.setItem('productNumber',1);
    shoppingnumber.textContent=1;
  }
  
};

// 資料裡每一個商品，及個別物品購物數量
// 如果裡面沒有則預設為1，有的化加1
// 如果有一樣的物品incart就加1，如果沒有一樣的物件就創一個
function cartItems(product){
  // console.log(product);
  let cartItem=localStorage.getItem('cartItems');
  cartItem=JSON.parse(cartItem);
  
  if(cartItem!=null){
    if(cartItem[product.tag]==undefined){
      cartItem={
        ...cartItem,
        [product.tag]:product
        // product.incart=1;
      };
    }
    cartItem[product.tag].incart+=1 
  }else{
    product.incart=1;
    cartItem={
      [product.tag]:product
    };
  }
  localStorage.setItem('cartItems',JSON.stringify(cartItem)); 
  totalPrice(product);
};

// 每個商品價格總和
// 第一次點total是物品價格，第二次點則把第一次點的加上去
function totalPrice(product,action){
  let total=localStorage.getItem('price');
  total=parseInt(total);
  if(action=='decrease'){
    localStorage.setItem('price',total-product.price);
    console.log(total-product.price)
  }else if(total){
    // total=parseInt(total);
    localStorage.setItem('price',total+product.price);
  }else{
    localStorage.setItem('price',product.price);
  }
};

// 做購物車畫面
// -使用 Object.values 取得物件的 value，組成陣列。
// 承上，使用 Array.map 將陣列中的特定屬性值取出，組成新陣列後回傳。
// const nameList = Object.values(list).map(item => item.name);
// ["Nina Ricci", "Hello Kitty", "Pusheen the cat"]
function shoppingCart(){
  let cartItem=localStorage.getItem('cartItems');
  let total=localStorage.getItem('price');
  cartItem=JSON.parse(cartItem);
  total=parseInt(total);
  let carts=document.querySelector('.carts');
  if(cartItem && carts){
    carts.innerHTML='';
    Object.values(cartItem).map(item=>{
      carts.innerHTML+=`
        <div class="cart-wrap">
          <div class="product-container">
            <ion-icon class="product-delete" name="trash-outline"></ion-icon>
            <img class="product-img" src="images/${item.tag}.jpg" alt="">
            <div class="product-title">${item.name}</div>
          </div>
          <div class="product-price">$${item.price}</div>
          <div class="product-quantity">
            <ion-icon class="decrease" name="caret-back-circle-outline"></ion-icon>
              <div class="product-incart">${item.incart}</div>
            <ion-icon class="increase" name="caret-forward-circle-outline"></ion-icon>
          </div>
          <div class="product-total">$${item.incart*item.price}</div>
        </div>
        `;
    })
  }
  carts.innerHTML+=`
  <div class="totals">共計：$${total}</div>
  `
  deleteProduct();
  quantityProduct();
};

// 刪除商品，改變總數量、總價格、畫面更新
function deleteProduct(){
  let delteBtn=document.querySelectorAll('.product-delete');
  let cartItem=localStorage.getItem('cartItems');
  cartItem=JSON.parse(cartItem);
  let productNumber=localStorage.getItem('productNumber');
  productNumber=parseInt(productNumber);
  let total=localStorage.getItem('price');
  total=parseInt(total);

  for(let i=0;i<delteBtn.length;i++){
    delteBtn[i].addEventListener('click',()=>{
      let productName=delteBtn[i].parentNode.textContent.trim();
      localStorage.setItem('price',total-(cartItem[productName].incart*cartItem[productName].price));
      localStorage.setItem('productNumber',productNumber-cartItem[productName].incart);
      delete cartItem[productName];
      localStorage.setItem('cartItems',JSON.stringify(cartItem)); 
      // console.log(cartItem[productName])
      updateCartNumber();
      shoppingCart();
    })
  }
};
// 數量增減
// 參考網址
// https://medium.com/when-you-feel-like-quitting-think-about-why-you/%E6%96%87%E4%BB%B6%E7%89%A9%E4%BB%B6%E6%A8%A1%E5%9E%8B-document-object-model-%E7%B0%A1%E7%A8%B1-dom-%E7%AD%86%E8%A8%98%E8%A3%9C%E5%85%85-fafde37ddb14
function quantityProduct(){
  let decreaseBtn=document.querySelectorAll('.decrease');
  let increaseBtn=document.querySelectorAll('.increase');
  let cartItem=localStorage.getItem('cartItems');
  cartItem=JSON.parse(cartItem);
  let quantity=0;
  let currentProduct='';
  for(let i=0;i<decreaseBtn.length;i++){
    decreaseBtn[i].addEventListener('click',()=>{
      quantity=decreaseBtn[i].parentElement.querySelector('.product-incart').textContent;
      // console.log(quantity)
      currentProduct=decreaseBtn[i].parentElement.previousElementSibling.previousElementSibling.textContent.trim();
      // console.log(cartItem[currentProduct])
      if(cartItem[currentProduct].incart>=1){
        cartItem[currentProduct].incart=cartItem[currentProduct].incart-1;
        localStorage.setItem('cartItems',JSON.stringify(cartItem));
        cartNumber('decrease');
        totalPrice(cartItem[currentProduct],'decrease');
        shoppingCart()
      }
    })
  };
  for(let i=0;i<increaseBtn.length;i++){
    increaseBtn[i].addEventListener('click',()=>{
      quantity=increaseBtn[i].parentElement.querySelector('.product-incart').textContent;
      // console.log(quantity)
      currentProduct=increaseBtn[i].parentElement.previousElementSibling.previousElementSibling.textContent.trim();
      // console.log(cartItem[currentProduct])
      cartItem[currentProduct].incart=cartItem[currentProduct].incart+1;
      localStorage.setItem('cartItems',JSON.stringify(cartItem));
      cartNumber();
      totalPrice(cartItem[currentProduct]);
      shoppingCart();
    })
  }
}

updateCartNumber();
shoppingCart();