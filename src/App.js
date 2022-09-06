import './App.css';
import React from 'react';
import {products, fields} from './data';


class App extends React.Component{
  constructor(props){
    super(props);
    let sort = [];
    for (let field of fields){
      sort[field.name] = true; //true - сортировка по возрастанию, false - по убыванию
    }
    sort['id'] = true;
    this.state={
      productList: products,
      cartList: [],
      cartSet: new Set(),
      isCartOpen: false,
      sort: sort
    }
    this.sortProductsByLabel('id');
  }

  renderProducts(){
    return <div>
      <table><thead>
        <tr className="basket__header">
          {fields.map((field)=>{
            const isBasketFiled = field.name === '';
            const arrowStyle = this.state.sort[field.name] ? ' arrow__down' : '';
            const name = field.name;
            return <th key={name} className='basket__header-text basket__table-text' style={{width: field.width}}>
                <div style={{display: 'flex', justifyContent: "center"}}>
                  {isBasketFiled ? null : <p className='sortable-head' onClick={()=>{this.sortProductsByLabel(name, !this.state.sort[name])}}>{field.label}</p>}
                  {isBasketFiled ? null
                    : <svg className={'arrow' + arrowStyle} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 54" width='20px' height='20px' onClick={()=>{
                      let sort = this.state.sort;
                      this.sortProductsByLabel(name, sort[name]);
                      sort[name] = !sort[name];
                      this.setState({sort: sort});
                    }}>
                        <g>
                          <path d="M0,0v54h54V0H0z M52,52H2V2h50V52z"/>
                          <path d="M10.707,35.707L27,19.414l16.293,16.293C43.488,35.902,43.744,36,44,36s0.512-0.098,0.707-0.293
                            c0.391-0.391,0.391-1.023,0-1.414L27,16.586L9.293,34.293c-0.391,0.391-0.391,1.023,0,1.414S10.316,36.098,10.707,35.707z"/>
                        </g>
                    </svg>
                  }
                </div>
              </th>
          })}
        </tr>
      </thead>
      <tbody>
        {this.state.productList.map((item) =>{
          return this.renderProductItem(item);
        })}
      </tbody></table>
    </div>
  }

  renderProductItem(item){
    const things = ['штук', 'штука', 'штуки', 'штуки', 'штуки'];
    const thing = item.inPackage >= things.length ? things[0] : things[item.inPackage] ;
    let price = item.price * (1 - item.discount / 100);
    price = +price.toFixed(2);
    const cartSet = this.state.cartSet;
    const cart = this.state.cartList;
    const index = this.getItemIndexById(item.id);
    const isDiscount = item.discount > 0
    return <tr key={item.id}>
      <td className='basket__product-text basket__table-text bold' style={{textAlign: 'left'}}>{item.name}</td>
      <td className='basket__product-text basket__table-text' style={{textAlign: 'center'}}>{item.inPackage + ' ' + thing}</td>
      <td className='basket__product-text basket__table-text' style={{textAlign: 'center'}}>{isDiscount ? item.discount + '%' : ''}</td>
      <td className='basket__product-text basket__table-text bold' style={{textAlign: 'center'}}>
        {isDiscount ?
        <div>
          <p className='discounted-price'>{price + 'Р'}</p>
          <p className='discounted-start-price'>{item.price + 'Р'}</p>
        </div>
        : <p>{item.price + 'Р'}</p>
        }
      </td>
      <td>
        <div style={{width: 'fit-content', margin:'0 auto'}}>
        {cartSet.has(item.id) ?
          this.drawCountControl(item, cart[index])
          : item.count > 0 ? <input className='basket__addcart-btn bold' type='button' value='Добавить в корзину' onClick={()=>{this.addItemToCart(item.id)}}/> : 'Нет в наличии'}
        </div>
      </td>
        
    </tr>
  }

  render(){
    const cart= this.state.cartList;
    const isOpen = this.state.isCartOpen
    const cartStyle =  isOpen ? ' cart-open' : '';
    const isNotEmpty = cart.length > 0;
    const shopCartStyle = isNotEmpty ? '' : ' basket__empty-cart';
    const counterStyle = isOpen ? ' cart-open' : ''
    let sum = 0;
    return (
      <div className='wrapper'>
        <header className="header">
            <div>
              <svg className={'basket__cart-icon' + cartStyle} width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={()=>{this.setState({isCartOpen: !isOpen})}}>
                <path d="M21 9h-1.42l-3.712-6.496-1.736.992L17.277 9H6.723l3.146-5.504-1.737-.992L4.42 9H3a1.001 1.001 0 0 0-.965 1.263l2.799 10.264A2.005 2.005 0 0 0 6.764 22h10.473c.898 0 1.692-.605 1.93-1.475l2.799-10.263A.998.998 0 0 0 21 9zm-3.764 11v1-1H6.764L4.31 11h15.38l-2.454 9z"/>
                <path d="M9 13h2v5H9zm4 0h2v5h-2z"/>
              </svg>
              {isNotEmpty ? <p className={'counter bold' + counterStyle} onClick={()=>{this.setState({isCartOpen: !isOpen})}}>{cart.length}</p> : null}
            </div>
            {isOpen ?
              <div className={'shopcart' + shopCartStyle}>
                <div className={'shopcart__list'}>
                  {isNotEmpty ? 
                    cart.map(item =>{
                      let product = products.filter(prod =>{
                        return item.id === prod.id;
                      })[0];
                      let price = product.price * (1 - product.discount / 100);
                      price = +price.toFixed(2);
                      sum += price * item.count;
                      return <div className='basket__shopping-cart table__vert-space'>
                        <p className='cart__name'>{product.name}</p>
                        <p className='cart__price'>{price + 'Р'}</p>
                        {this.drawCountControl(product, item)}
                        <svg className='delete-icon' width="50px" height="50px" viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg" onClick={()=>{this.removeItemFromCart(item.id)}}>
	                          <path fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 25.3333,23.75L 50.6667,23.75C 51.5411,23.75 51.8541,27.3125 51.8541,27.3125L 24.1458,27.3125C 24.1458,27.3125 24.4589,23.75 25.3333,23.75 Z M 35.625,19.7917L 40.375,19.7917C 40.8122,19.7917 41.9583,20.9378 41.9583,21.375C 41.9583,21.8122 40.8122,22.9584 40.375,22.9584L 35.625,22.9584C 35.1878,22.9584 34.0416,21.8122 34.0416,21.375C 34.0416,20.9378 35.1878,19.7917 35.625,19.7917 Z M 27.7083,28.5L 48.2916,28.5C 49.1661,28.5 49.875,29.2089 49.875,30.0834L 48.2916,53.8334C 48.2916,54.7078 47.5828,55.4167 46.7083,55.4167L 29.2917,55.4167C 28.4172,55.4167 27.7083,54.7078 27.7083,53.8334L 26.125,30.0834C 26.125,29.2089 26.8339,28.5 27.7083,28.5 Z M 30.0833,31.6667L 30.4792,52.25L 33.25,52.25L 32.8542,31.6667L 30.0833,31.6667 Z M 36.4167,31.6667L 36.4167,52.25L 39.5833,52.25L 39.5833,31.6667L 36.4167,31.6667 Z M 43.1458,31.6667L 42.75,52.25L 45.5208,52.25L 45.9167,31.6667L 43.1458,31.6667 Z "/>
                          </svg>
                      </div>
                    })
                  : <p>Корзина пуста</p>}
                </div>
                {isNotEmpty ? <div className='basket__shopping-cart'><p className='bold'>Всего к оплате:</p><p className='bold'>{sum.toFixed(2) + 'Р'}</p></div>: null}
              </div>
            : null}
        </header>
        <main>
          {this.renderProducts()}
        </main>
      </div>
    );
  }
  getItemIndexById(id){
    const cart = this.state.cartList;
    let i=0;
    let isFound = false;
    while(i < cart.length){      
      if (cart[i].id === id){
        isFound = true;
        break;
      }
      i += 1;
    }
    return isFound ? i : false;
  }
  addItemToCart(id){
    let cart = this.state.cartList;
    let cartSet = this.state.cartSet;
    const index = this.getItemIndexById(id);
    const prod = products.filter(it =>{
      return it.id === id;
    })[0];
    if (cartSet.has(id)){
      if (index === false){
        console.log('Ошибка поиска товара');
        return;
      }
      if (cart[index].count < prod.count){
        cart[index].count += 1;
      }
    }
    else{
        cart.push({id: id, count: 1});
        cartSet.add(id);
    }
    this.setState({cartList: cart, casrtSet: cartSet});
  }
  decreaceItemInCart(id){
    const index = this.getItemIndexById(id);
    let cart = this.state.cartList;
    if (index !== false){
      if (cart[index].count <= 1){
        this.removeItemFromCart(id, index);
        return;
      }
      else{
        cart[index].count -= 1;
        this.setState({cartList: cart});
      }
    }
  }
  removeItemFromCart(id, i=null){
    let cart = this.state.cartList;
    let cartSet = this.state.cartSet;
    const index = i ? i : this.getItemIndexById(id);
    if (index !== false){
      cart.splice(index, 1);
      cartSet.delete(id);
      this.setState({cartList: cart, casrtSet: cartSet});
    }
  }
  drawCountControl(product, cartItem){
    return<div className='count__container'>
      <input className='count__btn' type='button' value='-' onClick={()=>{this.decreaceItemInCart(product.id)}}/>
      <p className='count__text'>{cartItem.count * product.inPackage}</p>
      <input className='count__btn' type='button' value='+' onClick={()=>{this.addItemToCart(product.id)}}/>
  </div>
  }

  sortProductsByLabel(label, desc=false){
    let list = this.state.productList;
    list.sort((a, b)=>{
      let c = a[label];
      let d = b[label];
      if (label === 'price'){
        c = a.price * (1 - a.discount / 100);
        d = b.price * (1 - b.discount / 100);
      }
      if (c < d){
        return -1;
      }
      if (c === d){
        return 0;
      }
      return 1;
    });
    if (desc){
      list = list.reverse();
    }
    this.setState({productList: list});
  }
}

export default App;
