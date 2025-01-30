import { Card, CardContent } from '@/components/ui/card';
import BackBtn from './components/back-btn';

const TireTypeInfo = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackBtn />
                    <h1 className="text-3xl font-bold">Tire Casing and Tire Pressure</h1>
                </div>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <section>
                        <p className="text-gray-800">
                            Most of our previous data has been tested with World Tour riders who are using some of the fastest
                            tires available. Tires with extremely supple casing are significantly more efficient at absorbing
                            road vibrations so they are able to run higher pressures more efficiently. The lower quality casing,
                            the lower the breakpoint pressure will be. The optimal pressure can be as much as 20% lower on a
                            low quality casing vs the highest quality available.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
};

export default TireTypeInfo;
