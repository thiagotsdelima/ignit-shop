import Image from "next/image";
import { HomeContainer, Product } from "../styles/pages/home";
import { useKeenSlider } from 'keen-slider/react';
import { stripe } from "../services/stripe";
import { GetStaticProps } from "next";
import { BagButton } from '../components/BagButton'
import 'keen-slider/keen-slider.min.css';
import Stripe from "stripe";
import Link from "next/link";
import Head from "next/head";
import { useContext } from "react";
import { ShopCartContext } from "@/context/shopCartContext";


interface ProductsProps {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  defaultPriceId:string
}

interface HomeProps {
  products: ProductsProps[]
}

export default function Home({ products }: HomeProps) {
  const {addItem, checkItemExists} = useContext(ShopCartContext)
  
  const [sliderRef] = useKeenSlider({
    slides: {
      perView:3,
      spacing: 48
    }
  });

  async function handleAddToProductCart(product:ProductsProps) {
    addItem(product)
  };

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>
    
      <HomeContainer ref={sliderRef} className="keen-slider">
      {products && products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`} prefetch={false}>
            <Product className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={480} alt="" priority  />
              <footer>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </div>
                <BagButton 
                  color={"green"}
                  onClick={(e) => handleAddToProductCart(product)}
                  disabled={checkItemExists(product.id)}
                />
              </footer>
            </Product>
          </Link>
        ))}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  });

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;
    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      url: product.url,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format((price.unit_amount || 0) / 100),
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, 
  };
};