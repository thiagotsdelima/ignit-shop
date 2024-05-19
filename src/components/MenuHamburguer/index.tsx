import * as Dialog from '@radix-ui/react-dialog';
import { forwardRef, useContext } from 'react';
import { MenuContent } from '../MenuContent';
import { BagButton } from '../BagButton';
import { ShopCartContext } from "@/context/shopCartContext";


interface MenuHamburguerProps {
  badgeComponent: React.ComponentType<{ count: number }> | null;
}

const ForwardedBagButton = forwardRef<HTMLDivElement>((props, ref) => <BagButton ref={ref} {...props} />);

export function MenuHamburguer({ badgeComponent }: MenuHamburguerProps) {
  const { shopCartList } = useContext(ShopCartContext);

  const BadgeComponent = badgeComponent;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div style={{ position: 'relative' }}>
          <ForwardedBagButton />
          {BadgeComponent && shopCartList.length > 0 && <BadgeComponent count={shopCartList.length} />}
        </div>
      </Dialog.Trigger>
      <MenuContent />
    </Dialog.Root>
  );
}
