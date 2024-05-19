import { useContext, useState, useEffect } from 'react';
import { X } from 'phosphor-react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import axios from 'axios';
import { ItmsContent, Product, ProductImage, ProductDetails, Finalization, FinalizationDetails, Title, Close } from './styles';
import { ShopCartContext } from "@/context/shopCartContext";



export function MenuContent() {
  const { shopCartList, removeItem } = useContext(ShopCartContext);
  const [totalPrice, setTotalPrice] = useState('');

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false);

  async function handleBuyButton() {
    try {
      const priceId = shopCartList.map(item => {
        return {
          price: item.defaultPriceId,
          quantity: 1
        };
      });
      setIsCreatingCheckoutSession(true);

      const response = await axios.post('/api/checkout', { priceId });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (err) {
      setIsCreatingCheckoutSession(false);
      alert('Failed to redirect to checkout!');
    }
  }

  function handleRemoveItem(id: string) {
    removeItem(id);
  }

  useEffect(() => {
    function handleQuantity() {
      const sum = shopCartList.reduce((acc, cv) => acc + Number(cv.price.split('$')[1].replace(',', '.')), 0);

      const finalPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(sum);

      setTotalPrice(finalPrice);
    }
    handleQuantity();
  }, [shopCartList]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay />
      <ItmsContent>
        <Close>
          <X size={32} />
        </Close>
        <Title>Bag of Shopping</Title>
        <main>
          {shopCartList.length > 0 ? (
            shopCartList.map((product) => (
              <Product key={product.id}>
                <ProductImage>
                  <Image width={100} height={93} alt="" src={product.imageUrl} priority />
                </ProductImage>
                <ProductDetails>
                  <p>{product.name}</p>
                  <span>{product.price}</span>
                  <button onClick={() => handleRemoveItem(product.id)}>Remove</button>
                </ProductDetails>
              </Product>
            ))
          ) : (
            <p>It looks like your cart is empty.</p>
          )}
        </main>
        <Finalization>
          <FinalizationDetails>
            <div>
              <span>Amount</span>
              <p>
                {shopCartList.length}
                {shopCartList.length === 1 ? ' item' : ' items'}
              </p>
            </div>
            <div>
              <span>Total Amount</span>
              <p>{totalPrice}</p>
            </div>
          </FinalizationDetails>
          <button onClick={handleBuyButton} disabled={isCreatingCheckoutSession}>Finalize purchase</button>
        </Finalization>
      </ItmsContent>
    </Dialog.Portal>
  );
}
