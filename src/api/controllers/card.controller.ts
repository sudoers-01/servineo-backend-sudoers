import Stripe from "stripe";
import Card from "../../models/card.model";
import {User} from "../../models/user.model";
import 'dotenv/config';
 
// Validar que la clave de Stripe existe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('❌ STRIPE_SECRET_KEY no está definida en las variables de entorno');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =========================
// Crear y guardar tarjeta
// =========================
export const createCard = async (req, res) => {
  try {
    console.log("➡️ createCard called with body:", req.body);

    const { userId, paymentMethodId, saveCard, cardholderName } = req.body;

    // ⿡ Buscar usuario en MongoDB
    console.log(`🔍 Buscando usuario con ID: ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ Usuario no encontrado");
      return res.status(404).json({ error: "User not found" });
    }
    console.log("✅ Usuario encontrado:", { email: user.email, name: user.name, stripeCustomerId: user.stripeCustomerId });

    let customerId = user.stripeCustomerId;

    // ⿢ Validar o crear Customer en Stripe
    if (!customerId) {
      console.log("⚡ No hay Stripe Customer, creando uno nuevo...");
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
      console.log("✅ Customer creado en Stripe:", customerId);
    } else {
      console.log("🔄 Validando que el Customer existe en Stripe:", customerId);
      try {
        await stripe.customers.retrieve(customerId);
        console.log("✅ Customer existe en Stripe");
      } catch (error) {
        console.log("⚠️ Customer no encontrado en Stripe, creando uno nuevo...");
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
        console.log("✅ Nuevo Customer creado en Stripe:", customerId);
      }
    }

    // ⿣ Adjuntar PaymentMethod al Customer
    console.log("🔗 Adjuntando PaymentMethod al Customer:", paymentMethodId);
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    console.log("✅ PaymentMethod adjuntado:", paymentMethod.id);

    // ⿤ Guardar como default y registrar en MongoDB si se desea
    if (saveCard) {
      console.log("💾 Guardando PaymentMethod como default y registrando en DB...");
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethod.id },
      });

      const newCard = await Card.create({
        userId,
        stripePaymentMethodId: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        isDefault: true,
        cardholderName,
      });

      console.log("✅ Tarjeta guardada en MongoDB:", newCard);
      return res.json(newCard);
    }

    // ⿥ Retornar mensaje si no se guardó
    console.log("ℹ️ Tarjeta agregada para pago, pero no guardada");
    res.json({ message: "Tarjeta agregada para pago, no guardada" });

  } catch (error) {
    console.error("❌ Error createCard:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// =========================
// Listar tarjetas de usuario
// =========================
export const listCards = async (req, res) => {
  try {
    console.log("➡️ listCards called with query:", req.query);
    const { userId } = req.query;
    const cards = await Card.find({ userId });
    console.log("✅ Tarjetas encontradas:", cards);
    res.json(cards);
  } catch (error) {
    console.error("❌ Error listCards:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
