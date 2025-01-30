import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Bike } from 'lucide-react';
import { Link } from 'react-router-dom';

type FormData = {
    weight: string;
    weightUnit: 'lbs' | 'kg';
    surfaceCondition: string;
    tireWidth: string;
    tireDiameter: string;
    tireType: string;
    speed: string;
    weightDist: string;
};

type CalculationResult = {
    front: number;
    back: number;
    pinchFlatRisk: string;
    recommendedWidth?: number;
    alternativePressures?: {
        front: number;
        back: number;
    };
};

const CalculatorForm = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const validateWeight = (value: string) => {
        const weightInKg = form.getValues('weightUnit') === 'lbs'
            ? Number(value) * 0.453592
            : Number(value);

        return (weightInKg >= 34 && weightInKg <= 205) || 'Weight must be between 75-450 lbs or 34-205 kg';
    };

    const form = useForm<FormData>({
        defaultValues: {
            weightUnit: 'lbs',
            surfaceCondition: 'null',
            tireWidth: 'null',
            tireDiameter: 'null',
            tireType: 'null',
            speed: 'null',
            weightDist: 'null'
        }
    });

    const calculateK1 = (surfaceCondition: string): number => {
        const surfaceK1Map = {
            'track-indoor-wood': 354,
            'track-outdoor-wood': 294,
            'new-pavement': 261,
            'worn-pavement': 246.5,
            'cat1-gravel': 235.5,
            'poor-pavement': 225,
            'cat2-gravel': 212.5,
            'cobblestone': 199,
            'cat3-gravel': 187,
            'cat4-gravel': 170
        };
        return surfaceK1Map[surfaceCondition as keyof typeof surfaceK1Map];
    };

    const calculatePressures = (data: FormData): CalculationResult => {
        // Convert weight to kg
        const weight = data.weightUnit === 'lbs'
            ? Number(data.weight) * 0.453592
            : Number(data.weight);

        // Calculate K and K1
        const K1 = calculateK1(data.surfaceCondition);
        const K = 0.5 * (weight - 50) + K1;

        // Calculate center point pressure
        const width = Number(data.tireWidth);
        const diameter = Number(data.tireDiameter);
        const num = ((-0.00006 * (width ** 3)) + (0.0079 * (width ** 2)) - (0.4102 * width) + 12.725) * -226.44;
        const denom = (((-0.5 * 9.81) / (K * (20 / width)) + (width + (diameter / 2))) ** 2) - ((width + (diameter / 2)) ** 2);
        const CPP = num / denom;

        // Speed coefficient
        const speed = Number(data.speed);
        const speedCoeff = ((1.03 * speed) - (1.03 * 10) - (0.97 * speed) + (0.97 * 10) + (33 * 0.97) - (0.97 * 10)) / (33 - 10);

        // Weight distribution coefficient
        const weightDistMap = {
            'tr-tt-track': { front: 1, back: 1 },
            'road': { front: 0.985, back: 1.01 },
            'gravel': { front: 0.975, back: 1.02 },
            'mountain': { front: 0.97, back: 1.03 }
        };
        const weightDistCoeff = weightDistMap[data.weightDist as keyof typeof weightDistMap];

        // Tire type coefficient
        const tireTypeMap = {
            'high-perf-tubeless-latex': { front: 1, back: 1 },
            'mid-range-tubeless-latex': { front: 0.97, back: 0.97 },
            'mid-range-butyl': { front: 0.94, back: 0.94 },
            'puncture-resistant-tubeless-latex': { front: 0.91, back: 0.91 }
        };
        const tireTypeCoeff = tireTypeMap[data.tireType as keyof typeof tireTypeMap];

        // Calculate final pressures
        const finalPressures = {
            front: (CPP * speedCoeff * weightDistCoeff.front * tireTypeCoeff.front),
            back: (CPP * speedCoeff * weightDistCoeff.back * tireTypeCoeff.back)
        };

        // Calculate pinch flat risk
        const speedVal = Number(data.speed) * 0.44704; // Convert to m/s
        const tireWidthVal = Number(data.tireWidth);

        const KE = 0.5 * weight * (speedVal ** 2);
        const RE = 0.5 * (0.8 * tireWidthVal) * Math.sqrt((K ** 2) - ((0.8 * tireWidthVal) ** 2));
        const PF = 2 * RE - KE;

        // Calculate recommended width if at risk of pinch flats
        let recommendedWidth;
        let alternativePressures;

        if (PF < 0) {
            const Wnum1 = -2.56 * (K ** 2);
            const Wsqrtnum2 = 6.5536 * (K ** 4);
            const Wsqrtnum3 = 6.5536 * (-160000 - (800 * weight * (speedVal ** 2)) - ((weight ** 2) * (speedVal ** 4)));
            const Wnum = Wnum1 + Math.sqrt(Wsqrtnum2 + Wsqrtnum3);
            const Wdenom = 3.2768;
            recommendedWidth = Math.ceil(Math.sqrt(-Wnum / Wdenom));

            // Calculate alternative pressures
            const PNewNum = Math.sqrt((((25 * (weight ** 2) * (speedVal ** 4)) + (20000 * weight * (speedVal ** 2)) + 400000) / (64 * (tireWidthVal ** 2))) + (0.64 * (tireWidthVal ** 2)));
            const PNewDenom = K;
            alternativePressures = {
                front: (PNewNum / PNewDenom) * finalPressures.front,
                back: (PNewNum / PNewDenom) * finalPressures.back
            };
        }

        let pinchFlatRisk = 'none';
        if (PF >= -500 && PF <= 0) {
            pinchFlatRisk = 'increased';
        } else if (PF < -500) {
            pinchFlatRisk = 'extreme';
        }

        return {
            front: Math.round(finalPressures.front * 2) / 2,
            back: Math.round(finalPressures.back * 2) / 2,
            pinchFlatRisk,
            recommendedWidth,
            alternativePressures: alternativePressures ? {
                front: Math.round(alternativePressures.front * 2) / 2,
                back: Math.round(alternativePressures.back * 2) / 2
            } : undefined
        };
    };

    const onSubmit = (data: FormData) => {
        const results = calculatePressures(data);
        setResult(results);
    };
    console.log("results", result);

    return (
        <div className="relative">
            {/* Decorative bike elements */}
            <div className="hidden md:block absolute -top-6 left-0 opacity-10 rotate-[-35deg] -translate-x-1/2">
                <Bike size={120} />
            </div>
            <div className="hidden md:block absolute -bottom-6 right-0 opacity-10 rotate-[35deg] translate-x-1/2">
                <Bike size={120} />
            </div>

            {/* Main card */}
            <Card className="w-full max-w-3xl mx-auto bg-transparent md:bg-white/50 backdrop-blur-sm shadow-none md:shadow-xl relative border-0 md:border">
                <CardHeader className="text-center pb-2">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Bike className="w-8 h-8 text-blue-600" />
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Tire Pressure Calculator
                        </CardTitle>
                        <Bike className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">Calculate optimal tire pressure for your bicycle</p>
                </CardHeader>
                <CardContent className="px-0 md:px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    rules={{
                                        required: 'Weight is required',
                                        validate: validateWeight
                                    }}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold">Total System Weight</FormLabel>
                                            <div className="flex gap-2">
                                                <Select
                                                    onValueChange={(value) => form.setValue('weightUnit', value as 'lbs' | 'kg')}
                                                    defaultValue={form.getValues('weightUnit')}
                                                >
                                                    <SelectTrigger className="w-[90px]">
                                                        <SelectValue placeholder="Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="lbs">lbs</SelectItem>
                                                        <SelectItem value="kg">kg</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormControl>
                                                    <Input type="number" {...field} className="flex-1" />
                                                </FormControl>
                                            </div>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="surfaceCondition"
                                    rules={{ required: 'Surface condition is required' }}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <FormLabel className="text-sm font-semibold">Surface Condition</FormLabel>
                                                <Link
                                                    to="/surface-condition-info"
                                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    What is this?
                                                </Link>
                                            </div>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/50">
                                                        <SelectValue placeholder="Select Surface Condition" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="track-indoor-wood">Track (Indoor Wood)</SelectItem>
                                                    <SelectItem value="track-outdoor-wood">Track (Outdoor Concrete)</SelectItem>
                                                    <SelectItem value="new-pavement">New Pavement</SelectItem>
                                                    <SelectItem value="worn-pavement">Worn Pavement / Some Cracks</SelectItem>
                                                    <SelectItem value="cat1-gravel">Category 1 Gravel</SelectItem>
                                                    <SelectItem value="poor-pavement">Poor Pavement / Chipseal</SelectItem>
                                                    <SelectItem value="cat2-gravel">Category 2 Gravel</SelectItem>
                                                    <SelectItem value="cobblestone">Cobblestone</SelectItem>
                                                    <SelectItem value="cat3-gravel">Category 3 Gravel</SelectItem>
                                                    <SelectItem value="cat4-gravel">Category 4 Gravel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="tireWidth"
                                    rules={{ required: 'Tire width is required' }}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <FormLabel className="text-sm font-semibold">Measured Tire Width</FormLabel>
                                                <Link
                                                    to="/measured-width-info"
                                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    What is this?
                                                </Link>
                                            </div>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/50">
                                                        <SelectValue placeholder="Select Measured Tire Width" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Array.from({ length: 46 }, (_, i) => i + 20).map(width => (
                                                        <SelectItem key={width} value={width.toString()}>{width}mm</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tireDiameter"
                                    rules={{ required: 'Wheel diameter is required' }}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold">Wheel Diameter</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/50">
                                                        <SelectValue placeholder="Select Wheel Diameter" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="622">700C/29"</SelectItem>
                                                    <SelectItem value="571">650C</SelectItem>
                                                    <SelectItem value="584">650B/27.5"</SelectItem>
                                                    <SelectItem value="559">26"</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="tireType"
                                    rules={{ required: 'Tire type is required' }}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <FormLabel className="text-sm font-semibold">Tire Type</FormLabel>
                                                <Link
                                                    to="/tire-type-info"
                                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    What is this?
                                                </Link>
                                            </div>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/50">
                                                        <SelectValue placeholder="Select Tire Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="high-perf-tubeless-latex">High performance tire tubeless/latex tube</SelectItem>
                                                    <SelectItem value="mid-range-tubeless-latex">Mid Range casing tubeless/latex tube</SelectItem>
                                                    <SelectItem value="mid-range-butyl">Mid-Range casing butyl tube</SelectItem>
                                                    <SelectItem value="puncture-resistant-tubeless-latex">Puncture resistant tire tubeless/latex tube</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="speed"
                                    rules={{ required: 'Average speed is required' }}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold">Average Speed</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/50">
                                                        <SelectValue placeholder="Select Average Speed" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="14">Recreational</SelectItem>
                                                    <SelectItem value="15.5">Fast Single Track</SelectItem>
                                                    <SelectItem value="17.5">Moderate Group Ride</SelectItem>
                                                    <SelectItem value="19.5">Fast Group Ride</SelectItem>
                                                    <SelectItem value="21.5">Cat. 1 / Cat. 2 / Cat. 3 Racing</SelectItem>
                                                    <SelectItem value="24">Pro Tour</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormField
                                    control={form.control}
                                    name="weightDist"
                                    rules={{ required: 'Weight distribution is required' }}
                                    render={({ field }) => (
                                        <FormItem className="space-y-1">
                                            <FormLabel className="text-sm font-semibold">Weight Distribution</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/50">
                                                        <SelectValue placeholder="Select Weight Distribution" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="tr-tt-track">50/50 (Triathlon/TT/Track Bikes)</SelectItem>
                                                    <SelectItem value="road">48/52 (Road Bikes)</SelectItem>
                                                    <SelectItem value="gravel">47/53 (Gravel Bikes)</SelectItem>
                                                    <SelectItem value="mountain">46.5/53.5 (Mountain Bikes)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Calculate Pressure
                            </Button>
                        </form>
                    </Form>

                    {result && (
                        <div className="mt-8 p-6 border border-blue-100 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Recommended Tire Pressures</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="text-center p-4 rounded-lg bg-white/80 shadow-sm">
                                    <p className="text-sm text-gray-600 font-medium">Front</p>
                                    <p className="text-3xl font-bold text-blue-600">{result.front} PSI</p>
                                </div>
                                <div className="text-center p-4 rounded-lg bg-white/80 shadow-sm">
                                    <p className="text-sm text-gray-600 font-medium">Rear</p>
                                    <p className="text-3xl font-bold text-purple-600">{result.back} PSI</p>
                                </div>
                            </div>
                            {result.pinchFlatRisk !== 'none' && (
                                <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100">
                                    <p className="text-sm text-red-600 font-medium">
                                        Warning: {result.pinchFlatRisk} risk of pinch flats
                                    </p>
                                    {result.recommendedWidth && (
                                        <p className="text-sm text-red-600 mt-2">
                                            Recommended minimum tire width: {result.recommendedWidth}mm
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Optional: Add decorative tire tracks */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-10" />
        </div>
    );
};

export default CalculatorForm;
