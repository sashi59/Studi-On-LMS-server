import mongoose from "mongoose";    

const paymentSchema = new mongoose.Schema({

    razarpay_order_id: {
        type: String,
        required: true,
    },
    razarpay_payment_id: {
        type: String,
        required: true,
    },
    razarpay_signature: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

}, {
    timestamps: true,
});

export const Payment = mongoose.model("Payment", paymentSchema);