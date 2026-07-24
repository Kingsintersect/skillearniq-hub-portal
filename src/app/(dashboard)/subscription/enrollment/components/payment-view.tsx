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
                className="text-center space-y-6 max-w-md mx-auto py-16"
            >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/25">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold font-outfit text-foreground">Payment successful!</h2>
                <p className="text-muted-foreground">You have successfully enrolled in the course.</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary-600 hover:bg-primary-700 text-primary-foreground rounded-full px-8"
                >
                    Go to dashboard
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/40">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-outfit text-foreground">Complete your enrollment</h1>
                    <p className="text-muted-foreground mt-1">Secure payment processing</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="bg-card border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-outfit">Payment information</CardTitle>
                            <CardDescription>
                                Enter your card details to complete the purchase
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card number</Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        className="focus-visible:ring-accent-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry date</Label>
                                        <Input
                                            id="expiry"
                                            placeholder="MM/YY"
                                            className="focus-visible:ring-accent-500"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input
                                            id="cvc"
                                            placeholder="123"
                                            className="focus-visible:ring-accent-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Cardholder name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        className="focus-visible:ring-accent-500"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-accent-500 hover:bg-accent-600 text-white rounded-full shadow-sm shadow-accent-500/25"
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Complete payment — $99.00
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="bg-card border border-border shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-outfit">Order summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-foreground">
                                <span>Course price</span>
                                <span>$99.00</span>
                            </div>
                            <div className="flex justify-between font-bold text-foreground border-t border-border pt-3">
                                <span>Total</span>
                                <span>$99.00</span>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-primary-600 dark:text-primary-400">
                                <Shield className="w-4 h-4" />
                                <span>Secure SSL encryption</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
