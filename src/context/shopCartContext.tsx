import { shopCartListProps } from "@/interfaces/shopCart";
import { actions } from "@/reducer/actions";
import { shopCartReducer } from "@/reducer/shopCartReducer";
import { createContext, ReactNode, useReducer } from "react";

interface ShopCartContextProps {
  shopCartList: shopCartListProps[];
  addItem: (payload: shopCartListProps) => void;
  removeItem: (id: string) => void;
  checkItemExists: (id: string) => boolean;
}

export const ShopCartContext = createContext<ShopCartContextProps>({} as ShopCartContextProps);

interface ShopCartProviderProps {
  children: ReactNode;
}

const initialState = {
  shopCartList: [] as shopCartListProps[]
};

export function ShopCartProvider({ children }: ShopCartProviderProps) {
  const [state, dispatch] = useReducer(shopCartReducer, initialState);

  function addItem(payload: shopCartListProps) {
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
