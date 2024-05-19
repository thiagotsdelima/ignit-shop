import { ImageContainer, SuccessContainer, ImageContainerBox, ImageContainerRounded } from "../styles/pages/success";
import { GetServerSideProps } from "next";
import { stripe } from "../services/stripe";
import Link from "next/link";
import Stripe from "stripe";
import Image from "next/image";
import Head from "next/head";

interface SuccessProps {
    customerName: string;
    product: {
      id:string;
      name: string;
      imageUrl: string;
  }[];
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Purchases made | Ignite Shop</title>
        <meta name="robots" content="noindex" />
      </Head>
    
    <SuccessContainer>
      <h1>Purchases made</h1>
      {product.length > 1 ? 
        <ImageContainerBox>
          {product.map(image => (
            <ImageContainerRounded key={image.id}>
              <Image src={image.imageUrl}  width={130} height={130} alt=''/>
            </ImageContainerRounded>
          ))}
        </ImageContainerBox>
        :
        <ImageContainer>
          <Image src={product[0].imageUrl} width={120} height={110} alt="" />
        </ImageContainer>
      }
      <p>
        Uhuul <strong>{customerName}</strong>, your {Array.isArray(product) ? 
        `purchase of ${product.length} shirts` :
        <strong>{product[0].name}</strong>} is already on its way to your house.
      </p>
      <Link href="/">
        back to catalog
      </Link>
    </SuccessContainer>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  
  const sessionId = String(query.session_id)
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details?.name
  const StillProducts = session.line_items?.data.map(item => {
    return item.price!.product as Stripe.Product   
  })

  return {
    props:{
      customerName,
      product: StillProducts?.map(product => ({
        id: product.id,
        name: product.name,
        imageUrl: product.images[0]
      })) || [],
    }
  }
}
