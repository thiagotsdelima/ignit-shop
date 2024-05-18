import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Stripe from "stripe";
import { useContext, useState } from "react";
import { stripe } from "@/services/stripe";
import { ShopCartContext } from "@/context/shopCartCOntext";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
    defaultPriceId: string;
  }
}

export default function Product({ product }: ProductProps) {
  const { addItem, checkItemExists } = useContext(ShopCartContext);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const itemInCart = checkItemExists(product.id);

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckout(true);
      await addItem(product);
    } catch (error) {
      setIsCreatingCheckout(false);
      alert('Failed to add item to cart');
    }
  }
  
  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
    
      <ProductContainer>
        <ImageContainer>
          <Image src={product.imageUrl} width={520} height={480} alt="" />
        </ImageContainer>
        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>
          <p>{product.description}</p>
          <button 
            disabled={itemInCart || isCreatingCheckout} 
            onClick={handleBuyProduct}
          >
            {itemInCart ? 'Product is already in the cart' : 'Add to Cart'}
          </button>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: 'prod_Q2xsa22JHGWyCD' }}
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async ({ params }) => {
  const productId = params?.id as string;
  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });
  
  const price = product.default_price as Stripe.Price;
  
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format((price.unit_amount || 0) / 100),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1 // 1 hour
  };
}