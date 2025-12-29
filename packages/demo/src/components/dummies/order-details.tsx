import { InteractiveContentProps } from '@arsbreeze/interactive'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CreditCard, MapPin, Truck } from 'lucide-react'

export const OrderDetails = ({
  onComplete,
  onAbort,
  id
}: InteractiveContentProps & { id: string }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-green-600/30 bg-green-50 text-green-600 dark:bg-green-900/10">
            Paid
          </Badge>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Order Details
            </p>
            <div className="flex items-center justify-between">
              <p className="font-mono text-sm">#ORD-2023-001</p>
              <p className="text-sm text-muted-foreground">Dec 29, 2024</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Shipping Address
              </p>
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <address className="text-sm text-foreground not-italic">
                  <span className="font-medium">Pedro Duarte</span>
                  <br />
                  123 Sunset Blvd
                  <br />
                  Los Angeles, CA 90028
                </address>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Billing Information
              </p>
              <div className="flex gap-2">
                <CreditCard className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="text-sm text-foreground">
                  <p>Visa ending in 4242</p>
                  <p className="text-muted-foreground">Expires 12/28</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Items
            </p>
            <div className="space-y-4">
              {[
                {
                  name: 'Wireless Noise Cancelling Headphones',
                  sku: 'WH-1000XM5',
                  price: '$348.00',
                  qty: 1,
                  image: '🎧'
                },
                {
                  name: 'USB-C to USB-C Cable (2m)',
                  sku: 'CAB-USBC-2M',
                  price: '$19.00',
                  qty: 2,
                  image: '🔌'
                },
                {
                  name: 'Aluminum Laptop Stand',
                  sku: 'STAND-AL-01',
                  price: '$49.99',
                  qty: 1,
                  image: '💻'
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted text-lg">
                      {item.image}
                    </div>
                    <div>
                      <p className="text-sm leading-none font-medium">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        SKU: {item.sku}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.price}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-sm font-medium">$435.99</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Shipping (Express)
              </p>
              <p className="text-sm font-medium">$15.00</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tax</p>
              <p className="text-sm font-medium">$36.00</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-base font-semibold">Total</p>
              <p className="text-base font-semibold">$486.99</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t bg-muted/20 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>Estimated delivery: Jan 2, 2025</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onAbort}>
              Close
            </Button>
            <Button onClick={onComplete}>Print Invoice</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
