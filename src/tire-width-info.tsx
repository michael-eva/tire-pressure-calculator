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
                            Measured width does not equate to the number printed on the sidewall; rather, it refers to the width
                            of the tire when it is fully installed and inflated on the rim. Even dealing with this stuff every day, it can be
                            hard keeping it straight as we continue to call the tires by their casing numbers. That said, we have seen
                            23mm GP4000SII on a 21.5mm inner bead measure at 28.9mm wide, so would be 29mm in this calculator.
                        </p>
                        <p className="text-gray-800 mb-4">
                            Opposite of that, many of the gravel and mtn tires measure at or below the casing number which
                            seems to be a combination of assuming wide bead seat rims and/or measuring to tread and not casing, for
                            example WTB Riddler 29x2.25 (57mm) actually measure 51mm at the casing (56-57mm at the tread) on the
                            ENVE G23 rim... so the measured casing number is critical.
                        </p>
                        <p className="text-gray-800">
                            Measured width drives the volume of air in the tire as well as the size of your contact patch with the
                            ground. For this reason, it is critical to get an accurate width measurement before you attempt to optimize
                            your pressure. The penalty of getting these things wrong is 3-5x more than you would save by dropping
                            hundreds of dollars on ceramic bearings or the like!
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
                                    src="src/assets/caliper-measurement.png"
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
                                src="src/assets/diy-wire.png"
                                alt="Paperclip measurement step 1"
                                className="w-full h-48 object-cover rounded"
                            />
                            <img
                                src="src/assets/diy-ruler.png"
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