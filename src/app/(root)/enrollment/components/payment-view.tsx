import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function PaymentView() {
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate payment processing
        setTimeout(() => setPaymentSuccess(true), 2000);
    };

    if (paymentSuccess) {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6 max-w-md mx-auto"
            >
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                <p className="text-gray-600">You have successfully enrolled in the course.</p>
                <Button onClick={() => window.location.reload()}>
                    Go to Dashboard
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Complete Your Enrollment</h1>
                    <p className="text-gray-600">Secure payment processing</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                            <CardDescription>
                                Enter your card details to complete the purchase
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input
                                            id="cvc"
                                            placeholder="123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Cardholder Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Complete Payment - $99.00
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Course Price</span>
                                <span>$99.00</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>$99.00</span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-green-600">
                                <Shield className="w-4 h-4" />
                                <span>Secure SSL Encryption</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}