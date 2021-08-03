let cart = [];
let modalKey = 0;
let dataKey = 0;
let modalQt = 1;
const doc = (element) => document.querySelector(element); // retorna 1 item
const docAll = (element) => document.querySelectorAll(element); // retorna a lista

pizzaJson.map((item, index) => {
  fillInfoHomeScreen(item, index)
})

//Listagem das pizzas
function fillInfoHomeScreen(item, index){
    moverTopo();
    
    let pizzaItem = doc('.models .pizza-item').cloneNode(true);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `Apartir de R$ ${item.price[0].toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //evento de click para abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (event) => {
        event.preventDefault();
         // closest é para encontrar o item mais proximo de pizza item e pegar o attribute data-key que foi criada
         let key = event.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        doc('.pizzaBig img').src = pizzaJson[key].img;
        doc('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        doc('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[0].toFixed(2)}`;
        
        doc('.pizzaInfo--size.selected').classList.remove('selected');
        docAll('.pizzaInfo--size').forEach((size, sizeIndex) => {

            if(sizeIndex == 0){
                size.classList.add('selected');
            }
            
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        doc('.pizzaInfo--qt').innerHTML = modalQt;

        //animação para abertura do modal
        doc('.pizzaWindowArea').style.opacity = 0;
        doc('.pizzaWindowArea').style.display = 'Flex';
        setTimeout(() => {
            doc('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    })

   doc('.pizza-area').append(pizzaItem);
}

docAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//Eventos do Modal
function closeModal(){
    doc('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        doc('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

doc('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
   if(modalQt > 1){
    modalQt--;
    doc('.pizzaInfo--qt').innerHTML = modalQt;
   }
});

doc('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    doc('.pizzaInfo--qt').innerHTML = modalQt;
});

function selectedPriceSize(event){
    let clickedItem = event.currentTarget;
    dataKey = clickedItem.getAttribute('data-key');
    
    docAll('.pizzaInfo--size').forEach((element) => {
        element.classList.remove('selected');
    });
    clickedItem.classList.add("selected");
    doc('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[dataKey].toFixed(2)}`
}

docAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', selectedPriceSize);
});

doc('.pizzaInfo--addButton').addEventListener('click', () =>{
    moverTopo()
    let size = parseInt(doc('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id+'@'+size;
    
    // se ele encontrar o item o item ele retorna se não ele retorna -1
    let keyItem = cart.findIndex((item) => item.identifier == identifier);

    if(keyItem > -1) {
        cart[keyItem].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size:size,
            price:pizzaJson[modalKey].price[size],
            qt:modalQt 
        });
    }
    updateCart();
    closeModal();
})

function moverTopo(){
    window.scrollTo({
        top:0,
        left: 0,
        behavior: 'smooth'
    })
}

function decidirBotaoScrool(){
    if(window.scrollY === 0 ){
        doc('.subirTopo').style.display = 'none';
    }else{
        doc('.subirTopo').style.display = 'block';
    }
}

window.addEventListener('scroll', decidirBotaoScrool)

doc('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        doc('aside').style.left = '0';
    }
});

doc('.menu-closer').addEventListener('click', () => {
    doc('aside').style.left = '100vw';
})

function updateCart(){
    doc('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        doc('aside').classList.add('show');
        doc('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let cartItem = doc('.models .cart--item').cloneNode(true);
            let pizzaItem = pizzaJson.find((item) =>  item.id == cart[i].id);
            subtotal += cart[i].price * cart[i].qt;
           
           let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P - R$ 19.00 Un';
                    break;
                case 1:
                    pizzaSizeName = 'M - R$ 27.00 Un';
                    break;
                case 2:
                    pizzaSizeName = 'G - R$ 40.00 Un';
                    break;
            }
           
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSizeName}) `;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                  cart[i].qt--;
                }else{
                  cart.splice(i, 1);
                }
                updateCart();
             });
             
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
             });
            

            doc('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        doc('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        doc('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        doc('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`; 

    }else{
        doc('aside').classList.remove('show');
        doc('aside').style.left = '100vw';
    }
}