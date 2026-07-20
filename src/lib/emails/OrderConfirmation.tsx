import {
  Body,
  Column,
  Container,
  Heading,
  Hr,
  Html,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { Order, OrderItem, Product } from "@prisma/client";
import { formatPrice } from "@/lib/money";
import { formatAddressLines, type ShippingAddress } from "@/lib/address";

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[];
};

const labelStyle = { fontSize: "14px", color: "#1e2e1a", margin: "2px 0" };
const mutedStyle = { fontSize: "13px", color: "rgba(30,46,26,0.6)", margin: "2px 0" };

export default function OrderConfirmation({ order }: { order: OrderWithItems }) {
  const address = order.shippingAddress as unknown as ShippingAddress;

  return (
    <Html>
      <Body
        style={{
          backgroundColor: "#f5f1ea",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#1e2e1a",
          margin: 0,
          padding: "24px",
        }}
      >
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Heading style={{ fontSize: "24px", margin: "0 0 8px" }}>
            Your Reel Purpose order is confirmed! 🎣
          </Heading>
          <Text style={mutedStyle}>Order {order.orderNumber}</Text>

          <Hr style={{ borderColor: "rgba(30,46,26,0.12)" }} />

          <Section>
            {order.items.map((item) => (
              <Row key={item.id}>
                <Column style={labelStyle}>
                  {item.product.name} — {item.size} × {item.quantity}
                </Column>
                <Column align="right" style={labelStyle}>
                  {formatPrice(item.price * item.quantity)}
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ borderColor: "rgba(30,46,26,0.12)" }} />

          <Row>
            <Column style={labelStyle}>Subtotal</Column>
            <Column align="right" style={labelStyle}>
              {formatPrice(order.subtotal)}
            </Column>
          </Row>
          <Row>
            <Column style={labelStyle}>Florida Sales Tax (7%)</Column>
            <Column align="right" style={labelStyle}>
              {formatPrice(order.taxAmount)}
            </Column>
          </Row>
          {order.shippingAmount > 0 && (
            <Row>
              <Column style={labelStyle}>Shipping &amp; Handling</Column>
              <Column align="right" style={labelStyle}>
                {formatPrice(order.shippingAmount)}
              </Column>
            </Row>
          )}
          <Row>
            <Column style={{ ...labelStyle, fontWeight: "bold" }}>Total</Column>
            <Column
              align="right"
              style={{ ...labelStyle, fontWeight: "bold", color: "#b8541e" }}
            >
              {formatPrice(order.total)}
            </Column>
          </Row>

          <Hr style={{ borderColor: "rgba(30,46,26,0.12)" }} />

          <Text style={{ ...labelStyle, fontWeight: "bold" }}>Shipping to</Text>
          {formatAddressLines(address).map((line, i) => (
            <Text key={i} style={mutedStyle}>
              {line}
            </Text>
          ))}

          <Hr style={{ borderColor: "rgba(30,46,26,0.12)" }} />

          <Text style={labelStyle}>
            Your order is being prepared and will ship soon.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
