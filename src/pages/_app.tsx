import type { AppProps } from "next/app";
import { globalStyles } from "@/styles/global";
import { Container, Header } from '../styles/pages/app'
import { MenuHamburguer } from "../components/MenuHamburguer";
import { ShopCartProvider } from "@/context/shopCartContext";
import { Badge } from '../components/Badge'
import logoImg from '../assets/logo.svg'
import Image from "next/image";


globalStyles()


export default function App({ Component, pageProps }: AppProps) {

  return (
    <ShopCartProvider>
    <Container>
        <Header>
          <Image src={logoImg} alt="" priority /> 
          <MenuHamburguer badgeComponent={Badge} />
        </Header>
        <Component {...pageProps} />
        </Container>  
    </ShopCartProvider>
  )
}