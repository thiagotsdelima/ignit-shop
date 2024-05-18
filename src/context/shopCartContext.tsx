import { actions } from "@/reducer/actions";
import { shopCartReducer } from "@/reducer/shopCartReducer";
import { createContext, ReactNode, useReducer } from "react";

interface ShopCartProps {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  defaultPriceId: string;
}

interface ShopCartContextProps {
  shopCartList: ShopCartProps[];
  addItem: (payload: ShopCartProps) => void;
  removeItem: (id: string) => void;
  checkItemExists: (id: string) => boolean;
}

export const ShopCartContext = createContext<ShopCartContextProps>({} as ShopCartContextProps);

interface ShopCartProviderProps {
  children: ReactNode;
}

const initialState = {
  shopCartList: [] as ShopCartProps[]
};

export function ShopCartProvider({ children }: ShopCartProviderProps) {
  const [state, dispatch] = useReducer(shopCartReducer, initialState);

  function addItem(payload: ShopCartProps) {
    dispatch({ type: actions.ADD_ITEM, payload });
  }

  function removeItem(id: string) {
    dispatch({ type: actions.REMOVE_ITEM, payload: id });
  }

  function checkItemExists(id: string) {
    return state.shopCartList.some(item => item.id === id);
  }

  return (
    <ShopCartContext.Provider value={{ 
      shopCartList: state.shopCartList, 
      addItem, 
      removeItem,
      checkItemExists
    }}>
      {children}
    </ShopCartContext.Provider>
  );
}
