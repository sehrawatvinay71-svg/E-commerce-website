import React, { useEffect, useState } from 'react'
import AppContext from './app-context';

const AppContextProvider = ({children}) => {
  const [showCart, setShowCart] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [products,setProducts] = useState({});
  const [loading, setIsLoading] = useState(false);

   
  

  const openCart = () => setShowCart(true);
  const closeCart = () => setShowCart(false);

  const openAddProduct = () => setShowAddProduct(true);
  const onCloseAddProduct = () => setShowAddProduct(false);

  const handleAddToCart = (productId, ProductName, ProductImage) => {
    const productInCartIndex = cartItems.findIndex(
      (item)=> item.id===productId
    );

    if(productInCartIndex===-1){
    const cartItem = {
        id: productId,
        name: ProductName,
        image: ProductImage,
        quantity: 1,
      };
      setCartItems((state)=>[...state, cartItem]);
    }else{
      const updatedCartItems = [...cartItems];
      updatedCartItems[productInCartIndex].quantity+=1;
      setCartItems(updatedCartItems);
    }
  };

  const handleIncreaseQuantity = (productId)=>{
    const productInCartIndex = cartItems.findIndex(
      (item)=> item.id===productId
    );
    const updatedCartItems = [...cartItems];
    updatedCartItems[productInCartIndex].quantity+=1;
    setCartItems(updatedCartItems);
  }
  const handleDecreaseQuantity = (productId)=>{
    const productInCartIndex = cartItems.findIndex(
      (item)=> item.id===productId
    );
    const updatedCartItems = [...cartItems];
    updatedCartItems[productInCartIndex].quantity-=1;
    if(updatedCartItems[productInCartIndex].quantity<1){
      setCartItems(prev => prev.filter(item => item.id !== productId));
    }else{
      setCartItems(updatedCartItems);
    }
  }

  const handleAddProduct = (productName) =>{
    const product = {
      id: products.length + 1,
      name: productName,
      image: "default_product.png"
    };
    sendProductData(product);
    setProducts((state) => {
        return {...state, [Object.keys(state).length+1] : product};
    });
    setShowAddProduct(false);
  };

  const sendProductData = async (product) => {
    const response = await fetch(
        "https://react-app-78e70-default-rtdb.firebaseio.com/products.json", {
            method: "POST",
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(product),
        }
    );
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
        setIsLoading(true);
        try{
            const response = await fetch(
                "https://react-app-78e70-default-rtdb.firebaseio.com/products.json"
            );
            const data = await response.json();
            setProducts(data);
            setIsLoading(false);
        }catch(err){
            console.log(err);
            setIsLoading(false); 
        }
    };

    fetchProducts();
  },[]);
  const appContextValue = {
    showCart,
    showAddProduct,
    products,
    cartItems,
    openCart,
    loading,
    closeCart,
    openAddProduct,
    onCloseAddProduct,
    handleAddProduct,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity
  };
  return (
    <AppContext.Provider value = {appContextValue}>
        {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;