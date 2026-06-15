import { Body, Container, Heading, Hr, Html, Text } from "@react-email/components";
import { formatAddressLines, type ShippingAddress } from "@/lib/address";
import type { OrderWithItems } from "./OrderConfirmation";

const textStyle = {
  fontSize: "14px",
  color: "#1e2e1a",
  margin: "2px 0",
  fontFamily: "Arial, Helvetica, sans-serif",
};

export default function VendorNotification({
  order,
}: {
  order: OrderWithItems;
}) {
  const address = order.shippingAddress as unknown as ShippingAddress;
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US");

  return (
    <Html>
      <Body style={{ backgroundColor: "#ffffff", padding: "24px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Heading style={{ fontSize: "20px", margin: "0 0 12px" }}>
            New Reel Purpose Order — {order.orderNumber}
          </Heading>
          <Text style={textStyle}>Order date: {orderDate}</Text>

          <Hr />

          <Text style={{ ...textStyle, fontWeight: "bold" }}>SHIP TO</Text>
          {formatAddressLines(address).map((line, i) => (
            <Text key={i} style={textStyle}>
              {line}
            </Text>
          ))}

          <Hr />

          <Text style={{ ...textStyle, fontWeight: "bold" }}>ITEMS</Text>
          {order.items.map((item) => (
            <Text key={item.id} style={textStyle}>
              {item.quantity} × {item.product.name} — Size {item.size}
            </Text>
          ))}
        </Container>
      </Body>
    </Html>
  );
}
