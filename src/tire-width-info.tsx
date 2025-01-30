import { Card, CardContent } from '@/components/ui/card';
import BackBtn from './components/back-btn';

const MeasuredWidthInfo = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackBtn />
                    <h1 className="text-3xl font-bold">Measured Width</h1>
                </div>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <section>
                        <h2 className="text-xl font-bold mb-4">What it is and why it matters:</h2>
                        <p className="text-gray-800 mb-4">
                            Tire width refers to the actual width of the tire when fully installed and inflated on the rim, rather than the number printed on the sidewall. This distinction can be difficult to track, even for those working with tires on a daily basis, as the casing number is commonly used in reference. For example, a 23mm Continental GP4000SII mounted on a 21.5mm inner bead has been measured at 28.9mm wide, which would correspond to 29mm in this calculator.
                        </p>
                        <p className="text-gray-800 mb-4">
                            Conversely, many gravel and mountain bike tires measure at or below the casing number. This discrepancy may be due to factors such as the assumption of wide bead seat rims or the practice of measuring to the tread rather than the casing. For instance, the WTB Riddler 29x2.25 (57mm) actually measures 51mm at the casing (56-57mm at the tread) when mounted on the ENVE G23 rim. Therefore, accurate casing measurements are crucial for determining the correct tire width.
                        </p>
                        <p className="text-gray-800">
                            Measured width directly influences both the tire's air volume and the size of the contact patch with the ground. As such, obtaining an accurate width measurement is essential before attempting to optimize tire pressure. The potential consequences of incorrect measurements are far more significant than the benefits gained from investing in high-end components like ceramic bearings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">How to measure it:</h2>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <p className="text-gray-800">
                                    Calipers are the best/easiest way to measure
                                    your tire and to verify the rule of 105. Having a set will
                                    help ensure that you aren't making some simple size
                                    and pressure errors with your tire choice.
                                </p>
                                <img
                                    src="/assets/caliper-measurement.png"
                                    alt="Caliper measurement demonstration"
                                    className="w-full  object-cover rounded"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <p className="text-gray-800 text-center mb-4">
                            For a DIY approach, you can also measure casing width by bending a paperclip to fit around your tire.
                            Once it is accurately bent, remove the paperclip and line it up on metric ruler to gauge your approximate
                            width in millimeters.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="/assets/diy-wire.png"
                                alt="Paperclip measurement step 1"
                                className="w-full h-48 object-cover rounded"
                            />
                            <img
                                src="/assets/diy-ruler.png"
                                alt="Paperclip measurement step 2"
                                className="w-full h-48 object-cover rounded"
                            />
                        </div>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
};

export default MeasuredWidthInfo;