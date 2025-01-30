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
                            World Tour riders often use some of the fastest tires available, which feature highly supple casings that effectively absorb road vibrations. This allows them to maintain higher pressures with greater efficiency. In contrast, tires with lower-quality casings have a lower breakpoint pressure, meaning their optimal pressure can be up to 20% lower compared to those with the highest-quality casings.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
};

export default TireTypeInfo;
